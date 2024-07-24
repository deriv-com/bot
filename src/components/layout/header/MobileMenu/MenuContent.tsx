import { MenuItem, Text, useDevice } from '@deriv-com/ui';
import { PlatformSwitcher } from '../PlatformSwitcher';
import { MobileMenuConfig } from './MobileMenuConfig';

export const MenuContent = () => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';

    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-center h-28 border-b border-[#f2f3f4]'>
                <PlatformSwitcher />
            </div>

            <div className='relative h-full pt-4'>
                {MobileMenuConfig().map((item, index) => {
                    const removeBorderBottom = item.find(({ removeBorderBottom }) => removeBorderBottom);

                    return (
                        <div
                            className={!removeBorderBottom ? 'border-b border-[#f2f3f4]' : ''}
                            data-testid='dt_menu_item'
                            key={index}
                        >
                            {item.map(({ LeftComponent, RightComponent, as, href, label, onClick, target }) => {
                                if (as === 'a') {
                                    return (
                                        <MenuItem
                                            as='a'
                                            className='h-[5.6rem]'
                                            disableHover
                                            href={href}
                                            key={label}
                                            leftComponent={
                                                <LeftComponent className='mr-[1.6rem]' height={16} width={16} />
                                            }
                                            target={target}
                                        >
                                            <Text size={textSize}>{label}</Text>
                                        </MenuItem>
                                    );
                                }
                                return (
                                    <MenuItem
                                        as='button'
                                        className='w-full h-[5.6rem]'
                                        disableHover
                                        key={label}
                                        leftComponent={<LeftComponent className='mr-[1.6rem]' iconSize='xs' />}
                                        onClick={onClick}
                                        rightComponent={RightComponent}
                                    >
                                        <Text className='mr-auto' size={textSize}>
                                            {label}
                                        </Text>
                                    </MenuItem>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
