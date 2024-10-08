import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import AppContent from './app-content';

export default function AppRoot() {
    const store = useStore();

    if (!store)
        return (
            <div className='app-root'>
                <Loader />
                <div>{localize('Please wait while we connect to the server...')}</div>
            </div>
        );

    return <AppContent />;
}
