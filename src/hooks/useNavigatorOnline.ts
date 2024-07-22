import { useEffect, useState } from 'react';

/**
 * Retrieves the current online status of the browser.
 * @returns {boolean} The online status of the browser.
 */
const getOnlineStatus = () =>
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;

/**
 * A custom React hook that tracks the online status of the browser.
 * @returns {boolean} The current online status of the browser.
 */
const useNavigatorOnline = () => {
    const [status, setStatus] = useState(getOnlineStatus());

    const setOnline = () => setStatus(true);
    const setOffline = () => setStatus(false);

    useEffect(() => {
        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, []);

    return status;
};

export default useNavigatorOnline;
