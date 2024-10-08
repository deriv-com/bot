import React from 'react';
import { observer } from 'mobx-react-lite';
import { useBlocker } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Localize, localize } from '@deriv-com/translations';
import Dialog from '../shared_ui/dialog';

const RoutePromptDialog = observer(() => {
    const { ui } = useStore() ?? {
        ui: {
            show_prompt: false,
        },
    };
    const { show_prompt } = ui;

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) => show_prompt && currentLocation.pathname !== nextLocation.pathname
    );

    React.useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (show_prompt) {
                event.preventDefault();
            } else {
                delete event.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [show_prompt]);

    return (
        <Dialog
            title={localize('Leaving already?')}
            confirm_button_text={localize("Yes, I'll come back later")}
            cancel_button_text={localize("No, I'll stay")}
            onConfirm={() => {
                blocker?.proceed?.();
            }}
            onCancel={() => {
                blocker?.reset?.();
            }}
            is_visible={blocker.state === 'blocked'}
            has_close_icon={false}
        >
            <Localize i18n_default_text='If you leave, your current contract will be completed, but your bot will stop running immediately.' />
        </Dialog>
    );
});

export default RoutePromptDialog;
