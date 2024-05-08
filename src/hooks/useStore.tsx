import { createContext, useContext, useMemo } from 'react';

import RootStore from '../stores';

const StoreContext = createContext<null | RootStore>(null);

type TStoreProvider = {
    children: React.ReactNode;
};

const StoreProvider: React.FC<TStoreProvider> = ({ children }) => {
    const memoizedValue = useMemo(() => {
        return new RootStore();
    }, []);

    return <StoreContext.Provider value={memoizedValue}>{children}</StoreContext.Provider>;
};

const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreProvider');
    }

    return store;
};

export { StoreProvider, useStore };
