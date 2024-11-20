import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import Modal from '@/components/shared_ui/modal';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
import { Icon } from '@/utils/tmp/dummy';
import { Localize, localize } from '@deriv-com/translations';
import { ContentFlag } from '../shared';

const TradingAssesmentModal: React.FC = observer(() => {
    const store = useStore();
    const { client, ui } = store;

    const { is_trading_experience_incomplete, content_flag, is_logged_in, accounts, loginid } = client;

    const { is_trading_assessment_for_new_user_enabled } = ui;

    const should_show_trading_assessment_existing_user_form = useMemo(() => {
        return (
            is_logged_in &&
            accounts?.[loginid]?.landing_company_name === 'maltainvest' &&
            !is_trading_assessment_for_new_user_enabled &&
            is_trading_experience_incomplete &&
            content_flag !== ContentFlag.LOW_RISK_CR_EU &&
            content_flag !== ContentFlag.LOW_RISK_CR_NON_EU
        );
    }, [
        is_logged_in,
        is_trading_assessment_for_new_user_enabled,
        is_trading_experience_incomplete,
        content_flag,
        accounts,
        loginid,
    ]);
    return (
        <Modal
            is_open={should_show_trading_assessment_existing_user_form || false}
            width='44rem'
            className='trade-modal-wrapper'
        >
            <Modal.Body>
                <Icon icon={'ic-currency-eur-check'} className='currency-icon' size={95} />
                <Text as='p' align='center' weight='bold' className='verified-account__text'>
                    <Localize i18n_default_text='Trading Experience Assessment<0/>' components={[<br key={0} />]} />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize
                        i18n_default_text='As per our regulatory obligations, we are required to assess your trading knowledge and experience.<0/><0/>Please click ‘OK’ to continue'
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='button'
                    large
                    text={localize('OK')}
                    primary
                    onClick={() => {
                        window.location.assign('https://app.deriv.com/account/trading-assessment');
                    }}
                />
            </Modal.Footer>
        </Modal>
    );
});

export default TradingAssesmentModal;
