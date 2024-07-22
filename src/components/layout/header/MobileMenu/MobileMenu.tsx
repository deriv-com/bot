import { useState } from 'react';
import useModalManager from '@/hooks/useModalManager';
import { LANGUAGES } from '@/utils/languages';
import { useTranslations } from '@deriv-com/translations';
import { Drawer, MobileLanguagesDrawer, useDevice } from '@deriv-com/ui';
import NetworkStatus from './../../footer/NetworkStatus';
import ServerTime from './../../footer/ServerTime';
import { BackButton } from './BackButton';
import { MenuContent } from './MenuContent';
import { MenuHeader } from './MenuHeader';
import { ToggleButton } from './ToggleButton';

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
        <>
            <ToggleButton onClick={openDrawer} />

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
                            <BackButton buttonText={localize('Language')} onClick={hideModal} />

                            <MobileLanguagesDrawer
                                isOpen
                                languages={LANGUAGES}
                                onClose={hideModal}
                                onLanguageSwitch={switchLanguage}
                                selectedLanguage={currentLang}
                                wrapperClassName='px-[0.8rem]'
                            />
                        </>
                    ) : (
                        <MenuContent />
                    )}
                </Drawer.Content>

                <Drawer.Footer className='justify-center h-16'>
                    <ServerTime />
                    <NetworkStatus />
                </Drawer.Footer>
            </Drawer>
        </>
    );
};

export default MobileMenu;
