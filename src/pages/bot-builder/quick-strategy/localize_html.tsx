import React from 'react';
import { localize } from '@deriv-com/translations';

export const LocalizeHTMLForSellConditions = () => {
    return (
        <div className='sell_conditions'>
            <div className='sell_conditions__tick_count'>
                <span>
                    <strong>{localize('Tick Count: ')}</strong>
                </span>
                <span>{localize('Counting the number of ticks before selling the position. ')}</span>
            </div>
            <div className='sell_conditions__take_profit'>
                <span>
                    <strong>{localize('Take Profit: ')}</strong>
                </span>
                <span>{localize('The position closes after the profit and loss crosses the take profit amount.')}</span>
            </div>
        </div>
    );
};
