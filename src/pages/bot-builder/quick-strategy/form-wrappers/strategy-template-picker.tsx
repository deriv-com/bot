import React from 'react';
import { observer } from 'mobx-react-lite';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { LegacyGuide1pxIcon } from '@deriv/quill-icons';
import { Chip, SearchField } from '@deriv-com/quill-ui';
import { localize } from '@deriv-com/translations';
import StrategyList from './strategy-list';
import { QsSteps, TRADE_TYPES } from './trade-constants';
import './strategy-template-picker.scss';

type TStrategyTemplatePicker = {
    setCurrentStep: (current_step: QsSteps) => void;
    setSelectedTradeType: (selected_trade_type: string) => void;
};

const StrategyTemplatePicker = observer(({ setCurrentStep, setSelectedTradeType }: TStrategyTemplatePicker) => {
    const { dashboard, quick_strategy } = useStore();
    const { setActiveTabTutorial, setActiveTab, setFAQSearchValue, filterTuotrialTab } = dashboard;
    const { setFormVisibility, setSelectedStrategy } = quick_strategy;

    const [selector_chip_value, setSelectorChipValue] = React.useState(0);
    const [is_searching, setIsSearching] = React.useState(false);
    const [search_value, setSearchValue] = React.useState('');

    const handleChipSelect = (index: number) => {
        setSelectorChipValue(index);
    };

    const onSelectStrategy = (strategy: string, trade_type: string) => {
        setSelectedStrategy(strategy);
        setSelectedTradeType(trade_type);
        setCurrentStep(QsSteps.StrategyVerified);
    };

    return (
        <div className='strategy-template-picker'>
            <div className='strategy-template-picker__panel'>
                <SearchField
                    onChange={event => {
                        setSearchValue(event.target.value);
                        setIsSearching(true);
                        setFAQSearchValue(event.target.value);
                        filterTuotrialTab(event.target.value);
                    }}
                    placeholder={localize('Search')}
                    type='text'
                    value={search_value}
                    inputSize='sm'
                />
                <button
                    className='strategy-template-picker__icon'
                    onClick={() => {
                        setActiveTab(DBOT_TABS.TUTORIAL);
                        setActiveTabTutorial(2);
                        setFormVisibility(false);

                        // Add a small delay to ensure the tab is selected before scrolling
                        setTimeout(() => {
                            const tutorialsSection = document.getElementById('id-tutorials');
                            if (tutorialsSection) {
                                tutorialsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        }, 100);
                    }}
                >
                    <LegacyGuide1pxIcon iconSize='sm' />
                </button>
            </div>
            <div className='strategy-template-picker__chips'>
                {TRADE_TYPES.map((item, index) => (
                    <Chip.Selectable
                        key={index}
                        onClick={() => handleChipSelect(index)}
                        selected={index == selector_chip_value}
                        size='sm'
                        label={item}
                    />
                ))}
            </div>
            <StrategyList
                selector_chip_value={selector_chip_value}
                search_value={search_value}
                is_searching={is_searching}
                onSelectStrategy={onSelectStrategy}
            />
        </div>
    );
});

export default StrategyTemplatePicker;
