import React from 'react';
import { observer } from 'mobx-react-lite';
import { ToastContainer } from 'react-toastify';
import { getUrlBase } from '@/components/shared';
import TransactionDetailsModal from '@/components/transaction-details';
import { api_base, ApiHelpers, ServerTime } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { setSmartChartsPublicPath } from '@deriv/deriv-charts';
import { Loader } from '@deriv-com/ui';
import Audio from '../components/audio';
import BlocklyLoading from '../components/blockly-loading';
import BotStopped from '../components/bot-stopped';
import BotBuilder from '../pages/bot-builder';
import Main from '../pages/main';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';
import '../components/bot-notification/bot-notification.scss';

const AppContent = observer(() => {
    const [is_loading, setIsLoading] = React.useState(true);
    const store = useStore();
    const { app, transactions, common, client } = store;
    const { showDigitalOptionsMaltainvestError } = app;

    const { recovered_transactions, recoverPendingContracts } = transactions;
    const is_subscribed_to_msg_listener = React.useRef(false);
    const init_api_interval = React.useRef(null);
    const msg_listener = React.useRef(null);

    const { current_language } = common;
    const html = document.documentElement;
    React.useEffect(() => {
        html?.setAttribute('lang', current_language.toLowerCase());
        html?.setAttribute('dir', current_language.toLowerCase() === 'ar' ? 'rtl' : 'ltr');
    }, [current_language]);

    const handleMessage = React.useCallback(
        ({ data }) => {
            if (data?.msg_type === 'proposal_open_contract' && !data?.error) {
                const { proposal_open_contract } = data;
                if (
                    proposal_open_contract?.status !== 'open' &&
                    !recovered_transactions?.includes(proposal_open_contract?.contract_id)
                ) {
                    recoverPendingContracts(proposal_open_contract);
                }
            }
        },
        [recovered_transactions, recoverPendingContracts]
    );

    React.useEffect(() => {
        setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));
    }, []);

    const checkIfApiInitialized = React.useCallback(() => {
        init_api_interval.current = setInterval(() => {
            if (api_base?.api) {
                clearInterval(init_api_interval.current);

                // Listen for proposal open contract messages to check
                // if there is any active contract from bot still running
                if (api_base?.api && !is_subscribed_to_msg_listener.current) {
                    is_subscribed_to_msg_listener.current = true;
                    msg_listener.current = api_base.api.onMessage()?.subscribe(handleMessage);
                }
            }
        }, 500);
    }, [handleMessage]);

    React.useEffect(() => {
        // Check until api is initialized and then subscribe to the api messages
        // Also we should only subscribe to the messages once user is logged in
        // And is not already subscribed to the messages
        if (!is_subscribed_to_msg_listener.current && client.is_logged_in) {
            checkIfApiInitialized();
        }
        return () => {
            if (is_subscribed_to_msg_listener.current && msg_listener.current) {
                is_subscribed_to_msg_listener.current = false;
                msg_listener.current.unsubscribe();
            }
        };
    }, [checkIfApiInitialized, client.is_logged_in, client.loginid]);

    React.useEffect(() => {
        showDigitalOptionsMaltainvestError(client, common);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_options_blocked, client.account_settings?.country_code, client.clients_country]);

    const init = () => {
        // TODO: TBD
        // import('@/utils/gtm').then(({ default: GTM }) => {
        //     GTM.init();
        // });
        ServerTime.init(common);
        app.setDBotEngineStores();
        ApiHelpers.setInstance(app.api_helpers_store);
    };

    const changeActiveSymbolLoadingState = () => {
        init();
        const { active_symbols } = ApiHelpers.instance;
        active_symbols.retrieveActiveSymbols(true).then(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        init();
        setIsLoading(true);
        if (!client.is_logged_in) {
            changeActiveSymbolLoadingState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // use is_landing_company_loaded to know got details of accounts to identify should show an error or not
    React.useEffect(() => {
        if (client.is_logged_in && client.is_landing_company_loaded) {
            changeActiveSymbolLoadingState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_landing_company_loaded]);

    React.useEffect(() => {
        const onDisconnectFromNetwork = () => {
            setIsLoading(false);
        };
        window.addEventListener('offline', onDisconnectFromNetwork);
        return () => {
            window.removeEventListener('offline', onDisconnectFromNetwork);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (common?.error) return null;

    return is_loading ? (
        <Loader />
    ) : (
        <>
            <BlocklyLoading />
            <div className='bot-dashboard bot' data-testid='dt_bot_dashboard'>
                <Audio />
                <Main />
                <BotBuilder />
                <BotStopped />
                <TransactionDetailsModal />
                <ToastContainer limit={3} draggable={false} />
            </div>
        </>
    );
});

export default AppContent;
