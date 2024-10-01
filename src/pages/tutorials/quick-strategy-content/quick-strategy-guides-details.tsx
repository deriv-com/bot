import { KeyboardEvent } from 'react';
import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';
import { isDbotRTL } from '@/external/bot-skeleton/utils/workspace';
import { LabelPairedChevronLeftMdFillIcon, LabelPairedChevronRightMdFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { STRATEGIES } from '../../bot-builder/quick-strategy/config';
import StrategyTabContent from '../../bot-builder/quick-strategy/form-wrappers/strategy-tab-content';

type Tcontent = {
    qs_name: string;
    content: string[];
    type: string;
};

type TQuickStrategyGuides = {
    quick_strategy_tab_content: Tcontent[];
    tutorial_selected_strategy: string;
    setTutorialSelectedStrategy: (value: string) => void;
};

const QuickStrategyGuidesDetail = observer(
    ({ quick_strategy_tab_content, tutorial_selected_strategy, setTutorialSelectedStrategy }: TQuickStrategyGuides) => {
        const { isDesktop } = useDevice();
        const text_size = isDesktop ? 's' : 'xs';

        const scrollToTop = () => {
            const qs_guide = document.querySelector('.tutorials-mobile__qs-guide');
            if (qs_guide) {
                qs_guide.scrollTop = 0;
            }
        };

        return (
            <>
                {tutorial_selected_strategy === '' ? (
                    <div className='tutorials-quick-strategy__cards'>
                        {quick_strategy_tab_content?.map(({ qs_name, content, type }, index) => (
                            <div
                                className='tutorials-quick-strategy__placeholder'
                                key={type}
                                onClick={() => {
                                    setTutorialSelectedStrategy(qs_name);
                                    scrollToTop();
                                }}
                                tabIndex={index}
                                data-testid={'dt_quick_strategy_guides_details'}
                                onKeyDown={(e: KeyboardEvent) => {
                                    if (e.key === 'Enter') {
                                        setTutorialSelectedStrategy(qs_name);
                                    }
                                }}
                            >
                                <div>
                                    <div className='tutorials-quick-strategy__placeholder__title'>
                                        <Text
                                            align='center'
                                            weight='bold'
                                            color='prominent'
                                            lineHeight='s'
                                            size={text_size}
                                        >
                                            {type}
                                        </Text>
                                    </div>
                                    <div className='tutorials-quick-strategy__placeholder__content'>
                                        <ul>
                                            {content.map(data => (
                                                <li key={data}>
                                                    <Text
                                                        align='center'
                                                        color='prominent'
                                                        lineHeight='s'
                                                        size={text_size}
                                                        className='tutorials-quick-strategy__placeholder__content__text'
                                                    >
                                                        {data}
                                                    </Text>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {isDbotRTL() ? (
                                    <LabelPairedChevronLeftMdFillIcon className='tutorials-quick-strategy__placeholder__icon' />
                                ) : (
                                    <LabelPairedChevronRightMdFillIcon className='tutorials-quick-strategy__placeholder__icon' />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className='tutorials-quick-strategy__breadcrumb'>
                            <Text
                                className='tutorials-quick-strategy__breadcrumb__clickable'
                                color='prominent'
                                lineHeight='s'
                                size={text_size}
                                as='div'
                                onClick={() => {
                                    setTutorialSelectedStrategy('');
                                }}
                            >
                                <Localize i18n_default_text={'Quick strategy guides >'} />
                            </Text>
                            <Text color='less-prominent' lineHeight='s' size={text_size} as='div'>
                                <Localize
                                    i18n_default_text={`About ${STRATEGIES()[tutorial_selected_strategy].label}`}
                                />
                            </Text>
                        </div>
                        <Text color='prominent' lineHeight='s' size={text_size} weight='bold' as='div'>
                            <Localize i18n_default_text={`About ${STRATEGIES()[tutorial_selected_strategy].label}`} />
                        </Text>
                        <StrategyTabContent tutorial_selected_strategy={tutorial_selected_strategy} />
                    </>
                )}
            </>
        );
    }
);

export default QuickStrategyGuidesDetail;
