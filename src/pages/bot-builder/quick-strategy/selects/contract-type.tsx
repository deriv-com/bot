import React from 'react';
import classNames from 'classnames';
import debounce from 'debounce';
import { Field, FieldProps, useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import Autocomplete from '@/components/shared_ui/autocomplete';
import { TItem } from '@/components/shared_ui/dropdown-list';
import Text from '@/components/shared_ui/text';
import { ApiHelpers } from '@/external/bot-skeleton';
import { api_base } from '@/external/bot-skeleton';
import { requestOptionsProposalForQS } from '@/external/bot-skeleton/scratch/options-proposal-handler';
import { useStore } from '@/hooks/useStore';
import { useDevice } from '@deriv-com/ui';
import { TApiHelpersInstance, TDropdownItems, TFormData } from '../types';

type TContractTypes = {
    name: string;
    attached?: boolean;
};

type TProposalRequest = {
    amount: number;
    currency: string | undefined;
    symbol: string;
    contract_type: string;
    duration_unit: string;
    duration: number;
    basis: string;
};

const ContractTypes: React.FC<TContractTypes> = observer(({ name }) => {
    const { isDesktop } = useDevice();
    const [list, setList] = React.useState<TDropdownItems[]>([]);
    const { quick_strategy, client } = useStore();
    const { setValue } = quick_strategy;
    const { setFieldValue, values, setFieldError } = useFormikContext<TFormData>();
    const { symbol, tradetype } = values;

    React.useEffect(() => {
        if (tradetype && symbol) {
            const selected = values?.type;
            const getContractTypes = async () => {
                const { contracts_for } = (ApiHelpers?.instance as unknown as TApiHelpersInstance) ?? {};
                const categories = await contracts_for?.getContractTypes?.(tradetype);
                setList(categories);
                const has_selected = categories?.some(contract => contract.value === selected);
                if (!has_selected) {
                    setFieldValue?.(name, categories?.[0]?.value);
                    setValue(name, categories?.[0]?.value);
                }
            };
            getContractTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, tradetype]);

    const validateMinMaxForOptions = async (values: TFormData) => {
        if (!values.type || !values.symbol || !values.durationtype) return;

        // Set loading state to true before API call
        quick_strategy.setOptionsLoading(true);

        const amount = Number(values.stake) || 0;
        const contract_type = values.type;
        const duration_unit = values.durationtype;
        const duration = Number(values.duration) || 0;

        const request_proposal: TProposalRequest = {
            amount,
            currency: client?.currency,
            symbol: values.symbol as string,
            contract_type: contract_type as string,
            duration_unit: duration_unit as string,
            duration,
            basis: 'stake',
        };

        try {
            await requestOptionsProposalForQS(request_proposal, api_base.api);

            // Clear previous errors if validation passes
            if (Number(values.stake) <= 1000) {
                setFieldError('stake', undefined);
            }
        } catch (error_response: any) {
            const error_message = error_response?.message ?? error_response?.error?.message;

            if (error_response?.error?.details?.field === 'amount') {
                // Only show the error if stake value is not empty
                if (values.stake !== '' && values.stake !== undefined && values.stake !== null) {
                    setFieldError('stake', error_message);
                }
            }
        } finally {
            // Set loading state to false after API call (whether it succeeded or failed)
            quick_strategy.setOptionsLoading(false);
        }
    };

    const debounceChange = React.useCallback(
        debounce(validateMinMaxForOptions, 1000, {
            trailing: true,
            leading: false,
        }),
        []
    );

    React.useEffect(() => {
        if (values.type && values.symbol && values.durationtype) {
            // Set loading state to true before API call
            quick_strategy.setOptionsLoading(true);
            debounceChange(values);
        }
    }, [
        values.stake,
        values.type,
        values.symbol,
        values.durationtype,
        values.duration,
        client?.currency,
        values,
        debounceChange,
    ]);

    React.useEffect(() => {
        setFieldError('stake', undefined);
    }, [values.stake]);

    const handleChange = (value: string) => {
        setFieldValue?.(name, value);
        setValue(name, value);
    };

    const key = `qs-contract-type-${name}`;

    return (
        <div className='qs__form__field qs__form__field__input no-top-spacing'>
            <Field name={name} key={key} id={key}>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find(item => item?.value === field?.value);
                    if (!isDesktop) {
                        return (
                            <ul className='qs__form__field__list' data-testid='dt_qs_contract_types'>
                                {list.map(item => {
                                    const is_active = selected_item?.value === item?.value;
                                    return (
                                        <li
                                            key={item?.value}
                                            className={classNames('qs__form__field__list__item', {
                                                'qs__form__field__list__item--active': is_active,
                                            })}
                                            onClick={() => {
                                                handleChange(item?.value);
                                            }}
                                        >
                                            <Text size='xs' color='prominent' weight={is_active ? 'bold ' : 'normal'}>
                                                {item?.text}
                                            </Text>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    }
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            inputMode='none'
                            data-testid='dt_qs_contract_type'
                            autoComplete='off'
                            className='qs__select contract-type'
                            value={selected_item?.text || ''}
                            list_items={list}
                            onItemSelection={(item: TItem) => {
                                const { value } = item as TDropdownItems;
                                if (value) {
                                    handleChange(value);
                                }
                            }}
                        />
                    );
                }}
            </Field>
        </div>
    );
});

export default ContractTypes;
