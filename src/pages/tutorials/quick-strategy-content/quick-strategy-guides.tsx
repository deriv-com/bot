import React from 'react';
import { useStore } from '@/hooks/useStore';
import { localize } from '@/utils/tmp/dummy';
import { Text } from '@deriv-com/ui';
import QuickStrategyGuidesDetail from './quick-strategy-guides-details';
import './index.scss';

const QuickStrategyGuides = () => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard } = useStore();
    const { quick_strategy_tab_content } = dashboard;
    const [tutorial_selected_strategy, setTutorialSelectedStrategy] = React.useState('');

    return (
        <div className='tutorials-quick-strategy'>
            {tutorial_selected_strategy === '' && quick_strategy_tab_content.length > 0 && (
                <Text
                    className='tutorials-quick-strategy__title'
                    weight='bold'
                    color='prominent'
                    LineHeight='sm'
                    size={is_mobile ? 'xs' : 's'}
                    as='div'
                >
                    {localize('Quick strategy guides')}
                </Text>
            )}
            <QuickStrategyGuidesDetail
                tutorial_selected_strategy={tutorial_selected_strategy}
                setTutorialSelectedStrategy={setTutorialSelectedStrategy}
                quick_strategy_tab_content={quick_strategy_tab_content}
            />
        </div>
    );
};

export default QuickStrategyGuides;
