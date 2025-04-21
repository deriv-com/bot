export const print = (message: string) => {
    console.log(message); // eslint-disable-line no-console
};

/**
 * Checks if the current site is a .com domain or localhost
 * @returns {boolean} True if the site is a .com domain or localhost, false otherwise
 */
export const isDotComSite = (): boolean => {
    return /\.com$/i.test(window.location.hostname) || window.location.hostname === 'localhost';
};
