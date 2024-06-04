import React from 'react';
import { ToastContainer } from 'react-toastify';

import { Loader } from '@deriv-com/ui';

import TransactionDetailsModal from '@/components/transaction-details';
import { api_base, ApiHelpers, ServerTime } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import GTM from '@/utils/gtm';

import Audio from '../components/audio';
import BlocklyLoading from '../components/blockly-loading';
import BotNotificationMessages from '../components/bot-notification-messages';
import BotStopped from '../components/bot-stopped';
import NetworkToastPopup from '../components/network-toast-popup';
import RoutePromptDialog from '../components/route-prompt-dialog';
import BotBuilder from '../pages/bot-builder';
import Main from '../pages/main';

import './app.scss';
import 'react-toastify/dist/ReactToastify.css';
import '../components/bot-notification/bot-notification.scss';

const AppContent = () => {
    const [is_loading, setIsLoading] = React.useState(true);
    const RootStore = {
        common: {},
        client: {
            is_logged_in: false,
            is_options_blocked: false,
            account_settings: {},
            clients_country: '',
            is_landing_company_loaded: false,
        },
    };
    const { common, client } = RootStore;
    const DBotStores = useStore();
    const { app, transactions } = DBotStores;
    const { showDigitalOptionsMaltainvestError } = app;

    // TODO: Remove this when connect is removed completely
    const combinedStore = { ...DBotStores, core: { ...RootStore } };

    const { recovered_transactions, recoverPendingContracts } = transactions;
    const is_subscribed_to_msg_listener = React.useRef(false);
    const msg_listener = React.useRef(null);

    const handleMessage = ({ data }) => {
        if (data?.msg_type === 'proposal_open_contract' && !data?.error) {
            const { proposal_open_contract } = data;
            if (
                proposal_open_contract?.status !== 'open' &&
                !recovered_transactions?.includes(proposal_open_contract?.contract_id)
            ) {
                recoverPendingContracts(proposal_open_contract);
            }
        }
    };

    React.useEffect(() => {
        // Listen for proposal open contract messages to check
        // if there is any active contract from bot still running
        if (api_base?.api && !is_subscribed_to_msg_listener.current) {
            is_subscribed_to_msg_listener.current = true;
            msg_listener.current = api_base.api?.onMessage()?.subscribe(handleMessage);
        }
        return () => {
            if (is_subscribed_to_msg_listener.current && msg_listener.current) {
                is_subscribed_to_msg_listener.current = false;
                msg_listener.current.unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_base?.api]);

    React.useEffect(() => {
        showDigitalOptionsMaltainvestError(client, common);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_options_blocked, client.account_settings.country_code, client.clients_country]);

    const init = () => {
        GTM.init(combinedStore);
        ServerTime.init(common);
        app.setDBotEngineStores(combinedStore);
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
    if (client.is_landing_company_loaded) {
        changeActiveSymbolLoadingState();
    }

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

    return !is_loading ? (
        <Loader />
    ) : (
        <>
            <BlocklyLoading />
            <div className='bot-dashboard bot'>
                <Audio />
                <BotNotificationMessages />
                <NetworkToastPopup />
                <BotStopped />
                <RoutePromptDialog />
                <BotBuilder />
                <Main />
                <TransactionDetailsModal />
                <ToastContainer limit={3} draggable={false} />
            </div>
        </>
    );
};

export default AppContent;
