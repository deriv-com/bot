import { useState } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import RootStore from '@/stores/root-store';
import { handleOidcAuthFailure } from '@/utils/auth-utils';
import { Analytics } from '@deriv-com/analytics';
import { OAuth2Logout, requestOidcAuthentication } from '@deriv-com/auth-client';
import useTMB from '../useTMB';

/**
 * Provides an object with properties: `oAuthLogout`, `retriggerOAuth2Login`, and `isSingleLoggingIn`.
 *
 * `oAuthLogout` is a function that logs out the user of the OAuth2-enabled app.
 *
 * `retriggerOAuth2Login` is a function that retriggers the OAuth2 login flow to get a new token.
 *
 * `isSingleLoggingIn` is a boolean that indicates whether the user is currently logging in.
 *
 * The `handleLogout` argument is an optional function that will be called after logging out the user.
 * If `handleLogout` is not provided, the function will resolve immediately.
 *
 * @param {{ handleLogout?: () => Promise<void> }} [options] - An object with an optional `handleLogout` property.
 * @returns {{ oAuthLogout: () => Promise<void>; retriggerOAuth2Login: () => Promise<void>; isSingleLoggingIn: boolean }}
 */
export const useOauth2 = ({
    handleLogout,
    client,
}: {
    handleLogout?: () => Promise<void>;
    client?: RootStore['client'];
} = {}) => {
    const [isSingleLoggingIn, setIsSingleLoggingIn] = useState(false);

    const { is_tmb_enabled } = useTMB();
    const accountsList = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
    const isClientAccountsPopulated = Object.keys(accountsList).length > 0;
    const isSilentLoginExcluded =
        window.location.pathname.includes('callback') || window.location.pathname.includes('endpoint');

    const loggedState = Cookies.get('logged_state');

    useEffect(() => {
        window.addEventListener('unhandledrejection', event => {
            if (event?.reason?.error?.code === 'InvalidToken') {
                setIsSingleLoggingIn(false);
            }
        });
    }, []);

    useEffect(() => {
        const willEventuallySSO = loggedState === 'true' && !isClientAccountsPopulated;
        const willEventuallySLO = loggedState === 'false' && isClientAccountsPopulated;

        if (!isSilentLoginExcluded && (willEventuallySSO || willEventuallySLO)) {
            setIsSingleLoggingIn(true);
        } else {
            setIsSingleLoggingIn(false);
        }
    }, [isClientAccountsPopulated, loggedState, isSilentLoginExcluded]);

    const logoutHandler = async () => {
        client?.setIsLoggingOut(true);
        try {
            const isTMBEnabled = is_tmb_enabled || window.is_tmb_enabled === true;
            if (isTMBEnabled) {
                await client?.logout().catch(err => {
                    // eslint-disable-next-line no-console
                    console.error('Error during TMB logout:', err);
                });
            } else {
                await OAuth2Logout({
                    redirectCallbackUri: `${window.location.origin}/callback`,
                    WSLogoutAndRedirect: handleLogout ?? (() => Promise.resolve()),
                    postLogoutRedirectUri: window.location.origin,
                }).catch(err => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
            }
            Analytics.reset();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };
    const retriggerOAuth2Login = async () => {
        try {
            await requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
                postLogoutRedirectUri: window.location.origin,
            }).catch(err => {
                handleOidcAuthFailure(err);
            });
        } catch (error) {
            handleOidcAuthFailure(error);
        }
    };

    return { oAuthLogout: logoutHandler, retriggerOAuth2Login, isSingleLoggingIn };
};
