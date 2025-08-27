import { useEffect,useState } from 'react';

interface OfflineState {
    isOnline: boolean;
    isOffline: boolean;
    wasOffline: boolean;
    connectionType: string | null;
}

export const useOfflineDetection = () => {
    const [offlineState, setOfflineState] = useState<OfflineState>({
        isOnline: navigator.onLine,
        isOffline: !navigator.onLine,
        wasOffline: false,
        connectionType: null,
    });

    useEffect(() => {
        const updateOnlineStatus = () => {
            const isOnline = navigator.onLine;
            setOfflineState(prev => ({
                isOnline,
                isOffline: !isOnline,
                wasOffline: prev.isOffline || !isOnline,
                connectionType: getConnectionType(),
            }));
        };

        const getConnectionType = (): string | null => {
            const connection =
                (navigator as any).connection ||
                (navigator as any).mozConnection ||
                (navigator as any).webkitConnection;

            return connection ? connection.effectiveType || connection.type : null;
        };

        // Initial setup
        updateOnlineStatus();

        // Add event listeners
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Listen for connection changes if supported
        const connection =
            (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

        if (connection) {
            connection.addEventListener('change', updateOnlineStatus);
        }

        // Cleanup
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);

            if (connection) {
                connection.removeEventListener('change', updateOnlineStatus);
            }
        };
    }, []);

    return offlineState;
};

// Simple hook for just online/offline status
export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateStatus = () => setIsOnline(navigator.onLine);

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    return isOnline;
};

export default useOfflineDetection;
