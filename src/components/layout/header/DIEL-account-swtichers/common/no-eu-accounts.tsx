import React from 'react';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';

type TNoEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
};

const NoEuAccounts = ({ isVirtual, tabs_labels }: TNoEuAccounts) => {
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
        <UIAccountSwitcher.AccountsPanel
            isOpen
            title={localize('Eu Accounts')}
            className='account-switcher-panel'
            key={isVirtual ? tabs_labels.demo.toLowerCase() : tabs_labels.real.toLowerCase()}
        >
            <UIAccountSwitcher.AccountsItem account={no_account} onSelectAccount={() => {}} />
        </UIAccountSwitcher.AccountsPanel>
    );
};

export default NoEuAccounts;
