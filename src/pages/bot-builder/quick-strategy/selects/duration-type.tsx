import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import Autocomplete from '@/components/shared_ui/autocomplete';
import { TItem } from '@/components/shared_ui/dropdown-list';
import { ApiHelpers } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { TApiHelpersInstance, TDurationUnitItem, TFormData } from '../types';

type TDurationUnit = {
    attached?: boolean;
};

const DurationUnit: React.FC<TDurationUnit> = ({ attached }: TDurationUnit) => {
    const [list, setList] = React.useState<TDurationUnitItem[]>([]);
    const [prevSymbol, setPrevSymbol] = React.useState('');
    const [prevTradeType, setPrevTradeType] = React.useState('');
    const { quick_strategy } = useStore();
    const { setValue, setCurrentDurationMinMax, current_duration_min_max, setDropdownState } = quick_strategy;
    const { setFieldValue, validateForm, values } = useFormikContext<TFormData>();
    const { symbol, tradetype } = values;

    React.useEffect(() => {
        if (tradetype && symbol) {
            const getDurationUnits = async () => {
                const { contracts_for } = (ApiHelpers?.instance as unknown as TApiHelpersInstance) ?? {};
                const durations = await contracts_for?.getDurations?.(symbol, tradetype);
                const duration_units = durations?.map(duration => ({
                    text: duration.display ?? '',
                    value: duration.unit ?? '',
                    min: duration.min,
                    max: duration.max,
                }));
                setList(duration_units);
                const selected = values?.durationtype;
                const has_selected = duration_units?.some(duration => duration.value === selected);
                if (!has_selected || prevSymbol !== symbol || prevTradeType !== tradetype) {
                    setCurrentDurationMinMax(durations?.[0]?.min, durations?.[0]?.max);
                    setFieldValue?.('durationtype', durations?.[0]?.unit, true);
                    setFieldValue?.('duration', durations?.[0]?.min, true);
                    setValue('durationtype', durations?.[0]?.unit ?? '');
                } else {
                    const duration = duration_units?.find((duration: TDurationUnitItem) => duration.value === selected);
                    setCurrentDurationMinMax(duration?.min, duration?.max);
                }
                setPrevSymbol(symbol as string);
                setPrevTradeType(tradetype as string);
            };
            getDurationUnits();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, tradetype]);

    useEffect(() => {
        validateForm();
    }, [current_duration_min_max, validateForm]);

    return (
        <div
            className={classNames('qs__form__field qs__form__field__input', {
                'no-top-border-radius': attached,
            })}
        >
            <Field name='durationtype' key='durationtype' id='durationtype'>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find(item => item.value === field.value);
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            data-testid='dt_qs_durationtype'
                            autoComplete='off'
                            className='qs__select'
                            value={selected_item?.text || ''}
                            list_items={list}
                            onItemSelection={(item: TItem) => {
                                const { value, min, max } = item as TDurationUnitItem;
                                if (value) {
                                    setCurrentDurationMinMax(min, max);
                                    setFieldValue?.('durationtype', value);
                                    setValue('durationtype', value);
                                    setFieldValue?.('duration', min).then(() => {
                                        validateForm();
                                    });
                                    setValue('duration', min);
                                }
                            }}
                            onShowDropdownList={() => setDropdownState(true)}
                            onHideDropdownList={() => setDropdownState(false)}
                            data_testid='dt_qs_durationtype'
                            dropdown_offset=''
                            historyValue=''
                            input_id=''
                            is_alignment_top={false}
                            list_portal_id=''
                            not_found_text='No results found'
                            should_filter_by_char={false}
                        />
                    );
                }}
            </Field>
        </div>
    );
};

export default DurationUnit;
