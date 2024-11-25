import React, { MutableRefObject } from 'react';

export type TAccount = {
    account: {
        account_category: string;
        account_type: string;
        balance: string;
        broker: string;
        created_at: number;
        currency: string;
        currencyLabel: string;
        currency_type: string;
        icon: React.ReactNode;
        isActive: boolean;
        isVirtual: boolean;
        is_disabled: number;
        is_virtual: number;
        landing_company_name: string;
        linked_to: [];
        loginid: string;
    };
};
export type TDemoAccount = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    account_list: TAccount[];
    switchAccount?: (loginId: string) => void;
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
    account_list: TAccount[];
    switchAccount: (loginId: string) => void;
    account_switcher_data?: MutableRefObject<TSwitcherData | null>;
};

export type TEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    eu_accounts?: TAccount;
    switchAccount: (loginId: string) => void;
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
    switchAccount?: (loginId: string) => void;
    non_eu_accounts?: TAccount;
};

export type TNonEuAccounts = {
    isVirtual: boolean;
    tabs_labels: {
        demo: string;
        real: string;
    };
    non_eu_accounts?: TAccount;
    switchAccount?: (loginId: string) => void;
};
