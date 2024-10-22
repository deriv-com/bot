import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { timeSince } from '@/external/bot-skeleton';
import { save_types } from '@/external/bot-skeleton/constants/save-type';
import { useStore } from '@/hooks/useStore';
import { DerivLightGoogleDriveIcon, DerivLightMyComputerIcon } from '@deriv/quill-icons/Illustration';
import { LegacyReportsIcon } from '@deriv/quill-icons/Legacy';

type TRecentWorkspaceProps = {
    workspace: { [key: string]: any };
};
type TIcons = {
    [key: string]: React.ReactElement;
};

export const getRecentFileIcon = (save_type: string, class_name: string = ''): React.ReactElement => {
    if (!save_type && typeof save_type !== 'string')
        return <LegacyReportsIcon iconSize='xs' fill='var(--text-general)' />;
    const icons: TIcons = {
        [save_types.UNSAVED]: (
            <LegacyReportsIcon iconSize='xs' fill='var(--text-general)' className='icon-general-fill-g-path' />
        ),
        [save_types.LOCAL]: <DerivLightMyComputerIcon height='16px' width='16px' fill='var(--text-general)' />,
        [save_types.GOOGLE_DRIVE]: (
            <DerivLightGoogleDriveIcon className={class_name} height='16px' width='16px' fill='var(--text-general)' />
        ),
    };
    return icons[save_type as string] as React.ReactElement;
};

const RecentWorkspace = observer(({ workspace }: TRecentWorkspaceProps) => {
    const { load_modal, blockly_store } = useStore();
    const { setLoading } = blockly_store;
    const { getSaveType, loadStrategyOnModalRecentPreview, selected_strategy_id, updateXmlValuesOnStrategySelection } =
        load_modal;

    const onRecentWorkspaceClick = () => {
        if (selected_strategy_id === workspace.id) return;
        setLoading(true);
        loadStrategyOnModalRecentPreview(workspace.id);
        updateXmlValuesOnStrategySelection();
    };

    return (
        <div
            className={classnames('load-strategy__recent-item', {
                'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
            })}
            key={workspace.id}
            onClick={onRecentWorkspaceClick}
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
