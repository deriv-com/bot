import { MutableRefObject } from 'react';

export type TDemoAccount = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    account_list: any[];
    switchAccount: (loginId: number) => void;
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

export type TEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    eu_accounts: any[];
    switchAccount: (loginId: number) => void;
};

export type TNoEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
};

export type TNoNonEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    switchAccount?: (loginId: number) => void;
    non_eu_accounts?: any[];
};

export type TNonEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    non_eu_accounts: any[];
    switchAccount: (loginId: number) => void;
};
