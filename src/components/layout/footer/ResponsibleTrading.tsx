import { RESPONSIBLE } from '@/utils/constants';
import { LegacyResponsibleTradingIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const ResponsibleTrading = () => {
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='a'
            className='app-footer__icon'
            href={RESPONSIBLE}
            target='_blank'
            tooltipContent={localize('Responsible trading')}
        >
            <LegacyResponsibleTradingIcon iconSize='xs' />
        </Tooltip>
    );
};

export default ResponsibleTrading;
