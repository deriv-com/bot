import { useMemo } from 'react';
import clsx from 'clsx';
import useNetworkStatus from '@/hooks/useNetworkStatus';
// import { useTranslations } from '@deriv-com/translations';

const statusConfigs = {
    blinking: {
        className: 'app-footer__network-status-online app-footer__network-status-blinking',
        tooltip: 'Connecting to server',
    },
    offline: { className: 'app-footer__network-status-offline', tooltip: 'Offline' },
    online: { className: 'app-footer__network-status-online', tooltip: 'Online' },
};

const NetworkStatus = () => {
    // TODO complete the logic by adding the socket connctions status
    const status = useNetworkStatus();
    // const { localize } = useTranslations();
    const {
        className,
        // tooltip
    } = useMemo(() => statusConfigs[status], [status]);

    return (
        // <TooltipMenuIcon
        //     as='div'
        //     className='app-footer__icon'
        //     data-testid='dt_network_status'
        //     disableHover
        //     tooltipContent={localize('Network status: {{status}}', { status: tooltip })}
        // >
        <div className={clsx('app-footer__network-status', className)} data-testid='dt_circle' />
        // </TooltipMenuIcon>
    );
};

export default NetworkStatus;
