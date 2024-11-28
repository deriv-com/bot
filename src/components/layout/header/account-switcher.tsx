import { useCallback, useEffect, useMemo, useRef } from 'react';
import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { CurrencyIcon } from '@/components/currency/currency-icon';
import { getDecimalPlaces, standalone_routes } from '@/components/shared';
import Popover from '@/components/shared_ui/popover';
import { api_base } from '@/external/bot-skeleton';
import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { LegacyLogout1pxIcon } from '@deriv/quill-icons/Legacy';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher, Divider, Text } from '@deriv-com/ui';
import AccountInfoWallets from './wallets/account-info-wallets';
import { checkSwitcherType } from './utils';
import './account-switcher.scss';

type TModifiedAccount = ReturnType<typeof useApiBase>['accountList'][number] & {
    balance: string;
    currencyLabel: string;
    icon: React.ReactNode;
    isVirtual: boolean;
    isActive: boolean;
    loginid: number;
    currency: string;
};

type TAccountSwitcherProps = {
    isVirtual?: boolean;
    modifiedAccountList: TModifiedAccount[];
    switchAccount: (loginId: number) => void;
    activeLoginId?: string;
};

type TAccountSwitcher = {
    activeAccount: ReturnType<typeof useActiveAccount>['data'];
    is_dialog_on: boolean;
    toggleDialog: () => void;
};

const tabs_labels = {
    demo: localize('Demo'),
    real: localize('Real'),
};

interface AccountSwitcherData {
    renderCountryIsLowRiskAndHasNoRealAccount: boolean;
    renderCountryIsEuAndNoRealAccount: boolean;
    renderCountryIsNonEuAndNoRealAccount: boolean;
    renderCountryIsEuHasOnlyRealAccount: boolean;
    renderCountryIsNonEuHasOnlyRealAccount: boolean;
    renderCountryIsLowRiskAndHasRealAccount: boolean;
}

const RenderAccountItems = ({
    isVirtual,
    modifiedAccountList,
    switchAccount,
    activeLoginId,
}: TAccountSwitcherProps) => {
    const { client } = useStore();
    const { landing_companies } = client;

    const account_switcher_data = useRef<AccountSwitcherData | null>(null);

    const fetchAccountSwitcherData = useCallback(async () => {
        if (account_switcher_data.current || !client?.loginid || !modifiedAccountList) return;
        const account_data = {
            login_id: client.loginid,
            modifiedAccountList,
            landing_companies,
            is_virtual: isVirtual,
        };
        const account_info = await checkSwitcherType(account_data);
        account_switcher_data.current = account_info;
    }, [client, modifiedAccountList]);

    const { oAuthLogout } = useOauth2({ handleLogout: async () => client.logout() });

    useEffect(() => {
        fetchAccountSwitcherData();
    }, []);

    return (
        <>
            <UIAccountSwitcher.AccountsPanel
                isOpen
                title={localize('Deriv accounts')}
                className='account-switcher-panel'
                key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
            >
                {modifiedAccountList
                    ?.filter(account => (isVirtual ? account.is_virtual : !account.is_virtual))
                    .map(account => (
                        <span
                            className={clsx('account-switcher__item', {
                                'account-switcher__item--disabled': account.is_disabled,
                            })}
                            key={account.loginid}
                        >
                            <UIAccountSwitcher.AccountsItem
                                account={account}
                                onSelectAccount={() => {
                                    if (!account.is_disabled) switchAccount(account.loginid);
                                }}
                                onResetBalance={
                                    isVirtual && activeLoginId === account.loginid
                                        ? () => {
                                              api_base?.api?.send({
                                                  topup_virtual: 1,
                                              });
                                          }
                                        : undefined
                                }
                            />
                        </span>
                    ))}
            </UIAccountSwitcher.AccountsPanel>

            <Divider color='var(--du-general-active)' height='2px' />

            <div className='account-switcher-footer'>
                <UIAccountSwitcher.TradersHubLink href={standalone_routes.traders_hub}>
                    {localize(`Looking for CFD accounts? Go to Trader's Hub`)}
                </UIAccountSwitcher.TradersHubLink>
                <Divider color='var(--du-general-active)' height='2px' />

                <UIAccountSwitcher.Footer>
                    <div
                        id='dt_logout_button'
                        className='deriv-account-switcher__logout'
                        onClick={async () => {
                            await oAuthLogout();
                        }}
                    >
                        <Text color='prominent' size='xs' align='left' className='deriv-account-switcher__logout-text'>
                            {localize('Log out')}
                        </Text>
                        <LegacyLogout1pxIcon
                            iconSize='xs'
                            fill='var(--text-general)'
                            className='icon-general-fill-path'
                        />
                    </div>
                </UIAccountSwitcher.Footer>
            </div>
        </>
    );
};

const AccountSwitcher = observer(({ activeAccount }: TAccountSwitcher) => {
    const { accountList } = useApiBase();
    const { ui, run_panel, client } = useStore();
    const { accounts } = client;
    const { toggleAccountsDialog, is_accounts_switcher_on, account_switcher_disabled_message } = ui;
    const { is_stop_button_visible } = run_panel;
    const has_wallet = Object.keys(accounts).some(id => accounts[id].account_category === 'wallet');

    const modifiedAccountList = useMemo(() => {
        return accountList?.map(account => {
            return {
                ...account,
                balance:
                    client.all_accounts_balance?.accounts?.[account?.loginid]?.balance?.toFixed(
                        getDecimalPlaces(account.currency)
                    ) ?? '0',
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
        activeAccount &&
        (has_wallet ? (
            <AccountInfoWallets is_dialog_on={is_accounts_switcher_on} toggleDialog={toggleAccountsDialog} />
        ) : (
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
        ))
    );
});

export default AccountSwitcher;
