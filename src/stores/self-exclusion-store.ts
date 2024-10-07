import { action, computed, makeObservable, observable } from 'mobx';
import { api_base } from '@/external/bot-skeleton';
import { V2GetActiveClientId } from '@/external/bot-skeleton/services/api/appId';
import { TStores } from '@deriv/stores/types';
import RootStore from './root-store';

export default class SelfExclusionStore {
    root_store: RootStore;
    core: TStores;
    constructor(root_store: RootStore, core: TStores) {
        makeObservable(this, {
            api_max_losses: observable,
            run_limit: observable,
            is_restricted: observable,
            initial_values: computed,
            should_bot_run: computed,
            setIsRestricted: action.bound,
            setApiMaxLosses: action.bound,
            setRunLimit: action.bound,
            resetSelfExclusion: action.bound,
            checkRestriction: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
    }

    api_max_losses = 0;
    run_limit = -1;
    is_restricted = false;
    form_max_losses: number | undefined = undefined;
    get initial_values() {
        return {
            form_max_losses: this.api_max_losses || '',
            run_limit: this.run_limit !== -1 ? this.run_limit : '',
        };
    }

    get should_bot_run() {
        const { client } = this.core;
        if (client.is_eu && !client.is_virtual && (this.api_max_losses === 0 || this.run_limit === -1)) {
            return false;
        }
        return true;
    }

    setIsRestricted(is_restricted: boolean) {
        this.is_restricted = is_restricted;
    }

    setApiMaxLosses(api_max_losses: number) {
        this.api_max_losses = api_max_losses;
    }

    setRunLimit(run_limit: number) {
        this.run_limit = run_limit;
    }

    resetSelfExclusion() {
        this.is_restricted = false;
        this.api_max_losses = 0;
        this.form_max_losses = 0;
        this.run_limit = -1;
    }

    async checkRestriction() {
        if (api_base.api && api_base.is_authorized && V2GetActiveClientId()) {
            api_base.api.getSelfExclusion().then(({ get_self_exclusion }) => {
                const { max_losses: maxLosses } = get_self_exclusion;
                if (maxLosses) {
                    this.setApiMaxLosses(maxLosses);
                }
            });
        }
    }
}
