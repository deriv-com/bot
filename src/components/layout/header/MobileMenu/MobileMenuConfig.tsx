import { ComponentProps, ReactNode } from 'react';
import { ACCOUNT_LIMITS, HELP_CENTRE, RESPONSIBLE } from '@/utils/constants';
import {
    BrandDerivLogoCoralIcon,
    IconTypes,
    LegacyAccountLimitsIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
    LegacyLogout1pxIcon,
    LegacyProfileSmIcon,
    LegacyResponsibleTradingIcon,
    LegacyWhatsappIcon,
} from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { URLConstants } from '@deriv-com/utils';

export type TSubmenuSection = 'accountSettings' | 'cashier';

type TMenuConfig = {
    LeftComponent: IconTypes;
    RightComponent?: ReactNode;
    as: 'a' | 'button';
    href?: string;
    label: string;
    onClick?: () => void;
    removeBorderBottom?: boolean;
    submenu?: TSubmenuSection;
    target?: ComponentProps<'a'>['target'];
}[];

export const MobileMenuConfig = () => {
    const { localize } = useTranslations();
    const { logout } = useAuthData();

    const menuConfig: TMenuConfig[] = [
        [
            {
                as: 'a',
                href: URLConstants.derivComProduction,
                label: localize('Deriv.com'),
                LeftComponent: BrandDerivLogoCoralIcon,
            },
            {
                as: 'a',
                href: URLConstants.derivAppProduction,
                label: localize("Trader's Hub"),
                LeftComponent: LegacyHomeOldIcon,
            },
            {
                as: 'a',
                href: `${URLConstants.derivAppProduction}/dtrader`,
                label: localize('Trade'),
                LeftComponent: LegacyChartsIcon,
            },
            {
                as: 'a',
                href: `${URLConstants.derivAppProduction}/account/personal-details`,
                label: localize('Account Settings'),
                LeftComponent: LegacyProfileSmIcon,
            },
            {
                as: 'a',
                href: `${URLConstants.derivAppProduction}/cashier/deposit`,
                label: localize('Cashier'),
                LeftComponent: LegacyCashierIcon,
            },
            // TODO add theme logic
            // {
            //     as: 'button',
            //     label: localize('Dark theme'),
            //     LeftComponent: LegacyTheme1pxIcon,
            //     RightComponent: <ToggleSwitch />,
            // },
        ],
        [
            {
                as: 'a',
                href: HELP_CENTRE,
                label: localize('Help center'),
                LeftComponent: LegacyHelpCentreIcon,
            },
            {
                as: 'a',
                href: ACCOUNT_LIMITS,
                label: localize('Account limits'),
                LeftComponent: LegacyAccountLimitsIcon,
            },
            {
                as: 'a',
                href: RESPONSIBLE,
                label: localize('Responsible trading'),
                LeftComponent: LegacyResponsibleTradingIcon,
            },
            {
                as: 'a',
                href: URLConstants.whatsApp,
                label: localize('WhatsApp'),
                LeftComponent: LegacyWhatsappIcon,
                target: '_blank',
            },
            // TODO add livechat logic
            // {
            //     as: 'button',
            //     label: localize('Live chat'),
            //     LeftComponent: LegacyLiveChatOutlineIcon,
            // },
        ],
        [
            {
                as: 'button',
                label: localize('Log out'),
                LeftComponent: LegacyLogout1pxIcon,
                onClick: logout,
                removeBorderBottom: true,
            },
        ],
    ];

    return menuConfig;
};
