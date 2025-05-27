import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import { useFirebaseCountriesConfig } from '@/hooks/firebase/useFirebaseCountriesConfig';
import { useStore } from '@/hooks/useStore';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { useTranslations } from '@deriv-com/translations';
import { PlatformSwitcher as UIPlatformSwitcher, PlatformSwitcherItem } from '@deriv-com/ui';
import { platformsConfig } from '../header-config';
import './platform-switcher.scss';

const PlatformSwitcher = observer(() => {
    const { localize } = useTranslations();
    const { has_wallet = false } = useStoreWalletAccountsList() || {};
    const { hubEnabledCountryList } = useFirebaseCountriesConfig();
    const store = useStore();

    // Get the URL parameters to check if it's a demo account
    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');

    // Check if the account is a demo account from both client store and URL parameter
    const client = store?.client ?? {};
    const is_virtual = client.is_virtual || account_param === 'demo' || false;

    // Get the redirect URL from handleTraderHubRedirect
    const redirectParams = {
        product_type: 'cfds' as const,
        has_wallet,
        is_virtual,
        residence: client.residence,
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
        } else if (client.currency) {
            // For real accounts, set the account parameter to the currency
            redirect_url.searchParams.set('account', client.currency);
        }
        final_url = redirect_url.toString();
    } catch (error) {
        console.error('Error parsing redirect URL:', error);
    }
    return (
        <UIPlatformSwitcher
            bottomLinkLabel={localize("Looking for CFDs? Go to Trader's Hub")}
            buttonProps={{
                icon: platformsConfig[1].buttonIcon,
            }}
            bottomLinkProps={{
                href: final_url,
            }}
        >
            {platformsConfig.map(({ active, description, href, icon }) => (
                <PlatformSwitcherItem
                    active={active}
                    className='platform-switcher'
                    description={localize('{{description}}', { description })}
                    href={window.location.search ? `${href}/${window.location.search}` : href}
                    icon={icon}
                    key={description}
                />
            ))}
        </UIPlatformSwitcher>
    );
});

export default PlatformSwitcher;
