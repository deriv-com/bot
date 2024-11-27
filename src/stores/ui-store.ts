import { action, makeObservable, observable } from 'mobx';

export default class UiStore {
    is_mobile = true;
    is_desktop = true;
    is_tablet = false;
    is_chart_layout_default = true;
    is_dark_mode_on = localStorage.getItem('theme') === 'dark';
    account_switcher_disabled_message = '';
    show_prompt = false;
    is_trading_assessment_for_new_user_enabled = false;
    is_accounts_switcher_on = false;

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
            setIsTradingAssessmentForNewUserEnabled: action.bound,
            is_trading_assessment_for_new_user_enabled: observable,
            is_accounts_switcher_on: observable,
            toggleAccountsDialog: action.bound,
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
    setIsTradingAssessmentForNewUserEnabled(value: boolean) {
        this.is_trading_assessment_for_new_user_enabled = value;
    }

    setDarkMode = (value: boolean) => {
        this.is_dark_mode_on = value;
    };

    setDevice = (value: 'mobile' | 'desktop' | 'tablet') => {
        this.is_mobile = value === 'mobile';
        this.is_desktop = value === 'desktop';
        this.is_tablet = value === 'tablet';
    };

    toggleAccountsDialog(status = !this.is_accounts_switcher_on) {
        this.is_accounts_switcher_on = status;
    }
}
