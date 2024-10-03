import { ComponentProps, ReactNode } from 'react';
import useThemeSwitcher from '@/hooks/useThemeSwitcher';
import { ACCOUNT_LIMITS, HELP_CENTRE, RESPONSIBLE } from '@/utils/constants';
import {
    LegacyAccountLimitsIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
    LegacyLiveChatOutlineIcon,
    LegacyLogout1pxIcon,
    LegacyProfileSmIcon,
    LegacyResponsibleTradingIcon,
    LegacyTheme1pxIcon,
    LegacyWhatsappIcon,
} from '@deriv/quill-icons/Legacy';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons/Logo';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { ToggleSwitch } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

export type TSubmenuSection = 'accountSettings' | 'cashier';

//IconTypes
type TMenuConfig = {
    LeftComponent: any;
    RightComponent?: ReactNode;
    as: 'a' | 'button';
    href?: string;
    label: string;
    onClick?: () => void;
    removeBorderBottom?: boolean;
    submenu?: TSubmenuSection;
    target?: ComponentProps<'a'>['target'];
}[];

const useMobileMenuConfig = () => {
    const { localize } = useTranslations();
    const { logout } = useAuthData();
    const { is_dark_mode_on, toggleTheme } = useThemeSwitcher();

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
            {
                as: 'button',
                label: localize('Dark theme'),
                LeftComponent: LegacyTheme1pxIcon,
                RightComponent: <ToggleSwitch value={is_dark_mode_on} onChange={toggleTheme} />,
            },
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
            {
                as: 'button',
                label: localize('Live chat'),
                LeftComponent: LegacyLiveChatOutlineIcon,
            },
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

    return {
        config: menuConfig,
    };
};

export default useMobileMenuConfig;
