import { observer } from 'mobx-react-lite';

import { Text } from '@deriv-com/ui';

import { useStore } from '@/hooks/useStore';
import { Icon, Localize } from '@/utils/tmp/dummy';

const NoSearchResult = observer(() => {
    const { dashboard } = useStore();
    const { faq_search_value } = dashboard;
    return (
        <div className='dc-tabs__content dc-tabs__content--no-result'>
            <Icon icon='IcDbotNoSearchResult' size={80} />
            <Text className='dc-tabs__content--no-result__title' as='h1' weight='bold' lineHeight='xs'>
                <Localize i18n_default_text='No results found' />
            </Text>
            <Text className='dc-tabs__content--no-result__content' lineHeight='xs'>
                <Localize i18n_default_text={`We couldn’t find anything matching "${faq_search_value}".`} />
            </Text>
            <Text className='dc-tabs__content--no-result__content' lineHeight='xs'>
                <Localize i18n_default_text={`Try another term.`} />
            </Text>
        </div>
    );
});

export default NoSearchResult;
