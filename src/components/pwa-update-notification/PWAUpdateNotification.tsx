import React from 'react';
import { usePWAUpdate } from '@/hooks/usePWA';
import './PWAUpdateNotification.scss';

export interface PWAUpdateNotificationProps {
    position?: 'top' | 'bottom';
    autoHide?: boolean;
    autoHideDelay?: number;
    className?: string;
}

export const PWAUpdateNotification: React.FC<PWAUpdateNotificationProps> = ({
    position = 'bottom',
    autoHide = false,
    autoHideDelay = 10000,
    className = '',
}) => {
    const { showUpdatePrompt, handleUpdate, dismissUpdate } = usePWAUpdate();
    const [isUpdating, setIsUpdating] = React.useState(false);

    // Auto-hide functionality
    React.useEffect(() => {
        if (showUpdatePrompt && autoHide) {
            const timer = setTimeout(() => {
                dismissUpdate();
            }, autoHideDelay);

            return () => clearTimeout(timer);
        }
    }, [showUpdatePrompt, autoHide, autoHideDelay, dismissUpdate]);

    const handleUpdateClick = async () => {
        setIsUpdating(true);

        try {
            await handleUpdate();
        } catch (error) {
            console.error('Update failed:', error);
            setIsUpdating(false);
        }
    };

    const handleDismissClick = () => {
        dismissUpdate();
    };

    if (!showUpdatePrompt) {
        return null;
    }

    return (
        <div
            className={`pwa-update-notification pwa-update-notification--${position} ${className}`}
            role='alert'
            aria-live='polite'
        >
            <div className='pwa-update-notification__content'>
                <div className='pwa-update-notification__icon'>
                    <svg width='20' height='20' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm6 9V6a1 1 0 1 0-2 0v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L10 11z' />
                    </svg>
                </div>

                <div className='pwa-update-notification__message'>
                    <h4 className='pwa-update-notification__title'>App Update Available</h4>
                    <p className='pwa-update-notification__description'>
                        A new version of Deriv Bot is ready. Update now for the latest features and improvements.
                    </p>
                </div>

                <div className='pwa-update-notification__actions'>
                    <button
                        onClick={handleUpdateClick}
                        disabled={isUpdating}
                        className='pwa-update-notification__button pwa-update-notification__button--primary'
                        type='button'
                    >
                        {isUpdating ? (
                            <>
                                <span className='pwa-update-notification__spinner' />
                                Updating...
                            </>
                        ) : (
                            'Update Now'
                        )}
                    </button>

                    <button
                        onClick={handleDismissClick}
                        disabled={isUpdating}
                        className='pwa-update-notification__button pwa-update-notification__button--secondary'
                        type='button'
                        aria-label='Dismiss update notification'
                    >
                        Later
                    </button>
                </div>
            </div>

            <button
                onClick={handleDismissClick}
                disabled={isUpdating}
                className='pwa-update-notification__close'
                type='button'
                aria-label='Close update notification'
            >
                <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
                    <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
                </svg>
            </button>
        </div>
    );
};

export default PWAUpdateNotification;
