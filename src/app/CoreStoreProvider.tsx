import { useCallback, useEffect, useMemo, useRef } from 'react';
import Cookies from 'js-cookie';
import { observer } from 'mobx-react-lite';
import { getDecimalPlaces, toMoment } from '@/components/shared';
import { FORM_ERROR_MESSAGES } from '@/components/shared/constants/form-error-messages';
import { initFormErrorMessages } from '@/components/shared/utils/validation/declarative-validation-rules';
import { api_base } from '@/external/bot-skeleton';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { TLandingCompany, TSocketResponseData } from '@/types/api-types';
import { useTranslations } from '@deriv-com/translations';

const CoreStoreProvider: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
    const { isAuthorizing, isAuthorized, connectionStatus, accountList, activeLoginid } = useApiBase();

    const appInitialization = useRef(false);
    const accountInitialization = useRef(false);
    const timeInterval = useRef<NodeJS.Timeout | null>(null);
    const msg_listener = useRef<{ unsubscribe: () => void } | null>(null);
    const { client, common } = useStore() ?? {};

    const { currentLang } = useTranslations();

    const { oAuthLogout, isOAuth2Enabled } = useOauth2({ handleLogout: async () => client.logout(), client });

    const isLoggedOutCookie = Cookies.get('logged_state') === 'false';

    useEffect(() => {
        if (isLoggedOutCookie && isOAuth2Enabled && client?.is_logged_in) {
            oAuthLogout();
        }
    }, [isLoggedOutCookie, oAuthLogout, isOAuth2Enabled, client?.is_logged_in]);

    const activeAccount = useMemo(
        () => accountList?.find(account => account.loginid === activeLoginid),
        [activeLoginid, accountList]
    );

    useEffect(() => {
        const currentBalanceData = client?.all_accounts_balance?.accounts?.[activeAccount?.loginid ?? ''];
        if (currentBalanceData) {
            client?.setBalance(currentBalanceData.balance.toFixed(getDecimalPlaces(currentBalanceData.currency)));
            client?.setCurrency(currentBalanceData.currency);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccount?.loginid, client?.all_accounts_balance]);

    useEffect(() => {
        if (client && activeAccount) {
            client?.setLoginId(activeLoginid);
            client?.setAccountList(accountList);
            client?.setIsLoggedIn(true);
        }
    }, [accountList, activeAccount, activeLoginid, client]);

    useEffect(() => {
        initFormErrorMessages(FORM_ERROR_MESSAGES());

        return () => {
            if (timeInterval.current) {
                clearInterval(timeInterval.current);
            }
        };
    }, []);

    useEffect(() => {
        if (common && currentLang) {
            common.setCurrentLanguage(currentLang);
        }
    }, [currentLang, common]);

    useEffect(() => {
        if (client && !isAuthorizing && !appInitialization.current) {
            appInitialization.current = true;

            api_base.api?.websiteStatus().then((res: TSocketResponseData<'website_status'>) => {
                client.setWebsiteStatus(res.website_status);
            });

            // Update server time every 10 seconds
            timeInterval.current = setInterval(() => {
                api_base.api
                    ?.time()
                    .then((res: TSocketResponseData<'time'>) => {
                        common.setServerTime(toMoment(res.time), false);
                    })
                    .catch(() => {
                        common.setServerTime(toMoment(Date.now()), true);
                    });
            }, 10000);
        }
    }, [client, common, isAuthorizing]);

    const handleMessages = useCallback(
        async (res: Record<string, unknown>) => {
            if (!res) return;
            const data = res.data as TSocketResponseData<'balance'>;
            const { msg_type, error } = data;

            if (
                error?.code === 'AuthorizationRequired' ||
                error?.code === 'DisabledClient' ||
                error?.code === 'InvalidToken'
            ) {
                await oAuthLogout();
            }

            if (msg_type === 'balance' && data && !error) {
                const balance = data.balance;
                if (balance?.accounts) {
                    client.setAllAccountsBalance(balance);
                } else if (balance?.loginid) {
                    if (!client?.all_accounts_balance?.accounts || !balance?.loginid) return;
                    const accounts = { ...client.all_accounts_balance.accounts };
                    const currentLoggedInBalance = { ...accounts[balance.loginid] };
                    currentLoggedInBalance.balance = balance.balance;

                    const updatedAccounts = {
                        ...client.all_accounts_balance,
                        accounts: {
                            ...client.all_accounts_balance.accounts,
                            [balance.loginid]: currentLoggedInBalance,
                        },
                    };
                    client.setAllAccountsBalance(updatedAccounts);
                }
            }
        },
        [client, oAuthLogout]
    );

    useEffect(() => {
        if (!isAuthorizing && client) {
            const subscription = api_base?.api?.onMessage().subscribe(handleMessages);
            msg_listener.current = { unsubscribe: subscription?.unsubscribe };
        }

        return () => {
            if (msg_listener.current) {
                msg_listener.current.unsubscribe?.();
            }
        };
    }, [connectionStatus, handleMessages, isAuthorizing, isAuthorized, client]);

    useEffect(() => {
        if (!isAuthorizing && isAuthorized && !accountInitialization.current && client) {
            accountInitialization.current = true;
            api_base.api.getSettings().then((settingRes: TSocketResponseData<'get_settings'>) => {
                client?.setAccountSettings(settingRes.get_settings);
                api_base.api
                    .landingCompany({
                        landing_company: settingRes.get_settings?.country_code,
                    })
                    .then((res: TSocketResponseData<'landing_company'>) => {
                        client?.setLandingCompany(res.landing_company as unknown as TLandingCompany);
                    });
            });

            api_base.api.getAccountStatus().then((res: TSocketResponseData<'get_account_status'>) => {
                client?.setAccountStatus(res.get_account_status);
            });
        }
    }, [isAuthorizing, isAuthorized, client]);

    return <>{children}</>;
});

export default CoreStoreProvider;
