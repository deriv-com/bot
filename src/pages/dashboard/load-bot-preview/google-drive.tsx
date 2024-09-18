import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import StaticUrl from '@/components/shared_ui/static-url';
import { useStore } from '@/hooks/useStore';
import { DerivLightGoogleDriveIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';

const GoogleDrive = observer(() => {
    const { ui, google_drive, load_modal } = useStore();
    const { is_authorised } = google_drive;
    const { is_open_button_loading, onDriveConnect, onDriveOpen } = load_modal;
    const { is_mobile } = ui;
    const icon_size = is_mobile ? '96px' : '128px';
    return (
        <div className='load-strategy__container' data-testid='dt_google_drive'>
            <div className='load-strategy__google-drive'>
                <DerivLightGoogleDriveIcon
                    className={classnames('load-strategy__google-drive-icon', {
                        'load-strategy__google-drive-icon--disabled': !is_authorised,
                    })}
                    height={icon_size}
                    width={icon_size}
                />
                <div className='load-strategy__google-drive-connected-text'>
                    {is_authorised ? (
                        <Localize i18n_default_text='You are connected to Google Drive' />
                    ) : (
                        'Google Drive'
                    )}
                </div>
                {is_authorised ? (
                    <Button.Group>
                        <Button onClick={onDriveConnect} has_effect secondary large>
                            <Localize i18n_default_text='Disconnect' />
                        </Button>
                        <Button
                            onClick={() => {
                                onDriveOpen();
                            }}
                            is_loading={is_open_button_loading}
                            has_effect
                            primary
                            large
                        >
                            <Localize i18n_default_text='Open' />
                        </Button>
                    </Button.Group>
                ) : (
                    <React.Fragment>
                        <div className='load-strategy__google-drive-terms'>
                            <div className='load-strategy__google-drive-text'>
                                <Localize i18n_default_text="To import your bot from your Google Drive, you'll need to sign in to your Google account." />
                            </div>
                            <div className='load-strategy__google-drive-text'>
                                <Localize
                                    i18n_default_text='To know how Google Drive handles your data, please review Deriv’s <0>Privacy policy.</0>'
                                    components={[
                                        <StaticUrl
                                            key={0}
                                            className='link'
                                            href='tnc/security-and-privacy.pdf'
                                            is_document
                                        />,
                                    ]}
                                />
                            </div>
                        </div>
                        <Button onClick={onDriveConnect} has_effect primary large>
                            <Localize i18n_default_text='Sign in' />
                        </Button>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
});

export default GoogleDrive;
