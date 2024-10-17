import { useEffect } from 'react';
import { botNotification } from '@/components/bot-notification/bot-notification';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { localize } from '@deriv-com/translations';

const useNetworkStatusToastError = () => {
    const status = useNetworkStatus();

    useEffect(() => {
        if (status !== 'online') {
            botNotification(localize('You are offline'));
        }
    }, [status]);
    return null;
};

export default useNetworkStatusToastError;
