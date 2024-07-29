import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const Livechat = () => {
    const { localize } = useTranslations();
    // TODO add the logic of this
    // TODO add the test cases for this after adding the logics

    return (
        <Tooltip as='button' className='app-footer__icon' tooltipContent={localize('Live chat')}>
            <LegacyLiveChatOutlineIcon iconSize='xs' />
        </Tooltip>
    );
};

export default Livechat;
