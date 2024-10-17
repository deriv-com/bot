import React from 'react';
import { localize } from '@deriv-com/translations';
import { CONTRACT_TYPES, TRADE_TYPES } from '../contract';
import { TContractOptions } from '../contract/contract-types';

export const getLocalizedBasis = () =>
    ({
        accumulator: localize('Accumulators'),
        multiplier: localize('Multiplier'),
        payout_per_pip: localize('Payout per pip'),
        payout_per_point: localize('Payout per point'),
        payout: localize('Payout'),
        stake: localize('Stake'),
        turbos: localize('Turbos'),
    }) as const;

type TContractConfig = {
    button_name?: React.ReactNode;
    feature_flag?: string;
    name: React.ReactNode;
    position: string;
    main_title?: JSX.Element;
};

type TGetSupportedContracts = keyof ReturnType<typeof getSupportedContracts>;

export type TTextValueStrings = {
    text: string;
    value: string;
};

export type TTradeTypesCategories = {
    [key: string]: {
        name: string;
        categories: Array<string | TTextValueStrings>;
    };
};

export const getCardLabels = () =>
    ({
        APPLY: localize('Apply'),
        BARRIER: localize('Barrier:'),
        BUY_PRICE: localize('Buy price:'),
        CANCEL: localize('Cancel'),
        CLOSE: localize('Close'),
        CLOSED: localize('Closed'),
        CONTRACT_COST: localize('Contract cost:'),
        CONTRACT_VALUE: localize('Contract value:'),
        CURRENT_STAKE: localize('Current stake:'),
        DAY: localize('day'),
        DAYS: localize('days'),
        DEAL_CANCEL_FEE: localize('Deal cancel. fee:'),
        DECREMENT_VALUE: localize('Decrement value'),
        DONT_SHOW_THIS_AGAIN: localize("Don't show this again"),
        ENTRY_SPOT: localize('Entry spot:'),
        INCREMENT_VALUE: localize('Increment value'),
        INDICATIVE_PRICE: localize('Indicative price:'),
        INITIAL_STAKE: localize('Initial stake:'),
        LOST: localize('Lost'),
        MULTIPLIER: localize('Multiplier:'),
        NOT_AVAILABLE: localize('N/A'),
        PAYOUT: localize('Sell price:'),
        POTENTIAL_PAYOUT: localize('Potential payout:'),
        POTENTIAL_PROFIT_LOSS: localize('Potential profit/loss:'),
        PROFIT_LOSS: localize('Profit/Loss:'),
        PURCHASE_PRICE: localize('Buy price:'),
        RESALE_NOT_OFFERED: localize('Resale not offered'),
        SELL: localize('Sell'),
        STAKE: localize('Stake:'),
        STOP_LOSS: localize('Stop loss:'),
        STRIKE: localize('Strike:'),
        TAKE_PROFIT: localize('Take profit:'),
        TICK: localize('Tick '),
        TICKS: localize('Ticks'),
        TOTAL_PROFIT_LOSS: localize('Total profit/loss:'),
        TAKE_PROFIT_LOSS_NOT_AVAILABLE: localize(
            'Take profit and/or stop loss are not available while deal cancellation is active.'
        ),
        WON: localize('Won'),
    }) as const;

export const getMarketNamesMap = () =>
    ({
        FRXAUDCAD: localize('AUD/CAD'),
        FRXAUDCHF: localize('AUD/CHF'),
        FRXAUDJPY: localize('AUD/JPY'),
        FRXAUDNZD: localize('AUD/NZD'),
        FRXAUDPLN: localize('AUD/PLN'),
        FRXAUDUSD: localize('AUD/USD'),
        FRXBROUSD: localize('Oil/USD'),
        FRXEURAUD: localize('EUR/AUD'),
        FRXEURCAD: localize('EUR/CAD'),
        FRXEURCHF: localize('EUR/CHF'),
        FRXEURGBP: localize('EUR/GBP'),
        FRXEURJPY: localize('EUR/JPY'),
        FRXEURNZD: localize('EUR/NZD'),
        FRXEURUSD: localize('EUR/USD'),
        FRXGBPAUD: localize('GBP/AUD'),
        FRXGBPCAD: localize('GBP/CAD'),
        FRXGBPCHF: localize('GBP/CHF'),
        FRXGBPJPY: localize('GBP/JPY'),
        FRXGBPNOK: localize('GBP/NOK'),
        FRXGBPUSD: localize('GBP/USD'),
        FRXNZDJPY: localize('NZD/JPY'),
        FRXNZDUSD: localize('NZD/USD'),
        FRXUSDCAD: localize('USD/CAD'),
        FRXUSDCHF: localize('USD/CHF'),
        FRXUSDJPY: localize('USD/JPY'),
        FRXUSDNOK: localize('USD/NOK'),
        FRXUSDPLN: localize('USD/PLN'),
        FRXUSDSEK: localize('USD/SEK'),
        FRXXAGUSD: localize('Silver/USD'),
        FRXXAUUSD: localize('Gold/USD'),
        FRXXPDUSD: localize('Palladium/USD'),
        FRXXPTUSD: localize('Platinum/USD'),
        OTC_AEX: localize('Netherlands 25'),
        OTC_AS51: localize('Australia 200'),
        OTC_DJI: localize('Wall Street 30'),
        OTC_FCHI: localize('France 40'),
        OTC_FTSE: localize('UK 100'),
        OTC_GDAXI: localize('Germany 40'),
        OTC_HSI: localize('Hong Kong 50'),
        OTC_IBEX35: localize('Spanish Index'),
        OTC_N225: localize('Japan 225'),
        OTC_NDX: localize('US Tech 100'),
        OTC_SPC: localize('US 500'),
        OTC_SSMI: localize('Swiss 20'),
        OTC_SX5E: localize('Euro 50'),
        R_10: localize('Volatility 10 Index'),
        R_25: localize('Volatility 25 Index'),
        R_50: localize('Volatility 50 Index'),
        R_75: localize('Volatility 75 Index'),
        R_100: localize('Volatility 100 Index'),
        BOOM300N: localize('Boom 300 Index'),
        BOOM500: localize('Boom 500 Index'),
        BOOM1000: localize('Boom 1000 Index'),
        CRASH300N: localize('Crash 300 Index'),
        CRASH500: localize('Crash 500 Index'),
        CRASH1000: localize('Crash 1000 Index'),
        RDBEAR: localize('Bear Market Index'),
        RDBULL: localize('Bull Market Index'),
        STPRNG: localize('Step Index'),
        WLDAUD: localize('AUD Basket'),
        WLDEUR: localize('EUR Basket'),
        WLDGBP: localize('GBP Basket'),
        WLDXAU: localize('Gold Basket'),
        WLDUSD: localize('USD Basket'),
        '1HZ10V': localize('Volatility 10 (1s) Index'),
        '1HZ25V': localize('Volatility 25 (1s) Index'),
        '1HZ50V': localize('Volatility 50 (1s) Index'),
        '1HZ75V': localize('Volatility 75 (1s) Index'),
        '1HZ100V': localize('Volatility 100 (1s) Index'),
        '1HZ150V': localize('Volatility 150 (1s) Index'),
        '1HZ200V': localize('Volatility 200 (1s) Index'),
        '1HZ250V': localize('Volatility 250 (1s) Index'),
        '1HZ300V': localize('Volatility 300 (1s) Index'),
        JD10: localize('Jump 10 Index'),
        JD25: localize('Jump 25 Index'),
        JD50: localize('Jump 50 Index'),
        JD75: localize('Jump 75 Index'),
        JD100: localize('Jump 100 Index'),
        JD150: localize('Jump 150 Index'),
        JD200: localize('Jump 200 Index'),
        CRYBCHUSD: localize('BCH/USD'),
        CRYBNBUSD: localize('BNB/USD'),
        CRYBTCLTC: localize('BTC/LTC'),
        CRYIOTUSD: localize('IOT/USD'),
        CRYNEOUSD: localize('NEO/USD'),
        CRYOMGUSD: localize('OMG/USD'),
        CRYTRXUSD: localize('TRX/USD'),
        CRYBTCETH: localize('BTC/ETH'),
        CRYZECUSD: localize('ZEC/USD'),
        CRYXMRUSD: localize('ZMR/USD'),
        CRYXMLUSD: localize('XLM/USD'),
        CRYXRPUSD: localize('XRP/USD'),
        CRYBTCUSD: localize('BTC/USD'),
        CRYDSHUSD: localize('DSH/USD'),
        CRYETHUSD: localize('ETH/USD'),
        CRYEOSUSD: localize('EOS/USD'),
        CRYLTCUSD: localize('LTC/USD'),
    }) as const;

export const getUnsupportedContracts = () =>
    ({
        CALLSPREAD: {
            name: localize('Spread Up'),
            position: 'top',
        },
        PUTSPREAD: {
            name: localize('Spread Down'),
            position: 'bottom',
        },
    }) as const;

/**
 * // Config to display details such as trade buttons, their positions, and names of trade types
 *
 * @param {Boolean} is_high_low
 * @returns { object }
 */
export const getSupportedContracts = (is_high_low?: boolean) =>
    ({
        [CONTRACT_TYPES.ACCUMULATOR]: {
            button_name: localize('Buy'),
            name: localize('Accumulators'),
            position: 'top',
        },
        [CONTRACT_TYPES.CALL]: {
            name: is_high_low ? localize('Higher') : localize('Rise'),
            position: 'top',
        },
        [CONTRACT_TYPES.PUT]: {
            name: is_high_low ? localize('Lower') : localize('Fall'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.CALLE]: {
            name: localize('Rise'),
            position: 'top',
        },
        [CONTRACT_TYPES.PUTE]: {
            name: localize('Fall'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.MATCH_DIFF.MATCH]: {
            name: localize('Matches'),
            position: 'top',
        },
        [CONTRACT_TYPES.MATCH_DIFF.DIFF]: {
            name: localize('Differs'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.EVEN_ODD.EVEN]: {
            name: localize('Even'),
            position: 'top',
        },
        [CONTRACT_TYPES.EVEN_ODD.ODD]: {
            name: localize('Odd'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.OVER_UNDER.OVER]: {
            name: localize('Over'),
            position: 'top',
        },
        [CONTRACT_TYPES.OVER_UNDER.UNDER]: {
            name: localize('Under'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.TOUCH.ONE_TOUCH]: {
            name: localize('Touch'),
            position: 'top',
        },
        [CONTRACT_TYPES.TOUCH.NO_TOUCH]: {
            name: localize('No Touch'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.MULTIPLIER.UP]: {
            name: localize('Up'),
            position: 'top',
            main_title: localize('Multipliers'),
        },
        [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
            name: localize('Down'),
            position: 'bottom',
            main_title: localize('Multipliers'),
        },
        [CONTRACT_TYPES.TURBOS.LONG]: {
            name: localize('Up'),
            position: 'top',
            main_title: localize('Turbos'),
        },
        [CONTRACT_TYPES.TURBOS.SHORT]: {
            name: localize('Down'),
            position: 'bottom',
            main_title: localize('Turbos'),
        },
        [CONTRACT_TYPES.VANILLA.CALL]: {
            name: localize('Call'),
            position: 'top',
            main_title: localize('Vanillas'),
        },
        [CONTRACT_TYPES.VANILLA.PUT]: {
            name: localize('Put'),
            position: 'bottom',
            main_title: localize('Vanillas'),
        },
        [CONTRACT_TYPES.RUN_HIGH_LOW.HIGH]: {
            name: localize('Only Ups'),
            position: 'top',
        },
        [CONTRACT_TYPES.RUN_HIGH_LOW.LOW]: {
            name: localize('Only Downs'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.END.OUT]: {
            name: localize('Ends Outside'),
            position: 'top',
        },
        [CONTRACT_TYPES.END.IN]: {
            name: localize('Ends Between'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.STAY.IN]: {
            name: localize('Stays Between'),
            position: 'top',
        },
        [CONTRACT_TYPES.STAY.OUT]: {
            name: localize('Goes Outside'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.ASIAN.UP]: {
            name: localize('Asian Up'),
            position: 'top',
        },
        [CONTRACT_TYPES.ASIAN.DOWN]: {
            name: localize('Asian Down'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.TICK_HIGH_LOW.HIGH]: {
            name: localize('High Tick'),
            position: 'top',
        },
        [CONTRACT_TYPES.TICK_HIGH_LOW.LOW]: {
            name: localize('Low Tick'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.RESET.CALL]: {
            name: localize('Reset Call'),
            position: 'top',
        },
        [CONTRACT_TYPES.RESET.PUT]: {
            name: localize('Reset Put'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.LB_CALL]: {
            name: localize('Close-Low'),
            position: 'top',
        },
        [CONTRACT_TYPES.LB_PUT]: {
            name: localize('High-Close'),
            position: 'top',
        },
        [CONTRACT_TYPES.LB_HIGH_LOW]: {
            name: localize('High-Low'),
            position: 'top',
        },
    }) as const;

export const getContractConfig = (is_high_low?: boolean) => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay = (type: string, options: TContractOptions = {}) => {
    const { isHighLow = false, showButtonName = false, showMainTitle = false } = options;

    const contract_config = getContractConfig(isHighLow)[type as TGetSupportedContracts] as TContractConfig;
    if (showMainTitle) return contract_config?.main_title ?? '';
    return (showButtonName && contract_config?.button_name) || contract_config?.name || '';
};

export const getContractTypeFeatureFlag = (type: string, is_high_low = false) => {
    const contract_config = getContractConfig(is_high_low)[type as TGetSupportedContracts] as TContractConfig;
    return contract_config?.feature_flag ?? '';
};

export const getContractTypePosition = (type: TGetSupportedContracts, is_high_low = false) =>
    getContractConfig(is_high_low)?.[type]?.position || 'top';

export const isCallPut = (trade_type: 'rise_fall' | 'rise_fall_equal' | 'high_low'): boolean =>
    trade_type === TRADE_TYPES.RISE_FALL ||
    trade_type === TRADE_TYPES.RISE_FALL_EQUAL ||
    trade_type === TRADE_TYPES.HIGH_LOW;
