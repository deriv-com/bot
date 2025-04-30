/**
 * Utility functions for authentication-related operations
 */

/**
 * Clears authentication data from local storage and reloads the page
 */
export const clearAuthData = (): void => {
    localStorage.removeItem('accountsList');
    localStorage.removeItem('clientAccounts');
    localStorage.removeItem('callback_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('active_loginid');
    localStorage.removeItem('client.accounts');
    location.reload();
};
