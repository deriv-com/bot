import { action, makeObservable, observable } from 'mobx';

export default class UiStore {
    is_mobile = true;
    is_desktop = true;
    is_tablet = false;
    is_chart_layout_default = true;
    is_dark_mode_on = localStorage.getItem('theme') === 'dark';
    url_hashed_values = '';
    account_switcher_disabled_message = '';
    show_prompt = false;

    // TODO: fix - need to implement this feature
    is_onscreen_keyboard_active = false;

    constructor() {
        makeObservable(this, {
            show_prompt: observable,
            is_dark_mode_on: observable,
            is_mobile: observable,
            is_desktop: observable,
            is_tablet: observable,
            account_switcher_disabled_message: observable,
            setDarkMode: action,
            setDevice: action,
            setAccountSwitcherDisabledMessage: action,
            setPromptHandler: action,
        });
    }

    setPromptHandler = (should_show: boolean) => {
        this.show_prompt = should_show;
    };

    setAccountSwitcherDisabledMessage = (message: string) => {
        if (message) {
            this.account_switcher_disabled_message = message;
        } else {
            this.account_switcher_disabled_message = '';
        }
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
