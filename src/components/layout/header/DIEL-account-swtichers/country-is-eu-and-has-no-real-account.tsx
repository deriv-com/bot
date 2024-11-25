import React from 'react';
import DemoAccount from './common/demo-account';
import NoEuAccounts from './common/no-eu-accounts';
import { TSwitcherContent } from './common/utils';

const RenderCountryIsEuAndNoRealAccount = ({
    isVirtual,
    tabs_labels,
    account_list,
    switchAccount,
}: TSwitcherContent) => {
    return (
        <>
            {!isVirtual ? (
                <>
                    <NoEuAccounts isVirtual={isVirtual} tabs_labels={tabs_labels} />
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

export default RenderCountryIsEuAndNoRealAccount;
