import { reaction } from 'mobx';
import { TStatistics } from '@/components/transaction-details/transaction-details.types';
import RootStore from '@/stores/root-store';
import { ProposalOpenContract } from '@deriv/api-types';

const GTM = (() => {
    let timeoutId: NodeJS.Timeout;
    let initialized = false;
    const pushDataLayer = (data: { [key: string]: string | number | boolean; event: string }): void => {
        window.dataLayer?.push(data);
    };

    const init = (_root_store: RootStore): void => {
        if (initialized) return;
        initialized = true;

        function loadGTM() {
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js',
                });
                const f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.defer = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-NF7884S');
        }

        setTimeout(() => {
            loadGTM();
        }, 3000);

        try {
            const { run_panel, transactions, client, common } = _root_store;
            reaction(
                () => run_panel.is_running,
                (() => {
                    return () => {
                        if (run_panel.is_running) {
                            clearTimeout(timeoutId);
                            timeoutId = setTimeout(() => {
                                onRunBot(client?.loginid, common?.server_time?.unix(), transactions?.statistics);
                            }, 500);
                        }
                    };
                })()
            );
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Error initializing GTM reactions ', error);
        }
    };

    const onRunBot = (login_id: string, server_time: number, statistics: TStatistics): void => {
        try {
            const run_id = `${login_id}-${server_time}`;
            const counters = `tr:${statistics.number_of_runs},\
                ts:${statistics.total_stake},\
                py:${statistics.total_payout},\
                lc:${statistics.lost_contracts},\
                wc:${statistics.won_contracts},\
                pr:${statistics.total_profit}`;

            const data = {
                counters: counters.replace(/\s/g, ''),
                event: 'dbot_run',
                run_id,
            };
            pushDataLayer(data);
        } catch (error) {
            console.warn('Error pushing run data to datalayer ', error); // eslint-disable-line no-console
        }
    };

    const onTransactionClosed = (contract: ProposalOpenContract): void => {
        const data = {
            event: 'dbot_run_transaction',
            reference_id: contract?.contract_id ?? '',
        };
        pushDataLayer(data);
    };

    return {
        init,
        pushDataLayer,
        onTransactionClosed,
        onRunBot,
    };
})();

export default GTM;
