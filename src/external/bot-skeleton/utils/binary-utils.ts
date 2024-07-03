import { TickSpotData } from '@deriv/api-types';

export const getLast = (arr: any[]): any => arr && (arr.length === 0 ? undefined : arr[arr.length - 1]);

export const historyToTicks = (history: any): TickSpotData[] =>
    history.times.map((t, idx) => ({
        epoch: +t,
        quote: +history.prices[idx],
    }));
