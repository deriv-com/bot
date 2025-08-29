import { useCallback, useEffect, useState } from 'react';
import { BeforeInstallPromptEvent, getMobileSourceInfo, PWAInstallState, pwaManager } from '@/utils/pwa-utils';

export interface UsePWAReturn {
    // Install state
    canInstall: boolean;
    isInstalled: boolean;
    isStandalone: boolean;
    installPrompt: BeforeInstallPromptEvent | null;

    // Actions
    install: () => Promise<boolean>;

    // Update state
    updateAvailable: boolean;
    updateApp: () => Promise<void>;

    // Platform detection
    isIOS: boolean;
    isAndroid: boolean;

    // Utilities
    getInstallInstructions: () => string;

    // Mobile source detection
    isMobileSource: boolean;
    isPWALaunch: boolean;
    mobileSourceInfo: ReturnType<typeof getMobileSourceInfo>;
}

/**
 * React hook for PWA functionality
 */
export const usePWA = (): UsePWAReturn => {
    const [installState, setInstallState] = useState<PWAInstallState>(() => pwaManager.getInstallState());
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [mobileSourceInfo] = useState(() => getMobileSourceInfo());

    // Update install state when it changes
    useEffect(() => {
        const unsubscribe = pwaManager.onInstallStateChange(() => {
            setInstallState(pwaManager.getInstallState());
        });

        return unsubscribe;
    }, []);

    // Listen for app updates
    useEffect(() => {
        const unsubscribe = pwaManager.onUpdateAvailable(() => {
            setUpdateAvailable(true);
        });

        return unsubscribe;
    }, []);

    // Install the PWA
    const install = useCallback(async (): Promise<boolean> => {
        try {
            const result = await pwaManager.showInstallPrompt();
            return result;
        } catch (error) {
            return false;
        }
    }, []);

    // Update the app
    const updateApp = useCallback(async (): Promise<void> => {
        await pwaManager.updateApp();
    }, []);

    // Get install instructions
    const getInstallInstructions = useCallback((): string => {
        return pwaManager.getInstallInstructions();
    }, []);

    return {
        // Install state
        canInstall: installState.canInstall,
        isInstalled: installState.isInstalled,
        isStandalone: installState.isStandalone,
        installPrompt: installState.installPrompt,

        // Actions
        install,

        // Update state
        updateAvailable,
        updateApp,

        // Platform detection
        isIOS: pwaManager.isIOS(),
        isAndroid: pwaManager.isAndroid(),

        // Utilities
        getInstallInstructions,

        // Mobile source detection
        isMobileSource: mobileSourceInfo.isMobileSource,
        isPWALaunch: mobileSourceInfo.isPWALaunch,
        mobileSourceInfo,
    };
};

/**
 * Hook for PWA install prompt with automatic timing
 */
export const usePWAInstallPrompt = (options?: {
    delay?: number; // Delay before showing prompt (ms)
    minEngagement?: number; // Minimum engagement time before showing (ms)
    maxPrompts?: number; // Maximum number of prompts to show
}) => {
    const { canInstall, install, isInstalled } = usePWA();
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptCount, setPromptCount] = useState(0);

    const {
        delay = 30000, // 30 seconds
        minEngagement = 60000, // 1 minute
        maxPrompts = 3,
    } = options || {};

    // Track engagement time
    const startTime = Date.now();
    let engagementTimer: NodeJS.Timeout;
    let promptTimer: NodeJS.Timeout;

    useEffect(() => {
        if (isInstalled || !canInstall || promptCount >= maxPrompts) {
            return;
        }

        const checkEngagement = () => {
            const engagementTime = Date.now() - startTime;

            if (engagementTime >= minEngagement) {
                promptTimer = setTimeout(() => {
                    setShowPrompt(true);
                }, delay);
            }
        };

        // Start engagement tracking
        engagementTimer = setTimeout(checkEngagement, minEngagement);

        return () => {
            clearTimeout(engagementTimer);
            clearTimeout(promptTimer);
        };
    }, [canInstall, isInstalled, promptCount, delay, minEngagement, maxPrompts]);

    const handleInstall = useCallback(async () => {
        const result = await install();
        setShowPrompt(false);
        setPromptCount(prev => prev + 1);
        return result;
    }, [install]);

    const dismissPrompt = useCallback(() => {
        setShowPrompt(false);
        setPromptCount(prev => prev + 1);
    }, [promptCount]);

    return {
        showPrompt: showPrompt && canInstall && !isInstalled,
        handleInstall,
        dismissPrompt,
        promptCount,
    };
};

/**
 * Hook for PWA update notifications
 */
export const usePWAUpdate = () => {
    const { updateAvailable, updateApp } = usePWA();
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

    useEffect(() => {
        if (updateAvailable) {
            // Show update prompt after a short delay
            const timer = setTimeout(() => {
                setShowUpdatePrompt(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [updateAvailable]);

    const handleUpdate = useCallback(async () => {
        try {
            await updateApp();
            setShowUpdatePrompt(false);
        } catch (error) {
            console.error('Failed to update app:', error);
        }
    }, [updateApp]);

    const dismissUpdate = useCallback(() => {
        setShowUpdatePrompt(false);
    }, []);

    return {
        showUpdatePrompt,
        handleUpdate,
        dismissUpdate,
    };
};

export default usePWA;
