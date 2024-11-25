import React, { forwardRef, MutableRefObject } from 'react';
import { api_base } from '@/external/bot-skeleton';
import RenderCountryIsEuAndNoRealAccount from './DIEL-account-swtichers/country-is-eu-and-has-no-real-account';
import RenderCountryIsEuHasOnlyRealAccount from './DIEL-account-swtichers/country-is-eu-and-has-only-real-account';
import RenderCountryIsLowRiskAndHasNoRealAccount from './DIEL-account-swtichers/country-is-low-risk-and-has-no-real-account';
import RenderCountryIsLowRiskAndHasOnlyRealAccount from './DIEL-account-swtichers/country-is-low-risk-and-has-only-real-account';
import RenderCountryIsNonEuAndNoRealAccount from './DIEL-account-swtichers/country-is-non-eu-has-no-real-account';
import RenderCountryIsNonEuHasOnlyRealAccount from './DIEL-account-swtichers/country-is-non-eu-has-only-real-account';
import DefaultAccountSwitcher from './DIEL-account-swtichers/default-account-switcher';

type TAccountSwitcherContent = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    account_list: unknown[];
    ref: MutableRefObject<TSwitcherData | null>;
};

type TSwitcherData = {
    renderCountryIsLowRiskAndHasNoRealAccount: boolean;
    renderCountryIsEuAndNoRealAccount: boolean;
    renderCountryIsNonEuAndNoRealAccount: boolean;
    renderCountryIsEuHasOnlyRealAccount: boolean;
    renderCountryIsNonEuHasOnlyRealAccount: boolean;
    renderCountryIsLowRiskAndHasOnlyRealAccount: boolean;
};

const AccountSwitcherContent = forwardRef<MutableRefObject<TSwitcherData | null>, TAccountSwitcherContent>(
    ({ isVirtual, tabs_labels, account_list }, account_switcher_data) => {
        const switchAccount = async (loginId: number) => {
            const account_list = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
            const token = account_list[loginId];
            if (!token) return;
            localStorage.setItem('authToken', token);
            localStorage.setItem('active_loginid', loginId.toString());
            await api_base?.init(true);
        };

        const SwitcherContent = (account_switcher_data: MutableRefObject<TSwitcherData | null>) => {
            const has_account_data = account_switcher_data.current !== null;

            switch (has_account_data) {
                case account_switcher_data.current?.renderCountryIsLowRiskAndHasNoRealAccount:
                    return (
                        <RenderCountryIsLowRiskAndHasNoRealAccount
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            account_list={account_list}
                        />
                    );
                case account_switcher_data.current?.renderCountryIsLowRiskAndHasOnlyRealAccount:
                    return (
                        <RenderCountryIsLowRiskAndHasOnlyRealAccount
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            account_list={account_list}
                            account_switcher_data={account_switcher_data}
                        />
                    );
                case account_switcher_data.current?.renderCountryIsEuAndNoRealAccount:
                    return (
                        <RenderCountryIsEuAndNoRealAccount
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            account_list={account_list}
                        />
                    );
                case account_switcher_data.current?.renderCountryIsEuHasOnlyRealAccount:
                    return (
                        <RenderCountryIsEuHasOnlyRealAccount
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            account_list={account_list}
                            account_switcher_data={account_switcher_data}
                        />
                    );
                case account_switcher_data.current?.renderCountryIsNonEuAndNoRealAccount:
                    return (
                        <RenderCountryIsNonEuAndNoRealAccount
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            account_list={account_list}
                        />
                    );
                case account_switcher_data.current?.renderCountryIsNonEuHasOnlyRealAccount:
                    return (
                        <RenderCountryIsNonEuHasOnlyRealAccount
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            account_list={account_list}
                            account_switcher_data={account_switcher_data}
                        />
                    );
                default:
                    return (
                        <DefaultAccountSwitcher
                            isVirtual={isVirtual}
                            tabs_labels={tabs_labels}
                            switchAccount={switchAccount}
                            account_list={account_list}
                        />
                    );
            }
        };

        return SwitcherContent(account_switcher_data as MutableRefObject<TSwitcherData | null>);
    }
);

AccountSwitcherContent.displayName = 'AccountSwitcherContent';
export default AccountSwitcherContent;
