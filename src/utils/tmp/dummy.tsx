import { memo, SyntheticEvent } from 'react';

export const localize = (str: unknown, obj: unknown = {}) => `${str} ${JSON.stringify(obj)}`;

export const Localize = ({ i18n_default_text = '', values = {}, components = [] }) => {
    // Simulate basic interpolation
    const interpolatedText = i18n_default_text.replace(/\{\{([^}]+)\}\}/g, (match, key) => values[key] || '');

    // Combine text and components (assuming simple rendering)
    const content = (
        <>
            {interpolatedText}
            {components.map((component, index) => (
                <div key={index}>{component}</div>
            ))}
        </>
    );

    return <div className='dummy-localize'>{content}</div>;
};

export const i18n = {
    t: (key, obj) => localize(key, obj),
    store: {
        on: () => {},
        off: () => {},
    },
    language: 'en',
};

type TIconComponent = {
    icon: string;
    className?: string;
    onClick?: () => void;
};

const IconComponent: React.FC<TIconComponent> = ({ icon, ...rest }) => {
    const onError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        // eslint-disable-next-line no-console
        console.info(`${icon} not found, redirecting to fallback`, e);
        (e.target as HTMLImageElement).src = 'assets/icons/IcDashboard.svg';
    };

    return (
        <div className='dummy-icon' {...rest}>
            <img src={`assets/icons/${icon}.svg`} alt={icon} onError={onError} />
        </div>
    );
};

export const Icon = memo(IconComponent);

export const IconTradeTypes = ({ children }) => {
    // Simulate scrollbars
    return <div className='dummy-IconTradeTypes'>{children}</div>;
};
export const DataList = ({ children }) => {
    // Simulate scrollbars
    return <div className='dummy-DataList'>{children}</div>;
};

export const getLanguage = () => 'en';

export const getAppId = () => 36300;

export const ContentFlag = Object.freeze({
    LOW_RISK_CR_EU: 'low_risk_cr_eu',
    LOW_RISK_CR_NON_EU: 'low_risk_cr_non_eu',
    HIGH_RISK_CR: 'high_risk_cr',
    CR_DEMO: 'cr_demo',
    EU_DEMO: 'eu_demo',
    EU_REAL: 'eu_real',
});

export const routes = {
    traders_hub: '/appstore/traders-hub',
    reports: '/reports',
    bot: '/bot',
};

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

export const isEuResidenceWithOnlyVRTC = (accounts: TAccounts[]) => {
    return (
        accounts?.length === 1 &&
        accounts.every(acc => isEuCountry(acc.residence ?? '') && acc.landing_company_shortcode === 'virtual')
    );
};

export const showDigitalOptionsUnavailableError = (
    showError: (t: TShowError) => void,
    message: TMessage,
    redirectOnClick?: (() => void) | null,
    should_redirect?: boolean,
    should_clear_error_on_click = true
) => {
    const { title, text, link } = message;
    showError({
        message: text,
        header: title,
        redirect_label: link,
        redirectOnClick,
        should_show_refresh: false,
        redirect_to: '/appstore/traders-hub',
        should_clear_error_on_click,
        should_redirect,
    });
};

const isBrowser = () => typeof window !== 'undefined';

const deriv_com_url = 'deriv.com';
const deriv_me_url = 'deriv.me';
const deriv_be_url = 'deriv.be';

const supported_domains = [deriv_com_url, deriv_me_url, deriv_be_url];
const domain_url_initial = (isBrowser() && window.location.hostname.split('app.')[1]) || '';
const domain_url = supported_domains.includes(domain_url_initial) ? domain_url_initial : deriv_com_url;

export const deriv_urls = Object.freeze({
    DERIV_HOST_NAME: domain_url,
    DERIV_COM_PRODUCTION: `https://${domain_url}`,
    DERIV_COM_PRODUCTION_EU: `https://eu.${domain_url}`,
    DERIV_COM_STAGING: `https://staging.${domain_url}`,
    DERIV_APP_PRODUCTION: `https://app.${domain_url}`,
    DERIV_APP_STAGING: `https://staging-app.${domain_url}`,
    SMARTTRADER_PRODUCTION: `https://smarttrader.${domain_url}`,
    SMARTTRADER_STAGING: `https://staging-smarttrader.${domain_url}`,
    BINARYBOT_PRODUCTION: `https://bot.${domain_url}`,
    BINARYBOT_STAGING: `https://staging-bot.${domain_url}`,
});

export const domain_app_ids = {
    // these domains as supported "production domains"
    'deriv.app': 16929, // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
    'app.deriv.com': 16929,
    'staging-app.deriv.com': 16303,
    'app.deriv.me': 1411,
    'staging-app.deriv.me': 1411, // TODO: setup staging for deriv.me
    'app.deriv.be': 30767,
    'staging-app.deriv.be': 31186,
    'binary.com': 1,
    'test-app.deriv.com': 51072,
};

export const isProduction = () => {
    const all_domains = Object.keys(domain_app_ids).map(domain => `(www\\.)?${domain.replace('.', '\\.')}`);
    return new RegExp(`^(${all_domains.join('|')})$`, 'i').test(window.location.hostname);
};
