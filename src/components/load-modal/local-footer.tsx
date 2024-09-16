import React from 'react';
import { observer } from 'mobx-react-lite';
import { NOTIFICATION_TYPE } from '@/components/bot-notification/bot-notification-utils';
import { useStore } from '@/hooks/useStore';
import { localize } from '@/utils/tmp/dummy';
import { useDevice } from '@deriv-com/ui';
import Button from '../shared_ui/button';

const LocalFooter = observer(() => {
    const { load_modal, dashboard } = useStore();
    const { is_open_button_loading, loadFileFromLocal, setLoadedLocalFile, toggleLoadModal } = load_modal;
    const { setOpenSettings, setPreviewOnPopup } = dashboard;
    const { isDesktop } = useDevice();
    const Wrapper = !isDesktop ? Button.Group : React.Fragment;

    return (
        <Wrapper>
            {!isDesktop && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={() => {
                    loadFileFromLocal();
                    toggleLoadModal();
                    setPreviewOnPopup(false);
                    setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
                }}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
            />
        </Wrapper>
    );
});

export default LocalFooter;
