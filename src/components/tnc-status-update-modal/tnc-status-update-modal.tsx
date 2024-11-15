import React from 'react';
import { observer } from 'mobx-react-lite';
import { api_base } from '@/external/bot-skeleton/services/api/api-base';
import { useApiBase } from '@/hooks/useApiBase';
import useIsTNCNeeded from '@/hooks/useIsTNCNeeded';
import { useStore } from '@/hooks/useStore';
import { Button, Link, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import Modal from '../shared_ui/modal';
import './tnc-status-update-modal.scss';

const TncStatusUpdateModal: React.FC = observer(() => {
    const { isAuthorized } = useApiBase();
    const { client } = useStore();
    const { is_cr_account } = client;
    const [is_tnc_open, setIsTncOpen] = React.useState(false);
    const { isDesktop } = useDevice();
    const is_tnc_needed = useIsTNCNeeded();

    React.useEffect(() => {
        if (is_tnc_needed) {
            setIsTncOpen(true);
        }
    }, [is_tnc_needed]);

    const onClick = async () => {
        if (isAuthorized) {
            await api_base.api.send({ tnc_approval: 1 });
            setIsTncOpen(false);
        }
    };

    const tncLink = is_cr_account
        ? 'https://deriv.com/eu/terms-and-conditions#clients'
        : 'https://deriv.com/terms-and-conditions#clients';

    return (
        <Modal className='tnc-status-update-modal-wrapper' is_open={is_tnc_open} has_close_icon={false} width='44rem'>
            <div className='tnc-status-update-modal'>
                <Text size={isDesktop ? 'sm' : 'md'} bold>
                    <Localize i18n_default_text="Updated T&C's" />
                </Text>
                <div className='tnc-status-update-modal__text-container'>
                    <Text size={isDesktop ? 'sm' : 'md'}>
                        <Localize
                            i18n_default_text='Please review our updated <0>terms and conditions</0>.'
                            components={[
                                <Link className='tnc-link' key={0} size={isDesktop ? 'sm' : 'md'} href={tncLink} />,
                            ]}
                        />
                    </Text>
                    <Text size={isDesktop ? 'sm' : 'md'}>
                        <Localize i18n_default_text='By continuing you understand and accept the changes.' />
                    </Text>
                </div>
                <div className='tnc-status-update-modal__button'>
                    <Button
                        onClick={onClick}
                        size='md'
                        variant='primary'
                        label={<Localize i18n_default_text='Continue' />}
                    />
                </div>
            </div>
        </Modal>
    );
});

export default TncStatusUpdateModal;
