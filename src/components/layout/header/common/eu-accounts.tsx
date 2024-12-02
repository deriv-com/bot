import React from 'react';
import clsx from 'clsx';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { TEuAccounts } from './types';

const EuAccounts = ({
    isVirtual,
    tabs_labels,
    modifiedMFAccountList,
    switchAccount,
    is_low_risk_country,
}: TEuAccounts) => {
    const account_switcher_title_eu =
        modifiedMFAccountList?.length === 0 || !is_low_risk_country
            ? localize('Deriv accounts')
            : localize('Eu Deriv accounts');
    return (
        <UIAccountSwitcher.AccountsPanel
            isOpen
            title={account_switcher_title_eu}
            className='account-switcher-panel'
            key={!isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
        >
            {modifiedMFAccountList.map(account => {
                account.currencyLabel = localize('Multipliers');
                return (
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
                );
            })}
        </UIAccountSwitcher.AccountsPanel>
    );
};

export default EuAccounts;
