import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import OnboardTourHandler from '../tutorials/dbot-tours/onboarding-tour';
import Cards from './cards';
import InfoPanel from './info-panel';
import UserGuide from './user-guide';

type TMobileIconGuide = {
    handleTabChange: (active_number: number) => void;
};

const DashboardComponent = observer(({ handleTabChange }: TMobileIconGuide) => {
    const { ui } = useStore();
    const { load_modal, dashboard } = useStore();
    const { dashboard_strategies } = load_modal;
    const { setActiveTabTutorial, active_tab, active_tour } = dashboard;
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const { is_mobile } = ui;

    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': active_tour,
                })}
            >
                <div className='tab__dashboard__content'>
                    <UserGuide
                        is_mobile={is_mobile}
                        handleTabChange={handleTabChange}
                        setActiveTabTutorial={setActiveTabTutorial}
                    />
                    <div className='quick-panel'>
                        <div
                            className={classNames('tab__dashboard__header', {
                                'tab__dashboard__header--listed': !is_mobile && has_dashboard_strategies,
                            })}
                        >
                            {!has_dashboard_strategies && (
                                <Text className='title' as='h2' color='prominent' size='lg' weight='bold'>
                                    {localize('Load or build your bot')}
                                </Text>
                            )}
                            <Text
                                as='p'
                                color='prominent'
                                LineHeight='sm'
                                size='md'
                                className={classNames('subtitle', { 'subtitle__has-list': has_dashboard_strategies })}
                            >
                                {localize(
                                    'Import a bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                                )}
                            </Text>
                        </div>
                        <Cards has_dashboard_strategies={has_dashboard_strategies} is_mobile={is_mobile} />
                    </div>
                </div>
            </div>
            <InfoPanel />
            {active_tab === 0 && <OnboardTourHandler is_mobile={is_mobile} />}
        </React.Fragment>
    );
});

export default DashboardComponent;
