/**
 * @deprecated Please use 'URLUtils.getQueryParameter' from '@deriv-com/utils' instead of this.
 */
export const getlangFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lang = urlParams.get('lang');
    return lang;
};

/**
 * @deprecated Please use 'URLUtils.getQueryParameter' from '@deriv-com/utils' instead of this.
 */
export const getActionFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const action = urlParams.get('action');
    return action;
};

export const getPlatformFromUrl = (domain = window.location.hostname) => {
    const resolutions = {
        is_staging_deriv_app: /^staging-app\.deriv\.(com|me|be)$/i.test(domain),
        is_deriv_app: /^app\.deriv\.(com|me|be)$/i.test(domain),
        is_test_link: /^(.*)\.binary\.sx$/i.test(domain),
        is_test_deriv_app: /^test-app\.deriv\.com$/i.test(domain),
    };

    return {
        ...resolutions,
        is_staging: resolutions.is_staging_deriv_app,
        is_test_link: resolutions.is_test_link,
    };
};

export const isStaging = (domain = window.location.hostname) => {
    const { is_staging_deriv_app } = getPlatformFromUrl(domain);

    return is_staging_deriv_app;
};

export const isTestDerivApp = (domain = window.location.hostname) => {
    const { is_test_deriv_app } = getPlatformFromUrl(domain);

    return is_test_deriv_app;
};
