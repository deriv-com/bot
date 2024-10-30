import { ReactNode } from 'react';
import {
    LegacyCashierIcon as CashierLogo,
    LegacyHomeNewIcon as TradershubLogo,
    LegacyReportsIcon as ReportsLogo,
} from '@deriv/quill-icons/Legacy';
import {
    DerivProductBrandLightDerivBotLogoWordmarkIcon as DerivBotLogo,
    DerivProductBrandLightDerivTraderLogoWordmarkIcon as DerivTraderLogo,
    PartnersProductBrandLightSmarttraderLogoWordmarkIcon as SmarttraderLogo,
} from '@deriv/quill-icons/Logo';

export type PlatformsConfig = {
    active: boolean;
    buttonIcon: ReactNode;
    description: string;
    href: string;
    icon: ReactNode;
    showInEU: boolean;
};

export type MenuItemsConfig = {
    as: 'a' | 'button';
    href: string;
    icon: ReactNode;
    label: string;
};

export type TAccount = {
    balance: string;
    currency: string;
    icon: React.ReactNode;
    isActive: boolean;
    isEu: boolean;
    isVirtual: boolean;
    loginid: string;
    token: string;
    type: string;
};

export const platformsConfig: PlatformsConfig[] = [
    {
        active: true,
        buttonIcon: <DerivTraderLogo height={25} width={114.97} />,
        description: 'A whole new trading experience on a powerful yet easy to use platform.',
        href: 'https://app.deriv.com',
        icon: <DerivTraderLogo height={32} width={148} />,
        showInEU: true,
    },
    {
        active: false,
        buttonIcon: <DerivBotLogo height={24} width={91} />,
        description: 'Automated trading at your fingertips. No coding needed.',
        href: 'https://app.deriv.com/bot',
        icon: <DerivBotLogo height={32} width={121} />,
        showInEU: false,
    },
    {
        active: false,
        buttonIcon: <SmarttraderLogo height={24} width={115} />,
        description: 'Trade the world’s markets with our popular user-friendly platform.',
        href: 'https://smarttrader.deriv.com/en/trading',
        icon: <SmarttraderLogo height={32} width={153} />,
        showInEU: false,
    },
];

export const TRADERS_HUB_LINK_CONFIG = {
    as: 'a',
    href: 'https://app.deriv.com/appstore/traders-hub',
    icon: <TradershubLogo iconSize='xs' />,
    label: "Trader's Hub",
};

export const MenuItems: MenuItemsConfig[] = [
    {
        as: 'a',
        href: 'https://app.deriv.com/appstore/reports',
        icon: <ReportsLogo iconSize='xs' />,
        label: 'Reports',
    },
    {
        as: 'a',
        href: 'https://app.deriv.com/appstore/cashier',
        icon: <CashierLogo iconSize='xs' />,
        label: 'Cashier',
    },
];
