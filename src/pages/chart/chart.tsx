import { useEffect } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import {
    ActiveSymbolsRequest,
    ServerTimeRequest,
    TicksHistoryResponse,
    TicksStreamRequest,
    TradingTimesRequest,
} from '@deriv/api-types';
import { ChartTitle, SmartChart } from '@deriv/deriv-charts';

import chart_api from '@/external/bot-skeleton/services/api/chart-api';
import { useStore } from '@/hooks/useStore';

import ToolbarWidgets from './toolbar-widgets';

import '@deriv/deriv-charts/dist/smartcharts.css';

type TSubscription = {
    [key: string]: null | {
        unsubscribe?: () => void;
    };
};

type TError = null | {
    error?: {
        code?: string;
        message?: string;
    };
};

const subscriptions: TSubscription = {};

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useStore();

    const {
        chart_type,
        getMarketsOrder,
        granularity,
        onSymbolChange,
        setChartStatus,
        symbol,
        updateChartType,
        updateGranularity,
        updateSymbol,
    } = chart_store;
    const {
        ui: { is_mobile, is_desktop },
    } = useStore();
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;

    const settings = {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: true,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    };

    useEffect(() => {
        return () => {
            chart_api.api.forgetAll('ticks');
            Object.keys(subscriptions).forEach(subscription_id => {
                requestForgetStream(subscription_id);
            });
        };
    }, []);

    useEffect(() => {
        if (!symbol) updateSymbol();
    }, [symbol, updateSymbol]);

    const requestAPI = (req: ServerTimeRequest | ActiveSymbolsRequest | TradingTimesRequest) => {
        return chart_api.api.send(req);
    };

    const requestForget = () => {
        return chart_api.api.forgetAll('ticks');
    };

    const requestForgetStream = (subscription_id: string) => {
        subscriptions[subscription_id as string]?.unsubscribe();
        delete subscriptions[subscription_id];
    };

    const requestSubscribe = async (req: TicksStreamRequest, callback: (data: any) => void) => {
        try {
            const history = await chart_api.api.send(req);
            if (history) callback(history);
            if (req.subscribe === 1) {
                subscriptions[history?.subscription.id] = chart_api.api
                    .onMessage()
                    ?.subscribe(({ data }: { data: TicksHistoryResponse }) => {
                        callback(data);
                    });
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log((e as TError)?.error?.message);
        }
    };

    if (!symbol) return null;
    const is_connection_opened = !!chart_api?.api;

    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && !is_mobile,
                'dashboard__chart-wrapper--modal': is_chart_modal_visible && !is_mobile,
            })}
            dir='ltr'
        >
            <SmartChart
                id='dbot'
                barriers={barriers}
                showLastDigitStats={show_digits_stats}
                chartControlsWidgets={null}
                enabledChartFooter={false}
                chartStatusListener={(v: boolean) => setChartStatus(!v)}
                toolbarWidget={() => (
                    <ToolbarWidgets
                        updateChartType={updateChartType}
                        updateGranularity={updateGranularity}
                        position={is_mobile ? 'bottom' : 'top'}
                    />
                )}
                chartType={chart_type}
                isMobile={is_mobile}
                enabledNavigationWidget={is_desktop}
                granularity={granularity}
                requestAPI={requestAPI}
                requestForget={requestForget}
                requestForgetStream={requestForgetStream}
                requestSubscribe={requestSubscribe}
                settings={settings}
                symbol={symbol}
                topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
                isConnectionOpened={is_connection_opened}
                getMarketsOrder={getMarketsOrder}
                isLive
                leftMargin={80}
            />
        </div>
    );
});

export default Chart;
