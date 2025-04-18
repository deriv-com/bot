import { useEffect } from 'react';
import { observer as globalObserver } from '@/external/bot-skeleton/utils/observer';
import { useOauth2 } from './auth/useOauth2';

/**
 * Hook to handle invalid token events by retriggering OIDC authentication
 *
 * This hook listens for 'InvalidToken' events emitted by the API base when
 * a token is invalid but the cookie logged state is true. When such an event
 * is detected, it automatically retriggers the OIDC authentication flow to
 * get a new token.
 *
 * @returns {{ unregisterHandler: () => void }} An object containing a function to unregister the event handler
 */
export const useInvalidTokenHandler = (): { unregisterHandler: () => void } => {
    const { retriggerOAuth2Login } = useOauth2();

    const handleInvalidToken = () => {
        // Clear localStorage similar to client.logout
        retriggerOAuth2Login();
    };

    // Subscribe to the InvalidToken event
    useEffect(() => {
        globalObserver.register('InvalidToken', handleInvalidToken);

        // Cleanup the subscription when the component unmounts
        return () => {
            globalObserver.unregister('InvalidToken', handleInvalidToken);
        };
    }, [retriggerOAuth2Login]);

    // Return a function to unregister the handler manually if needed
    return {
        unregisterHandler: () => {
            globalObserver.unregister('InvalidToken', handleInvalidToken);
        },
    };
};

export default useInvalidTokenHandler;
