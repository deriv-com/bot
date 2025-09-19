import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Journal from '@/components/journal';
import SelfExclusion from '@/components/self-exclusion';
import Button from '@/components/shared_ui/button';
import Drawer from '@/components/shared_ui/drawer';
import Modal from '@/components/shared_ui/modal';
import Money from '@/components/shared_ui/money';
import Tabs from '@/components/shared_ui/tabs';
import Text from '@/components/shared_ui/text';
import Summary from '@/components/summary';
import TradeAnimation from '@/components/trade-animation';
import Transactions from '@/components/transactions';
import { DBOT_TABS } from '@/constants/bot-contents';
import { popover_zindex } from '@/constants/z-indexes';
import usePWA from '@/hooks/usePWA';
import { useStore } from '@/hooks/useStore';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import ThemedScrollbars from '../shared_ui/themed-scrollbars';

type TStatisticsTile = {
    content: React.ElementType | string;
    contentClassName: string;
    title: string;
};

type TStatisticsSummary = {
    currency: string;
    is_mobile: boolean;
    lost_contracts: number;
    number_of_runs: number;
    total_stake: number;
    total_payout: number;
    toggleStatisticsInfoModal: () => void;
    total_profit: number;
    won_contracts: number;
};
type TDrawerHeader = {
    is_clear_stat_disabled: boolean;
    is_mobile: boolean;
    is_drawer_open: boolean;
    onClearStatClick: () => void;
};

type TDrawerContent = {
    active_index: number;
    is_drawer_open: boolean;
    active_tour: string;
    setActiveTabIndex: () => void;
};

type TDrawerFooter = {
    is_clear_stat_disabled: boolean;
    onClearStatClick: () => void;
};

type TStatisticsInfoModal = {
    is_mobile: boolean;
    is_statistics_info_modal_open: boolean;
    toggleStatisticsInfoModal: () => void;
};

const StatisticsTile = ({ content, contentClassName, title }: TStatisticsTile) => (
    <div className='run-panel__tile'>
        <div className='run-panel__tile-title'>{title}</div>
        <div className={classNames('run-panel__tile-content', contentClassName)}>{content}</div>
    </div>
);

export const StatisticsSummary = ({
    currency,
    is_mobile,
    lost_contracts,
    number_of_runs,
    total_stake,
    total_payout,
    toggleStatisticsInfoModal,
    total_profit,
    won_contracts,
}: TStatisticsSummary) => (
    <div
        className={classNames('run-panel__stat', {
            'run-panel__stat--mobile': is_mobile,
        })}
    >
        <div className='run-panel__stat--info' onClick={toggleStatisticsInfoModal}>
            <div className='run-panel__stat--info-item'>
                <Localize i18n_default_text="What's this?" />
            </div>
        </div>
        <div className='run-panel__stat--tiles'>
            <StatisticsTile
                title={localize('Total stake')}
                alignment='top'
                content={<Money amount={total_stake} currency={currency} show_currency />}
            />
            <StatisticsTile
                title={localize('Total payout')}
                alignment='top'
                content={<Money amount={total_payout} currency={currency} show_currency />}
            />
            <StatisticsTile title={localize('No. of runs')} alignment='top' content={number_of_runs} />
            <StatisticsTile title={localize('Contracts lost')} alignment='bottom' content={lost_contracts} />
            <StatisticsTile title={localize('Contracts won')} alignment='bottom' content={won_contracts} />
            <StatisticsTile
                title={localize('Total profit/loss')}
                content={<Money amount={total_profit} currency={currency} has_sign show_currency />}
                alignment='bottom'
                contentClassName={classNames('run-panel__stat-amount', {
                    'run-panel__stat-amount--positive': total_profit > 0,
                    'run-panel__stat-amount--negative': total_profit < 0,
                })}
            />
        </div>
    </div>
);

const DrawerHeader = ({ is_clear_stat_disabled, is_mobile, is_drawer_open, onClearStatClick }: TDrawerHeader) =>
    is_mobile &&
    is_drawer_open && (
        <Button
            id='db-run-panel__clear-button'
            className='run-panel__clear-button'
            disabled={is_clear_stat_disabled}
            text={localize('Reset')}
            onClick={onClearStatClick}
            secondary
        />
    );

const DrawerContent = ({ active_index, is_drawer_open, active_tour, setActiveTabIndex, ...props }: TDrawerContent) => {
    const { isDesktop } = useDevice();
    // Use the useBlockScroll hook to prevent body scrolling when drawer is open on mobile

    React.useEffect(() => {
        if (!isDesktop && is_drawer_open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [is_drawer_open]);

    return (
        <>
            <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
                <div id='db-run-panel-tab__summary' label={<Localize i18n_default_text='Summary' />}>
                    <Summary is_drawer_open={is_drawer_open} />
                </div>
                <div id='db-run-panel-tab__transactions' label={<Localize i18n_default_text='Transactions' />}>
                    <Transactions is_drawer_open={is_drawer_open} />
                </div>
                <div id='db-run-panel-tab__journal' label={<Localize i18n_default_text='Journal' />}>
                    <Journal />
                </div>
            </Tabs>
            {((is_drawer_open && active_index !== 2) || active_tour) && <StatisticsSummary {...props} />}
        </>
    );
};

const DrawerFooter = ({ is_clear_stat_disabled, onClearStatClick }: TDrawerFooter) => (
    <div className='run-panel__footer'>
        <Button
            id='db-run-panel__clear-button'
            className='run-panel__footer-button'
            disabled={is_clear_stat_disabled}
            onClick={onClearStatClick}
            has_effect
            secondary
        >
            <span>
                <Localize i18n_default_text='Reset' />
            </span>
        </Button>
    </div>
);

const MobileDrawerFooter = () => {
    const { isPWALaunch, isIOS } = usePWA();
    return (
        <div className={classNames('controls__section', { 'controls__section--ios-pwa': isIOS && isPWALaunch })}>
            <div className='controls__buttons'>
                <TradeAnimation className='controls__animation' should_show_overlay />
            </div>
        </div>
    );
};

const StatisticsInfoModal = ({
    is_mobile,
    is_statistics_info_modal_open,
    toggleStatisticsInfoModal,
}: TStatisticsInfoModal) => {
    return (
        <Modal
            className={classNames('statistics__modal', { 'statistics__modal--mobile': is_mobile })}
            title={localize("What's this?")}
            is_open={is_statistics_info_modal_open}
            toggleModal={toggleStatisticsInfoModal}
            width={'440px'}
        >
            <Modal.Body>
                <div className={classNames('statistics__modal-body', { 'statistics__modal-body--mobile': is_mobile })}>
                    <ThemedScrollbars className='statistics__modal-scrollbar'>
                        <Text as='p' weight='bold' className='statistics__modal-body--content no-margin'>
                            <Localize i18n_default_text='Total stake' />
                        </Text>
                        <Text as='p'>
                            <Localize i18n_default_text='Total stake since you last cleared your stats.' />
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            <Localize i18n_default_text='Total payout' />
                        </Text>
                        <Text as='p'>{localize('Total payout since you last cleared your stats.')}</Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            <Localize i18n_default_text='No. of runs' />
                        </Text>
                        <Text as='p'>
                            <Localize i18n_default_text='The number of times your bot has run since you last cleared your stats. Each run includes the execution of all the root blocks.' />
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            <Localize i18n_default_text='Contracts lost' />
                        </Text>
                        <Text as='p'>
                            <Localize i18n_default_text='The number of contracts you have lost since you last cleared your stats.' />
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            <Localize i18n_default_text='Contracts won' />
                        </Text>
                        <Text as='p'>
                            <Localize i18n_default_text='The number of contracts you have won since you last cleared your stats.' />
                        </Text>
                        <Text as='p' weight='bold' className='statistics__modal-body--content'>
                            <Localize i18n_default_text='Total profit/loss' />
                        </Text>
                        <Text as='p'>
                            <Localize i18n_default_text='Your total profit/loss since you last cleared your stats. It is the difference between your total payout and your total stake.' />
                        </Text>
                    </ThemedScrollbars>
                </div>
            </Modal.Body>
        </Modal>
    );
};

const RunPanel = observer(() => {
    const { run_panel, dashboard, transactions } = useStore();
    const { client } = useStore();
    const { isDesktop } = useDevice();
    const { currency } = client;
    const {
        active_index,
        is_drawer_open,
        is_statistics_info_modal_open,
        is_clear_stat_disabled,
        onClearStatClick,
        onMount,
        onRunButtonClick,
        onUnmount,
        setActiveTabIndex,
        toggleDrawer,
        toggleStatisticsInfoModal,
    } = run_panel;
    const { statistics } = transactions;
    const { active_tour, active_tab } = dashboard;
    const { total_payout, total_profit, total_stake, won_contracts, lost_contracts, number_of_runs } = statistics;
    const { BOT_BUILDER, CHART } = DBOT_TABS;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        if (!isDesktop) {
            toggleDrawer(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const content = (
        <DrawerContent
            active_index={active_index}
            currency={currency}
            is_drawer_open={is_drawer_open}
            is_mobile={!isDesktop}
            lost_contracts={lost_contracts}
            number_of_runs={number_of_runs}
            setActiveTabIndex={setActiveTabIndex}
            toggleStatisticsInfoModal={toggleStatisticsInfoModal}
            total_payout={total_payout}
            total_profit={total_profit}
            total_stake={total_stake}
            won_contracts={won_contracts}
            active_tour={active_tour}
        />
    );

    const footer = <DrawerFooter is_clear_stat_disabled={is_clear_stat_disabled} onClearStatClick={onClearStatClick} />;

    const header = (
        <DrawerHeader
            is_clear_stat_disabled={is_clear_stat_disabled}
            is_mobile={!isDesktop}
            is_drawer_open={is_drawer_open}
            onClearStatClick={onClearStatClick}
        />
    );

    const show_run_panel = [BOT_BUILDER, CHART].includes(active_tab) || active_tour;
    if ((!show_run_panel && isDesktop) || active_tour === 'bot_builder') return null;

    return (
        <>
            <div className={!isDesktop && is_drawer_open ? 'run-panel__container--mobile' : 'run-panel'}>
                <Drawer
                    anchor='right'
                    className={classNames('run-panel', {
                        'run-panel__container': isDesktop,
                        'run-panel__container--tour-active': isDesktop && active_tour,
                    })}
                    contentClassName='run-panel__content'
                    header={header}
                    footer={isDesktop && footer}
                    is_open={is_drawer_open}
                    toggleDrawer={toggleDrawer}
                    width={366}
                    zIndex={popover_zindex.RUN_PANEL}
                >
                    {content}
                </Drawer>
                {!isDesktop && <MobileDrawerFooter />}
            </div>
            <SelfExclusion onRunButtonClick={onRunButtonClick} />
            <StatisticsInfoModal
                is_mobile={!isDesktop}
                is_statistics_info_modal_open={is_statistics_info_modal_open}
                toggleStatisticsInfoModal={toggleStatisticsInfoModal}
            />
        </>
    );
});

export default RunPanel;
