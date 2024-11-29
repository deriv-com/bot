import { useMemo } from 'react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { CurrencyIcon } from '@/components/currency/currency-icon';
import { addComma, getDecimalPlaces } from '@/components/shared';
import Popover from '@/components/shared_ui/popover';
import { api_base } from '@/external/bot-skeleton';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher, Divider } from '@deriv-com/ui';
import AccountSwitcherFooter from './common/account-swticher-footer';
import DemoAccounts from './common/demo-accounts';
import EuAccounts from './common/eu-accounts';
import NoEuAccounts from './common/no-eu-accounts';
import NonEUAccounts from './common/non-eu-accounts';
import { TAccountSwitcher, TAccountSwitcherProps, TModifiedAccount } from './common/types';
import { LOW_RISK_COUNTRIES } from './utils';

const tabs_labels = {
    demo: localize('Demo'),
    real: localize('Real'),
};

const RenderAccountItems = ({
    isVirtual,
    modifiedAccountList,
    modifiedCRAccountList,
    modifiedMFAccountList,
    switchAccount,
    activeLoginId,
}: TAccountSwitcherProps) => {
    const { client } = useStore();
    const { loginid } = client;
    const { oAuthLogout } = useOauth2({ handleLogout: async () => client.logout() });
    const is_low_risk_country = LOW_RISK_COUNTRIES().includes(client.account_settings?.country_code ?? '');

    if (isVirtual) {
        return (
            <>
                <DemoAccounts
                    modifiedAccountList={modifiedAccountList}
                    switchAccount={switchAccount}
                    activeLoginId={activeLoginId}
                    isVirtual={isVirtual}
                    tabs_labels={tabs_labels}
                    oAuthLogout={oAuthLogout}
                />
            </>
        );
    }

    return (
        <>
            {!isVirtual && modifiedCRAccountList && modifiedCRAccountList?.length > 0 ? (
                <NonEUAccounts
                    modifiedCRAccountList={modifiedCRAccountList}
                    modifiedMFAccountList={modifiedMFAccountList}
                    switchAccount={switchAccount}
                    isVirtual={isVirtual}
                    tabs_labels={tabs_labels}
                    is_low_risk_country={is_low_risk_country}
                />
            ) : (
                <NoEuAccounts
                    is_low_risk_country={is_low_risk_country}
                    isVirtual={!!isVirtual}
                    tabs_labels={tabs_labels}
                />
            )}
            <Divider color='var(--general-section-2)' height='4px' />
            {!isVirtual && modifiedMFAccountList && modifiedMFAccountList?.length > 0 && (
                <EuAccounts
                    modifiedMFAccountList={modifiedMFAccountList}
                    switchAccount={switchAccount}
                    tabs_labels={tabs_labels}
                    isVirtual={isVirtual}
                    is_low_risk_country={is_low_risk_country}
                />
            )}
            <Divider color='var(--general-section-2)' height='4px' />
            <AccountSwitcherFooter oAuthLogout={oAuthLogout} loginid={loginid} />
        </>
    );
};

const AccountSwitcher = observer(({ activeAccount }: TAccountSwitcher) => {
    const { accountList } = useApiBase();
    const { ui, run_panel, client } = useStore();
    const { account_switcher_disabled_message } = ui;
    const { is_stop_button_visible } = run_panel;

    const modifiedAccountList = useMemo(() => {
        return accountList?.map(account => {
            return {
                ...account,
                balance: addComma(
                    client.all_accounts_balance?.accounts?.[account?.loginid]?.balance?.toFixed(
                        getDecimalPlaces(account.currency)
                    ) ?? '0'
                ),
                currencyLabel: account?.is_virtual
                    ? tabs_labels.demo
                    : (client.website_status?.currencies_config?.[account?.currency]?.name ?? account?.currency),
                icon: (
                    <CurrencyIcon
                        currency={account?.currency?.toLowerCase()}
                        isVirtual={Boolean(account?.is_virtual)}
                    />
                ),
                isVirtual: Boolean(account?.is_virtual),
                isActive: account?.loginid === activeAccount?.loginid,
            };
        });
    }, [
        accountList,
        client.all_accounts_balance?.accounts,
        client.website_status?.currencies_config,
        activeAccount?.loginid,
    ]);
    const modifiedCRAccountList = useMemo(() => {
        return modifiedAccountList?.filter(account => account?.loginid?.includes('CR')) ?? [];
    }, [modifiedAccountList]);

    const modifiedMFAccountList = useMemo(() => {
        return modifiedAccountList?.filter(account => account?.loginid?.includes('MF')) ?? [];
    }, [modifiedAccountList]);

    const switchAccount = async (loginId: number) => {
        if (loginId.toString() === activeAccount?.loginid) return;
        const account_list = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
        const token = account_list[loginId];
        if (!token) return;
        localStorage.setItem('authToken', token);
        localStorage.setItem('active_loginid', loginId.toString());
        await api_base?.init(true);
    };

    return (
        activeAccount && (
            <Popover
                className='run-panel__info'
                classNameBubble='run-panel__info--bubble'
                alignment='bottom'
                message={account_switcher_disabled_message}
                zIndex='5'
            >
                <UIAccountSwitcher
                    activeAccount={activeAccount}
                    isDisabled={is_stop_button_visible}
                    tabsLabels={tabs_labels}
                >
                    <UIAccountSwitcher.Tab title={tabs_labels.real}>
                        <RenderAccountItems
                            modifiedAccountList={modifiedAccountList as TModifiedAccount[]}
                            modifiedCRAccountList={modifiedCRAccountList as TModifiedAccount[]}
                            modifiedMFAccountList={modifiedMFAccountList as TModifiedAccount[]}
                            switchAccount={switchAccount}
                            activeLoginId={activeAccount?.loginid}
                        />
                    </UIAccountSwitcher.Tab>
                    <UIAccountSwitcher.Tab title={tabs_labels.demo}>
                        <RenderAccountItems
                            modifiedAccountList={modifiedAccountList as TModifiedAccount[]}
                            switchAccount={switchAccount}
                            isVirtual
                            activeLoginId={activeAccount?.loginid}
                        />
                    </UIAccountSwitcher.Tab>
                </UIAccountSwitcher>
            </Popover>
        )
    );
});

export default AccountSwitcher;
