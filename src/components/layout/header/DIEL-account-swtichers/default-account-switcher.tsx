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
};
const DefaultAccountSwitcher = ({ isVirtual, tabs_labels, account_list, switchAccount }: TSwitcherContent) => (
    <UIAccountSwitcher.AccountsPanel
        isOpen
        title={localize('Deriv accounts')}
        className='account-switcher-panel'
        key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
    >
        {account_list
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
                    />
                </span>
            ))}
    </UIAccountSwitcher.AccountsPanel>
);

export default DefaultAccountSwitcher;
