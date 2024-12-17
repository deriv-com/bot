import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import Autocomplete from '@/components/shared_ui/autocomplete';
import { TItem } from '@/components/shared_ui/dropdown-list';
import Text from '@/components/shared_ui/text';
import { TradeTypeIcon } from '@/components/trade-type/trade-type-icon';
import { ApiHelpers } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { TApiHelpersInstance, TFormData, TTradeType } from '../types';
import { V2_QS_STRATEGIES } from '../utils';

type TTradeTypeOption = {
    trade_type: TTradeType;
};

const TradeTypeOption: React.FC<TTradeTypeOption> = ({ trade_type: { value, icon, text } }: TTradeTypeOption) => {
    return (
        <div key={value} className='qs__select__option'>
            {icon?.length
                ? icon.map((ic, idx) => (
                      <TradeTypeIcon type={ic} className='qs__select__option__icon' key={`${ic}id-${idx}`} size='sm' />
                  ))
                : null}
            <Text className='qs__select__option__text' size='xs' color='prominent'>
                {text}
            </Text>
        </div>
    );
};

const TradeTypeSelect: React.FC = () => {
    const [trade_types, setTradeTypes] = React.useState<TTradeType[]>([]);
    const { setFieldValue, values, validateForm } = useFormikContext<TFormData>();
    const { quick_strategy } = useStore();
    const { setValue, selected_strategy } = quick_strategy;
    const is_strategy_accumulator = V2_QS_STRATEGIES.includes(selected_strategy);

    React.useEffect(() => {
        if (values?.symbol) {
            const selected = values?.tradetype;
            const is_symbol_accumulator = is_strategy_accumulator ? 'ACCU' : '';

            const { contracts_for } = (ApiHelpers?.instance as unknown as TApiHelpersInstance) ?? {};
            const getTradeTypes = async () => {
                const trade_types = await contracts_for?.getTradeTypesForQuickStrategy?.(
                    values?.symbol,
                    is_symbol_accumulator
                );
                const has_selected = trade_types?.some(trade_type => trade_type.value === selected);
                if (!has_selected && trade_types?.[0]?.value !== selected) {
                    setFieldValue?.('tradetype', trade_types?.[0].value || '');
                    setValue('tradetype', trade_types?.[0].value);
                }
                setTradeTypes(trade_types);
            };
            getTradeTypes();
            validateForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values?.symbol]);

    const trade_type_dropdown_options = React.useMemo(
        () =>
            trade_types.map(trade_type => ({
                component: <TradeTypeOption key={trade_type.text} trade_type={trade_type} />,
                ...trade_type,
            })),
        [trade_types]
    );

    return (
        <div className='qs__form__field qs__form__field__input qs__form__field__group-icons'>
            <Field name='tradetype' key='tradetype' id='tradetype'>
                {({ field }: FieldProps) => {
                    const selected_trade_type = trade_type_dropdown_options?.find(
                        trade_type => trade_type.value === field.value
                    );
                    const is_accumulator = is_strategy_accumulator ? 'Buy' : selected_trade_type?.text;
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            inputMode='none'
                            data-testid='dt_qs_tradetype'
                            autoComplete='off'
                            className='qs__autocomplete'
                            value={is_accumulator || ''}
                            list_items={trade_type_dropdown_options}
                            onItemSelection={(item: TItem) => {
                                const value = (item as TTradeType)?.value;
                                const text = (item as TTradeType)?.text;
                                if (value && text) {
                                    setFieldValue?.('tradetype', value);
                                    setValue('tradetype', value);
                                }
                            }}
                            leading_icon={
                                <Text>
                                    <TradeTypeIcon type={selected_trade_type?.icon?.[0] || 'CALL'} size='sm' />
                                    <TradeTypeIcon type={selected_trade_type?.icon?.[1] || 'PUT'} size='sm' />
                                </Text>
                            }
                        />
                    );
                }}
            </Field>
        </div>
    );
};

export default TradeTypeSelect;
