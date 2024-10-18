import React from 'react';
import { observer } from 'mobx-react-lite';
import { NOTIFICATION_TYPE } from '@/components/bot-notification/bot-notification-utils';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import Button from '../shared_ui/button';

const LocalFooter = observer(() => {
    const { ui, load_modal, dashboard } = useStore();
    const {
        is_open_button_loading,
        is_open_button_disabled,
        loadStrategyOnBotBuilder,
        setLoadedLocalFile,
        saveStrategyToLocalStorage,
        toggleLoadModal,
    } = load_modal;
    const { setOpenSettings, setPreviewOnPopup } = dashboard;
    const { is_desktop } = ui;
    const Wrapper = is_desktop ? React.Fragment : Button.Group;

    return (
        <Wrapper>
            {!is_desktop && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={() => {
                    loadStrategyOnBotBuilder();
                    saveStrategyToLocalStorage();
                    setLoadedLocalFile(null);
                    toggleLoadModal();
                    setPreviewOnPopup(false);
                    setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
                }}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
                disabled={is_open_button_disabled}
            />
        </Wrapper>
    );
});

export default LocalFooter;
