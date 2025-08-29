import React from 'react';
import ReactDOM from 'react-dom';
import MobileFullPageModal from '@/components/shared_ui/mobile-full-page-modal/mobile-full-page-modal';
import Modal from '@/components/shared_ui/modal';
import Text from '@/components/shared_ui/text';
import { usePWA } from '@/hooks/usePWA';
//shouldShowPWAModal
import { markPWAModalDismissed, markPWAModalShown } from '@/utils/pwa-utils';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import './PWAInstallModal.scss';

const PWAInstallModal: React.FC = () => {
    //canInstall
    const { install, isIOS, isAndroid, isPWALaunch } = usePWA();
    const { isMobile, isDesktop } = useDevice();
    const [isOpen, setIsOpen] = React.useState(false);

    // Disabled auto-show functionality - modal only shows via announcements
    // React.useEffect(() => {
    //     if (isDesktop && canInstall && shouldShowPWAModal()) {
    //         // Show modal after a short delay to ensure page is loaded
    //         const timer = setTimeout(() => {
    //             setIsOpen(true);
    //             markPWAModalShown();
    //             trackPWAEvent('modal_auto_shown', {
    //                 trigger: 'first_desktop_visit',
    //             });
    //         }, 2000);

    //         return () => clearTimeout(timer);
    //     }
    // }, [isDesktop, canInstall]);

    // Listen for PWA install modal trigger events (for announcements)
    React.useEffect(() => {
        const handleShowPWAModal = () => {
            setIsOpen(true);
            markPWAModalShown();
        };

        window.addEventListener('showPWAInstallModal', handleShowPWAModal);
        return () => {
            window.removeEventListener('showPWAInstallModal', handleShowPWAModal);
        };
    }, []);

    const handleInstall = async () => {
        try {
            const success = await install();
            if (success) {
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Install failed:', error);
        }
    };

    const handleClose = () => {
        markPWAModalDismissed();
        setIsOpen(false);
    };

    const getInstallSteps = () => {
        if (isDesktop) {
            return [
                localize("Look for the install icon in your browser's address bar."),
                localize('Click the install button or use the browser menu.'),
                localize('Follow the prompts to install Deriv Bot.'),
            ];
        } else if (isIOS) {
            return [
                localize('Open Deriv Bot in your browser.'),
                localize('Tap the share icon (for iOS Safari)'),
                localize('Select "Add to Home screen".'),
            ];
        } else if (isAndroid) {
            return [
                localize('Open Deriv Bot in your browser.'),
                localize('Tap the menu (on Chrome) or share icon (for iOS Safari)'),
                localize('Select "Add to Home screen".'),
            ];
        } else {
            return [
                localize('Open Deriv Bot in your browser.'),
                localize('Tap the menu (on Chrome) or share icon (for iOS Safari)'),
                localize('Select "Add to Home screen".'),
            ];
        }
    };

    const renderModalContent = () => (
        <div className='pwa-install-modal__content'>
            <div className='pwa-install-modal__description'>
                <Text size='xs' color='prominent'>
                    {isPWALaunch
                        ? localize("Welcome to Deriv Bot! You're using the mobile app version.")
                        : isDesktop
                          ? localize('Install Deriv Bot as a desktop app for faster access and a native experience!')
                          : localize(
                                "We're excited to announce that Deriv Bot platform is now a Progressive Web App (PWA)!"
                            )}
                </Text>
            </div>

            <div className='pwa-install-modal__instructions'>
                <Text size='xs' color='prominent'>
                    {localize('How to install:')}
                </Text>

                <ul className='pwa-install-modal__steps'>
                    {getInstallSteps().map((step, index) => (
                        <li key={index}>
                            <Text size='xs' color='prominent'>
                                {step}
                            </Text>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='pwa-install-modal__footer-text'>
                <Text size='xs' color='prominent'>
                    {isPWALaunch
                        ? localize('Enjoy the full mobile app experience with offline capabilities and quick access.')
                        : isDesktop
                          ? localize(
                                'Get instant access from your desktop, work offline, and enjoy a faster, app-like experience.'
                            )
                          : localize('Try it now for a quick and seamless experience, just like a native app.')}
                </Text>
            </div>
        </div>
    );

    const renderFooterButton = () => (
        <div className='pwa-install-modal__buttons'>
            <button
                className='pwa-install-modal__button pwa-install-modal__button--primary'
                onClick={handleInstall}
                type='button'
            >
                <Text size='xs' weight='bold' color='colored-background'>
                    {isDesktop ? localize('Install Now') : localize('Got it')}
                </Text>
            </button>
            <button
                className='pwa-install-modal__button pwa-install-modal__button--secondary'
                onClick={handleClose}
                type='button'
            >
                <Text size='xs' weight='bold' color='general'>
                    {localize('Maybe Later')}
                </Text>
            </button>
        </div>
    );

    // Don't render anything if modal is not open
    if (!isOpen) {
        return null;
    }

    const modalContent = isMobile ? (
        <MobileFullPageModal
            is_modal_open={isOpen}
            page_header_text={localize('Install Deriv Bot')}
            pageHeaderReturnFn={handleClose}
            renderPageFooterChildren={() => renderFooterButton()}
            className='pwa-install-modal'
        >
            <div className='pwa-install-modal__placeholder'></div>
            {renderModalContent()}
        </MobileFullPageModal>
    ) : (
        <Modal
            is_open={isOpen}
            toggleModal={handleClose}
            title={isDesktop ? localize('Install Deriv Bot') : localize('Introducing our installable app')}
            has_close_icon={true}
            is_title_centered={false}
            className='pwa-install-modal'
            width='500px'
            portalId='modal_root'
        >
            <Modal.Body>{renderModalContent()}</Modal.Body>

            <Modal.Footer>{renderFooterButton()}</Modal.Footer>
        </Modal>
    );

    // Use React portal to render in the modal_root container
    const modalRoot = document.getElementById('modal_root');
    if (!modalRoot) {
        console.error('Modal root element not found');
        return null;
    }

    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default PWAInstallModal;
