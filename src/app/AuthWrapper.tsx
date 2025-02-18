import React from 'react';
import Cookies from 'js-cookie';
import ChunkLoader from '@/components/loader/chunk-loader';
import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import { localize } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import App from './App';
import { AccountsList, ApiInstance, ClientAccounts, LoginInfo } from './types';

const getCookieAccounts = (): ClientAccounts => {
    try {
        return JSON.parse(Cookies.get('client.accounts') || '{}');
    } catch (error) {
        console.error("Invalid JSON in 'client.accounts' cookie:", error);
        return {};
    }
};

const storeAccountsToLocalStorage = (clientAccounts: ClientAccounts) => {
    const accountsList: AccountsList = Object.fromEntries(
        Object.entries(clientAccounts).map(([loginid, { token }]) => [loginid, token])
    );
    localStorage.setItem('accountsList', JSON.stringify(accountsList));
    localStorage.setItem('clientAccounts', JSON.stringify(clientAccounts));
};

const authorizeAccounts = async (api: ApiInstance, clientAccounts: ClientAccounts): Promise<LoginInfo[]> => {
    if (!api || !Object.keys(clientAccounts).length) return [];

    const authorizedAccounts: LoginInfo[] = [];
    for (const [loginid, { token, currency }] of Object.entries(clientAccounts)) {
        if (token) {
            try {
                const { authorize, error } = await api.authorize(token);
                if (!error) {
                    authorize?.account_list.forEach(({ loginid }) => {
                        authorizedAccounts.push({
                            loginid,
                            token,
                            currency,
                        });
                    });
                }
            } catch (err) {
                console.error(`Authorization failed for ${loginid}:`, err);
            }
        }
    }
    return authorizedAccounts;
};

const setLocalStorageToken = async (loginInfo: LoginInfo[], paramsToDelete: string[]): Promise<LoginInfo[] | void> => {
    const cookieAccounts = getCookieAccounts();
    if (!loginInfo.length && !Object.keys(cookieAccounts).length) return;

    const api = await generateDerivApiInstance();
    if (!api) return;

    try {
        const authorizedAccounts = await authorizeAccounts(api, {
            ...cookieAccounts,
            ...Object.fromEntries(loginInfo.map(acc => [acc.loginid, acc])),
        });
        const clientAccounts = {
            ...cookieAccounts,
            ...Object.fromEntries(authorizedAccounts.map(acc => [acc.loginid, acc])),
        };
        storeAccountsToLocalStorage(clientAccounts);

        const activeAccount = Object.values(clientAccounts)[0] || loginInfo[0];
        if (activeAccount) {
            localStorage.setItem('authToken', activeAccount.token);
            localStorage.setItem('active_loginid', activeAccount.loginid);
        }

        URLUtils.filterSearchParams(paramsToDelete);
    } catch (error) {
        console.error('Error setting up login info:', error);
    } finally {
        api.disconnect();
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
