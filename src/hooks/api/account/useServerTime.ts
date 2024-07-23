import { useMemo } from 'react';
import { toMoment } from '@/components/shared';
import { useTime } from '@deriv-com/api-hooks';
/**
 * Hook that returns the current server time fetched using `time` endpoint
 */
const useServerTime = () => {
    const { data, ...rest } = useTime();

    const modified_data = useMemo(() => {
        if (!data) return;

        const server_time_moment = toMoment(data);
        return {
            /** Returns the server time in an instance of Moment */
            server_time_moment,
            /** Returns the server time in UTC format */
            server_time_utc: server_time_moment.utc().valueOf(),
        };
    }, [data]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useServerTime;
