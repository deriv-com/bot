import React from 'react';
import Cookies from 'js-cookie';
import ChunkLoader from '@/components/loader/chunk-loader';
import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import { localize } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import App from './App';
import {
    Account,
    AccountsList,
    ActiveAccount,
    ApiInstance,
    ClientAccounts,
    LocalStorageToken,
    LoginInfo,
} from './types';

const getCookieAccounts = () => {
    try {
        return JSON.parse(Cookies.get('client.accounts') || '{}');
    } catch (error) {
        console.error("Invalid JSON in 'client.accounts' cookie:", error);
        return {};
    }
};

const storeAccountsToLocalStorage = (cookieAccounts: Record<string, Account>): ClientAccounts => {
    const accountsList: AccountsList = {};
    const clientAccounts: ClientAccounts = {};

    Object.values(cookieAccounts).forEach(({ loginid, token, currency }) => {
        if (loginid && token) {
            accountsList[loginid] = token;
            clientAccounts[loginid] = { loginid, token, currency: currency || '' };
        }
    });

    localStorage.setItem('accountsList', JSON.stringify(accountsList));
    localStorage.setItem('clientAccounts', JSON.stringify(clientAccounts));
    return clientAccounts;
};

const getActiveAccount = (
    cookieAccounts: Record<string, ActiveAccount>,
    clientAccounts: ClientAccounts,
    loginInfo: LoginInfo[]
): ActiveAccount | undefined => {
    const queryParams = new URLSearchParams(window.location.search);
    const currencyType = queryParams.get('account') || loginInfo[0]?.currency;

    return (
        Object.values(cookieAccounts).find(acc => acc.currency === currencyType) ||
        Object.values(cookieAccounts)[0] ||
        Object.values(clientAccounts).find(acc => acc.currency === currencyType) ||
        Object.values(clientAccounts)[0] ||
        loginInfo[0]
    );
};

const authorizeAccount = async (api: ApiInstance, loginInfo: LoginInfo[]): Promise<LoginInfo | undefined> => {
    if (api) {
        const { authorize, error } = await api.authorize(loginInfo[0].token);
        api.disconnect();
        if (!error) {
            const firstId = authorize?.account_list[0]?.loginid;
            return loginInfo.find(acc => acc.loginid === firstId);
        }
    }
    return undefined;
};

const setLocalStorageToken = async ({ loginInfo, paramsToDelete }: LocalStorageToken): Promise<void> => {
    const cookieAccounts = getCookieAccounts();
    const hasValidLoginInfo = loginInfo.length > 0 && loginInfo.some(acc => acc.token);
    const hasValidCookie = Object.keys(cookieAccounts).length > 0;

    if (!hasValidLoginInfo && !hasValidCookie) return;

    try {
        const clientAccounts = storeAccountsToLocalStorage(cookieAccounts);
        let activeAccount = getActiveAccount(cookieAccounts, clientAccounts, loginInfo);

        if (activeAccount) {
            localStorage.setItem('authToken', activeAccount.token);
            localStorage.setItem('active_loginid', activeAccount.loginid);
        }

        URLUtils.filterSearchParams(paramsToDelete);
        const api = await generateDerivApiInstance();

        if (api && !activeAccount) {
            activeAccount = await authorizeAccount(api, loginInfo);
            if (activeAccount) {
                localStorage.setItem('authToken', activeAccount.token);
                localStorage.setItem('active_loginid', activeAccount.loginid);
            }
        }
    } catch (error) {
        console.error('Error setting up login info:', error);
    }
};

export const AuthWrapper = () => {
    const [isAuthComplete, setIsAuthComplete] = React.useState(false);
    const { loginInfo, paramsToDelete } = URLUtils.getLoginInfoFromURL();

    React.useEffect(() => {
        const initializeAuth = async () => {
            await setLocalStorageToken({ loginInfo, paramsToDelete });
            URLUtils.filterSearchParams(['lang']);
            setIsAuthComplete(true);
        };

        initializeAuth();
    }, [loginInfo, paramsToDelete]);

    if (!isAuthComplete) {
        return <ChunkLoader message={localize('Initializing...')} />;
    }

    return <App />;
};
