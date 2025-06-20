import React from 'react';
import classNames from 'classnames';
import { LabelPairedChevronsRightCaptionRegularIcon, LegacyHandleLessIcon } from '@deriv/quill-icons';
import { useDevice } from '@deriv-com/ui';

type TDrawer = {
    anchor?: string;
    className?: string;
    contentClassName?: string;
    footer?: React.ReactElement;
    header?: React.ReactElement;
    width?: number;
    zIndex?: number;
    is_open: boolean;
    toggleDrawer?: (prop: boolean) => void;
};

const Drawer = ({
    anchor = 'left',
    children,
    className,
    contentClassName,
    footer,
    header,
    width = 250,
    zIndex = 4,
    ...props
}: React.PropsWithChildren<TDrawer>) => {
    const [is_open, setIsOpen] = React.useState(props.is_open);
    const { isDesktop } = useDevice();

    React.useEffect(() => {
        setIsOpen(props.is_open);
    }, [props.is_open]);

    const toggleDrawer = () => {
        setIsOpen(!is_open);
        if (props.toggleDrawer) {
            props.toggleDrawer(!is_open);
        }
    };

    return (
        <div
            data-testid='drawer'
            className={classNames('dc-drawer', className, {
                [`dc-drawer--${anchor}`]: isDesktop,
                'dc-drawer--open': is_open,
            })}
            style={{
                zIndex,
                transform:
                    is_open && isDesktop
                        ? anchor === 'left'
                            ? `translateX(calc(${width}px - 16px))`
                            : `translateX(calc(-${width}px + 16px))`
                        : undefined,
            }}
        >
            <div
                className={classNames('dc-drawer__toggle', {
                    'dc-drawer__toggle--open': is_open,
                })}
                onClick={toggleDrawer}
            >
                {isDesktop ? (
                    <LabelPairedChevronsRightCaptionRegularIcon
                        className={classNames('dc-drawer__toggle-icon', {
                            [`dc-drawer__toggle-icon--${anchor}`]: isDesktop,
                        })}
                    />
                ) : (
                    <LegacyHandleLessIcon iconSize='sm' className='dc-drawer__toggle-icon' />
                )}
            </div>
            <div className={classNames('dc-drawer__container', { [`dc-drawer__container--${anchor}`]: isDesktop })}>
                {header && <div className='dc-drawer__header'>{header}</div>}
                <div className={classNames('dc-drawer__content', contentClassName)}>{children}</div>
                {footer && <div className='dc-drawer__footer'>{footer}</div>}
            </div>
        </div>
    );
};

export default Drawer;
