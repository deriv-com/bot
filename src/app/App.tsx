import { initSurvicate } from '../public-path';
import { Fragment, lazy, Suspense } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import { config } from '@/external/bot-skeleton';
import { StoreProvider } from '@/hooks/useStore';
import CallbackPage from '@/pages/callback';
import Endpoint from '@/pages/endpoint';
import { TAuthData } from '@/types/api-types';
import { initializeI18n, localize, TranslationProvider } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import CoreStoreProvider from './CoreStoreProvider';
import './app-root.scss';

const Layout = lazy(() => import('../components/layout'));
const AppRoot = lazy(() => import('./app-root'));

const { TRANSLATIONS_CDN_URL, R2_PROJECT_NAME, CROWDIN_BRANCH_NAME } = process.env;
const i18nInstance = initializeI18n({
    cdnUrl: `${TRANSLATIONS_CDN_URL}/${R2_PROJECT_NAME}/${CROWDIN_BRANCH_NAME}`,
});

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path='/'
            element={
                <Suspense
                    fallback={<ChunkLoader message={localize('Please wait while we connect to the server...')} />}
                >
                    <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                        <StoreProvider>
                            <RoutePromptDialog />
                            <CoreStoreProvider>
                                <Layout />
                            </CoreStoreProvider>
                        </StoreProvider>
                    </TranslationProvider>
                </Suspense>
            }
        >
            {/* All child routes will be passed as children to Layout */}
            <Route index element={<AppRoot />} />
            <Route path='endpoint' element={<Endpoint />} />
            <Route path='callback' element={<CallbackPage />} />
        </Route>
    )
);

function App() {
    const { loginInfo, paramsToDelete } = URLUtils.getLoginInfoFromURL();
    React.useEffect(() => {
        // Set login info to local storage and remove params from url
        if (loginInfo.length) {
            try {
                const defaultActiveAccount = URLUtils.getDefaultActiveAccount(loginInfo);
                if (!defaultActiveAccount) return;

                const accountsList: Record<string, string> = {};

                loginInfo.forEach(account => {
                    accountsList[account.loginid] = account.token;
                });

                localStorage.setItem('accountsList', JSON.stringify(accountsList));

                URLUtils.filterSearchParams(paramsToDelete);

                localStorage.setItem('authToken', loginInfo[0].token);
                localStorage.setItem('active_loginid', loginInfo[0].loginid);
            } catch (error) {
                console.error('Error setting up login info:', error);
            }
        }

        URLUtils.filterSearchParams(['lang']);
    }, [loginInfo, paramsToDelete]);

    React.useEffect(() => {
        initSurvicate();
        window?.dataLayer?.push({ event: 'page_load' });
        return () => {
            const survicate_box = document.getElementById('survicate-box');
            if (survicate_box) {
                survicate_box.style.display = 'none';
            }
        };
    }, []);

    React.useEffect(() => {
        const accounts_list = localStorage.getItem('accountsList');
        const client_accounts = localStorage.getItem('client.accounts');
        const url_params = new URLSearchParams(window.location.search);
        const account_currency = url_params.get('account');

        if (!account_currency || !accounts_list || !client_accounts) return;

        const parsed_accounts = JSON.parse(accounts_list);
        const parsed_client_accounts = JSON.parse(client_accounts) as TAuthData['account_list'];
        const is_valid_currency = config().lists.CURRENCY.includes(account_currency);

        const updateLocalStorage = (token: string, loginid: string) => {
            localStorage.setItem('authToken', token);
            localStorage.setItem('active_loginid', loginid);
        };

        // Handle demo account
        if (account_currency === 'demo') {
            const demo_account = Object.entries(parsed_accounts).find(([key]) => key.startsWith('VR'));

            if (demo_account) {
                const [loginid, token] = demo_account;
                updateLocalStorage(String(token), loginid);
                return;
            }
        }

        // Handle real account with valid currency
        if (account_currency !== 'demo' && is_valid_currency) {
            const real_account = Object.entries(parsed_client_accounts).find(
                ([loginid, account]) => !loginid.startsWith('VR') && account.currency === account_currency
            );

            if (real_account) {
                const [loginid, account] = real_account;
                if ('token' in account) {
                    updateLocalStorage(String(account?.token), loginid);
                }
                return;
            }
        }

        // Handle invalid currency case
        if (!is_valid_currency) {
            // Try to find default fiat account
            const default_account = Object.entries(parsed_client_accounts).find(
                ([, account]) => account.broker === 'CR' && account.currency_type === 'fiat'
            );

            if (default_account) {
                const [loginid, account] = default_account;
                if ('token' in account) {
                    updateLocalStorage(String(account.token), loginid);
                }
                return;
            }

            // Fallback to demo account if no fiat account found
            const demo_account = Object.entries(parsed_client_accounts).find(([loginid]) => loginid.startsWith('VR'));

            if (demo_account) {
                const [loginid, account] = demo_account;
                if ('token' in account) {
                    updateLocalStorage(String(account.token), loginid);
                }
            }
        }
    }, []);

    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
}

export default App;
