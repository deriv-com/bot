import { lazy, Suspense } from 'react';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import './app-root.scss';

const AppContent = lazy(() => import('./app-content'));

const AppRootLoader = () => {
    return (
        <div className='app-root'>
            <Loader />
            <div>{localize('Please wait while we connect to the server...')}</div>
        </div>
    );
};

export default function AppRoot() {
    const store = useStore();

    if (!store) return <AppRootLoader />;

    return (
        <Suspense fallback={<AppRootLoader />}>
            <AppContent />
        </Suspense>
    );
}
