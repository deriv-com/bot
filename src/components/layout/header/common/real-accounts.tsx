import React from 'react';
import AccountSwitcherFooter from './account-swticher-footer';
import EuAccounts from './eu-accounts';
import NoNonEuAccounts from './no-non-eu-accounts';
import NonEUAccounts from './non-eu-accounts';
import { TRealAccounts } from './types';
import { AccountSwitcherDivider } from './utils';

const RealAccounts = ({
    modifiedCRAccountList,
    modifiedMFAccountList,
    switchAccount,
    isVirtual,
    tabs_labels,
    is_low_risk_country,
    oAuthLogout,
    loginid,
    is_logging_out,
}: TRealAccounts) => {
    const hasNonEuAccounts = modifiedCRAccountList && modifiedCRAccountList?.length > 0;
    const hasEuAccounts = modifiedMFAccountList && modifiedMFAccountList?.length > 0;
    return (
        <>
            {hasNonEuAccounts ? (
                <>
                    <NonEUAccounts
                        modifiedCRAccountList={modifiedCRAccountList}
                        modifiedMFAccountList={modifiedMFAccountList}
                        switchAccount={switchAccount}
                        isVirtual={isVirtual}
                        tabs_labels={tabs_labels}
                        is_low_risk_country={is_low_risk_country}
                    />
                    <AccountSwitcherDivider />
                </>
            ) : (
                <>
                    <NoNonEuAccounts
                        is_low_risk_country={is_low_risk_country}
                        isVirtual={isVirtual}
                        tabs_labels={tabs_labels}
                    />
                    <AccountSwitcherDivider />
                </>
            )}
            {hasEuAccounts && (
                <>
                    <EuAccounts
                        modifiedMFAccountList={modifiedMFAccountList}
                        switchAccount={switchAccount}
                        isVirtual={isVirtual}
                        tabs_labels={tabs_labels}
                        is_low_risk_country={is_low_risk_country}
                    />
                    <AccountSwitcherDivider />
                </>
            )}
            <AccountSwitcherFooter oAuthLogout={oAuthLogout} loginid={loginid} is_logging_out={is_logging_out} />
        </>
    );
};

export default RealAccounts;
