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
    const { setValue, setAdditionalData, setDropdownState } = quick_strategy;
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

    // Define currency-specific configurations
    const currencyConfig = React.useMemo(
        () => ({
            USD: { min_stake: 1, increment_step: 1 },
            BTC: { min_stake: 0.000013, increment_step: 0.00000001 },
            ETH: { min_stake: 0.001, increment_step: 0.0001 },
            tUSDT: { min_stake: 1, increment_step: 1 },
            eUSDT: { min_stake: 1, increment_step: 1 },
            LTC: { min_stake: 0.01, increment_step: 0.001 },
            // Add default for any other currency
            default: { min_stake: 1, increment_step: 1 },
        }),
        []
    );

    // Track if initial values have been set
    const initialValuesSet = React.useRef(false);

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

        // Set the min_stake value in the additional_data object based on the currency
        const currency = client?.currency as keyof typeof currencyConfig;
        const config = currencyConfig[currency] || currencyConfig.default;

        setAdditionalData({
            ...quick_strategy.additional_data,
            min_stake: config.min_stake,
            increment_step: config.increment_step,
        });

        // Only set default values if they haven't been set before or if the currency changes
        // This prevents resetting values when other form fields change
        if (setFieldValue && !initialValuesSet.current) {
            // Set default value for stake field only if it hasn't been set before
            setFieldValue('stake', config.min_stake);

            // Set default value for max_stake field if it exists
            if (values.max_stake !== undefined) {
                // Set max_stake to a reasonable default based on min_stake and currency
                let defaultMaxStake;

                switch (currency) {
                    case 'BTC':
                        // For BTC, set a lower max stake (e.g., 0.001 BTC)
                        defaultMaxStake = 0.001;
                        break;
                    case 'ETH':
                        // For ETH, set a reasonable max stake (e.g., 0.1 ETH)
                        defaultMaxStake = 0.1;
                        break;
                    case 'LTC':
                        // For LTC, set a reasonable max stake (e.g., 1 LTC)
                        defaultMaxStake = 1;
                        break;
                    default:
                        // For other currencies (USD, tUSDT, eUSDT), use the original calculation
                        defaultMaxStake = Math.max(config.min_stake * 10, 10);
                }

                setFieldValue('max_stake', defaultMaxStake);
            }

            // Set default values for other currency-dependent fields
            if (values.profit !== undefined) {
                setFieldValue('profit', config.min_stake * 10);
            }

            if (values.loss !== undefined) {
                setFieldValue('loss', config.min_stake * 10);
            }

            if (values.take_profit !== undefined) {
                setFieldValue('take_profit', config.min_stake * 5);
            }

            // Mark that initial values have been set
            initialValuesSet.current = true;
        }
    }, [client?.currency, currencyConfig, setFieldValue]);

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

    const validateMinMaxForAccumulators = async (values: TFormData) => {
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

            // Extract max_stake from the correct path in the API response
            const max_stake = response?.proposal?.contract_details?.maximum_stake;
            const min_stake = response?.proposal?.contract_details?.minimum_stake;

            let min_error = '';
            let max_error = '';
            setAdditionalData({
                max_payout: ref_max_payout.current,
                max_ticks,
                max_stake: Number(max_stake) || 1000,
                min_stake: Number(min_stake) || 1,
            });
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
                // For tick count, replace the generic stake error message with a more appropriate one
                if (error_message.includes("Please enter a stake amount that's at least")) {
                    error_message = localize('Minimum tick count allowed is 1');
                } else if (error_message.includes('Maximum stake allowed is')) {
                    error_message = localize('Maximum tick count allowed is 1000');
                }
                setFieldError('tick_count', error_message);
                prev_error.current.tick_count = error_message;

                // Force rerender by updating the field value
                const current_value = Number(values.tick_count);
                if (current_value > 1000) {
                    setFieldValue('tick_count', 1000);
                } else if (current_value < 1) {
                    setFieldValue('tick_count', 1);
                }
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

                // Check if the error message is about minimum stake but the field is not 'stake'
                // The backend sometimes returns field as "amount" instead of "stake"
                if (
                    error_message.includes("Please enter a stake amount that's at least") &&
                    (error_response?.error?.details?.field === 'amount' ||
                        error_response?.error?.details?.field !== 'stake')
                ) {
                    // Extract the minimum stake value
                    const error_parts = error_message.split("Please enter a stake amount that's at least");
                    if (error_parts.length > 1) {
                        const min_stake_str = error_parts[1].trim().replace(/[^0-9.]/g, '');
                        if (min_stake_str && !isNaN(Number(min_stake_str))) {
                            const min_stake = min_stake_str;

                            // Update the additional_data with the extracted min_stake value
                            setAdditionalData({
                                ...quick_strategy.additional_data,
                                min_stake: Number(min_stake),
                            });

                            // Set the error on the stake field instead of take_profit
                            setFieldError('stake', localize(`Minimum stake allowed is ${min_stake}`));

                            // Only update the stake value if it's less than the minimum
                            if (Number(values.stake) < Number(min_stake)) {
                                // Force update the min_stake value in the UI
                                setFieldValue('stake', min_stake);
                                // Update the user's manually entered stake value
                                userStakeValue.current = min_stake;
                            }

                            // Clear the error on the take_profit field
                            setFieldError('take_profit', undefined);
                            prev_error.current.take_profit = null;

                            // Return early to avoid setting the error on the take_profit field
                            return;
                        }
                    }
                }

                if (error_response?.error?.details?.field === 'stake') {
                    // Get the min stake and max payout values from the error message
                    const min_stake_match =
                        error_response?.error?.message.match(/minimum stake of (\d+\.\d+)/i) ||
                        error_response?.error?.message.match(/at least (\d+\.\d+)/i) ||
                        error_response?.error?.message.match(/that's at least (\d+\.\d+)/i);
                    const max_payout_match = error_response?.error?.message.match(/maximum payout of (\d+\.\d+)/i);

                    if (min_stake_match) {
                        const min_stake = min_stake_match[1];

                        // Update the additional_data with the extracted min_stake value
                        setAdditionalData({
                            ...quick_strategy.additional_data,
                            min_stake: Number(min_stake),
                        });

                        // Only update the stake value if it's less than the minimum
                        if (Number(values.stake) < Number(min_stake)) {
                            // Force update the min_stake value in the UI
                            setFieldValue('stake', min_stake);
                            // Update the user's manually entered stake value
                            userStakeValue.current = min_stake;
                        }

                        if (max_payout_match) {
                            const max_payout = max_payout_match[1];
                            const current_payout = Number(values.take_profit) + Number(values.stake);

                            error_message = localize(
                                `Minimum stake of ${min_stake} and maximum payout of ${max_payout}. Current payout is ${current_payout.toFixed(2)}.`
                            );
                        } else {
                            error_message = localize(`Minimum stake allowed is ${min_stake}`);
                        }
                    } else if (error_message.includes("Please enter a stake amount that's at least")) {
                        // If we couldn't extract the min_stake with regex but the error message contains this phrase,
                        // try to extract the number directly from the error message
                        const error_parts = error_message.split("Please enter a stake amount that's at least");
                        if (error_parts.length > 1) {
                            const min_stake_str = error_parts[1].trim().replace(/[^0-9.]/g, '');
                            if (min_stake_str && !isNaN(Number(min_stake_str))) {
                                const min_stake = min_stake_str;

                                // Update the additional_data with the extracted min_stake value
                                setAdditionalData({
                                    ...quick_strategy.additional_data,
                                    min_stake: Number(min_stake),
                                });

                                // Only update the stake value if it's less than the minimum
                                if (Number(values.stake) < Number(min_stake)) {
                                    // Force update the min_stake value in the UI
                                    setFieldValue('stake', min_stake);
                                    // Update the user's manually entered stake value
                                    userStakeValue.current = min_stake;
                                }

                                error_message = localize(`Minimum stake allowed is ${min_stake}`);
                            }
                        }
                    } else if (error_message.includes('Maximum stake allowed is')) {
                        const max_stake = quick_strategy?.additional_data?.max_stake || '1000';
                        error_message = localize(`Maximum stake allowed is ${max_stake}`);
                    } else {
                        error_message = `${error_response?.error?.message}`;
                    }

                    // Set the error on the stake field instead of take_profit
                    setFieldError('stake', error_message);
                } else {
                    setFieldError('take_profit', error_message);
                    prev_error.current.take_profit = error_message;
                }
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

    // Track the user's manually entered stake value
    const userStakeValue = React.useRef<string | number | null>(null);

    React.useEffect(() => {
        // If the user has manually entered a stake value, store it
        if (values.stake && userStakeValue.current === null) {
            userStakeValue.current = values.stake;
        }

        // Only call debounceChange if specific values have changed
        // and avoid unnecessary API calls when stake value changes
        if (
            prev_proposal_payload.current?.symbol !== values.symbol ||
            // Only include stake in the condition if it's significantly different
            // This prevents minor formatting changes from triggering API calls
            (prev_proposal_payload.current?.amount !== values.stake &&
                Math.abs(Number(prev_proposal_payload.current?.amount) - Number(values.stake)) > 0.001) ||
            prev_proposal_payload.current?.limit_order?.take_profit !== values.take_profit ||
            prev_proposal_payload.current?.currency !== client?.currency ||
            prev_proposal_payload.current?.growth_rate !== values.growth_rate ||
            prev_proposal_payload.current?.boolean_tick_count !== values.boolean_tick_count
        ) {
            // Create a copy of values to avoid modifying the original
            const valuesToValidate = { ...values };

            // If the user has manually entered a stake value, use that instead
            // This prevents the API from resetting the stake value
            if (userStakeValue.current !== null) {
                valuesToValidate.stake = userStakeValue.current;
            }

            debounceChange(valuesToValidate);
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
                            onShowDropdownList={() => setDropdownState(true)}
                            onHideDropdownList={() => setDropdownState(false)}
                            data_testid='dt_qs_contract_type'
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
});

export default GrowthRateSelect;
