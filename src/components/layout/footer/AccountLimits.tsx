import { ACCOUNT_LIMITS } from '@/utils/constants';
import { LegacyAccountLimitsIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const AccountLimits = () => {
    const { localize } = useTranslations();

    return (
        <Tooltip as='a' className='app-footer__icon' href={ACCOUNT_LIMITS} tooltipContent={localize('Account limits')}>
            <LegacyAccountLimitsIcon iconSize='xs' />
        </Tooltip>
    );
};

export default AccountLimits;
