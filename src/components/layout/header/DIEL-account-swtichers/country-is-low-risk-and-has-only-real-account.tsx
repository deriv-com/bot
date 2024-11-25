import React from 'react';
import DemoAccount from './common/demo-account';
import EuAccounts from './common/eu-accounts';
import NoEuAccounts from './common/no-eu-accounts';
import NoNonEuAccounts from './common/no-non-eu-accounts';
import NonEuAccounts from './common/non-eu-accounts';
import { TSwitcherContent, updateNestedProperty } from './common/utils';

const RenderCountryIsLowRiskAndHasOnlyRealAccount = ({
    account_switcher_data,
    isVirtual,
    tabs_labels,
    account_list,
    switchAccount,
}: TSwitcherContent) => {
    const { non_eu_accounts, eu_accounts } = account_switcher_data.current;
    const eu_update_account = updateNestedProperty(eu_accounts, 'currencyLabel', 'multiplier');

    return (
        <>
            {!isVirtual ? (
                <>
                    {non_eu_accounts.length > 0 ? (
                        <NonEuAccounts
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            non_eu_accounts={non_eu_accounts}
                            switchAccount={switchAccount}
                        />
                    ) : (
                        <NoNonEuAccounts isVirtual={isVirtual} tabs_labels={tabs_labels} />
                    )}

                    {eu_update_account.length > 0 ? (
                        <EuAccounts
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            eu_accounts={eu_update_account}
                            switchAccount={switchAccount}
                        />
                    ) : (
                        <NoEuAccounts isVirtual={isVirtual} tabs_labels={tabs_labels} />
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

export default RenderCountryIsLowRiskAndHasOnlyRealAccount;
