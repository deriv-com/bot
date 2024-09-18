import { useState } from 'react';
import clsx from 'clsx';
import { LegacyNotificationIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Notifications as UINotifications, Tooltip, useDevice } from '@deriv-com/ui';
import './notifications.scss';

export const Notifications = () => {
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
            <UINotifications
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
