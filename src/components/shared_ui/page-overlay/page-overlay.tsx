import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons/LabelPaired';
import { LegacyClose1pxIcon } from '@deriv/quill-icons/Legacy';

type TPageOverlay = {
    header?: React.ReactNode;
    id?: string;
    is_from_app?: boolean;
    is_open?: boolean;
    onClickClose?: (event: MouseEvent) => void;
    portal_id?: string;
    header_classname?: string;
    has_return_icon?: boolean;
    onReturn?: () => void;
};

const PageOverlay = ({
    children,
    header,
    id,
    is_from_app = false,
    is_open,
    onClickClose,
    portal_id,
    header_classname,
    has_return_icon,
    onReturn,
}: React.PropsWithChildren<TPageOverlay>) => {
    const page_overlay_ref = React.useRef<HTMLDivElement>(null);

    const el_page_overlay = (
        <div
            ref={page_overlay_ref}
            id={id}
            className={classNames('dc-page-overlay', {
                'dc-page-overlay-portal': !!portal_id,
            })}
        >
            {header && (
                <div className={classNames('dc-page-overlay__header', { 'dc-page-app__header ': is_from_app })}>
                    <div className='dc-page-overlay__header-wrapper'>
                        <div className={classNames('dc-page-overlay__header-title', header_classname)}>
                            {has_return_icon && (
                                <LabelPairedArrowLeftCaptionFillIcon
                                    onClick={onReturn}
                                    className='dc-modal-header__icon'
                                />
                            )}
                            {header}
                        </div>
                        {!is_from_app && (
                            <div
                                data-testid='dt_page_overlay_header_close'
                                className='dc-page-overlay__header-close'
                                onClick={
                                    (onClickClose as unknown as MouseEventHandler<HTMLDivElement>) ||
                                    window.history.back
                                }
                            >
                                <LegacyClose1pxIcon height='20px' width='20px' />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className='dc-page-overlay__content'>{children}</div>
        </div>
    );

    if (portal_id) {
        return ReactDOM.createPortal(
            <CSSTransition
                appear
                in={is_open}
                timeout={250}
                classNames={{
                    appear: 'dc-page-overlay--enter',
                    enter: 'dc-page-overlay--enter',
                    enterDone: 'dc-page-overlay--enter-done',
                    exit: 'dc-page-overlay--exit',
                }}
                unmountOnExit
            >
                {el_page_overlay}
            </CSSTransition>,
            document.getElementById(portal_id) as HTMLElement
        );
    }

    return <React.Fragment>{el_page_overlay}</React.Fragment>;
};

export default PageOverlay;
