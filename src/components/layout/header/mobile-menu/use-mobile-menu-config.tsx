import { ComponentProps, ReactNode } from 'react';
import Livechat from '@/components/chat/Livechat';
import useIsLiveChatWidgetAvailable from '@/components/chat/useIsLiveChatWidgetAvailable';
import { standalone_routes } from '@/components/shared';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import useRemoteConfig from '@/hooks/growthbook/useRemoteConfig';
import { useIsIntercomAvailable } from '@/hooks/useIntercom';
import useThemeSwitcher from '@/hooks/useThemeSwitcher';
import RootStore from '@/stores/root-store';
import {
    LegacyAccountLimitsIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
    LegacyLogout1pxIcon,
    LegacyProfileSmIcon,
    LegacyReportsIcon,
    LegacyResponsibleTradingIcon,
    LegacyTheme1pxIcon,
    LegacyWhatsappIcon,
} from '@deriv/quill-icons/Legacy';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons/Logo';
import { useTranslations } from '@deriv-com/translations';
import { ToggleSwitch } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

export type TSubmenuSection = 'accountSettings' | 'cashier' | 'reports';

//IconTypes
type TMenuConfig = {
    LeftComponent: React.ElementType;
    RightComponent?: ReactNode;
    as: 'a' | 'button';
    href?: string;
    label: ReactNode;
    onClick?: () => void;
    removeBorderBottom?: boolean;
    submenu?: TSubmenuSection;
    target?: ComponentProps<'a'>['target'];
    isActive?: boolean;
}[];

const useMobileMenuConfig = (client?: RootStore['client']) => {
    const { localize } = useTranslations();
    const { is_dark_mode_on, toggleTheme } = useThemeSwitcher();

    const { oAuthLogout } = useOauth2({ handleLogout: async () => client?.logout(), client });

    const { data } = useRemoteConfig(true);
    const { cs_chat_whatsapp } = data;

    const { is_livechat_available } = useIsLiveChatWidgetAvailable();
    const icAvailable = useIsIntercomAvailable();

    // Function to add account parameter to URLs
    const getAccountUrl = (url: string) => {
        try {
            const redirect_url = new URL(url);
            // Check if the account is a demo account
            // Use the URL parameter to determine if it's a demo account, as this will update when the account changes
            const urlParams = new URLSearchParams(window.location.search);
            const account_param = urlParams.get('account');
            const is_virtual = client?.is_virtual || account_param === 'demo';
            const currency = client?.getCurrency?.();

            if (is_virtual) {
                // For demo accounts, set the account parameter to 'demo'
                redirect_url.searchParams.set('account', 'demo');
            } else if (currency) {
                // For real accounts, set the account parameter to the currency
                redirect_url.searchParams.set('account', currency);
            }

            return redirect_url.toString();
        } catch (error) {
            return url;
        }
    };

    const menuConfig: TMenuConfig[] = [
        [
            {
                as: 'a',
                href: standalone_routes.deriv_com,
                label: localize('Deriv.com'),
                LeftComponent: BrandDerivLogoCoralIcon,
            },
            {
                as: 'a',
                href: standalone_routes.deriv_app,
                label: localize("Trader's Hub"),
                LeftComponent: LegacyHomeOldIcon,
            },
            {
                as: 'a',
                href: standalone_routes.bot,
                label: localize('Trade'),
                LeftComponent: LegacyChartsIcon,
                isActive: true, // Always highlight Trade as active
            },
            {
                as: 'a',
                href: getAccountUrl(standalone_routes.personal_details),
                label: localize('Account Settings'),
                LeftComponent: LegacyProfileSmIcon,
            },
            {
                as: 'a',
                href: standalone_routes.cashier_deposit,
                label: localize('Cashier'),
                LeftComponent: LegacyCashierIcon,
            },
            client?.is_logged_in && {
                as: 'button',
                label: localize('Reports'),
                LeftComponent: LegacyReportsIcon,
                submenu: 'reports',
                onClick: () => {},
            },
            {
                as: 'button',
                label: localize('Dark theme'),
                LeftComponent: LegacyTheme1pxIcon,
                RightComponent: <ToggleSwitch value={is_dark_mode_on} onChange={toggleTheme} />,
            },
        ].filter(Boolean) as TMenuConfig,
        [
            {
                as: 'a',
                href: standalone_routes.help_center,
                label: localize('Help center'),
                LeftComponent: LegacyHelpCentreIcon,
            },
            {
                as: 'a',
                href: standalone_routes.account_limits,
                label: localize('Account limits'),
                LeftComponent: LegacyAccountLimitsIcon,
            },
            {
                as: 'a',
                href: standalone_routes.responsible,
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
            is_livechat_available || icAvailable
                ? {
                      as: 'button',
                      label: localize('Live chat'),
                      LeftComponent: Livechat,
                      onClick: () => {
                          icAvailable ? window.Intercom('show') : window.LiveChatWidget?.call('maximize');
                      },
                  }
                : null,
        ].filter(Boolean) as TMenuConfig,
        client?.is_logged_in
            ? [
                  {
                      as: 'button',
                      label: localize('Log out'),
                      LeftComponent: LegacyLogout1pxIcon,
                      onClick: oAuthLogout,
                      removeBorderBottom: true,
                  },
              ]
            : [],
    ];

    return {
        config: menuConfig,
    };
};

export default useMobileMenuConfig;
