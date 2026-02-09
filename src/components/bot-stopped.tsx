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
    const { dashboard, run_panel, client } = useStore();
    const { is_web_socket_intialised } = dashboard;

    const { is_running } = run_panel;
    const isOnline = useNavigatorOnline();

    // Get client information for the report URL
    const getCurrency = client?.getCurrency;
    const currency = getCurrency?.();

    // Check if the account is a demo account
    // Use the URL parameter to determine if it's a demo account, as this will update when the account changes
    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');
    const is_virtual = client?.is_virtual || account_param === 'demo' || false;

    // Determine the type of disconnection
    const isInternetDisconnection = !isOnline && is_running;
    const isInternalIssue = !is_web_socket_intialised && isOnline;

    // Show popup for either condition
    const shouldShowPopup = isInternetDisconnection || isInternalIssue;

    const onClickClose = () => {
        location.reload();
    };

    return (
        <Dialog
            is_visible={shouldShowPopup}
            is_mobile_full_width
            className={'dc-dialog bot-stopped-dialog'}
            cancel_button_text={!isInternetDisconnection ? localize('View Report') : undefined}
            confirm_button_text={!isInternetDisconnection ? localize('Back to Bot') : undefined}
            onCancel={
                !isInternetDisconnection
                    ? () => {
                          const url = new URL(standalone_routes.positions);

                          // Add account parameter based on account type
                          if (is_virtual) {
                              // For demo accounts, set the account parameter to 'demo'
                              url.searchParams.set('account', 'demo');
                          } else if (currency) {
                              // For real accounts, set the account parameter to the currency
                              url.searchParams.set('account', currency);
                          }

                          window.location.href = url.toString();
                      }
                    : undefined
            }
            onConfirm={() => location.reload()}
            login={() => {}}
        >
            <div className='dc-dialog__content__header'>
                <Text data-testid='data-title' weight='bold' as='p' align='left' size='s' color='prominent'>
                    {isInternetDisconnection ? (
                        <Localize i18n_default_text="You're offline" />
                    ) : (
                        <Localize i18n_default_text='Connection Interrupted' />
                    )}
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
                {isInternetDisconnection ? (
                    <Localize i18n_default_text='Your bot is paused while you’re offline. Reconnect to continue trading.' />
                ) : (
                    <Localize i18n_default_text='Your connection to the server was lost. All trades have been settled. Check the Reports page for final results.' />
                )}
            </Text>
        </Dialog>
    );
});

export default BotStopped;
