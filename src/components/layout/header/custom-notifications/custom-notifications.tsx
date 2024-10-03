import { useState } from 'react';
import clsx from 'clsx';
import { LegacyNotificationIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { Notifications, Tooltip, useDevice } from '@deriv-com/ui';
import './custom-notifications.scss';

const CustomNotifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslations();
    const { isMobile } = useDevice();

    return (
        <div className='notifications__wrapper'>
            <Tooltip
                as='button'
                onClick={() => setIsOpen(!isOpen)}
                tooltipContent={localize('View notifications')}
                tooltipPosition='bottom'
            >
                <LegacyNotificationIcon iconSize='sm' />
            </Tooltip>
            <Notifications
                className={clsx('', {
                    'notifications__wrapper--mobile': isMobile,
                    'notifications__wrapper--desktop': !isMobile,
                })}
                componentConfig={{
                    clearButtonText: localize('Clear all'),
                    modalTitle: localize('Notifications'),
                    noNotificationsMessage: localize('No notifications MESSAGE'),
                    noNotificationsTitle: localize('No notifications'),
                }}
                isOpen={isOpen}
                notifications={[]}
                setIsOpen={setIsOpen}
                clearNotificationsCallback={() => {}}
                loadMoreFunction={() => {}}
                isLoading={false}
            />
        </div>
    );
};

export default CustomNotifications;
