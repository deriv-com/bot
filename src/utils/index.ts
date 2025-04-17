export const print = (message: string) => {
    console.log(message); // eslint-disable-line no-console
};

/**
 * Checks if the current site is a .com domain
 * @returns {boolean} True if the site is a .com domain, false otherwise
 */
export const isDotComSite = (): boolean => {
    return /\.com$/i.test(window.location.hostname);
};

/**
 * Gets the domain from the current hostname (e.g., 'dbot.deriv.me' -> 'deriv.me')
 * @returns {string} The domain (deriv.com, deriv.me, or deriv.be)
 */
export const getDomain = (): string => {
    const hostname = window.location.hostname;
    const supported_domains = ['deriv.me', 'deriv.be'];

    // Extract the domain from the hostname
    let domain = 'deriv.com'; // Default
    for (const supported_domain of supported_domains) {
        if (hostname.endsWith(supported_domain)) {
            domain = supported_domain;
            break;
        }
    }

    return domain;
};

/**
 * Gets the app ID based on the environment
 * @returns {number} The app ID
 */
export const getAppId = (): number => {
    const hostname = window.location.hostname;

    // Determine the app_id based on the environment
    let app_id = 65555; // Default production app_id

    if (hostname.includes('localhost')) {
        app_id = 36300; // Local development
    } else if (hostname.includes('staging')) {
        app_id = 29934; // Staging environment
    }

    return app_id;
};
