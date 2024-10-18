import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { LabelPairedMinusCaptionRegularIcon, LabelPairedPlusCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';

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
                fill='var(--text-general)'
            />
            <LabelPairedMinusCaptionRegularIcon
                className='load-strategy__preview-workspace-icon'
                onClick={() => {
                    mockZoomInOut ? mockZoomInOut(false) : onZoomInOutClick(false);
                }}
                data-testid='zoom-out'
                fill='var(--text-general)'
            />
        </div>
    );
});

export default WorkspaceControl;
