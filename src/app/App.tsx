import { Fragment } from 'react/jsx-runtime';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/layout';
import { StoreProvider } from '../hooks/useStore';
import AppContent from './app-content';

const queryClient = new QueryClient();

const i18nInstance = initializeI18n({ cdnUrl: 'https://cdn.example.com' });

function App() {
    return (
        <Fragment>
            <Router>
                <QueryParamProvider adapter={ReactRouter5Adapter}>
                    <QueryClientProvider client={queryClient}>
                        <TranslationProvider defaultLang={'EN'} i18nInstance={i18nInstance}>
                            <AppDataProvider>
                                <StoreProvider>
                                    <Layout>
                                        <AppContent />
                                    </Layout>
                                </StoreProvider>
                            </AppDataProvider>
                        </TranslationProvider>
                    </QueryClientProvider>
                </QueryParamProvider>
            </Router>
        </Fragment>
    );
}

export default App;
