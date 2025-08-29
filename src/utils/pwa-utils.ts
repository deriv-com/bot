import { isFirefox, isSafari } from '@/components/shared/utils/browser/browser_detect';
import { localize } from '@deriv-com/translations';

// PWA Utilities for Deriv Bot
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export interface PWAInstallState {
    canInstall: boolean;
    isInstalled: boolean;
    isStandalone: boolean;
    installPrompt: BeforeInstallPromptEvent | null;
}

class PWAManager {
    private installPrompt: BeforeInstallPromptEvent | null = null;
    private installCallbacks: Array<(canInstall: boolean) => void> = [];
    private updateCallbacks: Array<() => void> = [];

    constructor() {
        this.init();
    }

    private init() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault();
            this.installPrompt = e as BeforeInstallPromptEvent;
            this.notifyInstallCallbacks(true);
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.installPrompt = null;
            this.notifyInstallCallbacks(false);
        });
    }

    /**
     * Register service worker (for all devices to enable offline functionality)
     */
    async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
        if (!('serviceWorker' in navigator)) {
            console.warn('[PWA] Service workers not supported');
            return null;
        }

        // Only enable PWA service workers on Chrome browsers
        const isChrome = /Chrome/.test(navigator.userAgent) && !isFirefox() && !isSafari();
        if (!isChrome) {
            const browser = isFirefox() ? 'Firefox' : isSafari() ? 'Safari' : 'Unknown';
            console.log(
                `[PWA] Service worker disabled on ${browser} - PWA only supported on Chrome to prevent chunk loading and login issues`
            );
            return null;
        }

        // Register service worker for Chrome only
        console.log('[PWA] Registering service worker for Chrome browser offline capabilities');

        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;

                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.notifyUpdateCallbacks();
                        }
                    });
                }
            });

            // Handle controller change (new service worker activated)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });

            return registration;
        } catch (error) {
            console.error('[PWA] Service worker registration failed:', error);
            return null;
        }
    }

    /**
     * Show install prompt
     */
    async showInstallPrompt(): Promise<boolean> {
        if (!this.installPrompt) {
            console.warn('[PWA] Install prompt not available');
            return false;
        }

        try {
            await this.installPrompt.prompt();
            const choiceResult = await this.installPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                this.installPrompt = null;
                return true;
            }

            return false;
        } catch (error) {
            console.error('[PWA] Install prompt failed:', error);
            return false;
        }
    }

    /**
     * Check if app can be installed
     */
    canInstall(): boolean {
        return this.installPrompt !== null;
    }

    /**
     * Check if app is installed (running in standalone mode)
     */
    isInstalled(): boolean {
        return this.isStandalone();
    }

    /**
     * Check if app is running in standalone mode
     */
    isStandalone(): boolean {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true ||
            document.referrer.includes('android-app://')
        );
    }

    /**
     * Get PWA install state
     */
    getInstallState(): PWAInstallState {
        return {
            canInstall: this.canInstall(),
            isInstalled: this.isInstalled(),
            isStandalone: this.isStandalone(),
            installPrompt: this.installPrompt,
        };
    }

    /**
     * Subscribe to install state changes
     */
    onInstallStateChange(callback: (canInstall: boolean) => void): () => void {
        this.installCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.installCallbacks.indexOf(callback);
            if (index > -1) {
                this.installCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Subscribe to app updates
     */
    onUpdateAvailable(callback: () => void): () => void {
        this.updateCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.updateCallbacks.indexOf(callback);
            if (index > -1) {
                this.updateCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Update the app (reload with new service worker)
     */
    async updateApp(): Promise<void> {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        } else {
            window.location.reload();
        }
    }

    /**
     * Check if device is iOS
     */
    isIOS(): boolean {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    /**
     * Check if device is Android
     */
    isAndroid(): boolean {
        return /Android/.test(navigator.userAgent);
    }

    /**
     * Check if device is mobile
     */
    isMobile(): boolean {
        return this.isIOS() || this.isAndroid() || /Mobile|Tablet/.test(navigator.userAgent);
    }

    /**
     * Check if browser is Safari Desktop (Safari with desktop screen width)
     */
    isSafariDesktop(): boolean {
        // Check if Safari and desktop width (typically > 768px for desktop)
        return isSafari() && window.innerWidth > 768;
    }

    /**
     * Get install instructions for current platform
     */
    getInstallInstructions(): string {
        if (this.isIOS()) {
            return localize('Tap the Share button and then "Add to Home Screen"');
        } else if (this.isAndroid()) {
            return localize('Tap the menu button and then "Add to Home Screen" or "Install App"');
        } else {
            return localize("Look for the install button in your browser's address bar");
        }
    }

    private notifyInstallCallbacks(canInstall: boolean) {
        this.installCallbacks.forEach(callback => {
            try {
                callback(canInstall);
            } catch (error) {
                console.error('[PWA] Install callback error:', error);
            }
        });
    }

    private notifyUpdateCallbacks() {
        this.updateCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('[PWA] Update callback error:', error);
            }
        });
    }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// Utility functions
export const registerPWA = () => pwaManager.registerServiceWorker();
export const showInstallPrompt = () => pwaManager.showInstallPrompt();
export const canInstallPWA = () => pwaManager.canInstall();
export const isPWAInstalled = () => pwaManager.isInstalled();
export const isPWAStandalone = () => pwaManager.isStandalone();
export const getPWAInstallState = () => pwaManager.getInstallState();
export const onPWAInstallStateChange = (callback: (canInstall: boolean) => void) =>
    pwaManager.onInstallStateChange(callback);
export const onPWAUpdateAvailable = (callback: () => void) => pwaManager.onUpdateAvailable(callback);
export const updatePWA = () => pwaManager.updateApp();
export const isSafariDesktopBrowser = () => isSafari() && window.innerWidth > 768;
export const isUnsupportedPWABrowser = () => !(/Chrome/.test(navigator.userAgent) && !isFirefox() && !isSafari());
export const isChromeOnlyPWA = () => /Chrome/.test(navigator.userAgent) && !isFirefox() && !isSafari();

// Mobile source detection utilities
export const isMobileSource = (): boolean => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('source') === 'mobile';
};

export const isPWALaunch = (): boolean => {
    return pwaManager.isStandalone() && isMobileSource();
};

export const getMobileSourceInfo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        isMobileSource: urlParams.get('source') === 'mobile',
        isStandalone: pwaManager.isStandalone(),
        isPWALaunch: pwaManager.isStandalone() && urlParams.get('source') === 'mobile',
        userAgent: navigator.userAgent,
        isMobile: pwaManager.isMobile(),
        isIOS: pwaManager.isIOS(),
        isAndroid: pwaManager.isAndroid(),
    };
};

// PWA Modal timing utilities
export const PWA_MODAL_STORAGE_KEY = 'pwa-modal-timing';

export interface PWAModalTiming {
    lastShown?: string;
    dismissCount: number;
    firstVisit?: string;
    hasBeenShown: boolean;
}

export const getPWAModalTiming = (): PWAModalTiming => {
    try {
        const stored = localStorage.getItem(PWA_MODAL_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.warn('[PWA] Failed to parse modal timing data:', error);
    }

    return {
        dismissCount: 0,
        hasBeenShown: false,
    };
};

export const setPWAModalTiming = (timing: PWAModalTiming): void => {
    try {
        localStorage.setItem(PWA_MODAL_STORAGE_KEY, JSON.stringify(timing));
    } catch (error) {
        console.warn('[PWA] Failed to save modal timing data:', error);
    }
};

export const shouldShowPWAModal = (): boolean => {
    const timing = getPWAModalTiming();
    const now = new Date();

    // Don't show if already installed
    if (pwaManager.isStandalone()) {
        return false;
    }

    // Only show PWA modal on Chrome browsers
    const isChrome = /Chrome/.test(navigator.userAgent) && !isFirefox() && !isSafari();
    if (!isChrome) {
        return false;
    }

    // Don't show on mobile (only desktop)
    if (pwaManager.isMobile()) {
        return false;
    }

    // Show on first visit if never shown before
    if (!timing.hasBeenShown && !timing.firstVisit) {
        return true;
    }

    // Don't show if dismissed more than 3 times
    if (timing.dismissCount >= 3) {
        return false;
    }

    // Don't show if shown in the last 7 days
    if (timing.lastShown) {
        const lastShown = new Date(timing.lastShown);
        const daysSinceLastShown = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastShown < 7) {
            return false;
        }
    }

    return true;
};

export const markPWAModalShown = (): void => {
    const timing = getPWAModalTiming();
    const now = new Date().toISOString();

    setPWAModalTiming({
        ...timing,
        lastShown: now,
        firstVisit: timing.firstVisit || now,
        hasBeenShown: true,
    });
};

export const markPWAModalDismissed = (): void => {
    const timing = getPWAModalTiming();

    setPWAModalTiming({
        ...timing,
        dismissCount: timing.dismissCount + 1,
        lastShown: new Date().toISOString(),
    });
};

export default pwaManager;
