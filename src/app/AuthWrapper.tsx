import React from 'react';
import Cookies from 'js-cookie';
import ChunkLoader from '@/components/loader/chunk-loader';
import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import { localize } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import App from './App';
import { Account, AccountsList, ApiInstance, ClientAccounts, LoginInfo } from './types';

const getCookieAccounts = (): ClientAccounts => {
    try {
        return JSON.parse(Cookies.get('client.accounts') || '{}');
    } catch (error) {
        console.error("Invalid JSON in 'client.accounts' cookie:", error);
        return {};
    }
};

const storeAccountsToLocalStorage = (
    cookieAccounts: ClientAccounts,
    loginInfo: LoginInfo[],
    authorizedAccounts: LoginInfo[]
): ClientAccounts => {
    const accountsList: AccountsList = {};
    const clientAccounts: ClientAccounts = { ...cookieAccounts };

    authorizedAccounts.forEach(({ loginid, token, currency }) => {
        if (loginid && token) {
            accountsList[loginid] = token;
            clientAccounts[loginid] = { loginid, token, currency: currency || '' };
        }
    });

    loginInfo.forEach(({ loginid, token, currency }) => {
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
    cookieAccounts: ClientAccounts,
    clientAccounts: ClientAccounts,
    loginInfo: LoginInfo[]
): Account | LoginInfo => {
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

const authorizeAccounts = async (api: ApiInstance | null, cookieAccounts: ClientAccounts): Promise<LoginInfo[]> => {
    if (!api || Object.keys(cookieAccounts).length === 0) return [];

    const authorizedAccounts: LoginInfo[] = [];

    for (const loginid in cookieAccounts) {
        const { token, currency } = cookieAccounts[loginid];

        if (token) {
            authorizedAccounts.push({
                loginid,
                token,
                currency: currency || '',
            });
        }
    }

    for (const loginid in cookieAccounts) {
        const { token, currency } = cookieAccounts[loginid];

        if (!token) {
            try {
                const { authorize, error } = await api.authorize(token);

                if (!error && authorize?.account_list) {
                    authorizedAccounts.push({
                        loginid,
                        token,
                        currency: currency || authorize.currency || '',
                    });
                }
            } catch (err) {
                console.error(`Authorization failed for ${loginid}:`, err);
            }
        }
    }

    api.disconnect();
    return authorizedAccounts;
};

const setLocalStorageToken = async (loginInfo: LoginInfo[], paramsToDelete: string[]): Promise<void> => {
    const cookieAccounts = getCookieAccounts();
    const hasValidLoginInfo = loginInfo.length > 0 && loginInfo.some(acc => acc.token);
    const hasValidCookie = Object.keys(cookieAccounts).length > 0;

    if (!hasValidLoginInfo && !hasValidCookie) return;

    try {
        const api = await generateDerivApiInstance();
        let authorizedAccounts: LoginInfo[] = [];

        if (api && hasValidCookie) {
            authorizedAccounts = await authorizeAccounts(api, cookieAccounts);
        }

        const clientAccounts = storeAccountsToLocalStorage(cookieAccounts, loginInfo, authorizedAccounts);

        let activeAccount = getActiveAccount(cookieAccounts, clientAccounts, loginInfo);

        if (api && !activeAccount) {
            const authorizedAccount = authorizedAccounts[0];
            if (authorizedAccount) {
                activeAccount = authorizedAccount;
                localStorage.setItem('authToken', activeAccount.token);
                localStorage.setItem('active_loginid', activeAccount.loginid);
            }
        }

        if (activeAccount) {
            localStorage.setItem('authToken', activeAccount.token);
            localStorage.setItem('active_loginid', activeAccount.loginid);
        }

        URLUtils.filterSearchParams(paramsToDelete);
    } catch (error) {
        console.error('Error setting up login info:', error);
    }
};

export const AuthWrapper = () => {
    const [isAuthComplete, setIsAuthComplete] = React.useState(false);
    const { loginInfo, paramsToDelete } = URLUtils.getLoginInfoFromURL();

    React.useEffect(() => {
        const initializeAuth = async () => {
            await setLocalStorageToken(loginInfo, paramsToDelete);
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
