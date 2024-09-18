import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { LabelPairedMinusCaptionRegularIcon, LabelPairedPlusCaptionRegularIcon } from '@deriv/quill-icons';

type TWorkspaceControlProps = {
    mockZoomInOut?: (is_zoom_in: boolean) => void;
};

const WorkspaceControl = observer(({ mockZoomInOut }: TWorkspaceControlProps) => {
    const { dashboard } = useStore();
    const { onZoomInOutClick } = dashboard;

    return (
        <div className='load-strategy__preview-workspace-controls'>
            <LabelPairedPlusCaptionRegularIcon
                className='load-strategy__preview-workspace-icon'
                onClick={() => {
                    mockZoomInOut ? mockZoomInOut(true) : onZoomInOutClick(true);
                }}
                data-testid='zoom-in'
            />
            <LabelPairedMinusCaptionRegularIcon
                className='load-strategy__preview-workspace-icon'
                onClick={() => {
                    mockZoomInOut ? mockZoomInOut(false) : onZoomInOutClick(false);
                }}
                data-testid='zoom-out'
            />
        </div>
    );
});

export default WorkspaceControl;
