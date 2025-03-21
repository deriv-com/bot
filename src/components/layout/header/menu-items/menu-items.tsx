import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import useIsGrowthbookIsLoaded from '@/hooks/growthbook/useIsGrowthbookLoaded';
import { useStore } from '@/hooks/useStore';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { useTranslations } from '@deriv-com/translations';
import { MenuItem, Text, useDevice } from '@deriv-com/ui';
import { MenuItems as items, TRADERS_HUB_LINK_CONFIG } from '../header-config';
import './menu-items.scss';

export const MenuItems = observer(() => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const store = useStore();
    const { has_wallet = false } = useStoreWalletAccountsList() || {};

    if (!store) return null;

    const client = store.client ?? {};
    const is_logged_in = client.is_logged_in ?? false;
    const getCurrency = client.getCurrency;
    const currency = getCurrency?.();

    const getModifiedHref = (originalHref: string) => {
        // Apply the redirection logic to all routes
        const redirect_url = new URL(originalHref);

        if (currency) {
            redirect_url.searchParams.set('account', currency);
        }

        return redirect_url.toString();
    };

    // Filter out the Cashier link when the account is a wallet account
    const filtered_items = items.filter((item, index) => {
        // Index 1 is the Cashier link
        if (index === 1 && has_wallet) {
            return false;
        }
        return true;
    });

    return (
        <>
            {is_logged_in &&
                (isDesktop
                    ? filtered_items.map(({ as, href, icon, label }) => (
                          <MenuItem
                              as={as}
                              className='app-header__menu'
                              href={getModifiedHref(href)}
                              key={label}
                              leftComponent={icon}
                          >
                              <Text>{localize(label)}</Text>
                          </MenuItem>
                      ))
                    : // For mobile, show the first available item after filtering
                      filtered_items.length > 0 && (
                          <MenuItem
                              as={filtered_items[0].as}
                              className='flex gap-2 p-5'
                              href={getModifiedHref(filtered_items[0].href)}
                              key={filtered_items[0].label}
                              leftComponent={filtered_items[0].icon}
                          >
                              <Text>{localize(filtered_items[0].label)}</Text>
                          </MenuItem>
                      ))}
        </>
    );
});

export const TradershubLink = observer(() => {
    const store = useStore();
    const { isGBLoaded, isGBAvailable } = useIsGrowthbookIsLoaded();

    if (!store) return null;

    const client = store.client ?? {};
    const getCurrency = client.getCurrency;
    const currency = getCurrency?.();

    // Apply the same redirection logic as MenuItems
    let redirect_url = new URL(standalone_routes.wallets_transfer);

    if (isGBAvailable && isGBLoaded) {
        redirect_url = new URL(standalone_routes.recent_transactions);
    }

    if (currency) {
        redirect_url.searchParams.set('account', currency);
    }

    return (
        <MenuItem
            as='a'
            className='app-header__menu'
            href={redirect_url.toString()}
            key={TRADERS_HUB_LINK_CONFIG.label}
            leftComponent={TRADERS_HUB_LINK_CONFIG.icon}
        >
            <Text>{TRADERS_HUB_LINK_CONFIG.label}</Text>
        </MenuItem>
    );
});

// Create a namespace for MenuItems to include TradershubLink
type MenuItemsType = typeof MenuItems & {
    TradershubLink: typeof TradershubLink;
};

// Assign TradershubLink to MenuItems
(MenuItems as MenuItemsType).TradershubLink = TradershubLink;

export default MenuItems as MenuItemsType;
