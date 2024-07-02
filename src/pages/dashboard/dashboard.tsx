import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/hooks/useStore';

import DeleteDialog from './common/delete-dialog/delete-dialog';
import SaveModal from './common/save-modal-dialog/save-modal';
import DashboardBotList from './dashboard-bot-list';
import DashboardQuickActions from './dashboard-quick-actions';

const Dashboard = observer(() => {
    const onClickUserGuide = () => {};
    const { load_modal } = useStore();
    const { setDashboardStrategies } = load_modal;
    return (
        <React.Fragment>
            <div className='dashboard'>
                <div className='dashboard__header'>
                    <button className='dashboard__user-guide-button' onClick={onClickUserGuide}>
                        <img src='icons/ic-user-guide.svg' alt='My SVG' />
                        User Guide
                    </button>
                </div>
                <div className='dashboard__title'>Load or build your bot</div>
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
