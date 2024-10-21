import { Fragment, lazy, Suspense } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import Endpoint from '@/pages/endpoint';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from '../hooks/useStore';
import CoreStoreProvider from './CoreStoreProvider';

const Layout = lazy(() => import('../components/layout'));
const AppRoot = lazy(() => import('./app-root'));

const queryClient = new QueryClient();

const { TRANSLATIONS_CDN_URL, R2_PROJECT_NAME, CROWDIN_BRANCH_NAME } = process.env;
const i18nInstance = initializeI18n({
    cdnUrl: `${TRANSLATIONS_CDN_URL}/${R2_PROJECT_NAME}/${CROWDIN_BRANCH_NAME}`,
});

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path='/'
            element={
                <Suspense fallback={<div>Please wait while we load the app...</div>}>
                    <QueryClientProvider client={queryClient}>
                        <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                            <AppDataProvider>
                                <StoreProvider>
                                    <RoutePromptDialog />
                                    <CoreStoreProvider>
                                        <Layout />
                                    </CoreStoreProvider>
                                </StoreProvider>
                            </AppDataProvider>
                        </TranslationProvider>
                    </QueryClientProvider>
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
    React.useEffect(() => {
        const loadGTM = () => {
            if (!window.dataLayer) {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

                const script = document.createElement('script');
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtm.js?id='GTM-NF7884S'`;
                document.head.appendChild(script);
            }
        };

        setTimeout(() => {
            loadGTM();
            window?.dataLayer?.push({ event: 'page_load' });
        }, 10000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
}

export default App;
