import React from 'react';
import { observer } from 'mobx-react-lite';

import { NOTIFICATION_TYPE } from '@/components/bot-notification/bot-notification-utils';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { Icon } from '@/utils/tmp/dummy';

const DashboardQuickActions = observer(() => {
    const { dashboard, load_modal } = useStore();
    const { showVideoDialog, setActiveTab, setFileLoaded, setOpenSettings } = dashboard;
    const { handleFileChange, loadFileFromLocal } = load_modal;
    const load_file_ref = React.useRef<HTMLInputElement | null>(null);
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    const openFileLoader = () => {
        load_file_ref?.current?.click();
    };
    const openGoogleDriveDialog = () => {
        showVideoDialog({
            type: 'google',
        });
    };
    const quick_actions = [
        {
            type: 'my-computer',
            icon: <Icon icon='IcMyComputer' />,
            content: 'My Computer',
            onClickHandler: () => openFileLoader(),
        },
        {
            type: 'google-drive',
            icon: <Icon icon='IcGoogleDrive' />,
            content: 'Google Drive',
            onClickHandler: () => openGoogleDriveDialog(),
        },
        {
            type: 'bot-builder',
            icon: <Icon icon='IcBotBuilder' />,
            content: 'Bot Builder',
            onClickHandler: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
            },
        },
        {
            type: 'quick-strategy',
            icon: <Icon icon='IcQuickStrategy' />,
            content: 'Quick strategy',
            onClickHandler: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
            },
        },
    ];
    return (
        <div className='dashboard__quickactions'>
            {quick_actions.map(icons => {
                const { icon, content, onClickHandler } = icons;
                return (
                    <div key={content} className='dashboard__quickactions__card' onClick={onClickHandler}>
                        <div className='dashboard__quickactions__card__icon'>{icon}</div>
                        <div className='dashboard__quickactions__card__content'>{content}</div>
                    </div>
                );
            })}
            <input
                type='file'
                ref={load_file_ref}
                accept='application/xml, text/xml'
                hidden
                onChange={e => {
                    setIsFileSupported(handleFileChange(e, false));
                    loadFileFromLocal();
                    setFileLoaded(true);
                    setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
                }}
            />
        </div>
    );
});

export default DashboardQuickActions;
