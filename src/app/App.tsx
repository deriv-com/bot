import { Fragment } from 'react/jsx-runtime';
import { BrowserRouter as Router } from 'react-router-dom';

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
            </Router>
        </Fragment>
    );
}

export default App;
