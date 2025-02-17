import React from 'react';
import Cookies from 'js-cookie';
import ChunkLoader from '@/components/loader/chunk-loader';
import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import { localize } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import App from './App';

const setLocalStorageToken = async (loginInfo: URLUtils.LoginInfo[], paramsToDelete: string[]) => {
    if (!loginInfo.length) return;

    try {
        let cookieAccounts: Record<string, { loginid?: string; token?: string; currency?: string }> = {};
        try {
            cookieAccounts = JSON.parse(Cookies.get('client.accounts') || '{}');
        } catch (error) {
            console.error("Invalid JSON in 'client.accounts' cookie:", error);
        }

        const accountsList: Record<string, string> = {};
        const clientAccounts: Record<string, { loginid: string; token: string; currency: string }> = {};

        Object.values(cookieAccounts).forEach(({ loginid, token, currency }) => {
            if (loginid && token) {
                accountsList[loginid] = token;
                clientAccounts[loginid] = { loginid, token, currency: currency || '' };
            }
        });

        localStorage.setItem('accountsList', JSON.stringify(accountsList));
        localStorage.setItem('clientAccounts', JSON.stringify(clientAccounts));

        const queryParams = new URLSearchParams(window.location.search);
        const currencyType = queryParams.get('account') || loginInfo[0].currency;

        const activeAccount =
            Object.values(clientAccounts).find(acc => acc.currency === currencyType) ||
            Object.values(clientAccounts)[0] ||
            loginInfo[0];

        if (activeAccount) {
            localStorage.setItem('authToken', activeAccount.token);
            localStorage.setItem('active_loginid', activeAccount.loginid);
        }

        URLUtils.filterSearchParams(paramsToDelete);
        const api = await generateDerivApiInstance();

        if (api && !activeAccount) {
            const { authorize, error } = await api.authorize(loginInfo[0].token);
            api.disconnect();
            if (!error) {
                const firstId = authorize?.account_list[0]?.loginid;
                const filteredAccount = loginInfo.find(acc => acc.loginid === firstId);
                if (filteredAccount) {
                    localStorage.setItem('authToken', filteredAccount.token);
                    localStorage.setItem('active_loginid', filteredAccount.loginid);
                }
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
