import React from 'react';
import clsx from 'clsx';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { TNonEUAccounts } from './types';

const NonEUAccounts = ({
    isVirtual,
    tabs_labels,
    modifiedCRAccountList,
    modifiedMFAccountList,
    is_low_risk_country,
    switchAccount,
}: TNonEUAccounts) => {
    if (!is_low_risk_country && modifiedCRAccountList && modifiedCRAccountList?.length === 0) {
        return null;
    }

    const account_switcher_title_non_eu =
        modifiedMFAccountList?.length === 0 ? localize('Deriv accounts') : localize('Non-Eu Deriv account');
    return (
        <>
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
        </>
    );
};

export default NonEUAccounts;
