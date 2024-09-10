import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api_base } from '@/external/bot-skeleton';
import RootStore from '@/stores/root-store';
import { TWebSocket } from '@/Types';
import { Loader } from '@deriv-com/ui';
import Bot from '../external/bot-skeleton/scratch/dbot';

const StoreContext = createContext<null | RootStore>(null);

type TStoreProvider = {
    children: React.ReactNode;
    mockStore?: RootStore;
};

const StoreProvider: React.FC<TStoreProvider> = ({ children, mockStore }) => {
    const [store, setStore] = useState<RootStore | null>(null);
    const initializingStore = useRef(false);

    useEffect(() => {
        const initializeStore = async () => {
            await api_base.init();
            const ws = api_base.api;
            const rootStore = new RootStore(Bot, ws);
            setStore(rootStore);
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
        return <Loader />;
    }

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreProvider');
    }

    return store;
};

export { StoreProvider, useStore };

export const mockStore = (ws: TWebSocket) => new RootStore(Bot, ws);
