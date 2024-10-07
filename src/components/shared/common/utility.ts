// eu countries to support
const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// check if client is from EU
export const isEuCountry = (country: string) => eu_countries.includes(country);

// countries where only multipliers are offered
const multipliers_only_countries = ['de', 'es', 'it', 'lu', 'gr', 'au', 'fr'];
export const isMultipliersOnly = (country: string) => multipliers_only_countries.includes(country);

// countries where binary options are blocked
const blocked_options_countries = ['au', 'fr'];
export const isOptionsBlocked = (country: string) => blocked_options_countries.includes(country);
