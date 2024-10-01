import { Fragment } from 'react/jsx-runtime';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Endpoint from '@/pages/endpoint';
import { AppDataProvider } from '@deriv-com/api-hooks';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/layout';
import { StoreProvider } from '../hooks/useStore';
import AppContent from './app-content';

const queryClient = new QueryClient();

const { TRANSLATIONS_CDN_URL, R2_PROJECT_NAME, CROWDIN_BRANCH_NAME } = process.env;
const i18nInstance = initializeI18n({ cdnUrl: `${TRANSLATIONS_CDN_URL}/${R2_PROJECT_NAME}/${CROWDIN_BRANCH_NAME}` });

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
                                        <Route path='/' element={<AppContent />} />
                                        <Route path='/endpoint' element={<Endpoint />} />
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
