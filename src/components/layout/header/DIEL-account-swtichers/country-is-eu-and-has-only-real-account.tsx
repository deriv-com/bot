import React from 'react';
import DemoAccount from './common/demo-account';
import EuAccounts from './common/eu-accounts';
import NoNonEuAccounts from './common/no-non-eu-accounts';
import { TSwitcherContent } from './common/types';

const RenderCountryIsEuHasOnlyRealAccount = ({
    isVirtual,
    tabs_labels,
    account_list,
    switchAccount,
    account_switcher_data,
}: TSwitcherContent) => {
    const { eu_accounts } = account_switcher_data.current;
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
    return (
        <>
            {!isVirtual ? (
                <>
                    {eu_update_account.length > 0 ? (
                        <EuAccounts
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            eu_accounts={eu_update_account}
                            switchAccount={switchAccount}
                        />
                    ) : (
                        <NoNonEuAccounts
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                        />
                    )}
                </>
            ) : (
                <>
                    <DemoAccount
                        isVirtual={isVirtual}
                        tabs_labels={tabs_labels}
                        account_list={account_list}
                        switchAccount={switchAccount}
                    />
                </>
            )}
        </>
    );
};

export default RenderCountryIsEuHasOnlyRealAccount;
