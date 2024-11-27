import useRemoteConfig from '@/hooks/growthbook/useRemoteConfig';
import useModalManager from '@/hooks/useModalManager';
import { getActiveTabUrl } from '@/utils/getActiveTabUrl';
import { LANGUAGES } from '@/utils/languages';
import { useTranslations } from '@deriv-com/translations';
import { DesktopLanguagesModal } from '@deriv-com/ui';
import Livechat from '../../chat/Livechat';
import AccountLimits from './AccountLimits';
import ChangeTheme from './ChangeTheme';
import Deriv from './Deriv';
import Endpoint from './Endpoint';
import FullScreen from './FullScreen';
import HelpCentre from './HelpCentre';
import LanguageSettings from './LanguageSettings';
import NetworkStatus from './NetworkStatus';
import ResponsibleTrading from './ResponsibleTrading';
import ServerTime from './ServerTime';
import WhatsApp from './WhatsApp';
import './footer.scss';

const Footer = () => {
    const { currentLang = 'EN', localize, switchLanguage } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    const openLanguageSettingModal = () => showModal('DesktopLanguagesModal');

    const { data } = useRemoteConfig(true);
    const { cs_chat_whatsapp } = data;

    return (
        <footer className='app-footer'>
            <FullScreen />
            <LanguageSettings openLanguageSettingModal={openLanguageSettingModal} />
            <HelpCentre />
            <div className='app-footer__vertical-line' />
            <ChangeTheme />
            <AccountLimits />
            <ResponsibleTrading />
            <Deriv />
            <Livechat />
            {cs_chat_whatsapp && <WhatsApp />}
            <div className='app-footer__vertical-line' />
            <ServerTime />
            <div className='app-footer__vertical-line' />
            <NetworkStatus />
            <Endpoint />

            {isModalOpenFor('DesktopLanguagesModal') && (
                <DesktopLanguagesModal
                    headerTitle={localize('Select Language')}
                    isModalOpen
                    languages={LANGUAGES}
                    onClose={hideModal}
                    onLanguageSwitch={code => {
                        switchLanguage(code);
                        hideModal();
                        window.location.replace(getActiveTabUrl());
                        window.location.reload();
                    }}
                    selectedLanguage={currentLang}
                />
            )}
        </footer>
    );
};

export default Footer;
