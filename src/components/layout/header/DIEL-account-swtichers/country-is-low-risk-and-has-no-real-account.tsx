import DemoAccount from './common/demo-account';
import NoNonEuAccounts from './common/no-non-eu-accounts';
import { TSwitcherContent } from './common/utils';
const RenderCountryIsLowRiskAndHasNoRealAccount = ({
    isVirtual,
    tabs_labels,
    account_list,
    switchAccount,
}: TSwitcherContent) => {
    return (
        <>
            {!isVirtual ? (
                <>
                    <NoNonEuAccounts isVirtual={isVirtual} tabs_labels={tabs_labels} switchAccount={switchAccount} />
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

export default RenderCountryIsLowRiskAndHasNoRealAccount;
