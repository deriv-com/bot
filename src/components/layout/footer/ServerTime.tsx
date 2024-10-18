import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useStore } from '@/hooks/useStore';
import { DATE_TIME_FORMAT_WITH_GMT, DATE_TIME_FORMAT_WITH_OFFSET } from '@/utils/time';
import { Text, Tooltip } from '@deriv-com/ui';
import { useDevice } from '@deriv-com/ui';

const ServerTime = observer(() => {
    const { isDesktop } = useDevice();
    const { common } = useStore() ?? {
        common: {
            server_time: moment(),
        },
    };

    return (
        <Tooltip
            as='div'
            className='app-footer__icon'
            data-testid='dt_server_time'
            tooltipContent={common.server_time.format(DATE_TIME_FORMAT_WITH_OFFSET)}
        >
            <Text size={isDesktop ? 'xs' : 'sm'}>{common.server_time.format(DATE_TIME_FORMAT_WITH_GMT)}</Text>
        </Tooltip>
    );
});

export default ServerTime;
