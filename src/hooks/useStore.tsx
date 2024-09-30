import { createContext, Suspense, useContext, useEffect, useRef, useState } from 'react';
import { api_base } from '@/external/bot-skeleton';
import RootStore from '@/stores/root-store';
import { TWebSocket } from '@/Types';
import { Loader } from '@deriv-com/ui';

const StoreContext = createContext<null | typeof RootStore>(null);

type TStoreProvider = {
    children: React.ReactNode;
    mockStore?: typeof RootStore;
};

const StoreProvider: React.FC<TStoreProvider> = ({ children, mockStore }) => {
    const [store, setStore] = useState<typeof RootStore | null>(null);
    const initializingStore = useRef(false);

    useEffect(() => {
        const initializeStore = async () => {
            await api_base.init();
            const ws = api_base.api;
            const RootStoreModule = await import('@/stores/root-store');
            const BotModule = await import('../external/bot-skeleton/scratch/dbot');
            const rootStore = new RootStoreModule.default(BotModule.default, ws);
            setStore(rootStore as unknown as typeof RootStore);
        };

        if (!store && !initializingStore.current) {
            initializingStore.current = true;
            // If the store is mocked for testing purposes, then return the mocked value.
            if (mockStore) {
                setStore(mockStore);
            } else {
                initializeStore();
            }
        }
    }, [store, mockStore]);

    if (!store) {
        return (
            <div>
                <h1>Loading app, please wait for a while...</h1>
                <Loader />
            </div>
        );
    }

    return (
        <Suspense fallback={<Loader />}>
            <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
        </Suspense>
    );
};

const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreProvider');
    }

    return store;
};

export { StoreProvider, useStore };

export const mockStore = async (ws: TWebSocket) => {
    const RootStoreModule = await import('@/stores/root-store');
    const BotModule = await import('../external/bot-skeleton/scratch/dbot');
    return new RootStoreModule.default(BotModule.default, ws);
};
