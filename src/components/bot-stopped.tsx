import React from 'react';
import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';

import useNavigatorOnline from '@/hooks/useNavigatorOnline';
import { useStore } from '@/hooks/useStore';

import { LegacyClose1pxIcon } from '@deriv/quill-icons/Legacy';
import { Localize, localize } from '@deriv-com/translations';
import Dialog from './shared_ui/dialog';
import { standalone_routes } from './shared';

const BotStopped = observer(() => {
    const { dashboard, run_panel } = useStore();
    const { is_web_socket_intialised } = dashboard;

    const { is_running } = run_panel;
    const isOnline = useNavigatorOnline();

    // Determine the type of disconnection
    const isInternetDisconnection = !isOnline && is_running;
    const isInternalIssue = !is_web_socket_intialised && isOnline;

    // Show popup for either condition
    const shouldShowPopup = isInternetDisconnection || isInternalIssue;

    const onClickClose = () => {
        location.reload();
    };

    // Different text based on disconnection type
    const getTitle = () => {
        if (isInternetDisconnection) {
            return 'Internet connection lost';
        } else {
            return "You're back online";
        }
    };

    const getMessage = () => {
        if (isInternetDisconnection) {
            return 'Your bot will pause trading until the connection is restored. Please check your internet connection.';
        } else {
            return 'The bot has stopped, but your trade may still be running. You can check it on the Reports page.';
        }
    };

    return (
        <Dialog
            is_visible={shouldShowPopup}
            is_mobile_full_width
            className={'dc-dialog bot-stopped-dialog'}
            cancel_button_text={localize('Go to Reports')}
            confirm_button_text={localize('Back to Bot')}
            onCancel={() => (window.location.href = standalone_routes.positions)}
            onConfirm={() => location.reload()}
            // [AI]
            login={() => {}}
        >
            <div className='dc-dialog__content__header'>
                <Text data-testid='data-title' weight='bold' as='p' align='left' size='s' color='prominent'>
                    {/* [AI] */}
                    <Localize i18n_default_text={getTitle()} />
                    {/* [/AI] */}
                </Text>
                <div
                    data-testid='data-close-button'
                    onClick={onClickClose}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') {
                            onClickClose();
                        }
                    }}
                    tabIndex={0}
                >
                    <LegacyClose1pxIcon height='20px' width='20px' fill='var(--text-general)' />
                </div>
            </div>
            <Text as='p' align='left' size='xs' color='prominent'>
                {/* [AI] */}
                <Localize i18n_default_text={getMessage()} />
                {/* [/AI] */}
            </Text>
        </Dialog>
    );
});

export default BotStopped;
