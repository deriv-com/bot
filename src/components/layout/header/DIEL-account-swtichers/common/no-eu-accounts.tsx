import React from 'react';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { no_account } from './utils';

type TNoEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
};

const NoEuAccounts = ({ isVirtual, tabs_labels }: TNoEuAccounts) => {
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
