import React from 'react';
import clsx from 'clsx';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';

type TSwitcherContent = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    account_list: any[];
    switchAccount: (loginId: number) => void;
    account_switcher_data: any;
};
const RenderCountryIsLowRiskAndHasOnlyRealAccount = ({
    account_switcher_data,
    isVirtual,
    tabs_labels,
    account_list,
    switchAccount,
}: TSwitcherContent) => {
    const { non_eu_accounts, eu_accounts } = account_switcher_data.current;
    let eu_update_account = [...eu_accounts];
    eu_update_account = eu_update_account.map(account => {
        return {
            ...account,
            account: {
                ...account.account,
                currencyLabel: 'Multipliers',
            },
        };
    });
    console.log(eu_update_account);
    const no_account = {
        currency: ' ',
        currencyLabel: 'You have no real accounts',
        is_virtual: 1,
        loginid: '',
        is_disabled: false,
        balance: '',
        icon: ' ',
        isActive: false,
        isVirtual: true,
    };
    return (
        <>
            {!isVirtual ? (
                <>
                    {non_eu_accounts.length > 0 ? (
                        <UIAccountSwitcher.AccountsPanel
                            isOpen
                            title={localize('Non-Eu Deriv accounts')}
                            className='account-switcher-panel'
                            key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
                        >
                            {non_eu_accounts.map(account => (
                                <span
                                    className={clsx('account-switcher__item', {
                                        'account-switcher__item--disabled': account.account.is_disabled,
                                    })}
                                    key={account.account.loginid}
                                >
                                    <UIAccountSwitcher.AccountsItem
                                        account={account.account}
                                        onSelectAccount={() => {
                                            if (!account.account.is_disabled) switchAccount(account.account.loginid);
                                        }}
                                    />
                                </span>
                            ))}
                        </UIAccountSwitcher.AccountsPanel>
                    ) : (
                        <UIAccountSwitcher.AccountsPanel
                            isOpen
                            title={localize('Non Eu Deriv accounts')}
                            className='account-switcher-panel'
                            key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
                        >
                            <UIAccountSwitcher.AccountsItem account={no_account} onSelectAccount={() => {}} />
                        </UIAccountSwitcher.AccountsPanel>
                    )}

                    {eu_update_account.length > 0 ? (
                        <UIAccountSwitcher.AccountsPanel
                            isOpen
                            title={localize('Eu Accounts')}
                            className='account-switcher-panel'
                            key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
                        >
                            {eu_update_account.map(account => (
                                <span
                                    className={clsx('account-switcher__item', {
                                        'account-switcher__item--disabled': account.account.is_disabled,
                                    })}
                                    key={account.account.loginid}
                                >
                                    <UIAccountSwitcher.AccountsItem
                                        account={account.account}
                                        onSelectAccount={() => {
                                            if (!account.account.is_disabled) switchAccount(account.account.loginid);
                                        }}
                                    />
                                </span>
                            ))}
                        </UIAccountSwitcher.AccountsPanel>
                    ) : (
                        <UIAccountSwitcher.AccountsPanel
                            isOpen
                            title={localize('Eu Accounts')}
                            className='account-switcher-panel'
                            key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
                        >
                            <UIAccountSwitcher.AccountsItem account={no_account} onSelectAccount={() => {}} />
                        </UIAccountSwitcher.AccountsPanel>
                    )}
                </>
            ) : (
                <>
                    <UIAccountSwitcher.AccountsPanel
                        isOpen
                        title={localize('Deriv account')}
                        className='account-switcher-panel'
                        key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
                    >
                        {account_list
                            ?.filter(account => account.is_virtual === 1)
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
                                    />
                                </span>
                            ))}
                    </UIAccountSwitcher.AccountsPanel>
                </>
            )}
        </>
    );
};

export default RenderCountryIsLowRiskAndHasOnlyRealAccount;
