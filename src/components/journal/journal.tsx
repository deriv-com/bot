import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { contract_stages } from '@/constants/contract-stage';
import { useStore } from '@/hooks/useStore';
import { DerivLightEmptyCardboardBoxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import DataList from '../data-list';
import { TCheckedFilters, TFilterMessageValues, TJournalDataListArgs } from './journal.types';
import { JournalItem, JournalLoader, JournalTools } from './journal-components';

const Journal = observer(() => {
    const { ui } = useStore();
    const { journal, run_panel } = useStore();
    const {
        checked_filters,
        filterMessage,
        filters,
        filtered_messages,
        is_filter_dialog_visible,
        toggleFilterDialog,
        unfiltered_messages,
    } = journal;
    const { is_stop_button_visible, contract_stage } = run_panel;

    const filtered_messages_length = Array.isArray(filtered_messages) && filtered_messages.length;
    const unfiltered_messages_length = Array.isArray(unfiltered_messages) && unfiltered_messages.length;
    const { is_mobile } = ui;

    return (
        <div
            className={classnames('journal run-panel-tab__content--no-stat', {
                'run-panel-tab__content': !is_mobile,
            })}
            data-testid='dt_mock_journal'
        >
            <JournalTools
                checked_filters={checked_filters}
                filters={filters}
                filterMessage={filterMessage}
                is_filter_dialog_visible={is_filter_dialog_visible}
                toggleFilterDialog={toggleFilterDialog}
            />
            <div className='journal__item-list'>
                {filtered_messages_length ? (
                    <DataList
                        className='journal'
                        data_source={filtered_messages}
                        rowRenderer={(args: TJournalDataListArgs) => <JournalItem {...args} />}
                        keyMapper={(row: TFilterMessageValues) => row.unique_id}
                    />
                ) : (
                    <>
                        {contract_stage >= contract_stages.STARTING &&
                        !!Object.keys(checked_filters as TCheckedFilters).length &&
                        !unfiltered_messages_length &&
                        is_stop_button_visible ? (
                            <JournalLoader is_mobile={is_mobile} />
                        ) : (
                            <div className='journal-empty'>
                                <DerivLightEmptyCardboardBoxIcon
                                    height='64px'
                                    width='64px'
                                    className='journal-empty__icon'
                                    color='secondary'
                                />
                                <Text
                                    as='h4'
                                    size='sm'
                                    weight='bold'
                                    align='center'
                                    color='less-prominent'
                                    lineHeight='sm'
                                    className='journal-empty__header'
                                >
                                    <Localize i18n_default_text='There are no messages to display' />
                                </Text>
                                <div className='journal-empty__message'>
                                    <Text size='xs' lineHeight='3xl' color='less-prominent'>
                                        <Localize i18n_default_text='Here are the possible reasons:' />
                                    </Text>
                                    <ul className='journal-empty__list'>
                                        <li>
                                            <Text size='xs' lineHeight='3xl' color='less-prominent'>
                                                <Localize i18n_default_text='The bot is not running' />
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xs' lineHeight='3xl' color='less-prominent'>
                                                <Localize i18n_default_text='The stats are cleared' />
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xs' lineHeight='3xl' color='less-prominent'>
                                                <Localize i18n_default_text='All messages are filtered out' />
                                            </Text>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default Journal;
