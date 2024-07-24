import { ComponentProps, ElementType, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Tooltip } from '@deriv-com/ui';
import './TooltipMenuIcon.scss';

type AsElement = 'a' | 'button' | 'div';
type TTooltipMenuIcon<T extends AsElement> = ComponentProps<T> & {
    as: T;
    disableHover?: boolean;
    tooltipContent: string;
    // tooltipPosition?: TooltipProps['placement'];
};

// TODO replace this with deriv/ui
const TooltipMenuIcon = <T extends AsElement>({
    as,
    children,
    className,
    disableHover = false,
    // tooltipContent,
    // tooltipPosition = 'top',
    ...rest
}: PropsWithChildren<TTooltipMenuIcon<T>>) => {
    const Tag = as as ElementType;

    return (
        <Tooltip tooltipContent={children} as={as}>
            <Tag className={clsx({ 'tooltip-menu-icon': !disableHover }, className)} {...rest}>
                {children}
            </Tag>
        </Tooltip>
    );
};

export default TooltipMenuIcon;
