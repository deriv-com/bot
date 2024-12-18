const getDerivComDomain = () => {
    const hostname = window.location.hostname;
    const isStaging = hostname.includes('staging');
    const domainType = hostname.endsWith('.me') ? 'me' : hostname.endsWith('.be') ? 'be' : 'com';

    const stagingDomain = 'https://staging.deriv.com';
    const productionDomains = {
        me: 'https://deriv.me',
        be: 'https://deriv.be',
        com: 'https://deriv.com',
    };

    return isStaging ? stagingDomain : productionDomains[domainType];
};

const getDerivAppDomain = () => {
    const hostname = window.location.hostname;
    const isStaging = hostname.includes('staging');
    const domainType = hostname.endsWith('.me') ? 'me' : hostname.endsWith('.be') ? 'be' : 'com';

    const stagingAppDomain = 'https://staging-app.deriv.com';
    const productionDomains = {
        me: 'https://app.deriv.me',
        be: 'https://app.deriv.be',
        com: 'https://app.deriv.com',
    };

    return isStaging ? stagingAppDomain : productionDomains[domainType];
};

const getSmartTraderDomain = () => {
    const hostname = window.location.hostname;
    const isStaging = hostname.includes('staging');
    const domainType = hostname.endsWith('.me') ? 'me' : hostname.endsWith('.be') ? 'be' : 'com';

    const smartTraderStaging = {
        me: 'https://staging-smarttrader.deriv.me',
        be: 'https://staging-smarttrader.deriv.be',
        com: 'https://staging-smarttrader.deriv.com',
    };

    const smartTraderProduction = {
        me: 'https://smarttrader.deriv.me',
        be: 'https://smarttrader.deriv.be',
        com: 'https://smarttrader.deriv.com',
    };

    return isStaging ? smartTraderStaging[domainType] : smartTraderProduction[domainType];
};

export const standalone_routes = {
    bot: '/',
    cashier: `${getDerivAppDomain()}/cashier/`,
    cashier_deposit: `${getDerivAppDomain()}/cashier/deposit`,
    cashier_p2p: `${getDerivAppDomain()}/cashier/p2p`,
    contract: `${getDerivAppDomain()}/contract/:contract_id`,
    personal_details: `${getDerivAppDomain()}/account/personal-details`,
    positions: `${getDerivAppDomain()}/reports/positions`,
    profit: `${getDerivAppDomain()}/reports/profit`,
    reports: `${getDerivAppDomain()}/reports`,
    root: getDerivAppDomain(),
    smarttrader: getSmartTraderDomain(),
    statement: `${getDerivAppDomain()}/reports/statement`,
    trade: `${getDerivAppDomain()}/dtrader`,
    traders_hub: getDerivAppDomain(),
    wallets_transfer: `${getDerivAppDomain()}/wallet/account-transfer`,
    signup: `https://hub.deriv.com/tradershub/signup`,
    deriv_com: getDerivComDomain(),
    deriv_app: getDerivAppDomain(),
    endpoint: '/endpoint',
    account_limits: `${getDerivAppDomain()}/account/account-limits`,
    help_center: `${getDerivComDomain()}/help-centre/`,
    responsible: `${getDerivComDomain()}/responsible/`,
};
