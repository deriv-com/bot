import React, { useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import Autocomplete from '@/components/shared_ui/autocomplete';
import { TItem } from '@/components/shared_ui/dropdown-list';
import { useStore } from '@/hooks/useStore';
import { TDurationUnitItem, TFormData } from '../types';

type TDurationUnit = {
    attached?: boolean;
};

type TSellConditionItem = {
    text: string;
    value: string;
};

const list_options = [
    { text: 'Take Profit', value: 'take_profit' },
    { text: 'Tick Count', value: 'tick_count' },
];

const SellConditions: React.FC<TDurationUnit> = ({ attached }: TDurationUnit) => {
    const { quick_strategy } = useStore();
    const { setValue } = quick_strategy;
    const { setFieldValue, values } = useFormikContext<TFormData>();
    const [selectedValue, setSelectedValue] = useState<TSellConditionItem>(
        values.boolean_tick_count ? list_options[1] : list_options[0]
    );

    const handleItemSelection = (item: TItem) => {
        if ((item as TDurationUnitItem)?.value) {
            const { value } = item as TDurationUnitItem;
            const is_take_profit = value === 'take_profit';
            const text = is_take_profit ? 'Take Profit' : 'Tick Count';
            setValue('boolean_tick_count', !is_take_profit);
            setFieldValue?.('boolean_tick_count', !is_take_profit);
            setSelectedValue({ ...selectedValue, text });
        }
    };

    return (
        <div
            className={classNames('qs__form__field qs__form__field__input', {
                'no-top-border-radius': attached,
            })}
        >
            <Field name='sell_conditions' key='sell_conditions' id='sell_conditions'>
                {({ field }: FieldProps) => {
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            inputMode='none'
                            data-testid='dt_qs_sell_conditions'
                            autoComplete='off'
                            className='qs__select'
                            value={selectedValue.text}
                            list_items={list_options}
                            onItemSelection={handleItemSelection}
                        />
                    );
                }}
            </Field>
        </div>
    );
};

export default SellConditions;
