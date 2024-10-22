import Text from '@/components/shared_ui/text';
import { LabelPairedLoaderMdBoldIcon } from '@deriv/quill-icons/LabelPaired';
import { localize } from '@deriv-com/translations';
import './contract-card-loading.scss';

export const message_running_bot = localize('Your bot is running and waiting for a signal to buy a contract.');

const ContractCardRunningBot = () => (
    <div className='db-contract-card-running-loader'>
        <LabelPairedLoaderMdBoldIcon id='rotate-icon' fontSize={16} fill='var(--text-general)' />
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
    </div>
);

export default ContractCardRunningBot;
