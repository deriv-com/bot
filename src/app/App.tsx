import { initSurvicate } from '../public-path';
import { Fragment, lazy, Suspense } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import { config } from '@/external/bot-skeleton';
import { api_base } from '@/external/bot-skeleton/services/api/api-base';
import { useApiBase } from '@/hooks/useApiBase';
import CallbackPage from '@/pages/callback';
import Endpoint from '@/pages/endpoint';
import { initializeI18n, localize, TranslationProvider } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import { StoreProvider } from '../hooks/useStore';
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
    const { accountList, activeLoginid } = useApiBase();
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

    const switchAccount = async (loginId: string) => {
        if (loginId.toString() === activeLoginid) return;
        const account_list = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
        const token = account_list[loginId];
        if (!token) return;
        localStorage.setItem('authToken', token);
        localStorage.setItem('active_loginid', loginId.toString());
        await api_base?.init(true);
    };

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const account_currency = urlParams.get('account');
        const is_valid_currency = config().lists.CURRENCY.some(currency => currency === account_currency);

        if (!activeLoginid || !accountList.length) return;

        if (account_currency === 'demo') {
            if (activeLoginid.startsWith('VR')) return;
            const should_switch_to_demo = !activeLoginid.startsWith('VR');
            const demo_account = accountList.find(account => account.loginid.startsWith('VR'));
            if (should_switch_to_demo && demo_account) {
                switchAccount(demo_account.loginid);
                return;
            }
        }

        if (account_currency && account_currency !== 'demo') {
            const target_account = accountList.find(
                account => !account.loginid.startsWith('VR') && account.currency === account_currency
            );
            if (target_account && target_account.loginid !== activeLoginid) {
                switchAccount(target_account.loginid);
                return;
            }
        }

        if (!account_currency || !is_valid_currency) {
            const default_account = accountList.find(
                account => account.broker === 'CR' && account.currency_type === 'fiat'
            );
            if (default_account) {
                switchAccount(default_account.loginid);
            } else {
                //here should be virtual
            }
        }
    }, [activeLoginid, accountList]);

    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
}

export default App;
