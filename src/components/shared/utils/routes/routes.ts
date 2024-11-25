import { URLConstants } from '@deriv-com/utils';

export const standalone_routes = {
    bot: '/', //
    cashier: `${URLConstants.derivAppProduction}/cashier/`,
    cashier_deposit: `${URLConstants.derivAppProduction}/cashier/deposit`,
    cashier_p2p: `${URLConstants.derivAppProduction}/cashier/p2p`,
    contract: `${URLConstants.derivAppProduction}/contract/:contract_id`,
    personal_details: `${URLConstants.derivAppProduction}/account/personal-details`,
    positions: `${URLConstants.derivAppProduction}/reports/positions`,
    profit: `${URLConstants.derivAppProduction}/reports/profit`,
    reports: `${URLConstants.derivAppProduction}/reports`,
    root: URLConstants.derivAppProduction,
    smarttrader: URLConstants.smartTraderProduction,
    statement: `${URLConstants.derivAppProduction}/reports/statement`,
    trade: `${URLConstants.derivAppProduction}/dtrader`,
    traders_hub: URLConstants.derivAppProduction,
    signup: `https://hub.deriv.com/tradershub/signup`,
};
