import React from 'react';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import './index.scss';

const LocalFooter = observer(() => {
    const { load_modal, dashboard } = useStore();
    const { is_open_button_loading, loadFileFromLocal, setLoadedLocalFile, toggleLoadModal } = load_modal;
    const { setPreviewOnPopup } = dashboard;
    const { isDesktop } = useDevice();
    const Wrapper = isDesktop ? React.Fragment : Button.Group;

    return (
        <Wrapper>
            {!isDesktop && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={() => {
                    loadFileFromLocal();
                    setPreviewOnPopup(false);
                    toggleLoadModal();
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
