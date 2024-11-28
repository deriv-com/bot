import React from 'react';
import classNames from 'classnames';
import debounce from 'debounce';
import { Field, FieldProps, useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import Autocomplete from '@/components/shared_ui/autocomplete';
import { TItem } from '@/components/shared_ui/dropdown-list';
import Text from '@/components/shared_ui/text';
import { api_base } from '@/external/bot-skeleton';
import { requestProposalForQS } from '@/external/bot-skeleton/scratch/accumulators-proposal-handler';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { TDropdownItems, TFormData } from '../types';

type TContractTypes = {
    name: string;
    attached?: boolean;
};

type TProposalRequest = {
    amount: number;
    currency: string;
    growth_rate: number;
    symbol: string;
    limit_order: {
        take_profit: number;
    };
    boolean_tick_count: boolean;
};

const GrowthRateSelect: React.FC<TContractTypes> = observer(({ name }) => {
    const { ui, client } = useStore();
    const { is_desktop } = ui;
    const [list, setList] = React.useState<TDropdownItems[]>([]);
    const { quick_strategy } = useStore();
    const { setValue, setAdditionalData } = quick_strategy;
    const { setFieldValue, values, setFieldError, errors } = useFormikContext<TFormData>();

    const prev_proposal_payload = React.useRef<TProposalRequest | null>(null);
    const ref_max_payout = React.useRef<TProposalRequest | null>(null);
    const prev_error = React.useRef<{
        tick_count: string | null;
        take_profit: string | null;
    }>({
        tick_count: null,
        take_profit: null,
    });

    React.useEffect(() => {
        setList([
            { text: '1%', value: '0.01' },
            { text: '2%', value: '0.02' },
            { text: '3%', value: '0.03' },
            { text: '4%', value: '0.04' },
            { text: '5%', value: '0.05' },
        ]);
        setFieldValue?.('tradetype', 'accumulator');
        setValue('tradetype', 'accumulator');
    }, []);

    React.useEffect(() => {
        if (values.boolean_tick_count) {
            setFieldValue('take_profit', 0);
            setFieldError('tick_count', prev_error.current?.tick_count ?? undefined);
            setFieldError('take_profit', undefined);
        } else {
            setFieldValue('tick_count', 0);
            setFieldError('take_profit', prev_error.current?.take_profit ?? undefined);
            setFieldError('tick_count', undefined);
        }
    }, [values, errors.take_profit, errors.tick_count, values.boolean_tick_count, setFieldValue, setFieldError]);

    const validateMinMaxForAccumulators = async values => {
        const growth_rate = Number(values.growth_rate);
        const amount = Number(values.stake);
        const take_profit = Number(values.take_profit);
        const request_proposal = {
            amount,
            currency: client?.currency,
            growth_rate,
            symbol: values.symbol,
            limit_order: {
                ...(!values.boolean_tick_count && { take_profit }),
            },
        };

        prev_proposal_payload.current = { ...request_proposal, boolean_tick_count: values.boolean_tick_count };
        try {
            const response = await requestProposalForQS(request_proposal, api_base.api);
            const min_ticks = 1;
            const max_ticks = response?.proposal?.validation_params?.max_ticks;
            let min_error = '';
            let max_error = '';
            setAdditionalData({ max_payout: ref_max_payout.current, max_ticks });
            ref_max_payout.current = response?.proposal?.validation_params?.max_payout;
            const current_tick_count = Number(values.tick_count);

            if (!isNaN(current_tick_count) && current_tick_count > max_ticks) {
                max_error = `Maximum tick count is: ${max_ticks}`;
                setFieldError('tick_count', max_error);
                prev_error.current.tick_count = max_error;
            } else if (!isNaN(current_tick_count) && current_tick_count < min_ticks) {
                min_error = `Minimum tick count is: ${min_ticks}`;
                setFieldError('tick_count', min_error);
                prev_error.current.tick_count = min_error;
            } else {
                prev_error.current.tick_count = null;
                setFieldError('tick_count', undefined);
            }
            prev_error.current.take_profit = null;
        } catch (error_response) {
            let error_message = error_response?.message ?? error_response?.error?.message;

            if (values.boolean_tick_count) {
                setFieldError('tick_count', error_message);
                prev_error.current.tick_count = error_message;
            } else {
                if (error_response?.error?.details?.field === 'take_profit') {
                    if (Number(values.take_profit) === 0) {
                        error_message = error_response?.error?.message;
                    } else {
                        error_message = `Your total payout is ${
                            Number(values.take_profit) + Number(values.stake)
                        }. Enter amount less than ${ref_max_payout.current} ${localize(
                            'By changing your initial stake and/or take profit.'
                        )}`;
                    }
                }

                if (error_response?.error?.details?.field === 'stake') {
                    error_message = `${error_response?.error?.message} ${localize('Update your initial stake.')}`;
                }
                setFieldError('take_profit', error_message);
                prev_error.current.take_profit = error_message;
            }
        }
    };

    const debounceChange = React.useCallback(
        debounce(validateMinMaxForAccumulators, 500, {
            trailing: true,
            leading: false,
        }),
        []
    );

    React.useEffect(() => {
        if (
            prev_proposal_payload.current?.symbol !== values.symbol ||
            prev_proposal_payload.current?.amount !== values.stake ||
            prev_proposal_payload.current?.limit_order?.take_profit !== values.take_profit ||
            prev_proposal_payload.current?.currency !== client?.currency ||
            prev_proposal_payload.current?.growth_rate !== values.growth_rate ||
            prev_proposal_payload.current?.boolean_tick_count !== values.boolean_tick_count
        ) {
            debounceChange(values);
        }
    }, [
        values.take_profit,
        values.tick_count,
        values.stake,
        values.growth_rate,
        client?.currency,
        values.boolean_tick_count,
        values,
        debounceChange,
    ]);

    const handleChange = async (value: string) => {
        setFieldValue?.(name, value);
        setValue(name, value);
    };

    const key = `qs-contract-type-${name}`;

    return (
        <div className='qs__form__field qs__form__field__input no-top-spacing'>
            <Field name={name} key={key} id={key}>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find(item => item?.value === field?.value);
                    if (!is_desktop) {
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
                                            onChange={() => {
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

export default GrowthRateSelect;
