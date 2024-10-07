import { action, computed, makeObservable, observable } from 'mobx';
import { isEmptyObject } from '@/components/shared';
import { isEuCountry, isMultipliersOnly, isOptionsBlocked } from '@/components/shared/common/utility';
import {
    useAccountList,
    useGetAccountStatus,
    useGetSettings,
    useLandingCompany,
    useWebsiteStatus,
} from '@deriv-com/api-hooks';

type TAccountList = NonNullable<ReturnType<typeof useAccountList>['data']>;

type GetAccountStatusResult = NonNullable<ReturnType<typeof useGetAccountStatus>['data']>;

type GetSettingsResult = NonNullable<ReturnType<typeof useGetSettings>['data']>;

type GetWebsiteStatusResult = NonNullable<ReturnType<typeof useWebsiteStatus>['data']>;

export type GetLandingCompanyResult = NonNullable<ReturnType<typeof useLandingCompany>['data']> & {
    gaming_company: {
        shortcode: string;
    };
    financial_company: {
        shortcode: string;
    };
    mt_gaming_company: {
        financial: {
            shortcode: string;
        };
        swap_free: {
            shortcode: string;
        };
    };
};

const eu_shortcode_regex = /^maltainvest$/;
const eu_excluded_regex = /^mt$/;

export default class ClientStore {
    loginid = '';
    account_list: TAccountList = [];
    balance = '0';
    currency = 'USD';
    is_logged_in = false;
    account_status: GetAccountStatusResult | undefined;
    account_settings: GetSettingsResult | undefined;
    website_status: GetWebsiteStatusResult | undefined;
    landing_companies: GetLandingCompanyResult | undefined;
    upgradeable_landing_companies: string[] = [];
    accounts: Record<string, TAccountList[number]> = {};
    is_landing_company_loaded = false;
    apiHookLogout = () => {};
    switch_broadcast = false;

    // TODO: fix with self exclusion
    updateSelfExclusion = () => {};

    constructor() {
        makeObservable(this, {
            account_list: observable,
            account_settings: observable,
            account_status: observable,
            apiHookLogout: observable,
            balance: observable,
            currency: observable,
            is_landing_company_loaded: observable,
            is_logged_in: observable,
            landing_companies: observable,
            loginid: observable,
            switch_broadcast: observable,
            upgradeable_landing_companies: observable,
            website_status: observable,
            active_accounts: computed,
            clients_country: computed,
            is_bot_allowed: computed,
            is_eu: computed,
            is_eu_country: computed,
            is_eu_or_multipliers_only: computed,
            is_low_risk: computed,
            is_multipliers_only: computed,
            is_options_blocked: computed,
            is_virtual: computed,
            landing_company_shortcode: computed,
            residence: computed,
            should_show_eu_error: computed,
            logout: action,
            setAccountList: action,
            setAccountSettings: action,
            setAccountStatus: action,
            setApiHookLogout: action,
            setBalance: action,
            setCurrency: action,
            setIsLoggedIn: action,
            setLandingCompany: action,
            setLoginId: action,
            setSwitchBroadcast: action,
            setWebsiteStatus: action,
            setUpgradeableLandingCompanies: action,
        });
    }

    get active_accounts() {
        return this.accounts instanceof Object
            ? Object.values(this.accounts).filter(account => !account.is_disabled)
            : [];
    }

    get clients_country() {
        return this.website_status?.clients_country;
    }

    get is_bot_allowed() {
        return this.isBotAllowed();
    }

    get is_eu() {
        if (!this.landing_companies) return false;
        const { gaming_company, financial_company, mt_gaming_company } = this.landing_companies;
        const financial_shortcode = financial_company?.shortcode;
        const gaming_shortcode = gaming_company?.shortcode;
        const mt_gaming_shortcode = mt_gaming_company?.financial.shortcode || mt_gaming_company?.swap_free.shortcode;
        const is_current_mf = this.landing_company_shortcode === 'maltainvest';
        return (
            is_current_mf || //is_currently logged in mf account via tradershub
            (financial_shortcode || gaming_shortcode || mt_gaming_shortcode
                ? (eu_shortcode_regex.test(financial_shortcode) && gaming_shortcode !== 'svg') ||
                  eu_shortcode_regex.test(gaming_shortcode)
                : eu_excluded_regex.test(this.residence))
        );
    }

    get is_eu_country() {
        const country = this.website_status?.clients_country;
        if (country) return isEuCountry(country);
        return false;
    }

    get is_low_risk() {
        const { gaming_company, financial_company } = this.landing_companies ?? {};
        const low_risk_landing_company =
            financial_company?.shortcode === 'maltainvest' && gaming_company?.shortcode === 'svg';
        return low_risk_landing_company;
    }

    get should_show_eu_error() {
        if (!this.is_landing_company_loaded) {
            return false;
        }
        return this.is_eu && !this.is_low_risk;
    }

    get landing_company_shortcode() {
        if (this.accounts[this.loginid]) {
            return this.accounts[this.loginid].landing_company_name;
        }
        return undefined;
    }

    get residence() {
        if (this.is_logged_in) {
            return this.account_settings?.country_code ?? '';
        }
        return '';
    }

    get is_options_blocked() {
        return isOptionsBlocked(this.residence);
    }

    get is_multipliers_only() {
        return isMultipliersOnly(this.residence);
    }

    get is_eu_or_multipliers_only() {
        // Check whether account is multipliers only and if the account is from eu countries
        return !this.is_multipliers_only ? !isEuCountry(this.residence) : !this.is_multipliers_only;
    }

    get is_virtual() {
        return !isEmptyObject(this.accounts) && this.accounts[this.loginid] && !!this.accounts[this.loginid].is_virtual;
    }

    get all_loginids() {
        return !isEmptyObject(this.accounts) ? Object.keys(this.accounts) : [];
    }

    get virtual_account_loginid() {
        return this.all_loginids.find(loginid => !!this.accounts[loginid].is_virtual);
    }

    isBotAllowed = () => {
        // Stop showing Bot, DBot, DSmartTrader for logged out EU IPs
        if (!this.is_logged_in && this.is_eu_country) return false;
        const is_mf = this.landing_company_shortcode === 'maltainvest';
        return this.is_virtual ? this.is_eu_or_multipliers_only : !is_mf && !this.is_options_blocked;
    };

    setLoginId = (loginid: string) => {
        this.loginid = loginid;
    };

    setAccountList = (account_list?: TAccountList) => {
        this.accounts = {};
        account_list?.forEach(account => {
            this.accounts[account.loginid] = account;
        });
        if (account_list) this.account_list = account_list;
    };

    setBalance = (balance: string) => {
        this.balance = balance;
    };

    setCurrency = (currency: string) => {
        this.currency = currency;
    };

    setIsLoggedIn = (is_logged_in: boolean) => {
        this.is_logged_in = is_logged_in;
    };

    getToken = () => {
        const accountList = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
        return accountList[this.loginid] ?? '';
    };

    setAccountStatus(status: GetAccountStatusResult) {
        this.account_status = status;
    }

    setAccountSettings(settings: GetSettingsResult) {
        const is_equal_settings = JSON.stringify(settings) === JSON.stringify(this.account_settings);
        if (!is_equal_settings) {
            this.account_settings = settings;
        }
    }

    setWebsiteStatus(status: GetWebsiteStatusResult) {
        this.website_status = status;
    }

    setLandingCompany(landing_companies: GetLandingCompanyResult) {
        this.landing_companies = landing_companies;
        this.is_landing_company_loaded = true;
    }

    setApiHookLogout = (logout: () => void) => {
        this.apiHookLogout = logout;
    };

    setUpgradeableLandingCompanies = (upgradeable_landing_companies: string[]) => {
        this.upgradeable_landing_companies = upgradeable_landing_companies;
    };

    setSwitchBroadcast = (switch_broadcast: boolean) => {
        this.switch_broadcast = switch_broadcast;
    };

    logout = () => {
        // reset all the states
        this.account_list = [];
        this.account_status = undefined;
        this.account_settings = undefined;
        this.landing_companies = undefined;
        this.accounts = {};
        this.is_logged_in = false;
        this.loginid = '';
        this.balance = '0';
        this.currency = 'USD';

        this.is_landing_company_loaded = false;
        this.switch_broadcast = false;

        this.apiHookLogout();
    };
}
