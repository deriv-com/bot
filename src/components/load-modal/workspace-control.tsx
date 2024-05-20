import { observer } from 'mobx-react-lite';

import { useStore } from '@/hooks/useStore';
import { Icon } from '@/utils/tmp/dummy';

type TWorkspaceControlProps = {
    mockZoomInOut?: (is_zoom_in: boolean) => void;
};

const WorkspaceControl = observer(({ mockZoomInOut }: TWorkspaceControlProps) => {
    const { dashboard } = useStore();
    const { onZoomInOutClick } = dashboard;

    return (
        <div className='load-strategy__preview-workspace-controls'>
            <Icon
                icon={'IcAddRounded'}
                className='load-strategy__preview-workspace-icon'
                onClick={() => {
                    mockZoomInOut ? mockZoomInOut(true) : onZoomInOutClick(true);
                }}
                data_testid='zoom-in'
            />
            <Icon
                icon={'IcMinusRounded'}
                className='load-strategy__preview-workspace-icon'
                onClick={() => {
                    mockZoomInOut ? mockZoomInOut(false) : onZoomInOutClick(false);
                }}
                data_testid='zoom-out'
            />
        </div>
    );
});

export default WorkspaceControl;
