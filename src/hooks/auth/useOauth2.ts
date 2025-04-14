import { useState } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import RootStore from '@/stores/root-store';
import {
    OAuth2Logout,
    requestOidcAuthentication,
    TOAuth2EnabledAppList,
    useIsOAuth2Enabled,
} from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from '../growthbook/useGrowthbookGetFeatureValue';

/**
 * Provides an object with properties: `isOAuth2Enabled`, `oAuthLogout`, and `retriggerOAuth2Login`.
 *
 * `isOAuth2Enabled` is a boolean that indicates whether OAuth2 is enabled.
 *
 * `oAuthLogout` is a function that logs out the user of the OAuth2-enabled app.
 *
 * `retriggerOAuth2Login` is a function that retriggers the OAuth2 login flow to get a new token.
 *
 * The `handleLogout` argument is an optional function that will be called after logging out the user.
 * If `handleLogout` is not provided, the function will resolve immediately.
 *
 * @param {{ handleLogout?: () => Promise<void> }} [options] - An object with an optional `handleLogout` property.
 * @returns {{ isOAuth2Enabled: boolean; oAuthLogout: () => Promise<void>; retriggerOAuth2Login: () => Promise<void> }}
 */
export const useOauth2 = ({
    handleLogout,
    client,
}: {
    handleLogout?: () => Promise<void>;
    client?: RootStore['client'];
} = {}) => {
    const { featureFlagValue: oAuth2EnabledApps, isGBLoaded: OAuth2EnabledAppsInitialised } =
        useGrowthbookGetFeatureValue<string>({
            featureFlag: 'hydra_be',
        });

    const isOAuth2Enabled = useIsOAuth2Enabled(
        oAuth2EnabledApps as unknown as TOAuth2EnabledAppList,
        OAuth2EnabledAppsInitialised
    );
    const [isSingleLoggingIn, setIsSingleLoggingIn] = useState(false);

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
            await OAuth2Logout({
                redirectCallbackUri: `${window.location.origin}/callback`,
                WSLogoutAndRedirect: handleLogout ?? (() => Promise.resolve()),
                postLogoutRedirectUri: window.location.origin,
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
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
                // eslint-disable-next-line no-console
                console.error('Error during OAuth2 login retrigger:', err);
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error during OAuth2 login retrigger:', error);
        }
    };

    return { isOAuth2Enabled, oAuthLogout: logoutHandler, retriggerOAuth2Login, isSingleLoggingIn };
};
