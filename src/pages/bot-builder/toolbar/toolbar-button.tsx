import Button from '@/components/shared_ui/button';
import Popover from '@/components/shared_ui/popover';

type TToolbarButton = {
    popover_message?: string;
    button_id: string;
    button_classname: string;
    buttonOnClick: () => void;
    icon?: React.ReactElement;
    button_text: string;
    is_bot_running?: boolean;
};

const ToolbarButton = ({
    popover_message,
    button_id,
    button_classname,
    buttonOnClick,
    icon,
    button_text,
    is_bot_running,
}: TToolbarButton) => {
    const button = (
        <Button id={button_id} className={button_classname} has_effect onClick={buttonOnClick} icon={icon} green>
            {button_text}
        </Button>
    );

    if (is_bot_running) {
        return button;
    }

    return (
        <Popover alignment='bottom' message={popover_message} should_disable_pointer_events>
            {button}
        </Popover>
    );
};

export default ToolbarButton;
