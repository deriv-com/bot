import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useFirebaseCountriesConfig } from '@/hooks/firebase/useFirebaseCountriesConfig';
import { useStore } from '@/hooks/useStore';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
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

    // Check if the account is a demo account
    // Use the URL parameter to determine if it's a demo account, as this will update when the account changes
    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');
    const is_virtual = client.is_virtual || account_param === 'demo' || false;

    // Use handleTraderHubRedirect for all links
    const getModifiedHref = (originalHref: string) => {
        const redirect_url = new URL(originalHref);

        if (is_virtual) {
            // For demo accounts, set the account parameter to 'demo'
            redirect_url.searchParams.set('account', 'demo');
        } else if (currency) {
            // For real accounts, set the account parameter to the currency
            redirect_url.searchParams.set('account', currency);
        }

        return redirect_url.toString();
    };

    // Filter out the Cashier link when the account is a wallet account
    const filtered_items = items.filter((item, index) => {
        // Index 0 is the Cashier link
        if (index === 0 && has_wallet) {
            return false;
        }
        return true;
    });

    // TODO : need to add the skeleton loader when growthbook is not loaded
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
    const { has_wallet = false } = useStoreWalletAccountsList() || {};
    const store = useStore();
    const { hubEnabledCountryList } = useFirebaseCountriesConfig();

    const [redirect_url_str, setRedirectUrlStr] = useState<null | string>(null);

    useEffect(() => {
        const redirectParams = {
            product_type: 'tradershub' as const,
            has_wallet,
            is_virtual: store?.client?.is_virtual,
            residence: store?.client?.residence,
            hubEnabledCountryList,
        };
        setRedirectUrlStr(handleTraderHubRedirect(redirectParams));
    }, [has_wallet, store?.client?.is_virtual, store?.client?.residence, hubEnabledCountryList]);

    if (!store) return null;

    const client = store.client ?? {};
    const getCurrency = client.getCurrency;
    const currency = getCurrency?.();

    // Check if the account is a demo account
    // Use the URL parameter to determine if it's a demo account, as this will update when the account changes
    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');
    const is_virtual = client.is_virtual || account_param === 'demo' || false;

    // Use the handleTraderHubRedirect function with the is_virtual flag

    // If the redirect_url_str is null, use the default URL with appropriate parameters
    let href = redirect_url_str;
    if (redirect_url_str) {
        // If we have a redirect_url_str, we still need to add the account parameter
        try {
            const redirect_url = new URL(redirect_url_str);
            if (is_virtual) {
                // For demo accounts, set the account parameter to 'demo'
                redirect_url.searchParams.set('account', 'demo');
            } else if (currency) {
                // For real accounts, set the account parameter to the currency
                redirect_url.searchParams.set('account', currency);
            }
            href = redirect_url.toString();
        } catch (error) {
            console.error('Error parsing redirect URL:', error);
        }
    }

    return (
        <MenuItem
            as='a'
            className='app-header__menu'
            href={href ?? undefined}
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
