import { action, makeObservable, observable } from 'mobx';

export default class UiStore {
    is_mobile = false;
    is_desktop = true;
    is_tablet = false;
    is_chart_layout_default = true;
    is_dark_mode_on = localStorage.getItem('theme') === 'dark';
    url_hashed_values = '';

    constructor() {
        makeObservable(this, {
            is_dark_mode_on: observable,
            is_mobile: observable,
            is_desktop: observable,
            is_tablet: observable,
            setDarkMode: action,
            setDevice: action,
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPromptHandler = (...args: unknown[]) => {
        // TODO: implement this
    };
    setAccountSwitcherDisabledMessage = () => {
        // TODO: implement this
    };

    setDarkMode = (value: boolean) => {
        this.is_dark_mode_on = value;
    };

    setDevice = (value: 'mobile' | 'desktop' | 'tablet') => {
        this.is_mobile = value === 'mobile';
        this.is_desktop = value === 'desktop';
        this.is_tablet = value === 'tablet';
    };
}
