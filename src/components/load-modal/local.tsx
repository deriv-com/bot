import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import { useStore } from '@/hooks/useStore';
import { DerivLightLocalDeviceIcon, DerivLightMyComputerIcon, LegacyClose1pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import LocalFooter from './local-footer';
import WorkspaceControl from './workspace-control';

const LocalComponent = observer(() => {
    const { dashboard, load_modal } = useStore();
    const { active_tab, active_tour } = dashboard;
    const { handleFileChange, loaded_local_file, setLoadedLocalFile } = load_modal;

    const file_input_ref = React.useRef<HTMLInputElement>(null);
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    const { isDesktop } = useDevice();

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
                                    onClick={() => setLoadedLocalFile(null)}
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
                    onChange={e => setIsFileSupported(handleFileChange(e, false))}
                    data-testid='dt-load-strategy-file-input'
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
                        data-testid='dt_load-strategy__local-upload'
                        onClick={() => file_input_ref?.current?.click()}
                        has_effect
                        primary
                        large
                    >
                        {is_file_supported ? (
                            <Localize i18n_default_text='Select an XML file from your device' />
                        ) : (
                            <Localize i18n_default_text='Please upload an XML file' />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default LocalComponent;
