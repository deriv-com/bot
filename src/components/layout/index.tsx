import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import PWAUpdateNotification from '@/components/pwa-update-notification';
import { api_base } from '@/external/bot-skeleton';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import { useStore } from '@/hooks/useStore';
import useTMB from '@/hooks/useTMB';
import { handleOidcAuthFailure } from '@/utils/auth-utils';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { useDevice } from '@deriv-com/ui';
import { crypto_currencies_display_order, fiat_currencies_display_order } from '../shared';
import Footer from './footer';
import AppHeader from './header';
import Body from './main-body';
import './layout.scss';

const Layout = observer(() => {
    const { isDesktop } = useDevice();
    const { isOnline } = useOfflineDetection();
    const store = useStore();
    const is_quick_strategy_active = store?.quick_strategy?.is_open;

    const isCallbackPage = window.location.pathname === '/callback';
    const { onRenderTMBCheck, is_tmb_enabled: tmb_enabled_from_hook, isTmbEnabled } = useTMB();
    const is_tmb_enabled = useMemo(
        () => window.is_tmb_enabled === true || tmb_enabled_from_hook,
        [tmb_enabled_from_hook]
    );

    const isLoggedInCookie = Cookies.get('logged_state') === 'true';
    const isEndpointPage = window.location.pathname.includes('endpoint');
    const checkClientAccount = JSON.parse(localStorage.getItem('clientAccounts') ?? '{}');
    const getQueryParams = new URLSearchParams(window.location.search);
    const currency = getQueryParams.get('account') ?? '';
    const accountsList = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
    const isClientAccountsPopulated = Object.keys(accountsList).length > 0;
    const ifClientAccountHasCurrency =
        Object.values(checkClientAccount).some((account: any) => account.currency === currency) ||
        currency === 'demo' ||
        currency === '';
    const [clientHasCurrency, setClientHasCurrency] = useState(ifClientAccountHasCurrency);
    const [isAuthenticating, setIsAuthenticating] = useState(true); // Start with true to prevent flashing

    // Expose setClientHasCurrency to window for global access
    useEffect(() => {
        (window as any).setClientHasCurrency = setClientHasCurrency;

        return () => {
            delete (window as any).setClientHasCurrency;
        };
    }, []);

    const validCurrencies = [...fiat_currencies_display_order, ...crypto_currencies_display_order];
    const query_currency = (getQueryParams.get('account') ?? '')?.toUpperCase();
    const isCurrencyValid = validCurrencies.includes(query_currency);
    const api_accounts: any[][] = [];
    let subscription: { unsubscribe: () => void };

    const validateApiAccounts = ({ data }: any) => {
        if (data.msg_type === 'authorize') {
            const account_list = data?.authorize?.account_list || [];
            const account_list_filter = account_list.filter((acc: any) => acc.is_disabled === 0);
            api_accounts.push(account_list_filter || []);
            const allCurrencies = new Set(Object.values(checkClientAccount).map((acc: any) => acc.currency));

            // Skip disabled accounts when checking for missing currency
            const accounts = api_accounts.flat();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let detected_currency = '';
            const hasMissingCurrency = accounts.some(data => {
                if (!allCurrencies.has(data.currency)) {
                    console.log('Missing currency:', data.currency);
                    sessionStorage.setItem('query_param_currency', data.currency);
                    return true;
                }
                detected_currency = data.currency;
                return false;
            });

            let hasMissingToken = false;
            let missingTokenCurrency = '';

            for (const acc of account_list_filter) {
                if (acc.loginid && !accountsList[acc.loginid]) {
                    hasMissingToken = true;
                    missingTokenCurrency = acc.currency || '';
                    // Store the missing token's currency in session storage
                    if (missingTokenCurrency) {
                        sessionStorage.setItem('query_param_currency', missingTokenCurrency);
                    }
                    break;
                }
            }

            if (hasMissingCurrency || hasMissingToken) {
                setClientHasCurrency(false);
            } else {
                const account_list_ =
                    account_list_filter?.find((acc: { currency: string }) => acc.currency === currency) ||
                    account_list_filter?.[0];

                let session_storage_currency =
                    sessionStorage.getItem('query_param_currency') || account_list_?.currency || 'USD';

                session_storage_currency = `account=${session_storage_currency}`;
                setClientHasCurrency(true);
                if (!new URLSearchParams(window.location.search).has('account')) {
                    window.history.pushState({}, '', `${window.location.pathname}?${session_storage_currency}`);
                }

                setClientHasCurrency(true);
            }

            if (subscription) {
                subscription?.unsubscribe();
            }
        }
    };

    useEffect(() => {
        if (isCurrencyValid && api_base.api) {
            // Subscribe to the onMessage event
            const is_valid_currency = currency && validCurrencies.includes(currency.toUpperCase());
            if (!is_valid_currency) return;
            subscription = api_base.api.onMessage().subscribe(validateApiAccounts);
        }
    }, []);

    useEffect(() => {
        // Always set the currency in session storage, even if the user is not logged in
        // This ensures the currency is available on the callback page
        setIsAuthenticating(true);
        if (currency) {
            sessionStorage.setItem('query_param_currency', currency);
        }

        const checkOIDCEnabledWithMissingAccount = !isEndpointPage && !isCallbackPage && !clientHasCurrency;
        const shouldAuthenticate =
            (isLoggedInCookie && !isClientAccountsPopulated && !isEndpointPage && !isCallbackPage) ||
            checkOIDCEnabledWithMissingAccount;

        // Skip authentication when offline
        if (!isOnline) {
            console.log('[Layout] Offline detected, skipping authentication');
            setIsAuthenticating(false);
            setClientHasCurrency(true); // Allow access in offline mode
            return;
        }

        // Create an async IIFE to handle authentication
        (async () => {
            try {
                // First, explicitly wait for TMB status to be determined
                // This ensures we have the correct TMB status before proceeding
                const tmbEnabled = await isTmbEnabled();

                // Now use the result of the explicit check
                if (tmbEnabled) {
                    await onRenderTMBCheck();
                } else if (shouldAuthenticate) {
                    const query_param_currency = currency || sessionStorage.getItem('query_param_currency') || 'USD';

                    // Make sure we have the currency in session storage before redirecting
                    if (query_param_currency) {
                        sessionStorage.setItem('query_param_currency', query_param_currency);
                    }
                    try {
                        await requestOidcAuthentication({
                            redirectCallbackUri: `${window.location.origin}/callback`,
                            ...(query_param_currency
                                ? {
                                      state: {
                                          account: query_param_currency,
                                      },
                                  }
                                : {}),
                        });
                    } catch (err) {
                        setIsAuthenticating(false);
                        handleOidcAuthFailure(err);
                    }
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                setIsAuthenticating(false);
                console.error('Authentication error:', err);
            } finally {
                setIsAuthenticating(false);
            }
        })();
    }, [
        isLoggedInCookie,
        isClientAccountsPopulated,
        isEndpointPage,
        isCallbackPage,
        clientHasCurrency,
        tmb_enabled_from_hook,
        onRenderTMBCheck,
        currency,
        is_tmb_enabled,
        isOnline, // Add isOnline to dependencies
    ]);

    // Add offline timeout to prevent infinite authentication
    useEffect(() => {
        if (!isOnline && isAuthenticating) {
            console.log('[Layout] Setting offline timeout for authentication');
            const timeout = setTimeout(() => {
                console.log('[Layout] Offline timeout reached, stopping authentication');
                setIsAuthenticating(false);
                setClientHasCurrency(true);
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [isOnline, isAuthenticating]);

    // Add a state to track if initial authentication check is complete
    const [isInitialAuthCheckComplete, setIsInitialAuthCheckComplete] = useState(false);

    // Effect to mark initial auth check as complete after a short delay
    useEffect(() => {
        if (!isAuthenticating && !isInitialAuthCheckComplete) {
            // Wait a bit to ensure all state updates have propagated
            const timer = setTimeout(() => {
                setIsInitialAuthCheckComplete(true);
            }, 500); // Give it enough time to stabilize

            return () => clearTimeout(timer);
        }
    }, [isAuthenticating, isInitialAuthCheckComplete]);

    return (
        <div
            className={clsx('layout', {
                responsive: isDesktop,
                'quick-strategy-active': is_quick_strategy_active && !isDesktop,
            })}
        >
            {!isCallbackPage && <AppHeader isAuthenticating={isAuthenticating || !isInitialAuthCheckComplete} />}
            <Body>
                <Outlet />
            </Body>
            {!isCallbackPage && isDesktop && <Footer />}
            <PWAUpdateNotification />
        </div>
    );
});

export default Layout;
