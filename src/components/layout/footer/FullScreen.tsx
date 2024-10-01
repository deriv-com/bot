import useFullScreen from '@/hooks/useFullScreen';
import { LegacyFullscreen1pxIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const FullScreen = () => {
    const { toggleFullScreenMode } = useFullScreen();
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='button'
            className='app-footer__icon'
            onClick={toggleFullScreenMode}
            tooltipContent={localize('Full screen')}
        >
            <LegacyFullscreen1pxIcon iconSize='xs' />
        </Tooltip>
    );
};

export default FullScreen;
