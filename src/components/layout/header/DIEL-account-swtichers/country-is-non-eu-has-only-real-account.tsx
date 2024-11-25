import React from 'react';
import DemoAccount from './common/demo-account';
import NoNonEuAccounts from './common/no-non-eu-accounts';
import NonEuAccounts from './common/non-eu-accounts';
import { TSwitcherContent } from './common/utils';

const RenderCountryIsNonEuHasOnlyRealAccount = ({
    switchAccount,
    account_switcher_data,
    isVirtual,
    tabs_labels,
    account_list,
}: TSwitcherContent) => {
    const { non_eu_accounts } = account_switcher_data.current;

    return (
        <>
            {!isVirtual ? (
                <>
                    {non_eu_accounts.length > 0 ? (
                        <NonEuAccounts
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            non_eu_accounts={non_eu_accounts}
                        />
                    ) : (
                        <NoNonEuAccounts isVirtual={isVirtual} tabs_labels={tabs_labels} />
                    )}
                </>
            ) : (
                <DemoAccount
                    isVirtual={isVirtual}
                    tabs_labels={tabs_labels}
                    account_list={account_list}
                    switchAccount={switchAccount}
                />
            )}
        </>
    );
};

export default RenderCountryIsNonEuHasOnlyRealAccount;
