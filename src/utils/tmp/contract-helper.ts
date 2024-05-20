export const isMultiplierContract = (contract_type = '') => /MULT/i.test(contract_type);

export const isEnded = (contract_info: TContractInfo) =>
    !!(
        (contract_info.status && contract_info.status !== 'open') ||
        contract_info.is_expired ||
        contract_info.is_settleable
    );

export const getTotalProfit = (contract_info: TContractInfo) =>
    Number(contract_info.bid_price) - Number(contract_info.buy_price);

export const getLimitOrderAmount = (limit_order?: TLimitOrder) => {
    if (!limit_order) return { stop_loss: null, take_profit: null };
    const {
        stop_loss: { order_amount: stop_loss_order_amount } = {},
        take_profit: { order_amount: take_profit_order_amount } = {},
    } = limit_order;

    return {
        stop_loss: stop_loss_order_amount,
        take_profit: take_profit_order_amount,
    };
};

export const getFinalPrice = (contract_info: TContractInfo) => contract_info.sell_price || contract_info.bid_price;

export const getIndicativePrice = (contract_info: TContractInfo) =>
    getFinalPrice(contract_info) && isEnded(contract_info)
        ? getFinalPrice(contract_info)
        : Number(contract_info.bid_price);
