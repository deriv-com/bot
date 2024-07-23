import { useEffect, useState } from 'react';
import useNavigatorOnline from './useNavigatorOnline';

type TStatus = 'blinking' | 'offline' | 'online';

const useNetworkStatus = () => {
    const [status, setStatus] = useState<TStatus>('online');
    const networkStatus = useNavigatorOnline();

    // TODO we need socket connection state from api-hooks whenever it finished we can update this part and check
    // both navigatorStatus and socket Status
    // for now we just check the user network status.

    useEffect(() => {
        if (networkStatus) setStatus('online');
        else setStatus('offline');
    }, [networkStatus]);

    return status;
};

export default useNetworkStatus;
