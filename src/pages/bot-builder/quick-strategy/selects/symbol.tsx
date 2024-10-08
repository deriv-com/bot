import React, { useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import Autocomplete from '@/components/shared_ui/autocomplete';
import { TItem } from '@/components/shared_ui/dropdown-list';
import Text from '@/components/shared_ui/text';
import { ApiHelpers } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { Icon } from '@/utils/tmp/dummy';
import { useDevice } from '@deriv-com/ui';
import { TFormData } from '../types';

type TSymbol = {
    component?: React.ReactNode;
    text: string;
    value: string;
    group?: string;
};

type TMarketOption = {
    symbol: TSymbol;
};

const MarketOption: React.FC<TMarketOption> = ({ symbol }) => (
    <div key={symbol.value} className='qs__select__option'>
        <Icon data_testid='dt_symbol_icon' icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='qs__select__option__text' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

const SymbolSelect: React.FC = () => {
    const { quick_strategy } = useStore();
    const { isDesktop } = useDevice();
    const { setValue } = quick_strategy;
    const [active_symbols, setActiveSymbols] = React.useState<TSymbol[]>([]);
    const [is_input_started, setIsInputStarted] = useState(false);
    const [input_value, setInputValue] = useState({ text: '', value: '' });
    const [last_selected_symbol, setLastSelectedSymbol] = useState({ text: '', value: '' });
    const { setFieldValue, values } = useFormikContext<TFormData>();

    const symbols = useMemo(
        () =>
            active_symbols.map((symbol: TSymbol) => ({
                component: <MarketOption key={symbol.text} symbol={symbol} />,
                ...symbol,
            })),
        [active_symbols]
    );

    useEffect(() => {
        const { active_symbols } = ApiHelpers.instance as unknown as {
            active_symbols: {
                getSymbolsForBot: () => TSymbol[];
            };
        };
        const symbols = active_symbols.getSymbolsForBot();
        setActiveSymbols(symbols);

        const has_symbol = !!symbols?.find(symbol => symbol?.value === values?.symbol);
        if (!has_symbol) {
            setFieldValue('symbol', symbols?.[0]?.value);
            setValue('symbol', symbols?.[0]?.value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const selected_symbol = symbols.find(symbol => symbol.value === values.symbol);
        if (selected_symbol) {
            setInputValue({ text: selected_symbol.text, value: selected_symbol.value });
        }
    }, [symbols, values.symbol, setInputValue]);

    const handleFocus = () => {
        if (isDesktop && !is_input_started) {
            setIsInputStarted(true);
            setInputValue({ text: '', value: '' });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue({ ...input_value, text: e.target.value });
    };

    const handleItemSelection = (item: TItem) => {
        if (item?.value) {
            const { value } = item as TSymbol;
            setFieldValue('symbol', value);
            setValue('symbol', value);
            setIsInputStarted(false);
        }
    };

    const handleHideDropdownList = () => {
        if (isDesktop) {
            const selectedSymbol = symbols.find(symbol => symbol.value === values.symbol);
            if (selectedSymbol && selectedSymbol.text !== input_value.text) {
                setInputValue({ text: selectedSymbol.text, value: selectedSymbol.value });
                setLastSelectedSymbol({ text: selectedSymbol.text, value: selectedSymbol.value });
                setIsInputStarted(false);
            }
            if (!selectedSymbol) {
                setInputValue({ text: last_selected_symbol.text, value: last_selected_symbol.value });
                setIsInputStarted(false);
            }
        }
    };

    return (
        <div className='qs__form__field qs__form__field__input'>
            <Field name='symbol' key='asset' id='asset'>
                {({ field: { ...rest_field } }: FieldProps) => (
                    <>
                        <Autocomplete
                            {...rest_field}
                            readOnly={!isDesktop}
                            inputMode='none'
                            data-testid='dt_qs_symbol'
                            autoComplete='off'
                            className='qs__autocomplete'
                            value={input_value.text}
                            list_items={symbols}
                            onItemSelection={handleItemSelection}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onHideDropdownList={handleHideDropdownList}
                            leading_icon={<Icon icon={`IcUnderlying${input_value.value}`} size={24} />}
                        />
                    </>
                )}
            </Field>
        </div>
    );
};

export default SymbolSelect;
