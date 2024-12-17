import { action, makeObservable, reaction, when } from 'mobx';
import { BOT_RESTRICTED_COUNTRIES_LIST } from '@/components/layout/header/utils';
import {
    ContentFlag,
    isEuResidenceWithOnlyVRTC,
    showDigitalOptionsUnavailableError,
    standalone_routes,
} from '@/components/shared';
import { api_base, ApiHelpers, DBot, runIrreversibleEvents } from '@/external/bot-skeleton';
import { setCurrency } from '@/external/bot-skeleton/scratch/utils';
import { TApiHelpersStore } from '@/types/stores.types';
import { localize } from '@deriv-com/translations';
import RootStore from './root-store';

export default class AppStore {
    root_store: RootStore;
    core: RootStore['core'];
    dbot_store: RootStore | null;
    api_helpers_store: TApiHelpersStore | null;
    timer: ReturnType<typeof setInterval> | null;
    disposeReloadOnLanguageChangeReaction: unknown;
    disposeCurrencyReaction: unknown;
    disposeSwitchAccountListener: unknown;
    disposeLandingCompanyChangeReaction: unknown;
    disposeResidenceChangeReaction: unknown;

    constructor(root_store: RootStore, core: RootStore['core']) {
        makeObservable(this, {
            onMount: action,
            onUnmount: action,
            registerCurrencyReaction: action,
            registerOnAccountSwitch: action,
            registerLandingCompanyChangeReaction: action,
            registerResidenceChangeReaction: action,
            setDBotEngineStores: action,
            onClickOutsideBlockly: action,
            showDigitalOptionsMaltainvestError: action,
        });

        this.root_store = root_store;
        this.core = core;
        this.dbot_store = null;
        this.api_helpers_store = null;
        this.timer = null;
    }

    getErrorForNonEuClients = () => ({
        text: localize(
            'Unfortunately, this trading platform is not available for EU Deriv account. Please switch to a non-EU account to continue trading.'
        ),
        title: localize('Deriv Bot is unavailable for this account'),
        link: localize('Switch to another account'),
    });

    getErrorForEuClients = (is_logged_in = false, country: string | undefined = undefined) => {
        return {
            text: ' ',
            title: is_logged_in
                ? localize(`Deriv Bot is not available for ${country || 'EU'} clients`)
                : localize(`Deriv Bot is unavailable in ${country || 'the EU'}`),
            link: is_logged_in ? localize("Back to Trader's Hub") : localize('Refresh'),
            route: standalone_routes.traders_hub,
        };
    };

    throwErrorForExceptionCountries = (client_country: string) => {
        const { client, common } = this.core;
        const bot_resticted_countries = BOT_RESTRICTED_COUNTRIES_LIST();

        const not_allowed_clients_country: { [key: string]: string } = {
            ...bot_resticted_countries,
        };

        const country_name = not_allowed_clients_country[client_country];

        if (country_name) {
            return showDigitalOptionsUnavailableError(
                common.showError,
                this.getErrorForEuClients(client.is_logged_in, country_name)
            );
        }
    };

    handleErrorForEu = () => {
        const { client, common } = this.core;

        if (!client?.is_logged_in && client?.is_eu_country) {
            this.throwErrorForExceptionCountries(client?.clients_country as string);
            return showDigitalOptionsUnavailableError(common.showError, this.getErrorForEuClients());
        }

        if (!client.is_landing_company_loaded) {
            common.setError(false, {});
            return false;
        }

        this.throwErrorForExceptionCountries(client?.account_settings?.clients_country as string);
        if (client.should_show_eu_error) {
            return showDigitalOptionsUnavailableError(common.showError, this.getErrorForEuClients(client.is_logged_in));
        }

        if (client.content_flag === ContentFlag.HIGH_RISK_CR) {
            common.setError(false, {});
            return false;
        }

        if (client.content_flag === ContentFlag.LOW_RISK_CR_EU) {
            return showDigitalOptionsUnavailableError(
                common.showError,
                this.getErrorForNonEuClients(),
                () => {
                    // TODOL: need to fix this from the deriv ui package
                    document.querySelector('.deriv-account-switcher__button')?.click();
                },
                false,
                false
            );
        }

        if (
            (!client.is_bot_allowed && client.is_eu && client.should_show_eu_error) ||
            isEuResidenceWithOnlyVRTC(client.active_accounts) ||
            client.is_options_blocked
        ) {
            return showDigitalOptionsUnavailableError(
                common.showError,
                this.getErrorForNonEuClients(),
                () => {
                    // TODOL: need to fix this from the deriv ui package
                    document.querySelector('.deriv-account-switcher__button')?.click();
                },
                false,
                false
            );
        }

        common.setError(false, {});
        return false;
    };

    onMount = async () => {
        const { blockly_store, run_panel } = this.root_store;
        const { client, ui } = this.core;
        this.showDigitalOptionsMaltainvestError();

        let timer_counter = 1;

        this.timer = setInterval(() => {
            if (window.sendRequestsStatistic) {
                window.sendRequestsStatistic(false);
                performance.clearMeasures();
                if (timer_counter === 6 || run_panel?.is_running) {
                    if (this.timer) clearInterval(this.timer);
                } else {
                    timer_counter++;
                }
            }
        }, 10000);

        if (!this.dbot_store) return;

        blockly_store.setLoading(true);
        await DBot.initWorkspace('/', this.dbot_store, this.api_helpers_store, ui.is_mobile, false);

        blockly_store.setContainerSize();
        blockly_store.setLoading(false);

        this.registerCurrencyReaction.call(this);
        this.registerOnAccountSwitch.call(this);
        this.registerLandingCompanyChangeReaction.call(this);
        this.registerResidenceChangeReaction.call(this);

        window.addEventListener('click', this.onClickOutsideBlockly);

        blockly_store.getCachedActiveTab();

        when(
            () => client?.should_show_eu_error || client?.is_landing_company_loaded,
            () => this.showDigitalOptionsMaltainvestError()
        );

        reaction(
            () => client?.content_flag,
            () => this.showDigitalOptionsMaltainvestError()
        );
    };

    onUnmount = () => {
        DBot.terminateBot();
        DBot.terminateConnection();
        if (window.Blockly?.derivWorkspace) {
            clearInterval(window.Blockly?.derivWorkspace.save_workspace_interval);
            window.Blockly.derivWorkspace?.dispose();
        }
        if (typeof this.disposeReloadOnLanguageChangeReaction === 'function') {
            this.disposeReloadOnLanguageChangeReaction();
        }
        if (typeof this.disposeCurrencyReaction === 'function') {
            this.disposeCurrencyReaction();
        }
        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
        if (typeof this.disposeLandingCompanyChangeReaction === 'function') {
            this.disposeLandingCompanyChangeReaction();
        }
        if (typeof this.disposeResidenceChangeReaction === 'function') {
            this.disposeResidenceChangeReaction();
        }

        window.removeEventListener('click', this.onClickOutsideBlockly);

        // Ensure account switch is re-enabled.
        // TODO: fix
        const { ui } = this.core;

        ui.setAccountSwitcherDisabledMessage();
        ui.setPromptHandler(false);

        if (this.timer) clearInterval(this.timer);
        performance.clearMeasures();
    };

    registerCurrencyReaction = () => {
        // Syncs all trade options blocks' currency with the client's active currency.
        this.disposeCurrencyReaction = reaction(
            () => this.core.client.currency,
            () => {
                if (!window.Blockly?.derivWorkspace) return;

                const trade_options_blocks = window.Blockly?.derivWorkspace
                    .getAllBlocks()
                    .filter(
                        b =>
                            b.type === 'trade_definition_tradeoptions' ||
                            b.type === 'trade_definition_multiplier' ||
                            b.type === 'trade_definition_accumulator' ||
                            (b.isDescendantOf('trade_definition_multiplier') && b.category_ === 'trade_parameters')
                    );

                trade_options_blocks.forEach(trade_options_block => setCurrency(trade_options_block));
            }
        );
    };

    registerOnAccountSwitch = () => {
        this.disposeSwitchAccountListener = reaction(
            () => this.root_store.common?.is_socket_opened,
            is_socket_opened => {
                if (!is_socket_opened) return;
                this.api_helpers_store = {
                    server_time: this.root_store.common.server_time,
                    ws: api_base.api,
                };

                if (!ApiHelpers?.instance) {
                    ApiHelpers.setInstance(this.api_helpers_store);
                }

                this.showDigitalOptionsMaltainvestError();

                const active_symbols = ApiHelpers?.instance?.active_symbols;
                const contracts_for = ApiHelpers?.instance?.contracts_for;

                if (ApiHelpers?.instance && active_symbols && contracts_for) {
                    if (window.Blockly?.derivWorkspace) {
                        active_symbols?.retrieveActiveSymbols(true).then(() => {
                            contracts_for.disposeCache();
                            window.Blockly?.derivWorkspace
                                .getAllBlocks()
                                .filter(block => block.type === 'trade_definition_market')
                                .forEach(block => {
                                    runIrreversibleEvents(() => {
                                        const fake_create_event = new window.Blockly.Events.BlockCreate(block);
                                        window.Blockly.Events.fire(fake_create_event);
                                    });
                                });
                        });
                    }
                    DBot.initializeInterpreter();
                }
            }
        );
    };

    registerLandingCompanyChangeReaction = () => {
        const { client } = this.core;

        this.disposeLandingCompanyChangeReaction = reaction(
            () => client.landing_company_shortcode,
            () => this.handleErrorForEu()
        );
    };

    registerResidenceChangeReaction = () => {
        const { client } = this.core;

        this.disposeResidenceChangeReaction = reaction(
            () => client.account_settings?.country_code,
            () => this.handleErrorForEu()
        );
    };

    setDBotEngineStores = () => {
        const { flyout, toolbar, save_modal, dashboard, load_modal, run_panel, blockly_store, summary_card } =
            this.root_store;
        const { client, common } = this.core;
        const { handleFileChange } = load_modal;
        const { setLoading } = blockly_store;
        const { setContractUpdateConfig } = summary_card;
        const {
            ui: { is_mobile },
        } = this.core;

        this.dbot_store = {
            client,
            flyout,
            toolbar,
            save_modal,
            dashboard,
            load_modal,
            run_panel,
            setLoading,
            setContractUpdateConfig,
            handleFileChange,
            is_mobile,
            common,
        };

        this.api_helpers_store = {
            server_time: this.core.common.server_time,
            ws: api_base.api,
        };
    };

    onClickOutsideBlockly = (event: Event) => {
        if (document.querySelector('.injectionDiv')) {
            const path = event.path || (event.composedPath && event.composedPath());
            const is_click_outside_blockly = !path.some(
                (el: Element) => el.classList && el.classList.contains('injectionDiv')
            );

            if (is_click_outside_blockly) {
                window.Blockly?.hideChaff(/* allowToolbox */ false);
            }
        }
    };

    showDigitalOptionsMaltainvestError = () => {
        this.handleErrorForEu(true);
    };
}
