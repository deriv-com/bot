import CommonStore from '@/stores/common-store';
import { TAuthData } from '@/types/api-types';
import { observer as globalObserver } from '../../utils/observer';
import { doUntilDone, socket_state } from '../tradeEngine/utils/helpers';
import {
    CONNECTION_STATUS,
    setAccountList,
    setAuthData,
    setConnectionStatus,
    setIsAuthorized,
    setIsAuthorizing,
} from './observables/connection-status-stream';
import ApiHelpers from './api-helpers';

type CurrentSubscription = {
    id: string;
    unsubscribe: () => void;
};

type SubscriptionPromise = Promise<{
    subscription: CurrentSubscription;
}>;

type TApiBaseApi = {
    connection: {
        readyState: keyof typeof socket_state;
        addEventListener: (event: string, callback: () => void) => void;
        removeEventListener: (event: string, callback: () => void) => void;
    };
    send: (data: unknown) => void;
    disconnect: () => void;
    authorize: (token: string) => Promise<{ authorize: TAuthData; error: unknown }>;
    getSelfExclusion: () => Promise<unknown>;
    onMessage: () => {
        subscribe: (callback: (message: unknown) => void) => {
            unsubscribe: () => void;
        };
    };
} & ReturnType<typeof generateDerivApiInstance>;

let reconnect_timeout: NodeJS.Timeout | null = null;

class APIBase {
    api: TApiBaseApi | null = null;
    token: string = '';
    account_id: string = '';
    pip_sizes = {};
    account_info = {};
    is_running = false;
    subscriptions: CurrentSubscription[] = [];
    time_interval: ReturnType<typeof setInterval> | null = null;
    has_active_symbols = false;
    is_stopping = false;
    active_symbols = [];
    current_auth_subscriptions: SubscriptionPromise[] = [];
    is_authorized = false;
    active_symbols_promise: Promise<void> | null = null;
    common_store: CommonStore | undefined;
    landing_company: string | null = null;
    //TODO : Need to remove this api call because we have it in client store
    async getLandingCompany() {
        if (!this.api || !this.account_info?.country) {
            return null;
        }
        try {
            const landing_company = await this.api.send({ landing_company: this.account_info.country });
            this.landing_company = landing_company;
        } catch (error) {
            console.error('Error fetching landing company:', error);
            this.landing_company = null;
        }
        return this.landing_company;
    }

    unsubscribeAllSubscriptions = () => {
        // this.current_auth_subscriptions?.forEach(subscription_promise => {
        //     subscription_promise.then(({ subscription }) => {
        //         if (subscription?.id) {
        //             this.api?.send({
        //                 forget: subscription.id,
        //             });
        //         }
        //     });
        // });
        this.current_auth_subscriptions = [];
    };

    onsocketopen() {
        setConnectionStatus(CONNECTION_STATUS.OPENED);
        console.log('test on open ---------');
    }

    onsocketclose() {
        setConnectionStatus(CONNECTION_STATUS.CLOSED);
        this.reconnectIfNotConnected();
        const error = {
            error: {
                code: 'DisconnectError',
                message: 'Connection lost',
            },
        };
        globalObserver?.emit('Error', error);
    }

    async initApi(force_create_connection = false) {
        this.toggleRunButton(true);

        if (this.api) {
            this.unsubscribeAllSubscriptions();
        }

        if (!this.api || this.api?.connection.readyState > 1 || force_create_connection) {
            if (this.api?.connection && !force_create_connection) {
                ApiHelpers.disposeInstance();
                setConnectionStatus(CONNECTION_STATUS.CLOSED);
                console.log('test ------------------- reconnect ---------');
                await this.api.reconnect();
                // this.api.connection.removeEventListener('open', this.onsocketopen.bind(this));
                // this.api.connection.removeEventListener('close', this.onsocketclose.bind(this));
            } else {
                this.api?.disconnect();
                this.api = generateDerivApiInstance();
                console.log('test ------------------- new ---------', this.api.onOpen);
                // Example: WebSocket API that returns Observable for 'open' events
                api_base.api.onOpen().subscribe({
                    next: openEvent => {
                        // This block is executed when WebSocket opens
                        console.log('WebSocket connection opened:', openEvent);
                        if (!this.has_active_symbols) {
                            this.active_symbols_promise = this.getActiveSymbols();
                        }
                
                        this.initEventListeners();
                
                        if (this.time_interval) clearInterval(this.time_interval);
                        this.time_interval = null;
                
                        if (V2GetActiveToken()) {
                            setIsAuthorizing(true);
                            this.authorizeAndSubscribe();
                        }
                        this.onsocketopen();
                    },
                    error: err => {
                        // Handle any errors (unlikely for WebSocket "open", but error handling is always good)
                        console.error('Error occurred while opening WebSocket:', err);
                    },
                    complete: () => {
                        // Complete is called when the Observable completes or the connection closes
                        console.log('WebSocket onOpen event stream completed');
                    },
                });

                this.api.onClose().subscribe({
                    next: closeEvent => {
                        console.log('WebSocket connection closed:', closeEvent);
                        this.onsocketclose();
                        // throw new Error('DisconnectError');
                    },
                    error: err => {
                        console.error('Error occurred while closing WebSocket:', err);
                    },
                    complete: () => {
                        console.log('WebSocket onClose event stream completed');
                    },
                });

                // Subscribing to the 'open' event
                // const openSubscription: Subscription = openObservable;
                // this.api?.connection.addEventListener('open', this.onsocketopen.bind(this));
                // this.api?.connection.addEventListener('close', this.onsocketclose.bind(this));
                // this.api.onClose(() => {
                //     console.log('test on close ---------');
                // });
            }
        }


        // chart_api.init(force_create_connection);

        if (!reconnect_timeout) {
            setInterval(() => {
                console.log('--------  Disconnecting the socket ---------');
                // this.api?.disconnect();
            }, 30000);
        } else {
            reconnect_timeout = null;
        }
    }

    getConnectionStatus() {
        if (this.api?.connection) {
            const ready_state = this.api.connection.readyState;
            return socket_state[ready_state as keyof typeof socket_state] || 'Unknown';
        }
        return 'Socket not initialized';
    }

    terminate() {
        // eslint-disable-next-line no-console
        // if (this.api) this.api.disconnect();
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
        }
    }

    async createNewInstance(account_id: string) {
        if (this.account_id !== account_id) {
            await this.initApi(true);
        }
    }

    reconnectIfNotConnected = () => {
        // eslint-disable-next-line no-console
        console.log('connection state: ', this.api?.connection?.readyState);
        if (this.api?.connection?.readyState && this.api?.connection?.readyState > 1) {
            // Debounce reconnection attempts to avoid multiple rapid reconnects
            if (reconnect_timeout) {
                clearTimeout(reconnect_timeout as NodeJS.Timeout);
            }
            reconnect_timeout = setTimeout(() => {
                // eslint-disable-next-line no-console
                console.log('Info: Connection to the server was closed, trying to reconnect.');
                this.initApi();
            }, 3000);
        }
    };

    async authorizeAndSubscribe() {
        const token = V2GetActiveToken();
        if (token) {
            this.token = token;
            this.account_id = V2GetActiveClientId() ?? '';

            if (!this.api) return;

            try {
                const { authorize, error } = await this.api.authorize(this.token);
                if (error) return error;

                if (this.has_active_symbols) {
                    this.toggleRunButton(false);
                } else {
                    this.active_symbols_promise = this.getActiveSymbols();
                }
                this.account_info = authorize;
                setAccountList(authorize.account_list);
                setAuthData(authorize);
                setIsAuthorized(true);
                this.is_authorized = true;
                this.subscribe();
                this.getSelfExclusion();
            } catch (e) {
                this.is_authorized = false;
                setIsAuthorized(false);
                globalObserver.emit('Error', e);
            } finally {
                setIsAuthorizing(false);
            }
        }
    }

    async getSelfExclusion() {
        if (!this.api || !this.is_authorized) return;
        await this.api.getSelfExclusion();
        // TODO: fix self exclusion
    }

    async subscribe() {
        const subscribeToStream = (streamName: string) => {
            return doUntilDone(
                () => {
                    const subscription = this.api?.send({
                        [streamName]: 1,
                        subscribe: 1,
                        ...(streamName === 'balance' ? { account: 'all' } : {}),
                    });
                    if (subscription) {
                        this.current_auth_subscriptions.push(subscription);
                    }
                    return subscription;
                },
                [],
                this.api
            );
        };

        const streamsToSubscribe = ['balance', 'transaction', 'proposal_open_contract'];

        await Promise.all(streamsToSubscribe.map(subscribeToStream));
    }

    getActiveSymbols = async () => {
        await doUntilDone(() => this.api?.send({ active_symbols: 'brief' }), [], this).then(
            ({ active_symbols = [], error = {} }) => {
                const pip_sizes = {};
                if (active_symbols.length) this.has_active_symbols = true;
                active_symbols.forEach(({ symbol, pip }: { symbol: string; pip: string }) => {
                    (pip_sizes as Record<string, number>)[symbol] = +(+pip).toExponential().substring(3);
                });
                this.pip_sizes = pip_sizes as Record<string, number>;
                this.toggleRunButton(false);
                this.active_symbols = active_symbols;
                return active_symbols || error;
            }
        );
    };

    toggleRunButton = (toggle: boolean) => {
        const run_button = document.querySelector('#db-animation__run-button');
        if (!run_button) return;
        (run_button as HTMLButtonElement).disabled = toggle;
    };

    setIsRunning(toggle = false) {
        this.is_running = toggle;
    }

    pushSubscription(subscription: CurrentSubscription) {
        this.subscriptions.push(subscription);
    }

    clearSubscriptions() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];

        // Resetting timeout resolvers
        const global_timeouts = globalObserver.getState('global_timeouts') ?? [];

        global_timeouts.forEach((_: unknown, i: number) => {
            clearTimeout(i);
        });
    }
}

export const api_base = new APIBase();
