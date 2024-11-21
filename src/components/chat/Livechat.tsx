import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { V2GetActiveToken } from '@/external/bot-skeleton/services/api/appId';
import { LegacyLiveChatOutlineIcon } from '@deriv/quill-icons/Legacy';
import { localize } from '@deriv-com/translations';
import { Tooltip, useDevice } from '@deriv-com/ui';
import useFreshChat from './useFreshchat';
import useIsLiveChatWidgetAvailable from './useIsLiveChatWidgetAvailable';

const Livechat = observer(() => {
    const { isDesktop } = useDevice();

    const token = V2GetActiveToken() ?? null;

    const { is_livechat_available } = useIsLiveChatWidgetAvailable();
    const { isReady, featureFlagValue, widget } = useFreshChat(token);

    useEffect(() => {
        window.enable_freshworks_live_chat = !!featureFlagValue;
    }, [featureFlagValue]);

    const isFreshchatEnabledButNotReady = featureFlagValue && !isReady;
    const isNeitherChatNorLiveChatAvailable = !is_livechat_available && !featureFlagValue;

    if (isFreshchatEnabledButNotReady || isNeitherChatNorLiveChatAvailable) {
        return null;
    }

    // Quick fix for making sure livechat won't popup if feature flag is late to enable.
    // We will add a refactor after this
    setInterval(() => {
        if (featureFlagValue) {
            window.LiveChatWidget?.call('destroy');
        }
    }, 10);

    const liveChatClickHandler = () => {
        console.log('test is_livechat_available', is_livechat_available);
        featureFlagValue ? widget.open() : window.LiveChatWidget?.call('maximize');
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
