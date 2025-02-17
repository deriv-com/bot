import { initSurvicate } from '../public-path';
import { lazy, Suspense } from 'react';
import React from 'react';
import Cookies from 'js-cookie';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import { StoreProvider } from '@/hooks/useStore';
import CallbackPage from '@/pages/callback';
import Endpoint from '@/pages/endpoint';
import { TAuthData } from '@/types/api-types';
import { initializeI18n, localize, TranslationProvider } from '@deriv-com/translations';
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
        const accounts_list = localStorage.getItem('accountsList') || '{}';
        const cookie_accounts = Cookies.get('client.accounts') || '{}';
        const stored_accounts = JSON.parse(localStorage.getItem('clientAccounts') || '{}');

        Object.values(JSON.parse(cookie_accounts)).forEach(data => {
            const account_data = data as { loginid: string; token: string };
            const loginid = account_data.loginid;
            accounts_list[loginid] = account_data.token;
        });

        const client_accounts = {
            ...stored_accounts,
            ...JSON.parse(cookie_accounts),
        };
        console.log(client_accounts);
        const active_loginid = Cookies.get('active_loginid') || localStorage.getItem('active_loginid');
        console.log('test from app', {
            active_loginid,
            active_login_id_encrypted: Cookies.get('active_loginid') || '{}',
            active_loginid_cookie: Cookies.get('active_loginid') || '{}',
            active_loginid_local_storage: localStorage.getItem('active_loginid'),
        });
        if (client_accounts) {
            localStorage.setItem('clientAccounts', JSON.stringify(client_accounts));
        }
        console.log('updated client accounts', JSON.parse(localStorage.getItem('clientAccounts') || '{}'));
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
                console.log(selected_account);
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

    return <RouterProvider router={router} />;
}

export default App;
