import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { LegacyThemeDarkIcon, LegacyThemeLightIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const ChangeTheme = observer(() => {
    const { ui } = useStore();
    const { setDarkMode, is_dark_mode_on } = ui;
    const { localize } = useTranslations();

    const toggleTheme = () => {
        const body = document.querySelector('body');
        if (!body) return;
        if (body.classList.contains('theme--dark')) {
            localStorage.setItem('theme', 'light');
            body.classList.remove('theme--dark');
            body.classList.add('theme--light');
            setDarkMode(false);
        } else {
            localStorage.setItem('theme', 'dark');
            body.classList.remove('theme--light');
            body.classList.add('theme--dark');
            setDarkMode(true);
        }
    };

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
