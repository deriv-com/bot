import React from 'react';
import clsx from 'clsx';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { TEuAccounts } from './types';

const EuAccounts = ({ isVirtual, tabs_labels, eu_accounts, switchAccount }: TEuAccounts) => {
    return (
        <UIAccountSwitcher.AccountsPanel
            isOpen
            title={localize('Eu Accounts')}
            className='account-switcher-panel'
            key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
        >
            {eu_accounts.map(account => (
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
    );
};

export default EuAccounts;
