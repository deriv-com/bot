import { useEffect, useState } from 'react';
import { useTime } from '@deriv-com/api-hooks';

/**
 * Custom React hook that syncs with server time and keeps it updated.
 *
 * This hook fetches the current server time at regular intervals and maintains a local
 * time state that is updated every second. The server time is refetched every 30 seconds.
 *
 * @returns {number} The current server time in seconds since the Unix epoch.
 *
 * @example
 * // Example usage in a functional component
 * import React from 'react';
 * import useSyncedTime from './useSyncedTime';
 *
 * const ServerTimeDisplay = () => {
 *     const serverTime = useSyncedTime();
 *
 *     return <div>Current Server Time: {new Date(serverTime * 1000).toLocaleString()}</div>;
 * };
 *
 * export default ServerTimeDisplay;
 */
const useSyncedTime = () => {
    const currentDate = Date.now() / 1000;
    const [serverTime, setServerTime] = useState(currentDate);
    const { data } = useTime({ refetchInterval: 30000 });

    useEffect(() => {
        let timeInterval: ReturnType<typeof setInterval>;

        if (data) {
            setServerTime(data ?? currentDate);

            timeInterval = setInterval(() => {
                setServerTime(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(timeInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return serverTime;
};

export default useSyncedTime;
