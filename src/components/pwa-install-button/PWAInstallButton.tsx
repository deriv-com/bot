import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { trackPWAEvent } from '@/utils/pwa-utils';
import './PWAInstallButton.scss';

export interface PWAInstallButtonProps {
    variant?: 'primary' | 'secondary' | 'minimal';
    size?: 'small' | 'medium' | 'large';
    showIcon?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    showIcon = true,
    className = '',
    children,
}) => {
    const { canInstall, isInstalled, install, isIOS, isAndroid } = usePWA();

    // Don't show if already installed or can't install
    if (isInstalled || !canInstall) {
        return null;
    }

    const handleInstall = async () => {
        trackPWAEvent('install_button_clicked', { variant, size });

        try {
            const success = await install();
            if (success) {
                trackPWAEvent('install_success_from_button');
            }
        } catch (error) {
            console.error('Install failed:', error);
            trackPWAEvent('install_failed_from_button', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };

    const getButtonText = () => {
        if (children) return children;

        if (isIOS) return 'Add to Home Screen';
        if (isAndroid) return 'Install App';
        return 'Install Deriv Bot';
    };

    const getButtonIcon = () => {
        if (!showIcon) return null;

        return (
            <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' className='pwa-install-button__icon'>
                <path d='M8 1a1 1 0 0 1 1 1v5.293l1.146-1.147a1 1 0 0 1 1.414 1.414l-2.5 2.5a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 0 1 1.414-1.414L7 7.293V2a1 1 0 0 1 1-1z' />
                <path d='M3 9a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1z' />
            </svg>
        );
    };

    return (
        <button
            onClick={handleInstall}
            className={`pwa-install-button pwa-install-button--${variant} pwa-install-button--${size} ${className}`}
            type='button'
            aria-label='Install Deriv Bot as an app'
        >
            {getButtonIcon()}
            <span className='pwa-install-button__text'>{getButtonText()}</span>
        </button>
    );
};

export default PWAInstallButton;
