import React from 'react';
import { LabelPairedLoaderMdBoldIcon } from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

export const message_running_bot = localize('Your bot is running and waiting for a signal to buy a contract.');

const ContractCardRunningBot = () => (
    <>
        <LabelPairedLoaderMdBoldIcon id='rotate-icon' fontSize={16} />
        <Text
            color='less-prominent'
            line_height='xs'
            size='xs'
            weight='bold'
            align='center'
            className='dc-contract-card-message'
        >
            {message_running_bot}
        </Text>
    </>
);

export default ContractCardRunningBot;
