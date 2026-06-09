import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import { useStore } from '@/hooks/useStore';
import { LabelPairedChevronRightSmBoldIcon, LabelPairedCircleInfoSmRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { CaptionText } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

const PositionsBannerMobile = observer(() => {
    const { isDesktop } = useDevice();
    const store = useStore();
    const is_logged_in = store?.client?.is_logged_in;

    if (isDesktop || !is_logged_in) return null;

    const handleClick = () => {
        window.location.assign(standalone_routes.reports);
    };

    return (
        <button
            type='button'
            className='positions-banner positions-banner--mobile'
            onClick={handleClick}
            aria-label='Review your reports before the Deriv Bot upgrade'
        >
            <LabelPairedCircleInfoSmRegularIcon
                className='positions-banner__icon'
                fill='var(--component-textIcon-normal-prominent)'
            />
            <CaptionText className='positions-banner__text'>
                <Localize i18n_default_text='System is upgrading. Close positions by 13 June.' />
            </CaptionText>
            <LabelPairedChevronRightSmBoldIcon
                className='positions-banner__chevron'
                fill='var(--component-textIcon-normal-prominent)'
            />
        </button>
    );
});

export default PositionsBannerMobile;
