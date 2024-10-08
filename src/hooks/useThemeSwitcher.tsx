import { useCallback } from 'react';
import { useStore } from './useStore';

const useThemeSwitcher = () => {
    const { ui } = useStore() ?? {
        ui: {
            setDarkMode: () => {},
            is_dark_mode_on: false,
        },
    };
    const { setDarkMode, is_dark_mode_on } = ui;

    const toggleTheme = useCallback(() => {
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
    }, [setDarkMode]);

    return {
        toggleTheme,
        is_dark_mode_on,
        setDarkMode,
    };
};

export default useThemeSwitcher;
