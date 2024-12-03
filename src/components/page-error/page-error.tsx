import React from 'react';
import classNames from 'classnames';
import { Button, useDevice } from '@deriv-com/ui';
import ButtonLink from '../button-link/button-link';
import DesktopWrapper from '../shared_ui/desktop-wrapper';
import MobileWrapper from '../shared_ui/mobile-wrapper';
import Text from '../shared_ui/text';

type TMessageObject = { message: string; has_html?: boolean };

type TPageErrorProps = {
    buttonOnClick?: () => void;
    buttonSize?: 'small' | 'medium' | 'large';
    classNameImage?: string;
    header: React.ReactNode;
    image_url?: string;
    messages: Array<TMessageObject | React.ReactNode>;
    redirect_labels: Array<JSX.Element | string>;
    redirect_urls?: string[];
    setError?: (has_error: boolean, error: React.ReactNode) => void;
    should_clear_error_on_click?: boolean;
    should_redirect?: boolean;
};

const PageError = ({
    buttonOnClick,
    buttonSize = 'large',
    classNameImage,
    header,
    image_url,
    messages,
    redirect_labels,
    redirect_urls,
    should_clear_error_on_click,
    setError,
    should_redirect = true,
}: TPageErrorProps) => {
    const onClickHandler = () => {
        if (should_clear_error_on_click) {
            setError?.(false, null);
            window.location.assign('https://app.deriv.com'); // TODO: NEED TO REMOVE & FIX THIS TO REDIRECT TO THE CORRECT URL
        } else {
            buttonOnClick?.();
        }
    };
    const { isMobile } = useDevice();

    return (
        // if image_url is passed we should split the page to two columns and left-align messages
        <div className='dc-page-error__container'>
            {!!image_url && (
                <>
                    <DesktopWrapper>
                        <img
                            className={classNameImage}
                            src={image_url}
                            alt={'404'}
                            loading='lazy'
                            width='607px' // width and height should be specified so it doesn't jump to the right after image loads
                            height='366px'
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <img
                            className={classNameImage}
                            src={image_url}
                            alt={'404'}
                            loading='lazy'
                            width='328px'
                            height='200px'
                        />
                    </MobileWrapper>
                </>
            )}
            <div
                className={classNames('dc-page-error__box', {
                    'dc-page-error__box--left': !!image_url,
                })}
            >
                <Text as='h3' size={isMobile ? 's' : 'l'} align='center' weight='bold' lineHeight='s' color='prominent'>
                    {header}
                </Text>
                <div
                    className={classNames('dc-page-error__message-wrapper', {
                        'dc-page-error__message-wrapper--left': !!image_url,
                    })}
                >
                    <Text
                        color='prominent'
                        className={classNames('dc-page-error__message', {
                            'dc-page-error__message--left': !!image_url,
                        })}
                    >
                        {messages.map((message, index) =>
                            (message as TMessageObject)?.has_html ? (
                                <Text
                                    as='p'
                                    size={isMobile ? 'xxs' : 's'}
                                    align={isMobile ? 'center' : 'left'}
                                    lineHeight='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                    dangerouslySetInnerHTML={{ __html: (message as TMessageObject)?.message }}
                                />
                            ) : (
                                <Text
                                    as='p'
                                    size={isMobile ? 'xxs' : 's'}
                                    align={isMobile ? 'center' : 'left'}
                                    lineHeight='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                >
                                    {message as React.ReactNode}
                                </Text>
                            )
                        )}
                    </Text>
                </div>
                <div className='dc-page-error__btn-wrapper' data-testid='dc-page-error__btn-wrapper'>
                    {should_redirect &&
                        redirect_labels.length !== 0 &&
                        redirect_urls?.map?.((url, index) => (
                            <ButtonLink
                                className='dc-page-error__btn'
                                // to={url} // TODO: NEED TO FIX THIS TO REDIRECT TO THE CORRECT URL
                                onClick={onClickHandler}
                                size={buttonSize}
                                key={index}
                            >
                                <Text
                                    weight='bold'
                                    size={isMobile ? 'xs' : 's'}
                                    className='dc-page-error__btn-text dc-btn__text'
                                >
                                    {redirect_labels[index]}
                                </Text>
                            </ButtonLink>
                        ))}
                    {!should_redirect && (
                        <Button
                            type='button'
                            className='dc-page-error__btn--no-redirect'
                            onClick={onClickHandler}
                            size={isMobile ? 'sm' : 'md'}
                        >
                            <Text
                                weight='bold'
                                size={isMobile ? 'xs' : 's'}
                                className='dc-page-error__btn-text dc-btn__text'
                            >
                                {redirect_labels[0]}
                            </Text>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageError;
