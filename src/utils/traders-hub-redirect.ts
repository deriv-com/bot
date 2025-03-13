import { standalone_routes } from '@/components/shared';
import { deriv_urls } from '@/components/shared/utils/url/constants';
import { getPlatformFromUrl } from '@/components/shared/utils/url/helpers';
import { Analytics } from '@deriv-com/analytics';

/**
 * Gets the base Trader's Hub URL based on the current environment
 * @returns The base Trader's Hub URL
 */
export const getBaseTraderHubUrl = (): string => {
    const { is_staging_deriv_app, is_test_link, is_test_deriv_app } = getPlatformFromUrl();
    console.log(
        is_staging_deriv_app,
        is_test_link,
        is_test_deriv_app,
        'is_staging_deriv_app, is_test_link, is_test_deriv_app'
    );

    // Get the domain from deriv_urls (e.g., deriv.com, deriv.me, deriv.be)
    const domain = deriv_urls.DERIV_HOST_NAME;

    // Determine if we're in a staging or testing environment
    const is_staging_or_test = is_staging_deriv_app || is_test_link || is_test_deriv_app;

    // Construct the appropriate hub URL
    return is_staging_or_test ? `https://staging-hub.${domain}` : `https://hub.${domain}`;
};

/**
 * Determines the appropriate Trader's Hub URL based on environment and product type
 * @param product_type - The type of product to redirect to ('options' or 'cfds')
 * @returns The URL to redirect to
 */
export const getTraderHubUrl = (product_type: 'tradershub' | 'cfds'): string => {
    const base_url = getBaseTraderHubUrl();
    let url = `${base_url}/tradershub`;
    if (product_type === 'cfds') {
        url = `${base_url}/tradershub/${product_type}`;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    return account ? `${url}?account=${account}` : url;
};

/**
 * Gets the URL for the wallet page in Trader's Hub
 * @returns The URL for the wallet page
 */
export const getWalletUrl = (): string => {
    const base_url = getBaseTraderHubUrl();
    const url = `${base_url}/tradershub/wallets/recent-transactions`;

    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    return account ? `${url}?account=${account}` : url;
};

/**
 * Checks if the user should be redirected to Trader's Hub based on:
 * 1. If they have wallets
 * 2. If their country is in the enabled list from GrowthBook
 *
 * @param has_wallet - Whether the user has wallets
 * @returns Boolean indicating if redirection should happen
 */
export const shouldRedirectToTraderHub = (has_wallet: boolean): boolean => {
    // Check if the country is in the enabled list from GrowthBook
    const is_country_enabled = !!Analytics?.getFeatureValue('hub_enabled_country_list_bot', {});
    console.log(is_country_enabled, 'is_country_enabled');

    // User should be redirected if they have wallets and their country is enabled
    return has_wallet && is_country_enabled;
};

/**
 * Handles redirection to Trader's Hub
 * @param product_type - The type of product to redirect to ('tradershub' or 'cfds')
 * @param has_wallet - Whether the user has wallets
 * @returns The URL to redirect to, or null if no redirection should happen
 */
export const handleTraderHubRedirect = (product_type: 'cfds' | 'tradershub', has_wallet: boolean): string | null => {
    if (shouldRedirectToTraderHub(has_wallet)) {
        return getTraderHubUrl(product_type);
    }

    // If no redirection should happen, return the default Trader's Hub URL
    return standalone_routes.traders_hub;
};
