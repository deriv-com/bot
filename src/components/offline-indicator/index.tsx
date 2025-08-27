import React from 'react';
import { useOnlineStatus } from '@/hooks/useOfflineDetection';
import { localize } from '@deriv-com/translations';
import './OfflineIndicator.scss';

interface OfflineIndicatorProps {
    className?: string;
    showWhenOnline?: boolean;
    position?: 'top' | 'bottom' | 'inline';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
    className = '',
    showWhenOnline = false,
    position = 'top',
}) => {
    const isOnline = useOnlineStatus();

    // Don't show anything if online and showWhenOnline is false
    if (isOnline && !showWhenOnline) {
        return null;
    }

    const indicatorClass = `offline-indicator offline-indicator--${position} ${
        isOnline ? 'offline-indicator--online' : 'offline-indicator--offline'
    } ${className}`;

    return (
        <div className={indicatorClass}>
            <div className='offline-indicator__content'>
                <div className='offline-indicator__icon'>{isOnline ? '🟢' : '🔴'}</div>
                <span className='offline-indicator__text'>
                    {isOnline ? localize('Online') : localize('Offline - Limited functionality available')}
                </span>
                {!isOnline && (
                    <button
                        className='offline-indicator__retry'
                        onClick={() => window.location.reload()}
                        title={localize('Retry connection')}
                    >
                        ↻
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfflineIndicator;
