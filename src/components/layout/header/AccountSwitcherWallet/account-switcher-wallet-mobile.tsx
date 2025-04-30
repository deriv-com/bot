import React from 'react';
import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import MobileDialog from '@/components/shared_ui/mobile-dialog';
import Text from '@/components/shared_ui/text';
import useGrowthbookGetFeatureValue from '@/hooks/growthbook/useGrowthbookGetFeatureValue';
import { useStore } from '@/hooks/useStore';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { Icon } from '@/utils/tmp/dummy';
import { getWalletUrl, handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { Localize } from '@deriv-com/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import './account-switcher-wallet-mobile.scss';

type TAccountSwitcherWalletMobile = {
    loginid: string;
    is_visible: boolean;
    toggle: (value: boolean) => void;
};

export const AccountSwitcherWalletMobile = observer(({ is_visible, toggle }: TAccountSwitcherWalletMobile) => {
    const { data: wallet_list, has_wallet = false } = useStoreWalletAccountsList() || {};
    const { client } = useStore() ?? {};
    const { featureFlagValue } = useGrowthbookGetFeatureValue<any>({ featureFlag: 'hub_enabled_country_list' });

    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    const handleTradersHubRedirect = () => {
        closeAccountsDialog();

        // Check if the account is a demo account
        const urlParams = new URLSearchParams(window.location.search);
        const account_param = urlParams.get('account');
        const is_virtual = account_param === 'demo' || false;

        // Get the redirect URL from handleTraderHubRedirect
        const redirect_url_str =
            handleTraderHubRedirect('cfds', has_wallet, is_virtual) || standalone_routes.traders_hub;

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

    const handleManageFundsRedirect = () => {
        closeAccountsDialog();

        // Check if the account is a demo account
        const urlParams = new URLSearchParams(window.location.search);
        const account_param = urlParams.get('account');
        const is_virtual = account_param === 'demo' || false;

        // Directly redirect to the wallet page in Trader's Hub if conditions are met
        if (has_wallet) {
            const wallet_url = getWalletUrl();
            window.location.assign(wallet_url);
        } else {
            // Fallback to the default wallet transfer page if conditions are not met
            let redirect_url = new URL(standalone_routes.wallets_transfer);

            // Check if the user's country is in the hub-enabled country list
            const is_hub_enabled_country = featureFlagValue?.hub_enabled_country_list?.includes(client?.residence);
            if (is_hub_enabled_country) {
                redirect_url = new URL(standalone_routes.recent_transactions);
            }

            // Add the account parameter to the URL
            if (is_virtual) {
                // For demo accounts, set the account parameter to 'demo'
                redirect_url.searchParams.set('account', 'demo');
            } else if (account_param) {
                // For real accounts, set the account parameter to the currency
                redirect_url.searchParams.set('account', account_param);
            }

            window.location.assign(redirect_url.toString());
        }
    };

    const footer = (
        <React.Fragment>
            <hr className='account-switcher-wallet-mobile__divider' />
            <button className='account-switcher-wallet-mobile__footer' onClick={handleTradersHubRedirect} type='button'>
                <Text weight='normal' size='xs'>
                    <Localize i18n_default_text='Looking for CFDs? Go to Trader’s Hub' />
                </Text>
                <Icon icon={'IcChevronRightBold'} />
            </button>
        </React.Fragment>
    );

    return (
        <MobileDialog
            portal_element_id='modal_root'
            footer={footer}
            visible={is_visible}
            onClose={closeAccountsDialog}
            has_close_icon
            has_full_height
            title={<Localize i18n_default_text='Options accounts' />}
        >
            <div className='account-switcher-wallet-mobile'>
                <AccountSwitcherWalletList wallets={dtrade_account_wallets} closeAccountsDialog={closeAccountsDialog} />
                <Button
                    className='account-switcher-wallet-mobile__button'
                    has_effect
                    primary
                    large
                    onClick={handleManageFundsRedirect}
                >
                    <Localize i18n_default_text='Manage funds' />
                </Button>
            </div>
        </MobileDialog>
    );
});
