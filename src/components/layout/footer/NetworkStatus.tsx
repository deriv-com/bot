import { useMemo } from 'react';
import clsx from 'clsx';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { localize } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const statusConfigs = () => ({
    blinking: {
        className: 'app-footer__network-status-online app-footer__network-status-blinking',
        tooltip: localize('Connecting to server'),
    },
    offline: { className: 'app-footer__network-status-offline', tooltip: 'Offline' },
    online: { className: 'app-footer__network-status-online', tooltip: 'Online' },
});

const NetworkStatus = () => {
    const status = useNetworkStatus();
    const { className, tooltip } = useMemo(() => statusConfigs()[status], [status]);

    return (
        <Tooltip
            as='div'
            className='app-footer__icon'
            data-testid='dt_network_status'
            tooltipContent={localize('Network status: {{status}}', { status: tooltip })}
        >
            <div className={clsx('app-footer__network-status', className)} data-testid='dt_circle' />
        </Tooltip>
    );
};

export default NetworkStatus;
