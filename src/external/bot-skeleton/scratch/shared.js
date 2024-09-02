import filesaver from 'file-saver';
import { CryptoConfig, getPropertyValue } from '@/components/shared';
import { config } from '../constants/config';

export const saveAs = ({ data, filename, type }) => {
    const blob = new Blob([data], { type });
    filesaver.saveAs(blob, filename);
};

/* 
    TODO: need to add currencies_config, calcDecimalPlaces after account switcher is implemented 
    add a const and dummy config here to fix the below error
*/
const currencies_config = [
    {
        USD: 'USD',
        fractional_digits: 2,
    },
];
const calcDecimalPlaces = currency => currency;

export const getDecimalPlaces = (currency = '') =>
    // need to check currencies_config[currency] exists instead of || in case of 0 value
    currencies_config[currency]
        ? getPropertyValue(currencies_config, [currency, 'fractional_digits'])
        : calcDecimalPlaces(currency);

export const getCurrencyDisplayCode = (currency = '') => {
    // eslint-disable-next-line
    if (currency !== 'eUSDT' && currency !== 'tUSDT') currency = currency.toUpperCase();
    return getPropertyValue(CryptoConfig.get(), [currency, 'display_code']) || currency;
};

export const getContractTypeOptions = (contract_type, trade_type) => {
    const trade_types = config.opposites[trade_type.toUpperCase()];

    if (!trade_types) {
        return config.NOT_AVAILABLE_DROPDOWN_OPTIONS;
    }

    const contract_options = trade_types.map(type => Object.entries(type)[0].reverse());

    // When user selected a specific contract, only return the contract type they selected.
    if (contract_type !== 'both') {
        return contract_options.filter(option => option[1] === contract_type);
    }

    return contract_options;
};
