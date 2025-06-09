import React from 'react';
import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import Text from '@/components/shared_ui/text';
import ThemedScrollbars from '@/components/shared_ui/themed-scrollbars';
import { useFirebaseCountriesConfig } from '@/hooks/firebase/useFirebaseCountriesConfig';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import './account-switcher-wallet.scss';
import '../wallets/wallet.scss';

type TAccountSwitcherWalletProps = {
    is_visible: boolean;
    toggle: (value?: boolean) => void;
    residence?: string;
};

export const AccountSwitcherWallet = observer(({ is_visible, toggle, residence }: TAccountSwitcherWalletProps) => {
    const { data: wallet_list, has_wallet = false } = useStoreWalletAccountsList() || {};
    const { hubEnabledCountryList } = useFirebaseCountriesConfig();
    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    // We're removing the token check from the account switcher component
    // This check is now handled in the Layout component to avoid triggering
    // OIDC login when opening the account switcher

    const validateClickOutside = (event: MouseEvent) => {
        const checkAllParentNodes = (node: HTMLElement): boolean => {
            if (node?.classList?.contains('acc-info__wallets')) return true;
            const parent = node?.parentNode as HTMLElement;
            if (parent) return checkAllParentNodes(parent);
            return false;
        };

        return is_visible && !checkAllParentNodes(event.target as HTMLElement);
    };

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const handleTradersHubRedirect = async () => {
        closeAccountsDialog();

        // Check if the account is a demo account
        const urlParams = new URLSearchParams(window.location.search);
        const account_param = urlParams.get('account');
        const is_virtual = account_param === 'demo' || false;

        // Get the redirect URL from handleTraderHubRedirect
        const redirectParams = {
            product_type: 'cfds' as const,
            has_wallet,
            is_virtual,
            residence,
            hubEnabledCountryList,
        };
        const redirect_url_str = handleTraderHubRedirect(redirectParams) || standalone_routes.traders_hub;

        // Add the account parameter to the URL
        let final_url = redirect_url_str;
        try {
            const redirect_url = new URL(redirect_url_str);
            if (is_virtual) {
                // For demo accounts, set the account parameter to 'demo'
                redirect_url.searchParams.set('account', 'demo');
            } else if (account_param) {
                // For real accounts, set the account parameter to the currency
                redirect_url.searchParams.set('account', account_param);
            }
            final_url = redirect_url.toString();
        } catch (error) {
            console.error('Error parsing redirect URL:', error);
        }

        window.location.assign(final_url);
    };

    return (
        <div className='account-switcher-wallet' ref={wrapper_ref}>
            <div className='account-switcher-wallet__header'>
                <Text as='h4' weight='bold' size='xs'>
                    <Localize i18n_default_text='Options accounts' />
                </Text>
            </div>
            <ThemedScrollbars height={450}>
                <AccountSwitcherWalletList wallets={dtrade_account_wallets} closeAccountsDialog={closeAccountsDialog} />
            </ThemedScrollbars>
            <button
                className='account-switcher-wallet__looking-for-cfds'
                onClick={handleTradersHubRedirect}
                type='button'
            >
                <Text size='xs' lineHeight='xl' color='prominent'>
                    <Localize i18n_default_text="Looking for CFDs? Go to Trader's Hub" />
                </Text>
                <div data-testid='dt_go_to_arrow' className='account-switcher-wallet__arrow'>
                    <StandaloneChevronDownBoldIcon />
                </div>
            </button>
        </div>
    );
});
