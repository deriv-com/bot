import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import ThemedScrollbars from '../shared_ui/themed-scrollbars';
import SummaryCard from './summary-card';

type TSummary = {
    is_drawer_open: boolean;
};

const Summary = observer(({ is_drawer_open }: TSummary) => {
    const { ui } = useStore();
    const { dashboard, summary_card } = useStore();
    const { is_contract_loading, contract_info, is_bot_running } = summary_card;
    const { active_tour } = dashboard;
    const { is_mobile } = ui;
    return (
        <div
            className={classnames({
                'run-panel-tab__content': !is_mobile,
                'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
                'run-panel-tab__content--summary-tab': (!is_mobile && is_drawer_open) || active_tour,
            })}
            data-testid='mock-summary'
        >
            <ThemedScrollbars
                className={classnames({
                    summary: !is_contract_loading && !contract_info,
                    'summary--loading':
                        (is_mobile && is_contract_loading) || (is_mobile && !is_contract_loading && contract_info),
                })}
            >
                <SummaryCard
                    is_contract_loading={is_contract_loading}
                    contract_info={contract_info}
                    is_bot_running={is_bot_running}
                />
            </ThemedScrollbars>
        </div>
    );
});

export default Summary;
