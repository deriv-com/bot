import Text from '@/components/shared_ui/text';
import useSyncedTime from '@/hooks/useSyncedTime';
import { DATE_TIME_FORMAT_WITH_GMT, DATE_TIME_FORMAT_WITH_OFFSET, epochToLocal, epochToUTC } from '@/utils/time';
import { Tooltip } from '@deriv-com/ui';
import { useDevice } from '@deriv-com/ui';

const ServerTime = () => {
    const time = useSyncedTime();
    const UTCFormat = epochToUTC(time, DATE_TIME_FORMAT_WITH_GMT);
    const localFormat = epochToLocal(time, DATE_TIME_FORMAT_WITH_OFFSET);
    const { isDesktop } = useDevice();

    return (
        <Tooltip as='div' className='app-footer__icon' data-testid='dt_server_time' tooltipContent={localFormat}>
            <Text size={isDesktop ? 'xs' : 'sm'}>{UTCFormat}</Text>
        </Tooltip>
    );
};

export default ServerTime;
