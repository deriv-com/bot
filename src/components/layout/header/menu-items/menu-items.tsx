import Text from '@/components/shared_ui/text';
import { useTranslations } from '@deriv-com/translations';
import { MenuItem, useDevice } from '@deriv-com/ui';
import { MenuItems as items, TRADERS_HUB_LINK_CONFIG } from '../header-config';
import './menu-items.scss';

export const MenuItems = () => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    return (
        <>
            {isDesktop ? (
                items.map(({ as, href, icon, label }) => (
                    <MenuItem as={as} className='app-header__menu' href={href} key={label} leftComponent={icon}>
                        <Text>{localize(label)}</Text>
                    </MenuItem>
                ))
            ) : (
                <MenuItem
                    as={items[1].as}
                    className='flex gap-2 p-5'
                    href={items[1].href}
                    key={items[1].label}
                    leftComponent={items[1].icon}
                >
                    <Text>{localize(items[1].label)}</Text>
                </MenuItem>
            )}
        </>
    );
};

export const TradershubLink = () => (
    <MenuItem
        as='a'
        className='app-header__menu'
        href={TRADERS_HUB_LINK_CONFIG.href}
        key={TRADERS_HUB_LINK_CONFIG.label}
        leftComponent={TRADERS_HUB_LINK_CONFIG.icon}
    >
        <Text>{TRADERS_HUB_LINK_CONFIG.label}</Text>
    </MenuItem>
);

MenuItems.TradershubLink = TradershubLink;
export default MenuItems;
