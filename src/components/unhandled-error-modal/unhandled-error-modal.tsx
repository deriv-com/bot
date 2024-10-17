import React from 'react';
import { DerivLightUserErrorIcon } from '@deriv/quill-icons/Illustration';
import { getDefaultError } from '../shared/utils/constants';
import Button from '../shared_ui/button';
import DesktopWrapper from '../shared_ui/desktop-wrapper';
import MobileDialog from '../shared_ui/mobile-dialog';
import MobileWrapper from '../shared_ui/mobile-wrapper';
import Modal from '../shared_ui/modal';
import Text from '../shared_ui/text';

const ModalContent = () => (
    <div className='unhandled-error'>
        <DerivLightUserErrorIcon height='120px' width='120px' />

        <Text
            className='da-icon-with-message__text'
            as='p'
            size='s'
            color='general'
            lineHeight='xxl'
            align='center'
            weight='bold'
        >
            {getDefaultError().header}
        </Text>
        <Text
            className='da-icon-with-message__text__desc'
            as='p'
            size='xs'
            color='general'
            lineHeight='xxs'
            align='center'
        >
            {getDefaultError().description}
        </Text>
        <Button onClick={() => location.reload()} has_effect primary large text={getDefaultError().cta_label} />
    </div>
);

const UnhandledErrorModal = () => {
    const [is_page_error_modal_open, setPageErrorModalOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        setPageErrorModalOpen(true);
    }, []);

    const togglePageErrorModal = () => {
        setPageErrorModalOpen(!is_page_error_modal_open);
    };

    return (
        <Modal
            has_close_icon
            width='440px'
            height='284px'
            is_open={is_page_error_modal_open}
            toggleModal={togglePageErrorModal}
        >
            <DesktopWrapper>
                <Modal.Body>
                    <ModalContent />
                </Modal.Body>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    has_close_icon
                    visible={is_page_error_modal_open}
                    onClose={togglePageErrorModal}
                >
                    <Modal.Body>
                        <ModalContent />
                    </Modal.Body>
                </MobileDialog>
            </MobileWrapper>
        </Modal>
    );
};

export default UnhandledErrorModal;
