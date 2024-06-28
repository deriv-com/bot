import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { DBOT_TABS } from '@/constants/bot-contents';
import { getSavedWorkspaces, timeSince } from '@/external/bot-skeleton';
import { MENU_DESKTOP, STRATEGY } from '@/constants/dashboard';
import DeleteDialog from './common/delete-dialog';
import { waitForDomElement } from '@/utils/dom-observer';
import { isMobileOs } from '@/components/shared';
import SaveModal from './common/save-modal';

const DashboardQuickActions = observer(() => {
    const { dashboard } = useStore();
    const { showVideoDialog, setActiveTab } = dashboard;
    const load_file_ref = React.useRef<HTMLInputElement | null>(null);
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
            icon: <img src='/ic-my-computer.svg' alt='My computer' />,
            content: 'My Computer',
            onClickHandler: () => openFileLoader(),
        },
        {
            type: 'google-drive',
            icon: <img src='/ic-google-drive.svg' alt='Google Drive' />,
            content: 'Google Drive',
            onClickHandler: () => openGoogleDriveDialog(),
        },
        {
            type: 'bot-builder',
            icon: <img src='/ic-bot-builder.svg' alt='Bot Builder' />,
            content: 'Bot Builder',
            onClickHandler: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
            },
        },
        {
            type: 'quick-strategy',
            icon: <img src='/ic-quick-strategy.svg' alt='Quick strategy' />,
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
            <input type='file' ref={load_file_ref} accept='application/xml, text/xml' hidden onChange={() => {}} />
        </div>
    );
});

const DashboardBotList = observer(() => {
    const { load_modal, dashboard, save_modal } = useStore();
    const {
        dashboard_strategies,
        setDashboardStrategies,
        onToggleDeleteDialog,
        loadFileFromRecent,
        setPreviewedStrategyId,
        previewRecentStrategy,
    } = load_modal;
    const { setActiveTab, active_tab, setPreviewOnDialog } = dashboard;
    const { updateBotName, toggleSaveModal } = save_modal;
    const is_mobile = isMobileOs();

    React.useEffect(() => {
        let strategies;
        const getStrategies = async () => {
            strategies = await getSavedWorkspaces();
            setDashboardStrategies(strategies);
        };
        getStrategies();
    }, []);


    const handleInit = (workspace: any) => {
        setPreviewedStrategyId(workspace?.id);
        // Fires for desktop
        if (active_tab === 0) {
            previewRecentStrategy(workspace.id);
        }
    };

    const handlePreviewList = (workspace: any) => {
        setPreviewedStrategyId(workspace.id);
        // Fires for mobile on clicking preview button
        if (is_mobile) {
            setPreviewOnDialog(true);
            const dashboard_tab_dom_element = document.getElementsByClassName('tab__dashboard')?.[0];
            waitForDomElement('#load-strategy__blockly-container', dashboard_tab_dom_element).then(() => {
                previewRecentStrategy(workspace.id);
            });
        }
    };

    const handleEdit = async () => {
        await loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const handleSave = (workspace: any) => {
        updateBotName(workspace?.name);
        toggleSaveModal();
    };

    const viewRecentStrategy = async (type: string, workspace: any) => {
        //setSelectedStrategyId(workspace.id);
        switch (type) {
            case STRATEGY.INIT:
                // Fires for desktop preview
                handleInit(workspace);
                break;

            case STRATEGY.PREVIEW_LIST:
                // Fires for mobile preview
                handlePreviewList(workspace);
                break;

            case STRATEGY.EDIT:
                await handleEdit();
                break;

            case STRATEGY.SAVE:
                handleSave(workspace);
                break;

            case STRATEGY.DELETE:
                onToggleDeleteDialog(true);
                break;

            default:
                break;
        }
    };

    if(!dashboard_strategies) return null;
    return (
        <div className='dashboard__botlist'>
            <div className='dashboard__botlist__header'>Your Bots</div>
            <table className='dashboard__botlist__table'>
                <th className='dashboard__botlist__table__title'>Bot Name</th>
                <th className='dashboard__botlist__table__title'>Last Modified</th>
                <th className='dashboard__botlist__table__title'>Status</th>
                <th className='dashboard__botlist__table__title'>Action</th>
                {dashboard_strategies.map((workspace, index) => {
                    const { name, timestamp, save_type } = workspace;
                    return (
                        <tr key={timestamp + index} className='dashboard__botlist__table__row'>
                            <td className='dashboard__botlist__table__row__bot_name'>{name}</td>
                            <td className='dashboard__botlist__table__row__last_modified'>{timeSince(timestamp)}</td>
                            <td className='dashboard__botlist__table__row__status'>{save_type}</td>
                            <td className='dashboard__botlist__table__row__actions'>
                                {MENU_DESKTOP.map(item => {
                                    return (
                                        <div
                                            key={item.type}
                                            className='dashboard__botlist__table__row__actions--item'
                                            onClick={e => {
                                                e.stopPropagation();
                                                viewRecentStrategy(item.type, workspace);
                                            }}
                                        >
                                            <img src={item.icon} />
                                        </div>
                                    );
                                })}
                            </td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}); 

const Dashboard = observer(() => {
    const onClickUserGuide = () => {
    };
     const { load_modal } = useStore();
     const { setDashboardStrategies} = load_modal;
    return (
        <React.Fragment>
            <div className='dashboard'>
                <div className='dashboard__header'>
                    <button className='dashboard__user-guide-button' onClick={onClickUserGuide}>
                        <img src='/ic-user-guide.svg' alt='My SVG' />
                        User Guide
                    </button>
                </div>
                <div className='dashboard__description'>
                    Import a bot from your computer or Google Drive, build it from scratch, or start with a quick
                    strategy.
                </div>
                <DashboardQuickActions />
                <DashboardBotList />
                <DeleteDialog setStrategies={setDashboardStrategies} />
                <SaveModal />
            </div>
        </React.Fragment>
    );
});

export default Dashboard;
