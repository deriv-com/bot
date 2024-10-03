import React from 'react';
import Text from '@/components/shared_ui/text';
import { LabelPairedLoaderMdBoldIcon } from '@deriv/quill-icons/LabelPaired';
import { localize } from '@deriv-com/translations';

export const message_running_bot = localize('Your bot is running and waiting for a signal to buy a contract.');

const ContractCardRunningBot = () => (
    <>
        <LabelPairedLoaderMdBoldIcon id='rotate-icon' fontSize={16} />
        <Text
            color='less-prominent'
            lineHeight='xs'
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
