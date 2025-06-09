import { standalone_routes } from '@/components/shared';

/**
 * Gets the base Trader's Hub URL based on the current environment
 * @returns The base Trader's Hub URL
 */
export const getBaseTraderHubUrl = (): string => {
    const hostname = window.location.hostname;

    const domain = 'deriv.com';

    const is_staging = hostname.includes('staging');
    const is_test =
        hostname.includes('localhost') || hostname.includes('test') || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

    if (is_staging || is_test) {
        return `https://staging-hub.${domain}`;
    }

    return `https://hub.${domain}`;
};

/**
 * Determines the appropriate Trader's Hub URL based on environment and product type
 * @param product_type - The type of product to redirect to ('tradershub', 'cfds', 'reports', or 'cashier')
 * @returns The URL to redirect to
 */
export const getTraderHubUrl = (product_type: 'tradershub' | 'cfds' | 'reports' | 'cashier'): string => {
    const base_url = getBaseTraderHubUrl();

    // Map product_type to redirect_to parameter
    let redirect_to = 'home';
    if (product_type === 'cfds') redirect_to = 'cfds';
    else if (product_type === 'reports') redirect_to = 'reports';
    else if (product_type === 'cashier') redirect_to = 'cashier';

    // Construct the redirect URL
    const url = `${base_url}/tradershub/redirect?action=redirect_to&redirect_to=${redirect_to}`;

    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');

    // Determine account value: if Demo → 'demo' else Currency (USD/BTC)
    const account_value = account_param === 'demo' ? 'demo' : account_param;

    return account_value ? `${url}&account=${account_value}` : url;
};

/**
 * Gets the URL for the wallet page in Trader's Hub
 * @returns The URL for the wallet page
 */
export const getWalletUrl = (is_virtual?: boolean, currency?: string): string => {
    const base_url = getBaseTraderHubUrl();
    const url = `${base_url}/tradershub/redirect?action=redirect_to&redirect_to=wallet`;

    let account_value;
    if (currency) {
        account_value = is_virtual ? 'demo' : currency;
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const account_param = urlParams.get('account');

        // Determine account value: if Demo → 'demo' else Currency (USD/BTC)
        account_value = account_param === 'demo' ? 'demo' : account_param;
    }

    return account_value ? `${url}&account=${account_value}` : url;
};

/**
 * Checks if the user should be redirected to Trader's Hub based on:
 * 1. If they have wallets
 * 2. If their country is in the enabled list from Firebase config
 *
 * @param has_wallet - Whether the user has wallets
 * @param residence - The user's residence country code
 * @param hubEnabledCountryList - List of countries enabled for the hub
 * @returns Boolean indicating if redirection should happen
 */
export const shouldRedirectToTraderHub = (
    has_wallet: boolean,
    residence?: string,
    hubEnabledCountryList: string[] = []
): boolean => {
    // Check if the country is in the enabled list
    const is_country_enabled = residence ? hubEnabledCountryList.includes(residence) : false;

    return has_wallet && is_country_enabled;
};

/**
 * Handles redirection to Trader's Hub
 * @param params - Object containing parameters for redirection
 * @param params.product_type - The type of product to redirect to ('tradershub', 'cfds', 'reports', or 'cashier')
 * @param params.has_wallet - Whether the user has wallets
 * @param params.is_virtual - Whether the account is a demo account
 * @param params.residence - The user's residence country code
 * @param params.hubEnabledCountryList - List of countries enabled for the hub
 * @returns The URL to redirect to, or null if no redirection should happen
 */
export const handleTraderHubRedirect = ({
    product_type,
    has_wallet,
    is_virtual = false,
    residence,
    hubEnabledCountryList = [],
}: {
    product_type: 'cfds' | 'tradershub' | 'reports' | 'cashier';
    has_wallet: boolean;
    is_virtual?: boolean;
    residence?: string;
    hubEnabledCountryList?: string[];
}): string | null => {
    if (shouldRedirectToTraderHub(has_wallet, residence, hubEnabledCountryList)) {
        return getTraderHubUrl(product_type);
    }

    // If no redirection should happen, return the default Trader's Hub URL
    const url = standalone_routes.traders_hub;

    // If it's a demo account, append the demo parameter
    if (is_virtual) {
        const redirect_url = new URL(url);
        redirect_url.searchParams.set('account', 'demo');
        return redirect_url.toString();
    }

    return url;
};
