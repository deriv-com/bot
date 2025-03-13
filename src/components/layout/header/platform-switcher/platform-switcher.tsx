import { standalone_routes } from '@/components/shared';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { useTranslations } from '@deriv-com/translations';
import { PlatformSwitcher as UIPlatformSwitcher, PlatformSwitcherItem } from '@deriv-com/ui';
import { platformsConfig } from '../header-config';
import './platform-switcher.scss';

const PlatformSwitcher = () => {
    const { localize } = useTranslations();
    const { has_wallet = false } = useStoreWalletAccountsList() || {};
    const redirect_url = handleTraderHubRedirect('cfds', has_wallet) || standalone_routes.traders_hub;
    console.log(redirect_url, 'redirect_url');
    return (
        <UIPlatformSwitcher
            bottomLinkLabel={localize('Looking for CFDs? Go to Trader’s Hub')}
            buttonProps={{
                icon: platformsConfig[1].buttonIcon,
            }}
            bottomLinkProps={{
                href: redirect_url,
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
};

export default PlatformSwitcher;
