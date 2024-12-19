import { api_base } from '@/external/bot-skeleton';

export const BOT_RESTRICTED_COUNTRIES_LIST = () => ({
    au: 'Australian',
    sg: 'Singaporean',
    it: 'Italian',
    de: 'German',
    fr: 'French',
    lu: 'Luxembourgish',
    gr: 'Greek',
    mf: 'Saint Martiner',
    es: 'Spanish',
    sk: 'Slovak',
    lt: 'Lithuanian',
    nl: 'Dutch',
    at: 'Austrian',
    bg: 'Bulgarian',
    si: 'Slovenian',
    cy: 'Cypriot',
    be: 'Belgian',
    ro: 'Romanian',
    hr: 'Croatian',
    pt: 'Portuguese',
    pl: 'Polish',
    lv: 'Latvian',
    ee: 'Estonian',
    cz: 'Czech',
    fi: 'Finnish',
    hu: 'Hungarian',
    dk: 'Danish',
    se: 'Swedish',
    ie: 'Irish',
    im: 'Manx',
    gb: 'British',
    mt: 'Malta',
});

export const LOW_RISK_COUNTRIES = () => ['za', 'ec', 'bw'];
export const EU_COUNTRIES = () => [
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

export const isEu = country_code => EU_COUNTRIES().includes(country_code);

export const isEuByAccount = (account = {}) => {
    const { loginInfo = {} } = account;
    return EU_COUNTRIES().includes(loginInfo.country);
};

export const isEuLandingCompany = landing_company => /^(maltainvest|malta|iom)$/.test(landing_company);

export const hasEuAccount = token_list =>
    token_list.some(token_obj => isEuLandingCompany(token_obj.loginInfo.landing_company_name));

const isLowRisk = (financial, gaming, upgrade) => {
    const { shortcode: f_sc = '' } = financial || {};
    const { shortcode: g_sc = '' } = gaming || {};
    return (f_sc === 'maltainvest' && g_sc === 'svg') || (upgrade?.includes('svg') && upgrade?.includes('maltainvest'));
};

const isHighRisk = (financial_company, gaming_company, risk_classification) => {
    const restricted_countries =
        financial_company?.shortcode === 'svg' ||
        (gaming_company?.shortcode === 'svg' && financial_company?.shortcode !== 'maltainvest');

    const high_risk_landing_company = financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg';
    return risk_classification === 'high' || high_risk_landing_company || restricted_countries;
};

const isMultiplier = landing_company_list => {
    const multiplier_account = landing_company_list?.financial_company?.legal_allowed_contract_categories;
    const is_multiplier = multiplier_account?.includes('multiplier');
    return {
        is_multiplier: multiplier_account?.length === 1 && is_multiplier,
        country_code: landing_company_list?.id,
    };
};

export const checkSwitcherType = async account_data => {
    const { client_accounts = {}, login_id, isVirtual = false, landing_companies } = account_data;

    const virtual_accounts = [];
    const non_eu_accounts = [];
    const eu_accounts = [];
    if (!login_id) return null;
    const account_info = { ...api_base.account_info };

    if (!account_info) return null;

    const account_status = { ...api_base.account_status };

    const { country, upgradeable_landing_companies = [] } = account_info;
    const is_eu = isEu(country);

    const { country_code } = isMultiplier(landing_companies);

    const { financial_company, gaming_company } = landing_companies;

    const { risk_classification } = account_status || {};
    const is_country_low_risk = LOW_RISK_COUNTRIES().includes(country_code);

    let is_low_risk = isLowRisk(financial_company, gaming_company, upgradeable_landing_companies);
    let is_high_risk = isHighRisk(financial_company, gaming_company, risk_classification);
    const low_risk_no_account = is_low_risk && Object.keys(client_accounts).length === 1;
    const high_risk_no_account = is_high_risk && Object.keys(client_accounts).length === 1;

    if (low_risk_no_account) is_low_risk = false;
    if (high_risk_no_account) is_high_risk = false;
    if (is_low_risk) is_high_risk = false;
    if (is_high_risk) is_low_risk = false;

    account_data.modifiedAccountList.forEach(account => {
        if (account.loginid.startsWith('VR')) virtual_accounts.push({ ...client_accounts[account], account });
        if (account.loginid.startsWith('MF')) eu_accounts.push({ ...client_accounts[account], account });
        if (account.loginid.startsWith('CR')) non_eu_accounts.push({ ...client_accounts[account], account });
    });

    const real_accounts = eu_accounts.length + non_eu_accounts.length;
    const renderCountryIsLowRiskAndHasNoRealAccount = !isVirtual && is_country_low_risk && real_accounts === 0;
    const renderCountryIsEuAndNoRealAccount = !isVirtual && !is_country_low_risk && is_eu && real_accounts === 0;
    const renderCountryIsNonEuAndNoRealAccount = !isVirtual && !is_country_low_risk && !is_eu && real_accounts === 0;
    const renderCountryIsEuHasOnlyRealAccount = !isVirtual && is_country_low_risk && is_eu && real_accounts > 0;
    const renderCountryIsNonEuHasOnlyRealAccount =
        !isVirtual && is_country_low_risk && !is_eu && real_accounts.length > 0;
    const renderCountryIsLowRiskAndHasOnlyRealAccount = !isVirtual && is_country_low_risk && real_accounts > 0;

    return {
        non_eu_accounts,
        eu_accounts,
        virtual_accounts,
        renderCountryIsLowRiskAndHasNoRealAccount,
        renderCountryIsEuAndNoRealAccount,
        renderCountryIsNonEuAndNoRealAccount,
        renderCountryIsEuHasOnlyRealAccount,
        renderCountryIsNonEuHasOnlyRealAccount,
        renderCountryIsLowRiskAndHasOnlyRealAccount,
    };
};
