import React from 'react';
import { observer } from 'mobx-react-lite';

import { localize } from '@deriv-com/translations';
import { Dialog, Text } from '@deriv-com/ui';

import { useStore } from '@/hooks/useStore';
import { Icon } from '@/utils/tmp/dummy';

const BotStopped = observer(() => {
    const { dashboard } = useStore();
    const { is_web_socket_intialised } = dashboard;
    const onClickClose = () => {
        location.reload();
    };
    return (
        <Dialog
            is_visible={!is_web_socket_intialised}
            is_mobile_full_width
            className={'dc-dialog bot-stopped-dialog'}
            cancel_button_text={localize('Go to Reports')}
            confirm_button_text={localize('Back to Bot')}
            onCancel={() => location.replace('reports/positions')}
            onConfirm={() => location.reload()}
        >
            <div className='dc-dialog__content__header'>
                <Text data-testid='data-title' weight='bold' as='p' align='left' size='s' color='prominent'>
                    {localize("You're back online")}
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
                    <Icon icon='IcCross' />
                </div>
            </div>
            <Text as='p' align='left' size='xs' color='prominent'>
                {localize(
                    'The bot has stopped, but your trade may still be running. You can check it on the Reports page.'
                )}
            </Text>
        </Dialog>
    );
});

export default BotStopped;
