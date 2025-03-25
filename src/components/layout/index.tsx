import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import { api_base } from '@/external/bot-skeleton';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { useDevice } from '@deriv-com/ui';
import { crypto_currencies_display_order, fiat_currencies_display_order } from '../shared';
import SSOLoader from '../sso-loader';
import Footer from './footer';
import AppHeader from './header';
import Body from './main-body';
import './layout.scss';

const Layout = () => {
    const { isDesktop } = useDevice();

    const { isOAuth2Enabled, isSingleLoggingIn } = useOauth2();

    const isCallbackPage = window.location.pathname === '/callback';
    const isLoggedInCookie = Cookies.get('logged_state') === 'true';
    const isEndpointPage = window.location.pathname.includes('endpoint');
    const checkClientAccount = JSON.parse(localStorage.getItem('clientAccounts') ?? '{}');
    const getQueryParams = new URLSearchParams(window.location.search);
    const currency = getQueryParams.get('account') ?? '';
    const accountsList = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
    const isClientAccountsPopulated = Object.keys(accountsList).length > 0;
    const ifClientAccountHasCurrency =
        Object.values(checkClientAccount).some(account => account.currency === currency) ||
        currency === 'demo' ||
        currency === '';
    const [clientHasCurrency, setClientHasCurrency] = useState(ifClientAccountHasCurrency);

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
            api_accounts.push(account_list || []);
            let currency;
            const allCurrencies = new Set(Object.values(checkClientAccount).map(acc => acc.currency));

            // Check for missing currency
            const hasMissingCurrency = api_accounts?.flat().some(data => {
                if (!allCurrencies.has(data.currency)) {
                    sessionStorage.setItem('query_param_currency', data.currency);
                    return true;
                }
                currency = data.currency;
                return false;
            });

            // Check for missing tokens
            const accountsList = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
            let hasMissingToken = false;
            let missingTokenCurrency = '';

            for (const acc of account_list) {
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
                    account_list?.find((acc: { currency: string }) => acc.currency === currency) || account_list?.[0];

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
            subscription = api_base.api.onMessage().subscribe(validateApiAccounts);
        }
    }, []);

    useEffect(() => {
        // Always set the currency in session storage, even if the user is not logged in
        // This ensures the currency is available on the callback page
        if (currency) {
            sessionStorage.setItem('query_param_currency', currency);
        }

        if (
            (isLoggedInCookie && !isClientAccountsPopulated && isOAuth2Enabled && !isEndpointPage && !isCallbackPage) ||
            !clientHasCurrency
        ) {
            const query_param_currency = sessionStorage.getItem('query_param_currency') || currency || 'USD';

            // Make sure we have the currency in session storage before redirecting
            if (query_param_currency) {
                sessionStorage.setItem('query_param_currency', query_param_currency);
            }
            try {
                requestOidcAuthentication({
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
                console.error(err);
            }
        }
    }, [
        isLoggedInCookie,
        isClientAccountsPopulated,
        isOAuth2Enabled,
        isEndpointPage,
        isCallbackPage,
        clientHasCurrency,
    ]);

    return (
        <div className={clsx('layout', { responsive: isDesktop })}>
            {!isCallbackPage && !isSingleLoggingIn && <AppHeader />}
            <Body>
                {isSingleLoggingIn && <SSOLoader />}
                {!isSingleLoggingIn && <Outlet />}
            </Body>
            {!isCallbackPage && !isSingleLoggingIn && isDesktop && <Footer />}
        </div>
    );
};

export default Layout;
