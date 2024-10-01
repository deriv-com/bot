import { HELP_CENTRE } from '@/utils/constants';
import { LegacyHelpCentreIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const HelpCentre = () => {
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='a'
            className='app-footer__icon'
            href={HELP_CENTRE}
            target='_blank'
            tooltipContent={localize('Help centre')}
        >
            <LegacyHelpCentreIcon iconSize='xs' />
        </Tooltip>
    );
};

export default HelpCentre;
