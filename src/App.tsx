import { Fragment } from 'react/jsx-runtime';

import { AppDataProvider } from '@deriv-com/api-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from './components/layout';
import { StoreProvider } from './hooks/useStore';
import Home from './pages/home';

import './styles/index.scss';

const queryClient = new QueryClient();

function App() {
    return (
        <Fragment>
            <QueryClientProvider client={queryClient}>
                <AppDataProvider>
                    <StoreProvider>
                        <Layout>
                            <Home />
                        </Layout>
                    </StoreProvider>
                </AppDataProvider>
            </QueryClientProvider>
        </Fragment>
    );
}

export default App;
