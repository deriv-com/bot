import { Fragment, lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import Endpoint from '@/pages/endpoint';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/layout';
import { StoreProvider } from '../hooks/useStore';
import AuthProvider from './AuthProvider';

const AppContent = lazy(() => import('./app-content')); // Lazy load AppContent

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
                <Suspense fallback={<div>Loading...</div>}>
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
            <Route index element={<AppContent />} />
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
