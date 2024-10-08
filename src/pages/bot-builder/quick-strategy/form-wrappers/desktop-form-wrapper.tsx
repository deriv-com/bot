import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import Text from '@/components/shared_ui/text';
import ThemedScrollbars from '@/components/shared_ui/themed-scrollbars';
import { useStore } from '@/hooks/useStore';
import { LegacyClose1pxIcon } from '@deriv/quill-icons/Legacy';
import { Localize } from '@deriv-com/translations';
import {
    rudderStackSendQsEditStrategyEvent,
    rudderStackSendQsRunStrategyEvent,
    rudderStackSendQsSelectedTabEvent,
    rudderStackSendSelectQsStrategyGuideEvent,
} from '../analytics/rudderstack-quick-strategy';
import { getQsActiveTabString } from '../analytics/utils';
import { STRATEGIES } from '../config';
import { TFormData, TFormValues } from '../types';
import FormTabs from './form-tabs';
import StrategyTabContent from './strategy-tab-content';
import useQsSubmitHandler from './useQsSubmitHandler';
import '../quick-strategy.scss';

type TDesktopFormWrapper = {
    active_tab_ref?: React.MutableRefObject<HTMLDivElement | null>;
    children: React.ReactNode;
    onClickClose: () => void;
};

const FormWrapper: React.FC<TDesktopFormWrapper> = observer(({ children, onClickClose, active_tab_ref }) => {
    const [activeTab, setActiveTab] = React.useState('TRADE_PARAMETERS');
    const { submitForm, isValid, setFieldValue, validateForm, values } = useFormikContext<TFormValues>();
    const { quick_strategy } = useStore();
    const { selected_strategy, setSelectedStrategy, onSubmit, is_stop_bot_dialog_open } = quick_strategy;
    const strategy = STRATEGIES()[selected_strategy as keyof typeof STRATEGIES];
    const { handleSubmit } = useQsSubmitHandler();

    React.useEffect(() => {
        validateForm();
    }, [selected_strategy, validateForm]);

    const onChangeStrategy = (strategy: string) => {
        setSelectedStrategy(strategy);
        setActiveTab('TRADE_PARAMETERS');
        rudderStackSendSelectQsStrategyGuideEvent({ selected_strategy });
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        rudderStackSendQsSelectedTabEvent({ quick_strategy_tab: getQsActiveTabString(tab) });
    };

    const onEdit = async () => {
        rudderStackSendQsEditStrategyEvent({
            form_values: values,
            selected_strategy,
            quick_strategy_tab: getQsActiveTabString(activeTab),
        });
        await setFieldValue('action', 'EDIT');
        validateForm();
        submitForm().then((form_data: TFormData | void) => {
            if (isValid && form_data) {
                onSubmit(form_data); // true to load and run the bot
            }
        });
    };

    const onRun = () => {
        rudderStackSendQsRunStrategyEvent({
            form_values: values,
            selected_strategy,
        });
        handleSubmit();
    };

    return (
        !is_stop_bot_dialog_open && (
            <div className='qs'>
                <div className='qs__head'>
                    <div className='qs__head__title'>
                        <Text weight='bold'>
                            <Localize i18n_default_text='Quick strategy' />
                        </Text>
                    </div>
                    <div className='qs__head__action'>
                        <span
                            data-testid='qs-desktop-close-button'
                            onClick={onClickClose}
                            tabIndex={0}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                    onClickClose();
                                }
                            }}
                        >
                            <LegacyClose1pxIcon height='20px' width='20px' />
                        </span>
                    </div>
                </div>
                <div className='qs__body'>
                    <div className='qs__body__sidebar'>
                        <div className='qs__body__sidebar__subtitle'>
                            <Text size='xs'>
                                <Localize i18n_default_text='Choose a template below and set your trade parameters.' />
                            </Text>
                        </div>
                        <div className='qs__body__sidebar__items'>
                            <ul>
                                {(Object.keys(STRATEGIES()) as (keyof typeof STRATEGIES)[]).map(key => {
                                    const str = STRATEGIES()[key];
                                    const active = key === selected_strategy;
                                    return (
                                        <li
                                            className={classNames({ active })}
                                            key={key}
                                            onClick={() => onChangeStrategy(String(key))}
                                        >
                                            <Text size='xs' weight={active ? 'bold' : 'normal'}>
                                                {str.label}
                                            </Text>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className='qs__body__content'>
                        <ThemedScrollbars
                            className={classNames('qs__form__container', {
                                'qs__form__container--no-footer': activeTab !== 'TRADE_PARAMETERS',
                            })}
                            autohide={false}
                        >
                            <div ref={active_tab_ref}>
                                <FormTabs
                                    active_tab={activeTab}
                                    onChange={handleTabChange}
                                    description={strategy?.description}
                                />
                            </div>
                            <StrategyTabContent formfields={children} active_tab={activeTab} />
                        </ThemedScrollbars>
                        {activeTab === 'TRADE_PARAMETERS' && (
                            <div className='qs__body__content__footer'>
                                <Button secondary disabled={!isValid} onClick={onEdit}>
                                    <Localize i18n_default_text='Edit' />
                                </Button>
                                <Button
                                    data-testid='qs-run-button'
                                    primary
                                    onClick={e => {
                                        e.preventDefault();
                                        onRun();
                                    }}
                                    disabled={!isValid}
                                >
                                    <Localize i18n_default_text='Run' />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
});

export default React.memo(FormWrapper);
