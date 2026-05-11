import React from 'react';
import { observer } from 'mobx-react-lite';
import { getUrlBase, standalone_routes } from '@/components/shared';
import { useStore } from '@/hooks/useStore';
import { Button, Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { markPositionsBannerSeen, usePositionsBannerSeen } from './use-positions-banner-seen';

const PositionsBannerModal = observer(() => {
    const store = useStore();
    const is_logged_in = store?.client?.is_logged_in;
    const { isMobile } = useDevice();

    const [is_modal_open, setIsModalOpen] = React.useState(false);
    // Shared hook — also consumed by TourStartDialog so the welcome/tour
    // suppresses itself while this modal is pending on mobile.
    const is_seen = usePositionsBannerSeen();
    const timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const onClose = () => {
        markPositionsBannerSeen();
        setIsModalOpen(false);
    };

    const onReview = () => {
        markPositionsBannerSeen();
        setIsModalOpen(false);
        // Reports lives on app.deriv.com — full navigation is intentional.
        window.location.assign(standalone_routes.reports);
    };

    React.useEffect(() => {
        // Modal is mobile-only, logged-in-only, and one-time-per-browser.
        if (!isMobile || !is_logged_in || is_seen) return undefined;

        // Delay matches OnboardingGuide. Opening synchronously on mount races
        // with the CSSTransition setState inside Quill UI's modal during the
        // initial commit phase and can cause an intermittent crash.
        timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);
        return () => clearTimeout(timeout_ref.current);
    }, [isMobile, is_logged_in, is_seen]);

    // Conditionally mount — modal is mobile-only, logged-in-only, and one-time-per-browser.
    if (!isMobile || !is_logged_in || is_seen) return null;

    return (
        <Modal
            isOpened={is_modal_open}
            isNonExpandable
            isMobile={isMobile}
            showHandleBar
            showCrossIcon={false}
            shouldCloseModalOnSwipeDown
            toggleModal={onClose}
            showPrimaryButton={false}
            hasFooter={false}
            className='positions-banner-modal'
        >
            <Modal.Header
                image={<img src={getUrlBase('/assets/images/clock_warning.png')} alt='' width={96} height={96} />}
                className='positions-banner-modal__header'
            />
            <Modal.Body>
                <div className='positions-banner-modal__content'>
                    <Text as='h2' size='lg' bold className='positions-banner-modal__title'>
                        <Localize i18n_default_text='Close positions by 13 June' />
                    </Text>
                    <Text size='md' className='positions-banner-modal__description'>
                        <Localize i18n_default_text="We're upgrading Deriv Bot on 13 June at 06:00 UTC." />
                    </Text>
                    <Text size='md' className='positions-banner-modal__description'>
                        <Localize i18n_default_text='Any running bots and open positions will be automatically closed at this time, so please review and close yours beforehand.' />
                    </Text>
                    <Text size='md' className='positions-banner-modal__description'>
                        <Localize i18n_default_text="You'll be able to run new bots after the upgrade." />
                    </Text>
                    <Button
                        className='positions-banner-modal__cta'
                        variant='primary'
                        color='coral'
                        size='lg'
                        fullWidth
                        label={<Localize i18n_default_text='Review positions' />}
                        onClick={onReview}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
});

// Layout re-renders often (auth/currency state churn) — memoise to avoid
// pointless re-renders while the modal sits in the tree.
export default React.memo(PositionsBannerModal);
