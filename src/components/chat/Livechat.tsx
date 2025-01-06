import { observer } from 'mobx-react-lite';
import { useIsIntercomAvailable } from '@/hooks/useIntercom';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons/Legacy';
import { localize } from '@deriv-com/translations';
import { Tooltip, useDevice } from '@deriv-com/ui';
import useIsLiveChatWidgetAvailable from './useIsLiveChatWidgetAvailable';

const Livechat = observer(() => {
    const { isDesktop } = useDevice();

    const { is_livechat_available } = useIsLiveChatWidgetAvailable();
    const icAvailable = useIsIntercomAvailable();

    const isNeitherChatNorLiveChatAvailable = !is_livechat_available && !icAvailable;

    if (isNeitherChatNorLiveChatAvailable) {
        return null;
    }

    // Quick fix for making sure livechat won't popup if feature flag is late to enable.
    // We will add a refactor after this
    setInterval(() => {
        if (icAvailable) {
            window.LiveChatWidget?.call('destroy');
        }
    }, 10);

    const liveChatClickHandler = () => {
        icAvailable ? window.Intercom('show') : window.LiveChatWidget?.call('maximize');
    };

    if (isDesktop)
        return (
            <div onKeyDown={liveChatClickHandler} onClick={liveChatClickHandler}>
                <Tooltip as='button' className='app-footer__icon' tooltipContent={localize('Live chat')}>
                    <LegacyLiveChatOutlineIcon iconSize='xs' />
                </Tooltip>
            </div>
        );

    // For mobile sidebar we only need the component to be rendered.
    // Design is handled from use-mobile-menu-config.tsx
    return <LegacyLiveChatOutlineIcon iconSize='xs' className='mobile-menu__content__items--right-margin' />;
});

export default Livechat;
