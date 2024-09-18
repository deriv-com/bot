import { action, makeObservable, observable } from 'mobx';
import { useAccountList } from '@deriv-com/api-hooks';

type TAccountList = NonNullable<ReturnType<typeof useAccountList>['data']>;

export default class ClientStore {
    loginid = '';
    account_list: TAccountList = [];
    account_settings = { country_code: '' };
    balance = '0';
    currency = 'USD';
    is_logged_in = false;

    constructor() {
        makeObservable(this, {
            loginid: observable,
            account_list: observable,
            account_settings: observable,
            balance: observable,
            currency: observable,
            is_logged_in: observable,
            setLoginId: action,
            setAccountList: action,
            setBalance: action,
            setCurrency: action,
            setIsLoggedIn: action,
        });
    }

    setLoginId = (loginid: string) => {
        this.loginid = loginid;
    };

    setAccountList = (account_list?: TAccountList) => {
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
}
