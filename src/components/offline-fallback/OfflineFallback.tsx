import React from 'react';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import { localize } from '@deriv-com/translations';
import './OfflineFallback.scss';

interface OfflineFallbackProps {
    children: React.ReactNode;
    fallbackComponent?: React.ComponentType;
}

const OfflineFallback: React.FC<OfflineFallbackProps> = ({ children, fallbackComponent: FallbackComponent }) => {
    const { isOnline } = useOfflineDetection();
    const [hasError, setHasError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!isOnline) {
            // When offline, set a timeout to show fallback if children don't load
            const timeout = setTimeout(() => {
                setIsLoading(false);
                if (!hasError) {
                    setHasError(true);
                }
            }, 3000);

            return () => clearTimeout(timeout);
        } else {
            setHasError(false);
            setIsLoading(false);
        }
    }, [isOnline, hasError]);

    // Error boundary functionality
    React.useEffect(() => {
        const handleError = (error: ErrorEvent) => {
            if (!isOnline && error.message.includes('Loading chunk')) {
                console.log('[OfflineFallback] Chunk loading failed offline, showing fallback');
                setHasError(true);
                setIsLoading(false);
            }
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, [isOnline]);

    if (!isOnline && (hasError || isLoading)) {
        if (FallbackComponent) {
            return <FallbackComponent />;
        }

        return (
            <div className='offline-fallback'>
                <div className='offline-fallback__container'>
                    <div className='offline-fallback__icon'>📱</div>
                    <h1 className='offline-fallback__title'>{localize('Offline Mode')}</h1>
                    <p className='offline-fallback__message'>
                        {localize('You are currently offline. Some features may be limited.')}
                    </p>
                    <div className='offline-fallback__status'>
                        <span className='offline-fallback__status-indicator offline'></span>
                        {localize('No internet connection')}
                    </div>
                    <button className='offline-fallback__retry' onClick={() => window.location.reload()}>
                        {localize('Try Again')}
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default OfflineFallback;
