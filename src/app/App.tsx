import { Fragment, lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const RoutePromptDialog = lazy(() => import('@/components/route-prompt-dialog'));
const Endpoint = lazy(() => import('@/pages/endpoint'));
const AppDataProvider = lazy(() =>
    import('@deriv-com/api-hooks').then(module => ({ default: module.AppDataProvider }))
);
const Layout = lazy(() => import('../components/layout'));
const StoreProvider = lazy(() => import('../hooks/useStore').then(module => ({ default: module.StoreProvider })));
const AuthProvider = lazy(() => import('./AuthProvider'));

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
                <Suspense fallback={<div className='loader'></div>}>
                    <QueryClientProvider client={queryClient}>
                        <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                            <AppDataProvider>
                                <StoreProvider>
                                    <RoutePromptDialog />
                                    <AuthProvider>
                                        <Layout />
                                    </AuthProvider>
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
    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
}

export default App;
