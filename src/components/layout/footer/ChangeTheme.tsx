import { LegacyThemeLightIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const ChangeTheme = () => {
    const { localize } = useTranslations();

    return (
        // TODO need to add theme logic
        // TODO update the component's tests after adding the logic
        <Tooltip as='button' className='app-footer__icon' tooltipContent={localize('Change theme')}>
            <LegacyThemeLightIcon iconSize='xs' />
        </Tooltip>
    );
};

export default ChangeTheme;
