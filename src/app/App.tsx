import { Fragment, lazy, Suspense, useEffect } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import Endpoint from '@/pages/endpoint';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import { StoreProvider } from '../hooks/useStore';
import { AppRootLoader } from './app-root';
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
                <Suspense fallback={<AppRootLoader />}>
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
        </Route>
    )
);

function App() {
    const { loginInfo, paramsToDelete } = URLUtils.getLoginInfoFromURL();

    useEffect(() => {
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
    }, [loginInfo, paramsToDelete]);

    React.useEffect(() => {
        window?.dataLayer?.push({ event: 'page_load' });
    }, []);

    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
}

export default App;
