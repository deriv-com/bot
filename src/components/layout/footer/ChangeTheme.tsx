import { useState } from 'react';
import { LegacyThemeDarkIcon, LegacyThemeLightIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const ChangeTheme = () => {
    const { localize } = useTranslations();
    const [current_theme, setCurrentTheme] = useState(localStorage.getItem('theme') ?? 'light');

    const toggleTheme = () => {
        const body = document.querySelector('body');
        if (!body) return;
        if (body.classList.contains('theme--dark')) {
            localStorage.setItem('theme', 'light');
            body.classList.remove('theme--dark');
            body.classList.add('theme--light');
            setCurrentTheme('light');
        } else {
            localStorage.setItem('theme', 'dark');
            body.classList.remove('theme--light');
            body.classList.add('theme--dark');
            setCurrentTheme('dark');
        }
    };

    return (
        // TODO need to add theme logic
        // TODO update the component's tests after adding the logic
        <Tooltip
            as='button'
            className='app-footer__icon'
            tooltipContent={localize('Change theme')}
            onClick={toggleTheme}
        >
            {current_theme === 'light' ? <LegacyThemeLightIcon iconSize='xs' /> : <LegacyThemeDarkIcon iconSize='xs' />}
        </Tooltip>
    );
};

export default ChangeTheme;
