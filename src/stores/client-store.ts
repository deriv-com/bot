import { action, computed, makeObservable, observable } from 'mobx';
import { ContentFlag, isEmptyObject } from '@/components/shared';
import { isEuCountry, isMultipliersOnly, isOptionsBlocked } from '@/components/shared/common/utility';
import {
    setAccountList,
    setAuthData,
    setIsAuthorized,
} from '@/external/bot-skeleton/services/api/observables/connection-status-stream';
import type { TAuthData, TLandingCompany } from '@/types/api-types';
import type { Balance, GetAccountStatus, GetSettings, WebsiteStatus } from '@deriv/api-types';

const eu_shortcode_regex = /^maltainvest$/;
const eu_excluded_regex = /^mt$/;
export default class ClientStore {
    loginid = '';
    account_list: TAuthData['account_list'] = [];
    balance = '0';
    currency = 'AUD';
    is_logged_in = false;
    account_status: GetAccountStatus | undefined;
    account_settings: GetSettings | undefined;
    website_status: WebsiteStatus | undefined;
    landing_companies: TLandingCompany | undefined;
    upgradeable_landing_companies: string[] = [];
    accounts: Record<string, TAuthData['account_list'][number]> = {};
    is_landing_company_loaded = false;
    all_accounts_balance: Balance | null = null;
    is_logging_out = false;

    // TODO: fix with self exclusion
    updateSelfExclusion = () => {};

    constructor() {
        makeObservable(this, {
            account_list: observable,
            account_settings: observable,
            account_status: observable,
            all_accounts_balance: observable,
            balance: observable,
            currency: observable,
            is_landing_company_loaded: observable,
            is_logged_in: observable,
            landing_companies: observable,
            loginid: observable,
            upgradeable_landing_companies: observable,
            website_status: observable,
            is_logging_out: observable,
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
            setAllAccountsBalance: action,
            setBalance: action,
            setCurrency: action,
            setIsLoggedIn: action,
            setIsLoggingOut: action,
            setLandingCompany: action,
            setLoginId: action,
            setWebsiteStatus: action,
            setUpgradeableLandingCompanies: action,
            is_trading_experience_incomplete: computed,
            is_cr_account: computed,
            account_open_date: computed,
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
    get is_trading_experience_incomplete() {
        return this.account_status?.status?.some(status => status === 'trading_experience_not_complete');
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

    get content_flag() {
        const { is_logged_in, landing_companies, residence, is_landing_company_loaded } = this;
        if (is_landing_company_loaded) {
            const { financial_company, gaming_company } = landing_companies ?? {};

            //this is a conditional check for countries like Australia/Norway which fulfills one of these following conditions
            const restricted_countries = financial_company?.shortcode === 'svg' || gaming_company?.shortcode === 'svg';

            if (!is_logged_in) return '';
            if (!gaming_company?.shortcode && financial_company?.shortcode === 'maltainvest') {
                if (this.is_virtual) return ContentFlag.EU_DEMO;
                return ContentFlag.EU_REAL;
            } else if (
                financial_company?.shortcode === 'maltainvest' &&
                gaming_company?.shortcode === 'svg' &&
                !this.is_virtual
            ) {
                if (this.is_eu) return ContentFlag.LOW_RISK_CR_EU;
                return ContentFlag.LOW_RISK_CR_NON_EU;
            } else if (
                ((financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg') ||
                    restricted_countries) &&
                !this.is_virtual
            ) {
                return ContentFlag.HIGH_RISK_CR;
            }

            // Default Check
            if (isEuCountry(residence)) {
                if (this.is_virtual) return ContentFlag.EU_DEMO;
                return ContentFlag.EU_REAL;
            }
            if (this.is_virtual) return ContentFlag.CR_DEMO;
        }
        return ContentFlag.LOW_RISK_CR_NON_EU;
    }

    get is_cr_account() {
        return this.loginid?.startsWith('CR');
    }

    get account_open_date() {
        if (isEmptyObject(this.accounts) || !this.accounts[this.loginid]) return undefined;
        return Object.keys(this.accounts[this.loginid]).includes('created_at')
            ? this.accounts[this.loginid].created_at
            : undefined;
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

    setAccountList = (account_list?: TAuthData['account_list']) => {
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

    setAccountStatus(status: GetAccountStatus | undefined) {
        this.account_status = status;
    }

    setAccountSettings(settings: GetSettings | undefined) {
        try {
            const is_equal_settings = JSON.stringify(settings) === JSON.stringify(this.account_settings);
            if (!is_equal_settings) {
                this.account_settings = settings;
            }
        } catch (error) {
            console.error('setAccountSettings error', error);
        }
    }

    setWebsiteStatus(status: WebsiteStatus | undefined) {
        this.website_status = status;
    }

    setLandingCompany(landing_companies: TLandingCompany) {
        this.landing_companies = landing_companies;
        this.is_landing_company_loaded = true;
    }

    setUpgradeableLandingCompanies = (upgradeable_landing_companies: string[]) => {
        this.upgradeable_landing_companies = upgradeable_landing_companies;
    };

    setAllAccountsBalance = (all_accounts_balance: Balance | undefined) => {
        this.all_accounts_balance = all_accounts_balance ?? null;
    };

    setIsLoggingOut = (is_logging_out: boolean) => {
        this.is_logging_out = is_logging_out;
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

        this.all_accounts_balance = null;

        localStorage.removeItem('active_loginid');
        localStorage.removeItem('accountsList');
        localStorage.removeItem('authToken');
        localStorage.removeItem('clientAccounts');

        setIsAuthorized(false);
        setAccountList([]);
        setAuthData(null);

        this.setIsLoggingOut(false);

        // disable livechat
        window.LC_API?.close_chat?.();
        window.LiveChatWidget?.call('hide');

        // shutdown and initialize intercom
        if (window.Intercom) {
            window.Intercom('shutdown');
            window.DerivInterCom.initialize({
                hideLauncher: true,
                token: null,
            });
        }
    };
}
