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
    installPrompt: x | null;
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
            console.log('[PWA] Install prompt available');
            e.preventDefault();
            this.installPrompt = e as BeforeInstallPromptEvent;
            this.notifyInstallCallbacks(true);
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.installPrompt = null;
            this.notifyInstallCallbacks(false);
        });

        // Check if app is already installed
        if (this.isStandalone()) {
            console.log('[PWA] App is running in standalone mode');
        }
    }

    /**
     * Register service worker
     */
    async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
        if (!('serviceWorker' in navigator)) {
            console.warn('[PWA] Service workers not supported');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            console.log('[PWA] Service worker registered:', registration.scope);

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                console.log('[PWA] Service worker update found');
                const newWorker = registration.installing;

                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] New service worker installed, update available');
                            this.notifyUpdateCallbacks();
                        }
                    });
                }
            });

            // Handle controller change (new service worker activated)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[PWA] Service worker controller changed');
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

            console.log('[PWA] Install prompt result:', choiceResult.outcome);

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
     * Get install instructions for current platform
     */
    getInstallInstructions(): string {
        if (this.isIOS()) {
            return 'Tap the Share button and then "Add to Home Screen"';
        } else if (this.isAndroid()) {
            return 'Tap the menu button and then "Add to Home Screen" or "Install App"';
        } else {
            return "Look for the install button in your browser's address bar";
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

// Analytics helper
export const trackPWAEvent = (event: string, data?: Record<string, any>) => {
    console.log(`[PWA Analytics] ${event}`, data);

    // Integrate with your existing analytics
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
            event: 'pwa_event',
            pwa_event_name: event,
            pwa_event_data: data,
        });
    }
};

export default pwaManager;
