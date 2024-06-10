import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import Popover from '@/components/shared_ui/popover';
import { popover_zindex } from '@/constants/z-indexes';
import { Icon } from '@/utils/tmp/dummy';

type TToolbarIcon = {
    popover_message: string;
    icon: string;
    icon_id: string;
    action: () => void;
    icon_color?: string;
    data_testid?: string;
};

const ToolbarIcon = ({ popover_message, icon, icon_id, icon_color, action, data_testid }: TToolbarIcon) => {
    const renderIcon = () => (
        <Icon
            icon={icon}
            id={icon_id}
            className='toolbar__icon'
            onClick={action}
            {...(icon_color && { color: icon_color })}
            data_testid={data_testid}
        />
    );

    return (
        <>
            <MobileWrapper>{renderIcon()}</MobileWrapper>
            <DesktopWrapper>
                <Popover
                    alignment='bottom'
                    message={popover_message}
                    zIndex={String(popover_zindex.TOOLBAR)}
                    should_disable_pointer_events
                >
                    {renderIcon()}
                </Popover>
            </DesktopWrapper>
        </>
    );
};

export default ToolbarIcon;
