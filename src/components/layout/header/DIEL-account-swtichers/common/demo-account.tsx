import React from 'react';
import clsx from 'clsx';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { TDemoAccount } from './utils';

const DemoAccount = ({ isVirtual, tabs_labels, account_list, switchAccount }: TDemoAccount) => {
    return (
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
    );
};

export default DemoAccount;
