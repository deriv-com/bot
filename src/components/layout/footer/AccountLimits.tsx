import { standalone_routes } from '@/components/shared';
import { LegacyAccountLimitsIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const AccountLimits = () => {
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='a'
            className='app-footer__icon'
            href={standalone_routes.account_limits}
            tooltipContent={localize('Account limits')}
        >
            <LegacyAccountLimitsIcon iconSize='xs' fill='var(--text-general)' />
        </Tooltip>
    );
};

export default AccountLimits;
