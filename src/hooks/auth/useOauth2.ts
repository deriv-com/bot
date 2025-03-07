import RootStore from '@/stores/root-store';
import { TOAuth2EnabledAppList, useIsOAuth2Enabled, useOAuth2 } from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from '../growthbook/useGrowthbookGetFeatureValue';

/**
 * Provides an object with two properties: `isOAuth2Enabled` and `oAuthLogout`.
 *
 * `isOAuth2Enabled` is a boolean that indicates whether OAuth2 is enabled.
 *
 * `oAuthLogout` is a function that logs out the user of the OAuth2-enabled app.
 *
 * The `handleLogout` argument is an optional function that will be called after logging out the user.
 * If `handleLogout` is not provided, the function will resolve immediately.
 *
 * @param {{ handleLogout?: () => Promise<void> }} [options] - An object with an optional `handleLogout` property.
 * @returns {{ isOAuth2Enabled: boolean; oAuthLogout: () => Promise<void> }}
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

    const oAuthGrowthbookConfig = {
        OAuth2EnabledApps: oAuth2EnabledApps as unknown as TOAuth2EnabledAppList,
        OAuth2EnabledAppsInitialised,
    };

    const { OAuth2Logout: oAuthLogout } = useOAuth2(oAuthGrowthbookConfig, handleLogout ?? (() => Promise.resolve()));

    const logoutHandler = async () => {
        client?.setIsLoggingOut(true);
        await oAuthLogout();
    };

    return { isOAuth2Enabled, oAuthLogout: logoutHandler };
};
