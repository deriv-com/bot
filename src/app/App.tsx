import { Fragment, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/layout';
import { StoreProvider } from '../hooks/useStore';

const Endpoint = lazy(() => import('@/pages/endpoint'));
const AppContent = lazy(() => import('./app-content'));

const queryClient = new QueryClient();

const i18nInstance = initializeI18n({ cdnUrl: 'https://cdn.example.com' });

const Loader = () => {
    return <div>Loading...</div>;
};

function App() {
    return (
        <Fragment>
            <Router>
                <QueryClientProvider client={queryClient}>
                    <TranslationProvider defaultLang={'EN'} i18nInstance={i18nInstance}>
                        <AppDataProvider>
                            <StoreProvider>
                                <Layout>
                                    <Routes>
                                        <Route
                                            path='/'
                                            element={
                                                <Suspense fallback={<Loader />}>
                                                    <AppContent />
                                                </Suspense>
                                            }
                                        />
                                        <Route
                                            path='/endpoint'
                                            element={
                                                <Suspense fallback={<Loader />}>
                                                    <Endpoint />
                                                </Suspense>
                                            }
                                        />
                                    </Routes>
                                </Layout>
                            </StoreProvider>
                        </AppDataProvider>
                    </TranslationProvider>
                </QueryClientProvider>
            </Router>
        </Fragment>
    );
}

export default App;
