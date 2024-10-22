import { observer } from 'mobx-react-lite';
import { LabelPairedSearchCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { LegacyCloseCircle1pxBlackIcon } from '@deriv/quill-icons/Legacy';

type TSearchIcon = {
    search: string;
    is_search_loading: boolean;
    onClick: () => void;
};

const SearchIcon = observer(({ search, is_search_loading, onClick }: TSearchIcon) => {
    if (!search) return <LabelPairedSearchCaptionRegularIcon height='20px' width='20px' fill='var(--text-general)' />;
    if (is_search_loading) return <div className='loader' data-testid='loader' />;
    return <LegacyCloseCircle1pxBlackIcon onClick={onClick} height='18px' width='18px' fill='var(--text-general)' />;
});

export default SearchIcon;
