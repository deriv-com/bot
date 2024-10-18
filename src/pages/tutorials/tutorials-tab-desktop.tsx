import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Tabs from '@/components/shared_ui/tabs';
import { useStore } from '@/hooks/useStore';
import { LabelPairedSearchCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { LegacyCloseCircle1pxBlackIcon } from '@deriv/quill-icons/Legacy';
import SearchInput from './common/search-input';
import { TTutorialsTabItem } from './tutorials';

type TTutorialsTabDesktop = {
    tutorial_tabs: TTutorialsTabItem[];
    prev_active_tutorials: number;
};

const TutorialsTabDesktop = observer(({ tutorial_tabs, prev_active_tutorials }: TTutorialsTabDesktop) => {
    const { dashboard } = useStore();

    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue, resetTutorialTabContent } =
        dashboard;
    const search = faq_search_value?.toLowerCase();

    const onCloseHandleSearch = () => {
        setFAQSearchValue('');
        resetTutorialTabContent();
        setActiveTabTutorial(prev_active_tutorials);
    };

    React.useEffect(() => {
        if (faq_search_value !== '') {
            setActiveTabTutorial(3);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab_tutorials]);

    return (
        <div className='dc-tabs__wrapper' data-testid='tutorials-tab-desktop'>
            <div className='dc-tabs__wrapper__group'>
                <LabelPairedSearchCaptionRegularIcon
                    height='20px'
                    width='20px'
                    className='search-icon'
                    data-testid='id-test-search'
                    fill='var(--text-general)'
                />
                <SearchInput
                    faq_value={faq_search_value}
                    setFaqSearchContent={setFAQSearchValue}
                    prev_active_tutorials={prev_active_tutorials}
                />
                {search && (
                    <LegacyCloseCircle1pxBlackIcon
                        height='18px'
                        width='18px'
                        className='close-icon'
                        data-testid='id-test-close'
                        onClick={onCloseHandleSearch}
                        fill='var(--text-general)'
                    />
                )}
            </div>
            <Tabs
                className={classNames('tutorials', {
                    'tutorials-guide': prev_active_tutorials === 0,
                    'tutorials-faq': prev_active_tutorials === 1,
                    'tutorials-qs-guide': prev_active_tutorials === 2,
                    'tutorials-search': active_tab_tutorials === 3,
                })}
                active_index={active_tab_tutorials}
                onTabItemClick={setActiveTabTutorial}
                top
            >
                {tutorial_tabs?.map(
                    ({ label, content }) =>
                        content && (
                            <div label={label} key={`${content}_${label}`}>
                                {content}
                            </div>
                        )
                )}
            </Tabs>
        </div>
    );
});

export default TutorialsTabDesktop;
