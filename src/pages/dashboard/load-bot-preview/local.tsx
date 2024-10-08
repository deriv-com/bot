import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Dialog from '@/components/shared_ui/dialog';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import BotPreview from './bot-preview';
import './index.scss';

const LocalComponent = observer(() => {
    const { isDesktop } = useDevice();
    const { load_modal, dashboard } = useStore();
    const { loadFileFromRecent, dashboard_strategies } = load_modal;
    const { setActiveTab, setPreviewOnDialog, has_mobile_preview_loaded } = dashboard;

    const el_ref = React.useRef<HTMLInputElement | null>(null);
    const has_strategies = !!dashboard_strategies?.length;

    React.useEffect(() => {
        if (el_ref.current?.children.length === 3) {
            el_ref?.current?.removeChild(el_ref?.current?.children[1]);
        }
    }, [el_ref.current?.children.length]);

    const renderOpenButton = () => (
        <button
            className='load-strategy__button-group--open'
            onClick={() => {
                setPreviewOnDialog(false);
                loadFileFromRecent();
                setActiveTab(DBOT_TABS.BOT_BUILDER);
            }}
        >
            {localize('Open')}
        </button>
    );
    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div
                className={classNames('load-strategy__local-preview', {
                    'load-strategy__local-preview--listed': has_strategies,
                })}
            >
                <div className='load-strategy__recent-preview'>
                    <div
                        className={classNames('load-strategy__title', 'load-strategy__recent-preview-title', {
                            'load-strategy__title--listed': has_strategies && !isDesktop,
                        })}
                    >
                        {isDesktop && <Localize i18n_default_text='Preview' />}
                    </div>

                    {isDesktop ? (
                        <>
                            <div className='load-strategy__preview-workspace'>
                                <BotPreview id_ref={el_ref} />
                            </div>
                            <div className='load-strategy__button-group'>{renderOpenButton()}</div>
                        </>
                    ) : (
                        <Dialog
                            is_visible={has_mobile_preview_loaded}
                            onCancel={() => setPreviewOnDialog(false)}
                            is_mobile_full_width
                            className='dc-dialog__wrapper--preview'
                            has_close_icon
                            title={localize('Preview')}
                            onConfirm={() => null}
                        >
                            <BotPreview id_ref={el_ref} />
                            <div className='load-strategy__button-group'>{renderOpenButton()}</div>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
});

export default LocalComponent;
