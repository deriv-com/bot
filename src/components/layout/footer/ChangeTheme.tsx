import { observer } from 'mobx-react-lite';
import Tooltip from '@/components/shared_ui/tooltip';
import useThemeSwitcher from '@/hooks/useThemeSwitcher';
import { LegacyThemeDarkIcon, LegacyThemeLightIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';

const ChangeTheme = observer(() => {
    const { is_dark_mode_on, toggleTheme } = useThemeSwitcher();
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='button'
            className='app-footer__icon'
            tooltipContent={localize('Change theme')}
            onClick={toggleTheme}
        >
            {!is_dark_mode_on ? <LegacyThemeLightIcon iconSize='xs' /> : <LegacyThemeDarkIcon iconSize='xs' />}
        </Tooltip>
    );
});

export default ChangeTheme;
