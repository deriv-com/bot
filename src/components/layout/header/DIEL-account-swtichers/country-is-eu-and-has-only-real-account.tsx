import React from 'react';
import DemoAccount from './common/demo-account';
import EuAccounts from './common/eu-accounts';
import NoNonEuAccounts from './common/no-non-eu-accounts';
import { TSwitcherContent } from './common/types';
import { updateNestedProperty } from './common/utils';

const RenderCountryIsEuHasOnlyRealAccount = ({
    isVirtual,
    tabs_labels,
    account_list,
    switchAccount,
    account_switcher_data,
}: TSwitcherContent) => {
    const { eu_accounts } = account_switcher_data.current;
    const eu_update_account = updateNestedProperty(eu_accounts, 'currencyLabel', 'multiplier');

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
