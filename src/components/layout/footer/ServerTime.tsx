// import { DATE_TIME_FORMAT_WITH_GMT, DATE_TIME_FORMAT_WITH_OFFSET } from '@/constants';
import useSyncedTime from '@/hooks/useSyncedTime';
import {
    DATE_TIME_FORMAT_WITH_GMT,
    // DATE_TIME_FORMAT_WITH_OFFSET,
    // epochToLocal,
    epochToUTC,
} from '@/utils/time';
import { Text, useDevice } from '@deriv-com/ui';

const ServerTime = () => {
    const time = useSyncedTime();
    const UTCFormat = epochToUTC(time, DATE_TIME_FORMAT_WITH_GMT);
    // const localFormat = epochToLocal(time, DATE_TIME_FORMAT_WITH_OFFSET);
    const { isDesktop } = useDevice();

    return (
        // TODO: fix
        // <TooltipMenuIcon
        //     as='div'
        //     className='app-footer__icon'
        //     data-testid='dt_server_time'
        //     disableHover
        //     tooltipContent={localFormat}
        // >
        <Text size={isDesktop ? 'xs' : 'sm'}>{UTCFormat}</Text>
        // </TooltipMenuIcon>
    );
};

export default ServerTime;
