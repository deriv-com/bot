import { ComponentProps, ReactNode, useMemo } from 'react';
import Livechat from '@/components/chat/Livechat';
import useIsLiveChatWidgetAvailable from '@/components/chat/useIsLiveChatWidgetAvailable';
import { standalone_routes } from '@/components/shared';
import { useFirebaseCountriesConfig } from '@/hooks/firebase/useFirebaseCountriesConfig';
import useRemoteConfig from '@/hooks/growthbook/useRemoteConfig';
import { useIsIntercomAvailable } from '@/hooks/useIntercom';
import useThemeSwitcher from '@/hooks/useThemeSwitcher';
import useTMB from '@/hooks/useTMB';
import RootStore from '@/stores/root-store';
import {
    LegacyAccountLimitsIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
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

    const { data } = useRemoteConfig(true);
    const { cs_chat_whatsapp } = data;

    const { is_livechat_available } = useIsLiveChatWidgetAvailable();
    const icAvailable = useIsIntercomAvailable();

    // Get current account information for dependency tracking
    const is_virtual = client?.is_virtual;
    const currency = client?.getCurrency?.();
    const is_logged_in = client?.is_logged_in;
    const client_residence = client?.residence;
    const accounts = client?.accounts || {};
    const { isTmbEnabled } = useTMB();
    const is_tmb_enabled = window.is_tmb_enabled || isTmbEnabled();

    const { hubEnabledCountryList } = useFirebaseCountriesConfig();

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

    const has_wallet = Object.keys(accounts).some(id => accounts[id].account_category === 'wallet');
    const is_hub_enabled_country = hubEnabledCountryList.includes(client?.residence || '');
    // Determine the appropriate redirect URL based on user's country
    const getRedirectUrl = () => {
        // Check if the user's country is in the hub-enabled country list
        if (has_wallet && is_hub_enabled_country) {
            return getAccountUrl(standalone_routes.account_settings);
        }
        return getAccountUrl(standalone_routes.personal_details);
    };

    const menuConfig = useMemo(
        (): TMenuConfig[] => [
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
                    href: getRedirectUrl(),
                    label: localize('Account Settings'),
                    LeftComponent: LegacyProfileSmIcon,
                },
                !has_wallet &&
                    !is_hub_enabled_country && {
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
            // Logout button removed from mobile interface as per acceptance criteria
            [],
        ],
        [is_virtual, currency, is_logged_in, client_residence, is_tmb_enabled]
    );

    return {
        config: menuConfig,
    };
};

export default useMobileMenuConfig;
