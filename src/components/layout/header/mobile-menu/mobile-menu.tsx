import { useState } from 'react';
import useModalManager from '@/hooks/useModalManager';
import { getActiveTabUrl } from '@/utils/getActiveTabUrl';
import { LANGUAGES } from '@/utils/languages';
import { useTranslations } from '@deriv-com/translations';
import { Drawer, MobileLanguagesDrawer, useDevice } from '@deriv-com/ui';
import NetworkStatus from './../../footer/NetworkStatus';
import ServerTime from './../../footer/ServerTime';
import BackButton from './back-button';
import MenuContent from './menu-content';
import MenuHeader from './menu-header';
import ToggleButton from './toggle-button';
import './mobile-menu.scss';

const MobileMenu = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { currentLang = 'EN', localize, switchLanguage } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { isDesktop } = useDevice();

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const openLanguageSetting = () => showModal('MobileLanguagesDrawer');
    const isLanguageSettingVisible = Boolean(isModalOpenFor('MobileLanguagesDrawer'));

    if (isDesktop) return null;
    return (
        <div className='mobile-menu'>
            <div className='mobile-menu__toggle'>
                <ToggleButton onClick={openDrawer} />
            </div>

            <Drawer isOpen={isDrawerOpen} onCloseDrawer={closeDrawer} width='29.5rem'>
                <Drawer.Header onCloseDrawer={closeDrawer}>
                    <MenuHeader
                        hideLanguageSetting={isLanguageSettingVisible}
                        openLanguageSetting={openLanguageSetting}
                    />
                </Drawer.Header>

                <Drawer.Content>
                    {isLanguageSettingVisible ? (
                        <>
                            <div className='mobile-menu__back-btn'>
                                <BackButton buttonText={localize('Language')} onClick={hideModal} />
                            </div>

                            <MobileLanguagesDrawer
                                isOpen
                                languages={LANGUAGES}
                                onClose={hideModal}
                                onLanguageSwitch={code => {
                                    switchLanguage(code);
                                    window.location.replace(getActiveTabUrl());
                                    window.location.reload();
                                }}
                                selectedLanguage={currentLang}
                                wrapperClassName='mobile-menu__language-drawer'
                            />
                        </>
                    ) : (
                        <MenuContent />
                    )}
                </Drawer.Content>

                <Drawer.Footer className='mobile-menu__footer'>
                    <ServerTime />
                    <NetworkStatus />
                </Drawer.Footer>
            </Drawer>
        </div>
    );
};

export default MobileMenu;
