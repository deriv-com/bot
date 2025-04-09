import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { getSetting } from '@/utils/settings';
import ReactJoyrideWrapper from '../common/react-joyride-wrapper';
import TourEndDialog from '../common/tour-end-dialog';
import TourStartDialog from '../common/tour-start-dialog';
import { BOT_BUILDER_TOUR } from '../tour-content';
import { useTourHandler } from '../useTourHandler';

const BotBuilderTourDesktop = observer(() => {
    const { is_close_tour, is_finished, handleJoyrideCallback, setIsCloseTour } = useTourHandler();
    const { dashboard, load_modal } = useStore();
    const { active_tab, active_tour, setActiveTour, setTourDialogVisibility } = dashboard;
    const { is_load_modal_open } = load_modal;
    const token = getSetting('bot_builder_token');
    if (!token && active_tab === 1) setTourDialogVisibility(true);

    React.useEffect(() => {
        if (is_finished) {
            setTourDialogVisibility(true);
            setActiveTour('');
        } else if (is_close_tour) {
            setActiveTour('');
            setIsCloseTour(false);
        }
    }, [is_close_tour, is_finished, setActiveTour, setIsCloseTour, setTourDialogVisibility]);

    return (
        <>
            {is_finished ? <TourEndDialog /> : !is_load_modal_open ? <TourStartDialog /> : null}
            {active_tour && (
                <ReactJoyrideWrapper
                    handleCallback={handleJoyrideCallback}
                    steps={BOT_BUILDER_TOUR}
                    disableCloseOnEsc
                    disableOverlay={false}
                    disableOverlayClose={true}
                    styles={{
                        options: {
                            arrowColor: 'transparent',
                            backgroundColor: 'var(--general-main-2)',
                            primaryColor: 'var(--brand-red-coral)',
                            textColor: 'var(--text-general)',
                        },
                    }}
                />
            )}
        </>
    );
});

export default BotBuilderTourDesktop;
