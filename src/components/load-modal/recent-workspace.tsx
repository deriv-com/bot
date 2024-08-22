import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { timeSince } from '@/external/bot-skeleton';
import { save_types } from '@/external/bot-skeleton/constants/save-type';
import { useStore } from '@/hooks/useStore';
import { DerivLightGoogleDriveIcon, DerivLightMyComputerIcon, LegacyReportsIcon } from '@deriv/quill-icons';

type TRecentWorkspaceProps = {
    workspace: { [key: string]: any };
};

type TIcons = {
    [key: string]: React.ReactElement;
};

export const getRecentFileIcon = (save_type: string, class_name: string = ''): React.ReactElement => {
    if (!save_type && typeof save_type !== 'string') return <LegacyReportsIcon height='14px' width='14px' />;
    const icons: TIcons = {
        [save_types.UNSAVED]: <LegacyReportsIcon height='14px' width='14px' />,
        [save_types.LOCAL]: <DerivLightMyComputerIcon height='14px' width='24px' />,
        [save_types.GOOGLE_DRIVE]: <DerivLightGoogleDriveIcon className={class_name} height='14px' width='14px' />,
    };
    return icons[save_type as string] as React.ReactElement;
};

const RecentWorkspace = observer(({ workspace }: TRecentWorkspaceProps) => {
    const { load_modal } = useStore();
    const { getSaveType, previewRecentStrategy, selected_strategy_id } = load_modal;

    return (
        <div
            className={classnames('load-strategy__recent-item', {
                'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
            })}
            key={workspace.id}
            onClick={selected_strategy_id === workspace.id ? undefined : () => previewRecentStrategy(workspace.id)}
            data-testid='dt_recent_workspace_item'
        >
            <div className='load-strategy__recent-item-text'>
                <div className='load-strategy__recent-item-title' title={workspace.name}>
                    {workspace.name}
                </div>
                <div className='load-strategy__recent-item-time'>{timeSince(workspace.timestamp)}</div>
            </div>
            <div className='load-strategy__recent-item-location'>
                {getRecentFileIcon(workspace.save_type, 'load-strategy__recent-icon--active')}
                <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
            </div>
        </div>
    );
});

export default RecentWorkspace;
