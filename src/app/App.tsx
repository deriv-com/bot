import { initSurvicate } from '../public-path';
import { Fragment, lazy, Suspense } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import RoutePromptDialog from '@/components/route-prompt-dialog';
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
                const clientAccounts: Record<string, { loginid: string; token: string; currency: string }> = {};

                loginInfo.forEach((account: { loginid: string; token: string; currency: string }) => {
                    accountsList[account.loginid] = account.token;
                    clientAccounts[account.loginid] = account;
                });

                localStorage.setItem('accountsList', JSON.stringify(accountsList));
                localStorage.setItem('clientAccounts', JSON.stringify(clientAccounts));

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

    const updateAccountParamInURL = (account_data: TAuthData['account_list'][number], fallback_currency = '') => {
        const search_params = new URLSearchParams(window.location.search);
        const account_param = account_data.loginid.startsWith('VR')
            ? 'demo'
            : account_data.currency || fallback_currency;
        search_params.set('account', account_param);
        window.history.pushState({}, '', `${window.location.pathname}?${search_params.toString()}`);
    };

    React.useEffect(() => {
        const accounts_list = localStorage.getItem('accountsList');
        const client_accounts = localStorage.getItem('clientAccounts');
        const active_loginid = localStorage.getItem('active_loginid');
        const url_params = new URLSearchParams(window.location.search);
        const account_currency = url_params.get('account');

        if (!account_currency) {
            try {
                if (!client_accounts) return;
                const parsed_client_accounts = JSON.parse(client_accounts) as TAuthData['account_list'];
                const selected_account = Object.entries(parsed_client_accounts).find(
                    ([/* eslint-disable-line @typescript-eslint/no-unused-vars */ _, account]) =>
                        account.loginid === active_loginid
                );
                if (!selected_account) return;
                const [/* eslint-disable-line @typescript-eslint/no-unused-vars */ _, account] = selected_account;
                updateAccountParamInURL(account);
            } catch (e) {
                console.warn('Error', e); // eslint-disable-line no-console
            }
        }

        if (!accounts_list || !client_accounts) return;

        try {
            const parsed_accounts = JSON.parse(accounts_list);
            const parsed_client_accounts = JSON.parse(client_accounts) as TAuthData['account_list'];
            const is_valid_currency = account_currency
                ? Object.values(parsed_client_accounts).some(
                      account => account.currency.toUpperCase() === account_currency.toUpperCase()
                  )
                : false;

            const updateLocalStorage = (token: string, loginid: string) => {
                localStorage.setItem('authToken', token);
                localStorage.setItem('active_loginid', loginid);
            };

            // Handle demo account
            if (account_currency?.toUpperCase() === 'DEMO') {
                const demo_account = Object.entries(parsed_accounts).find(([key]) => key.startsWith('VR'));

                if (demo_account) {
                    const [loginid, token] = demo_account;
                    updateLocalStorage(String(token), loginid);
                    return;
                }
            }

            // Handle real account with valid currency
            if (account_currency?.toUpperCase() !== 'DEMO' && is_valid_currency) {
                const real_account = Object.entries(parsed_client_accounts).find(
                    ([loginid, account]) =>
                        !loginid.startsWith('VR') && account.currency.toUpperCase() === account_currency?.toUpperCase()
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
                const selected_account = Object.entries(parsed_client_accounts).find(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ([_, account]) => account.loginid === active_loginid
                );
                if (!selected_account) return;
                const [_, account] = selected_account; // eslint-disable-line @typescript-eslint/no-unused-vars
                updateAccountParamInURL(account, 'USD');
            }
        } catch (e) {
            console.warn('Error', e); // eslint-disable-line no-console
        }
    }, []);

    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
}

export default App;
