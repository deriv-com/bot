import React, { MutableRefObject } from 'react';
import clsx from 'clsx';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';

type TSwitcherData = {
    renderCountryIsLowRiskAndHasNoRealAccount: boolean;
    renderCountryIsEuAndNoRealAccount: boolean;
    renderCountryIsNonEuAndNoRealAccount: boolean;
    renderCountryIsEuHasOnlyRealAccount: boolean;
    renderCountryIsNonEuHasOnlyRealAccount: boolean;
    renderCountryIsLowRiskAndHasOnlyRealAccount: boolean;
};
type TSwitcherContent = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    account_list: unknown[];
    switchAccount: (loginId: number) => void;
    account_switcher_data: MutableRefObject<TSwitcherData | null>;
};
const RenderCountryIsNonEuHasOnlyRealAccount = ({
    switchAccount,
    account_switcher_data,
    isVirtual,
    tabs_labels,
    account_list,
}: TSwitcherContent) => {
    const { non_eu_accounts = [] } = account_switcher_data;
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
                            title={localize('Non Eu Accounts')}
                            className='account-switcher-panel'
                            key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
                        >
                            {non_eu_accounts.map(account => (
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
                        <UIAccountSwitcher.AccountsPanel
                            isOpen
                            title={localize('Non Eu Accounts')}
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

export default RenderCountryIsNonEuHasOnlyRealAccount;
