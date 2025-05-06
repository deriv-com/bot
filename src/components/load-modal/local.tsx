import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import { useStore } from '@/hooks/useStore';
import { DerivLightLocalDeviceIcon, DerivLightMyComputerIcon } from '@deriv/quill-icons/Illustration';
import { LegacyClose1pxIcon, LegacyInfo1pxIcon } from '@deriv/quill-icons/Legacy';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { botNotification } from '../bot-notification/bot-notification';
import { notification_message } from '../bot-notification/bot-notification-utils';
import LocalFooter from './local-footer';
import SectionMessage from './section-message';
import WorkspaceControl from './workspace-control';

const LocalComponent = observer(() => {
    const { dashboard, load_modal, blockly_store } = useStore();
    const { active_tab, active_tour } = dashboard;
    const { handleFileChange, loaded_local_file, setLoadedLocalFile, imported_strategy_type, is_open_button_loading } =
        load_modal;

    const file_input_ref = React.useRef<HTMLInputElement>(null);
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    const { isDesktop } = useDevice();
    const { is_loading } = blockly_store;

    React.useEffect(() => {
        if (loaded_local_file && is_file_supported && imported_strategy_type !== 'pending' && !is_loading) {
            if (imported_strategy_type === 'old') {
                botNotification(notification_message().strategy_conversion, undefined, {
                    closeButton: false,
                });
            }
        }
    }, [loaded_local_file, is_file_supported, imported_strategy_type, is_open_button_loading, is_loading]);

    if (loaded_local_file && is_file_supported) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div
                    className={classNames('load-strategy__local-preview', {
                        'load-strategy__local-preview--active': active_tab === 1 && active_tour,
                    })}
                >
                    <div className='load-strategy__title'>
                        <Localize i18n_default_text='Preview' />
                    </div>
                    <div className='load-strategy__preview-workspace'>
                        <div id='load-strategy__blockly-container' style={{ height: '100%' }}>
                            <div className='load-strategy__local-preview-close'>
                                <LegacyClose1pxIcon
                                    onClick={() => {
                                        setLoadedLocalFile(null);
                                    }}
                                    data-testid='dt_load-strategy__local-preview-close'
                                    height='20px'
                                    width='20px'
                                />
                            </div>
                            <WorkspaceControl />
                        </div>
                    </div>
                </div>
                {!isDesktop && (
                    <div className='load-strategy__local-footer'>
                        <LocalFooter />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='load-strategy__container'>
            <div className='load-strategy__local-dropzone'>
                <input
                    type='file'
                    ref={file_input_ref}
                    accept='application/xml, text/xml'
                    style={{ display: 'none' }}
                    onChange={e => {
                        const is_supported = handleFileChange(e, false);
                        !is_supported &&
                            botNotification(notification_message().xml_import_error, undefined, {
                                className: 'error-toast',
                            });
                        setIsFileSupported(is_supported);
                    }}
                    data-testid='dt-load-strategy-file-input'
                />

                <SectionMessage
                    message={localize(
                        'Importing XML files from Binary Bot and other third-party platforms may take longer.'
                    )}
                    icon={<LegacyInfo1pxIcon fill='#e18d00' iconSize='xs' />}
                    className='load-strategy__section_message'
                />

                <div
                    data-testid='dt__local-dropzone-area'
                    className='load-strategy__local-dropzone-area'
                    onDrop={e => {
                        handleFileChange(e, false);
                    }}
                >
                    {!isDesktop ? (
                        <DerivLightLocalDeviceIcon height='96px' width='96px' className='load-strategy__local-icon' />
                    ) : (
                        <React.Fragment>
                            <DerivLightMyComputerIcon
                                height='128px'
                                width='128px'
                                className='load-strategy__local-icon'
                            />
                            <div className='load-strategy__local-title'>
                                <Localize i18n_default_text='Drag your XML file here' />
                            </div>
                            <div className='load-strategy__local-description'>
                                <Localize i18n_default_text='or, if you prefer...' />
                            </div>
                        </React.Fragment>
                    )}
                    <Button
                        text={
                            is_file_supported
                                ? localize('Select an XML file from your device')
                                : localize('Please upload an XML file')
                        }
                        data-testid='dt_load-strategy__local-upload'
                        onClick={() => file_input_ref?.current?.click()}
                        has_effect
                        primary
                        large
                    />
                </div>
            </div>
        </div>
    );
});

export default LocalComponent;
