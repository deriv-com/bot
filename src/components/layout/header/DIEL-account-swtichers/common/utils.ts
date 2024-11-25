export const no_account = {
    currency: ' ',
    currencyLabel: 'You have no real accounts',
    is_virtual: 1,
    loginid: '',
    is_disabled: false,
    balance: '',
    icon: ' ',
    isActive: false,
    isVirtual: true,
};

export type TSwitcherData = {
    renderCountryIsLowRiskAndHasNoRealAccount: boolean;
    renderCountryIsEuAndNoRealAccount: boolean;
    renderCountryIsNonEuAndNoRealAccount: boolean;
    renderCountryIsEuHasOnlyRealAccount: boolean;
    renderCountryIsNonEuHasOnlyRealAccount: boolean;
    renderCountryIsLowRiskAndHasOnlyRealAccount: boolean;
};

export type TSwitcherContent = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    account_list: unknown[];
    switchAccount: (loginId: number) => void;
    account_switcher_data: MutableRefObject<TSwitcherData | null>;
};
