import React from 'react';
import classNames from 'classnames';
import { isLookBacksContract, isSmartTraderContract, isVanillaContract } from '@/components/shared';
import { TradeTypeIcon } from '../../../trade-type/trade-type-icon';
import { TGetContractTypeDisplay } from '../../types';

export type TContractTypeCellProps = {
    getContractTypeDisplay: TGetContractTypeDisplay;
    is_high_low: boolean;
    is_multipliers?: boolean;
    is_turbos?: boolean;
    type?: string;
    displayed_trade_param?: React.ReactNode;
};

const ContractTypeCell = ({
    displayed_trade_param,
    getContractTypeDisplay,
    is_high_low,
    is_multipliers,
    is_turbos,
    type = '',
}: TContractTypeCellProps) => {
    let higher_lower_trade_type = '';
    if (is_high_low) {
        higher_lower_trade_type = type === 'CALL' ? 'HIGHER' : 'LOWER';
    }

    return (
        <div className='dc-contract-type'>
            <div className='dc-contract-type__type-wrapper'>
                <TradeTypeIcon
                    type={is_high_low && !isVanillaContract(type) ? higher_lower_trade_type : type}
                    className='category-type'
                    size='md'
                />
            </div>
            <div
                className={classNames('dc-contract-type__type-label', {
                    'dc-contract-type__type-label--smarttrader-contract': isSmartTraderContract(type),
                    'dc-contract-type__type-label--lookbacks-contract': isLookBacksContract(type),
                    'dc-contract-type__type-label--multipliers': is_multipliers,
                })}
            >
                <div>
                    {getContractTypeDisplay(type, {
                        isHighLow: is_high_low,
                        showMainTitle: is_multipliers || is_turbos,
                    }) || ''}
                </div>
                {displayed_trade_param && (
                    <div className='dc-contract-type__type-label-trade-param'>{displayed_trade_param}</div>
                )}
            </div>
        </div>
    );
};

export default ContractTypeCell;
