import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import StaticUrl from '@/components/shared_ui/static-url';
import { useStore } from '@/hooks/useStore';
import { Icon, Localize, localize } from '@/utils/tmp/dummy';

const GoogleDrive = observer(() => {
    const { ui, google_drive, load_modal } = useStore();
    const { is_authorised } = google_drive;
    const { is_open_button_loading, onDriveConnect, onDriveOpen } = load_modal;
    const { is_mobile } = ui;

    return (
        <div className='load-strategy__container' data-testid='dt_google_drive'>
            <div className='load-strategy__google-drive'>
                <Icon
                    icon={'IcGoogleDrive'}
                    className={classnames('load-strategy__google-drive-icon', {
                        'load-strategy__google-drive-icon--disabled': !is_authorised,
                    })}
                    size={is_mobile ? 96 : 128}
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
                        <Button text={localize('Disconnect')} onClick={onDriveConnect} has_effect secondary large />
                        <Button
                            text={localize('Open')}
                            onClick={() => {
                                onDriveOpen();
                            }}
                            is_loading={is_open_button_loading}
                            has_effect
                            primary
                            large
                        />
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
                        <Button text={localize('Sign in')} onClick={onDriveConnect} has_effect primary large />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
});

export default GoogleDrive;
