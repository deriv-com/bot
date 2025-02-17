import React from 'react';
import Cookies from 'js-cookie';
import ChunkLoader from '@/components/loader/chunk-loader';
import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import { localize } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import App from './App';

const setLocalStorageToken = async (loginInfo: URLUtils.LoginInfo[], paramsToDelete: string[]) => {
    if (loginInfo.length) {
        try {
            let cookieAccounts = {};
            try {
                cookieAccounts = JSON.parse(Cookies.get('client.accounts') || '{}');
            } catch (error) {
                console.error("Invalid JSON in 'client.accounts' cookie:", error);
            }

            const storedClientAccounts = {
                ...JSON.parse(localStorage.getItem('clientAccounts') || '{}'),
                ...cookieAccounts,
            };

            const storedAccountsList = JSON.parse(localStorage.getItem('accountsList') || '{}');

            Object.values(cookieAccounts).forEach(data => {
                const accountData = data as { loginid?: string; token?: string };
                if (accountData?.loginid && accountData?.token) {
                    storedAccountsList[accountData.loginid] = accountData.token;
                }
            });

            if (!Object.keys(storedAccountsList).length) {
                localStorage.setItem('accountsList', JSON.stringify(storedAccountsList));
            }

            if (!Object.keys(storedClientAccounts).length) {
                localStorage.setItem('clientAccounts', JSON.stringify(storedClientAccounts));
            }

            const defaultActiveAccount = URLUtils.getDefaultActiveAccount(loginInfo);
            if (!defaultActiveAccount) return;

            const accountsList: Record<string, string> = {};
            const clientAccounts: Record<string, { loginid: string; token: string; currency: string }> = {};

            loginInfo.forEach((account: { loginid: string; token: string; currency: string }) => {
                accountsList[account.loginid] = account.token;
                clientAccounts[account.loginid] = account;
            });

            localStorage.setItem('accountsList', JSON.stringify(accountsList));
            console.log('authwrapper', clientAccounts);
            localStorage.setItem('clientAccounts', JSON.stringify(clientAccounts));
            URLUtils.filterSearchParams(paramsToDelete);
            const api = await generateDerivApiInstance();

            if (api) {
                const { authorize, error } = await api.authorize(loginInfo[0].token);
                api.disconnect();
                if (!error) {
                    const firstId = authorize?.account_list[0]?.loginid;
                    const filteredTokens = loginInfo.filter(token => token.loginid === firstId);
                    if (filteredTokens.length) {
                        localStorage.setItem('authToken', filteredTokens[0].token);
                        localStorage.setItem('active_loginid', filteredTokens[0].loginid);
                        return;
                    }
                }
            }

            localStorage.setItem('authToken', loginInfo[0].token);
            localStorage.setItem('active_loginid', loginInfo[0].loginid);
        } catch (error) {
            console.error('Error setting up login info:', error);
        }
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
