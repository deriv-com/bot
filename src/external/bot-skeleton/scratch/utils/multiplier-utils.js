/**
 * Check if multipliers are available for the current client
 * @returns {boolean} true if multipliers are available, false if restricted
 */
export const isMultipliersAvailable = () => {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return true; // Default to available in non-browser environments

        let clientCountry = null;

        // Try multiple sources for client country (in order of reliability)

        // 1. Check from DBotStore client first (most reliable when available)
        if (typeof window !== 'undefined' && window.DBotStore?.instance?.client) {
            const client_info = window.DBotStore.instance.client;
            // Try different possible paths for country
            clientCountry = client_info.country || client_info.account_info?.country;
            if (clientCountry) {
                clientCountry = clientCountry.toLowerCase();
            }
        }

        // 2. Fallback to localStorage with multiple possible keys
        if (!clientCountry && typeof localStorage !== 'undefined') {
            const possibleKeys = ['client.country', 'client_country', 'country'];
            for (const key of possibleKeys) {
                const stored_country = localStorage.getItem(key);
                if (stored_country) {
                    clientCountry = stored_country.toLowerCase();
                    break;
                }
            }
        }

        // 3. Try accessing DBotStore through global window as additional fallback
        if (!clientCountry && typeof window !== 'undefined' && window.DBotStore) {
            try {
                const client_info = window.DBotStore.instance?.client;
                if (client_info) {
                    const dbotCountry = client_info.country || client_info.account_info?.country;
                    if (dbotCountry) {
                        clientCountry = dbotCountry.toLowerCase();
                    }
                }
            } catch (e) {
                // Ignore access errors, continue with other fallbacks
            }
        }

        // List of countries where multipliers are restricted
        const restrictedCountries = ['in']; // India

        // Return false if client is from a restricted country
        return !restrictedCountries.includes(clientCountry);
    } catch (error) {
        console.warn('Error checking multiplier availability:', error);
        return true; // Default to available on error
    }
};
