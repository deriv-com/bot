import { standalone_routes } from '@/components/shared';
import { useFirebaseCountriesConfig } from '@/hooks/firebase/useFirebaseCountriesConfig';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { Localize, localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher, Button } from '@deriv-com/ui';
import { TNoNonEuAccounts } from './types';
import { AccountSwitcherDivider, no_account } from './utils';

type TNoNonEuAccountsWithResidence = TNoNonEuAccounts & {
    residence?: string;
};

const NoNonEuAccounts = ({ isVirtual, tabs_labels, is_low_risk_country, residence }: TNoNonEuAccountsWithResidence) => {
    const { has_wallet = false } = useStoreWalletAccountsList() || {};
    const { hubEnabledCountryList } = useFirebaseCountriesConfig();

    // Check if the account is a demo account from both isVirtual prop and URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');
    const is_demo = isVirtual || account_param === 'demo' || false;

    if (!is_low_risk_country) {
        return null;
    }
    return (
        <UIAccountSwitcher.AccountsPanel
            isOpen
            title={localize('Non-Eu Deriv account')}
            className='account-switcher-panel'
            key={!isVirtual ? tabs_labels?.demo?.toLowerCase() : tabs_labels?.real?.toLowerCase()}
        >
            <div className='account-switcher-panel__no-eu-accounts'>
                <UIAccountSwitcher.AccountsItem account={no_account} onSelectAccount={() => {}} />
                <AccountSwitcherDivider />
                <Button
                    id='add-button'
                    className='add-button'
                    onClick={() => {
                        // Get the redirect URL from handleTraderHubRedirect
                        const redirectParams = {
                            product_type: 'tradershub' as const,
                            has_wallet,
                            is_virtual: is_demo,
                            residence,
                            hubEnabledCountryList,
                        };
                        let redirect_url_str = handleTraderHubRedirect(redirectParams) || standalone_routes.traders_hub;

                        // Add the account parameter to the URL
                        try {
                            const redirect_url = new URL(redirect_url_str);
                            if (is_demo) {
                                // For demo accounts, set the account parameter to 'demo'
                                redirect_url.searchParams.set('account', 'demo');
                            }
                            redirect_url_str = redirect_url.toString();
                        } catch (error) {
                            console.error('Error parsing redirect URL:', error);
                        }

                        location.replace(redirect_url_str);
                    }}
                >
                    <Localize i18n_default_text='Add' />
                </Button>
            </div>
        </UIAccountSwitcher.AccountsPanel>
    );
};

export default NoNonEuAccounts;
