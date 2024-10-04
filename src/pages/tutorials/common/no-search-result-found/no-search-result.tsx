import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
import { LabelPairedCircleExclamationCaptionFillIcon } from '@deriv/quill-icons/LabelPaired';
import { Localize } from '@deriv-com/translations';

const NoSearchResult = observer(() => {
    const { dashboard } = useStore();
    const { faq_search_value } = dashboard;
    return (
        <div className='dc-tabs__content dc-tabs__content--no-result' data-testid='no-search-result'>
            <LabelPairedCircleExclamationCaptionFillIcon height='80px' width='80px' fill='#ff444f' />
            <Text className='dc-tabs__content--no-result__title' as='h1' weight='bold' lineHeight='xxs'>
                <Localize i18n_default_text='No results found' />
            </Text>
            <Text className='dc-tabs__content--no-result__content' lineHeight='xxs'>
                <Localize i18n_default_text='We couldn’t find anything matching' />
                <Localize i18n_default_text={` ${faq_search_value}`} />
            </Text>
            <Text className='dc-tabs__content--no-result__content' lineHeight='xxs'>
                <Localize i18n_default_text='Try another term.' />
            </Text>
        </div>
    );
});

export default NoSearchResult;
