import { standalone_routes } from '@/components/shared';
import { LegacyDerivIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const Deriv = () => {
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='a'
            className='app-footer__icon'
            href={standalone_routes.deriv_com}
            target='_blank'
            tooltipContent={localize('Go to deriv.com')}
        >
            <LegacyDerivIcon iconSize='xs' />
        </Tooltip>
    );
};

export default Deriv;
