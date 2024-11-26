import { ComponentProps, ReactNode } from 'react';
import Livechat from '@/components/chat/Livechat';
import { standalone_routes } from '@/components/shared';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import useRemoteConfig from '@/hooks/growthbook/useRemoteConfig';
import { useStore } from '@/hooks/useStore';
import useThemeSwitcher from '@/hooks/useThemeSwitcher';
import { ACCOUNT_LIMITS, HELP_CENTRE, RESPONSIBLE } from '@/utils/constants';
import {
    LegacyAccountLimitsIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
    LegacyLogout1pxIcon,
    LegacyProfileSmIcon,
    LegacyResponsibleTradingIcon,
    LegacyTheme1pxIcon,
    LegacyWhatsappIcon,
} from '@deriv/quill-icons/Legacy';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons/Logo';
import { useTranslations } from '@deriv-com/translations';
import { ToggleSwitch } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

export type TSubmenuSection = 'accountSettings' | 'cashier';

//IconTypes
type TMenuConfig = {
    LeftComponent: ReactNode | React.ElementType;
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
    const { is_dark_mode_on, toggleTheme } = useThemeSwitcher();
    const { client } = useStore();

    const { oAuthLogout } = useOauth2({ handleLogout: async () => client.logout() });

    const { data } = useRemoteConfig(true);
    const { cs_chat_whatsapp } = data;

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
                href: standalone_routes.trade,
                label: localize('Trade'),
                LeftComponent: LegacyChartsIcon,
            },
            {
                as: 'a',
                href: standalone_routes.personal_details,
                label: localize('Account Settings'),
                LeftComponent: LegacyProfileSmIcon,
            },
            {
                as: 'a',
                href: standalone_routes.cashier_deposit,
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
        (
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
                cs_chat_whatsapp
                    ? {
                          as: 'a',
                          href: URLConstants.whatsApp,
                          label: localize('WhatsApp'),
                          LeftComponent: LegacyWhatsappIcon,
                          target: '_blank',
                      }
                    : null,
                {
                    as: 'button',
                    label: localize('Live chat'),
                    LeftComponent: Livechat,
                    onClick: () => {
                        window.enable_freshworks_live_chat
                            ? window.fcWidget.open()
                            : window.LiveChatWidget?.call('maximize');
                    },
                },
            ] as TMenuConfig
        ).filter(Boolean),
        [
            {
                as: 'button',
                label: localize('Log out'),
                LeftComponent: LegacyLogout1pxIcon,
                onClick: oAuthLogout,
                removeBorderBottom: true,
            },
        ],
    ];

    return {
        config: menuConfig,
    };
};

export default useMobileMenuConfig;
