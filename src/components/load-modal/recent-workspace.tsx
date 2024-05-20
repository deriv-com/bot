import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { timeSince } from '@/external/bot-skeleton';
import { save_types } from '@/external/bot-skeleton/constants/save-type';
import { useStore } from '@/hooks/useStore';
import { Icon } from '@/utils/tmp/dummy';

type TRecentWorkspaceProps = {
    workspace: { [key: string]: any };
};

const RecentWorkspace = observer(({ workspace }: TRecentWorkspaceProps) => {
    const { load_modal } = useStore();
    const { getRecentFileIcon, getSaveType, previewRecentStrategy, selected_strategy_id } = load_modal;

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
                <Icon
                    icon={getRecentFileIcon(workspace.save_type)}
                    className={classnames({
                        'load-strategy__recent-icon--active': workspace.save_type === save_types.GOOGLE_DRIVE,
                    })}
                />
                <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
            </div>
        </div>
    );
});

export default RecentWorkspace;
