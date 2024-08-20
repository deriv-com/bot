import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import Popover from '@/components/shared_ui/popover';
import { popover_zindex } from '@/constants/z-indexes';

type TToolbarIcon = {
    popover_message: string;
    icon: string | React.ReactNode;
};

const ToolbarIcon = ({ popover_message, icon }: TToolbarIcon) => {
    return (
        <>
            <MobileWrapper>{icon}</MobileWrapper>
            <DesktopWrapper>
                <Popover
                    alignment='bottom'
                    message={popover_message}
                    zIndex={String(popover_zindex.TOOLBAR)}
                    should_disable_pointer_events
                >
                    {icon}
                </Popover>
            </DesktopWrapper>
        </>
    );
};

export default ToolbarIcon;
