import React from 'react';
import { localize } from '@deriv-com/translations';

export const LocalizeHTMLForSellConditions = () => {
    return (
        <div className='sell_conditions'>
            <div className='sell_conditions__take_profit'>
                <span>
                    <strong>{localize('Take Profit: ')}</strong>
                </span>
                <span>{localize('The position closes once its profit exceeds the take-profit amount')}</span>
            </div>
            <div className='sell_conditions__tick_count'>
                <span>
                    <strong>{localize('Tick Count: ')}</strong>
                </span>
                <span>{localize('The holding period measured in ticks before the position is sold')}</span>
            </div>
        </div>
    );
};
