import { useTranslations } from '@deriv-com/translations';
import { PlatformSwitcher as UIPlatformSwitcher, PlatformSwitcherItem } from '@deriv-com/ui';
import { platformsConfig } from '../HeaderConfig';

export const PlatformSwitcher = () => {
    const { localize } = useTranslations();

    return (
        <UIPlatformSwitcher
            bottomLinkLabel={localize('Looking for CFDs? Go to Trader’s Hub')}
            buttonProps={{
                className: 'hover:bg-transparent lg:hover:bg-[#e6e9e9] px-[1.6rem]',
                icon: platformsConfig[0].buttonIcon,
            }}
            itemsWrapperClassName='top-48 h-full lg:top-[4.7rem] lg:h-auto'
            overlayClassName='top-48 lg:top-[4.7rem]'
        >
            {platformsConfig.map(({ active, description, href, icon }) => (
                <PlatformSwitcherItem
                    active={active}
                    className='py-[1.4rem] px-[1.6rem] my-[1.4rem] mx-[1.6rem] h-auto lg:py-[2.4rem] lg:m-[1.6rem] lg:mt-[2.4rem] lg:h-[14.3rem]'
                    description={localize('{{description}}', { description })}
                    href={href}
                    icon={icon}
                    key={description}
                />
            ))}
        </UIPlatformSwitcher>
    );
};
