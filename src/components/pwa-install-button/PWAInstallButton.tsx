import React from 'react';
import './PWAInstallButton.scss';

export interface PWAInstallButtonProps {
    variant?: 'primary' | 'secondary' | 'minimal';
    size?: 'small' | 'medium' | 'large';
    showIcon?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = () => {
    // Install button has been removed as per requirements
    // PWA installation is now handled through:
    // 1. Automatic modal on desktop first visit
    // 2. PWA announcement in the announcements section
    return null;
};

export default PWAInstallButton;
