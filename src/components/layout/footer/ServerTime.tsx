import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useStore } from '@/hooks/useStore';
import { DATE_TIME_FORMAT_WITH_GMT, DATE_TIME_FORMAT_WITH_OFFSET } from '@/utils/time';
import { Text, Tooltip } from '@deriv-com/ui';
import { useDevice } from '@deriv-com/ui';

const UPDATE_TIME_INTERVAL = 1000;

const ServerTime = observer(() => {
    const { isDesktop } = useDevice();
    const { common } = useStore() ?? {
        common: {
            server_time: moment(),
        },
    };

    // Initialize with UTC/GMT time, not local time
    const [gmtTime, setGmtTime] = useState(moment().utc());
    // Check if we're on the endpoint page
    const isEndpointPage = window.location.pathname.includes('/endpoint');

    useEffect(() => {
        // Only set up interval on endpoint page
        if (isEndpointPage) {
            // Start GMT timer for endpoint page
            const intervalId = setInterval(() => {
                // Update GMT time by 1 second
                setGmtTime(prevTime => moment(prevTime).add(UPDATE_TIME_INTERVAL, 'milliseconds').utc());
            }, UPDATE_TIME_INTERVAL);

            // Clear interval on unmount
            return () => clearInterval(intervalId);
        }
    }, [isEndpointPage]);

    // Use GMT timer on endpoint page, otherwise use server time
    const displayTime = isEndpointPage ? gmtTime : common.server_time;

    return (
        <Tooltip
            as='div'
            className='app-footer__icon'
            data-testid='dt_server_time'
            tooltipContent={displayTime.format(DATE_TIME_FORMAT_WITH_OFFSET)}
        >
            <Text size={isDesktop ? 'xs' : 'sm'}>{displayTime.format(DATE_TIME_FORMAT_WITH_GMT)}</Text>
        </Tooltip>
    );
});

export default ServerTime;
