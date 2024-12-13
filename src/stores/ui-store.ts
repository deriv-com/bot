import { action, makeObservable, observable } from 'mobx';
import { isTouchDevice } from '@/components/shared/utils/screen/responsive';

export default class UiStore {
    is_mobile = true;
    is_desktop = true;
    is_tablet = false;
    is_chart_layout_default = true;
    is_dark_mode_on = localStorage.getItem('theme') === 'dark';
    account_switcher_disabled_message = '';
    current_focus = null;
    show_prompt = false;
    is_trading_assessment_for_new_user_enabled = false;
    is_accounts_switcher_on = false;

    // TODO: fix - need to implement this feature
    is_onscreen_keyboard_active = false;

    constructor() {
        makeObservable(this, {
            account_switcher_disabled_message: observable,
            current_focus: observable,
            is_accounts_switcher_on: observable,
            is_dark_mode_on: observable,
            is_desktop: observable,
            is_mobile: observable,
            is_tablet: observable,
            is_trading_assessment_for_new_user_enabled: observable,
            show_prompt: observable,
            setAccountSwitcherDisabledMessage: action.bound,
            setCurrentFocus: action.bound,
            setDarkMode: action.bound,
            setDevice: action.bound,
            setPromptHandler: action.bound,
            setIsTradingAssessmentForNewUserEnabled: action.bound,
            toggleAccountsDialog: action.bound,
            toggleOnScreenKeyboard: action.bound,
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

    toggleOnScreenKeyboard() {
        this.is_onscreen_keyboard_active = this.current_focus !== null && this.is_mobile && isTouchDevice();
    }

    setCurrentFocus(value) {
        this.current_focus = value;
        this.toggleOnScreenKeyboard();
    }
}
