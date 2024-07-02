import React from 'react';
import { observer } from 'mobx-react-lite';

import { isMobileOs } from '@/components/shared';
import { DBOT_TABS } from '@/constants/bot-contents';
import { CONTEXT_MENU_MOBILE, MENU_DESKTOP, STRATEGY } from '@/constants/dashboard';
import { getSavedWorkspaces, timeSince } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { waitForDomElement } from '@/utils/dom-observer';

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

    if (!dashboard_strategies) return null;
    return (
        <div className='dashboard__botlist'>
            <div className='dashboard__botlist__header'>Your Bots</div>
            <table className='dashboard__botlist__table'>
                <thead className='dashboard__botlist__table__header'>
                    <tr className='dashboard__botlist__table__header__row'>
                        <td className='dashboard__botlist__table__title'>Bot Name</td>
                        <td className='dashboard__botlist__table__title'>Last Modified</td>
                        <td className='dashboard__botlist__table__title'>Status</td>
                        <td className='dashboard__botlist__table__title' />
                    </tr>
                </thead>
                <tbody className='dashboard__botlist__table__body'>
                    {dashboard_strategies.map((workspace, index) => (
                        <tr key={workspace.timestamp + index} className='dashboard__botlist__table__row'>
                            <td className='dashboard__botlist__table__row__bot_name'>{workspace.name}</td>
                            <td className='dashboard__botlist__table__row__last_modified'>
                                {timeSince(workspace.timestamp)}
                            </td>
                            <td className='dashboard__botlist__table__row__status'>{workspace.save_type}</td>
                            <td className='dashboard__botlist__table__row__actions'>
                                {MENU_DESKTOP.map(item => (
                                    <div
                                        key={item.type}
                                        className='desktop dashboard__botlist__table__row__actions--item'
                                        onClick={e => {
                                            e.stopPropagation();
                                            viewRecentStrategy(item.type, workspace);
                                        }}
                                    >
                                        <img src={item.icon} alt={item.type} />
                                    </div>
                                ))}
                                <button className='mobile dashboard__botlist__mobile'>
                                    <img src='/ic-menu-dots.svg' />
                                </button>
                                {CONTEXT_MENU_MOBILE.map(item => (
                                    <div
                                        key={item.type}
                                        className='mobile bot-list__item__responsive__menu'
                                        onClick={e => {
                                            e.stopPropagation();
                                            viewRecentStrategy(item.type, workspace);
                                        }}
                                    >
                                        <div>
                                            {/* <Icon icon={item.icon} /> */}
                                            <img src={item.icon} alt={item.type} />
                                        </div>
                                        {item.label}
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default DashboardBotList;
