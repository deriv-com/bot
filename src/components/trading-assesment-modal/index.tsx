import React from 'react';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import Modal from '@/components/shared_ui/modal';
import Text from '@/components/shared_ui/text';
import { Localize, localize } from '@deriv-com/translations';
import { Icon } from '@/utils/tmp/dummy';


type TOnboardTourHandler = {
    is_mobile: boolean;
};

const TradingAssesmentModal: React.FC<TOnboardTourHandler> = observer(({ is_mobile }) => {
    return (
        <Modal width="44rem" is_open={true} className='trade-modal-wrapper'>
            <Modal.Body>
                <Icon icon={'ic-currency-eur-check'} className='currency-icon' size={95} />
                <Text as="p" align="center" weight="bold" className="verified-account__text">
                    <Localize i18n_default_text="Trading Experience Assessment<0/>" components={[<br key={0} />]} />
                </Text>
                <Text as="p" size="xs" align="center">
                    <Localize
                        i18n_default_text="As per our regulatory obligations, we are required to assess your trading knowledge and experience.<0/><0/>Please click ‘OK’ to continue"
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" large text={localize('OK')} primary      onClick={() => {
                                window.location.assign('https://app.deriv.com/account/trading-assessment');
                            }} />
            </Modal.Footer>
        </Modal>
    );
});

export default TradingAssesmentModal;
