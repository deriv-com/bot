import { TNotificationMessage } from '@deriv/stores/types';
import { localize } from '@deriv-com/translations';
import { BrandConstants } from '@deriv-com/utils';

const { platforms } = BrandConstants;

export const switch_account_notification = () => ({
    key: 'bot_switch_account',
    header: localize('You have switched accounts.'),
    message: localize(
        'Our system will finish any Deriv Bot trades that are running, and Deriv Bot will not place any new trades.'
    ),
    type: 'warning',
    is_persistent: true,
});

export const journalError = (onClick: () => void): TNotificationMessage => {
    return {
        key: 'bot_error',
        header: localize('The bot encountered an error while running.'),
        action: {
            text: localize('View in Journal'),
            onClick,
        },
        type: 'danger',
        platform: platforms.dBot,
        is_disposable: true,
    };
};
