import { useMemo } from 'react';
import React from 'react';
import classNames from 'classnames';
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
import { LegacyDerivIcon, LegacyLogout1pxIcon } from '@deriv/quill-icons/Legacy';
import { Localize, localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher, Button, Divider, Text } from '@deriv-com/ui';

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
    modifiedCRAccountList?: TModifiedAccount[];
    modifiedMFAccountList?: TModifiedAccount[];
    activeLoginId?: string;
};

type TAccountSwitcher = {
    activeAccount: ReturnType<typeof useActiveAccount>['data'];
};

const tabs_labels = {
    demo: localize('Demo'),
    real: localize('Real'),
};

const no_account = {
    currency: ' ',
    currencyLabel: 'Options & Multipliers',
    is_virtual: 1,
    loginid: '',
    is_disabled: false,
    balance: '',
    icon: <LegacyDerivIcon width={24} height={24} />,
    isActive: false,
    isVirtual: true,
};

const NoEuAccounts = ({ isVirtual, tabs_labels }) => {
    return (
        <UIAccountSwitcher.AccountsPanel
            isOpen
            title={localize('Non-Eu Deriv Accounts')}
            className='account-switcher-panel'
            key={!isVirtual ? tabs_labels?.demo?.toLowerCase() : tabs_labels?.real?.toLowerCase()}
        >
            <div className='account-switcher-panel__no-eu-accounts'>
                <UIAccountSwitcher.AccountsItem account={no_account} onSelectAccount={() => {}} />
                <Button
                    id='add-button'
                    className='add-button'
                    onClick={() => location.replace(standalone_routes.traders_hub)}
                >
                    <Localize i18n_default_text='Add' />
                </Button>
            </div>
        </UIAccountSwitcher.AccountsPanel>
    );
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

    const show_manage_button = client?.loginid?.includes('CR') || client?.loginid?.includes('MF');

    const account_switcher_title_non_eu =
        modifiedMFAccountList?.length === 0 ? localize('Deriv accounts') : localize('Non-Eu Deriv accounts');
    const account_switcher_title_eu = modifiedMFAccountList
        ? localize('Eu Deriv accounts')
        : localize('Deriv accounts');
    const { oAuthLogout } = useOauth2({ handleLogout: async () => client.logout() });

    if (isVirtual) {
        return (
            <>
                <UIAccountSwitcher.AccountsPanel
                    isOpen
                    title={localize('Deriv accounts')}
                    className='account-switcher-panel'
                    key={tabs_labels.demo.toLowerCase()}
                >
                    {modifiedAccountList
                        ?.filter(account => account.is_virtual)
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
                                        isVirtual &&
                                        activeLoginId === account.loginid &&
                                        Number(account.balance) !== 10000
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
                        <></>
                        <div id='dt_logout_button' className='deriv-account-switcher__logout' onClick={oAuthLogout}>
                            <Text
                                color='prominent'
                                size='xs'
                                align='left'
                                className='deriv-account-switcher__logout-text'
                            >
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
    }

    return (
        <>
            {!isVirtual && modifiedCRAccountList?.length > 0 ? (
                <UIAccountSwitcher.AccountsPanel
                    isOpen
                    title={account_switcher_title_non_eu}
                    className='account-switcher-panel'
                    style={{ maxHeight: '220px' }}
                    key={!isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels?.real.toLowerCase()}
                >
                    {modifiedCRAccountList.map(account => (
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
                            />
                        </span>
                    ))}
                </UIAccountSwitcher.AccountsPanel>
            ) : (
                <NoEuAccounts isVirtual={isVirtual} tabs_labels={tabs_labels} />
            )}
            {!isVirtual && modifiedMFAccountList?.length > 0 && (
                <UIAccountSwitcher.AccountsPanel
                    isOpen
                    title={account_switcher_title_eu}
                    className='account-switcher-panel'
                    key={!isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
                >
                    {modifiedMFAccountList.map(account => (
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
                            />
                        </span>
                    ))}
                </UIAccountSwitcher.AccountsPanel>
            )}
            <Divider color='var(--du-general-active)' height='2px' />
            <div className=''>
                <UIAccountSwitcher.TradersHubLink href={standalone_routes.traders_hub}>
                    {localize(`Looking for CFD accounts? Go to Trader's Hub`)}
                </UIAccountSwitcher.TradersHubLink>
                <Divider color='var(--du-general-active)' height='2px' />
                <div
                    className={classNames('account-switcher-footer__actions', {
                        'account-switcher-footer__actions--hide-manage-button': !show_manage_button,
                    })}
                >
                    {show_manage_button && (
                        <Button
                            id='manage-button'
                            className='manage-button'
                            onClick={() => location.replace(standalone_routes.traders_hub)}
                        >
                            <Localize i18n_default_text='Manage account' />
                        </Button>
                    )}
                    <UIAccountSwitcher.Footer>
                        <div
                            id='dt_logout_button'
                            className='deriv-account-switcher__logout'
                            onClick={async () => {
                                await oAuthLogout();
                            }}
                        >
                            <Text
                                color='prominent'
                                size='xs'
                                align='left'
                                className='deriv-account-switcher__logout-text'
                            >
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
            </div>
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
    const modifiedCRAccountList = useMemo(() => {
        return modifiedAccountList?.filter(account => account?.loginid?.includes('CR'));
    }, [modifiedAccountList]);

    const modifiedMFAccountList = useMemo(() => {
        return modifiedAccountList?.filter(account => account?.loginid?.includes('MF'));
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
                    modalContentStyle={{
                        content: {
                            top: '30%',
                            borderRadius: '10px',
                        },
                    }}
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
