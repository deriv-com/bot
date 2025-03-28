import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import Input from '@/components/shared_ui/input';
import Popover from '@/components/shared_ui/popover';
import { useStore } from '@/hooks/useStore';

type TQSInput = {
    name: string;
    onChange: (key: string, value: string | number | boolean) => void;
    type?: string;
    attached?: boolean;
    should_have?: { key: string; value: string | number | boolean }[];
    disabled?: boolean;
    min?: number;
    max?: number;
    has_currency_unit?: boolean;
};

const QSInput: React.FC<TQSInput> = observer(
    ({
        name,
        onChange,
        type = 'text',
        attached = false,
        disabled = false,
        min,
        max,
        has_currency_unit = false,
    }: TQSInput) => {
        const {
            client: { currency },
        } = useStore();
        const { quick_strategy } = useStore();
        const { loss_threshold_warning_data } = quick_strategy;

        const [, setFocus] = React.useState(false);
        const [error_message, setErrorMessage] = React.useState<string | null>(null);
        const { setFieldValue, setFieldTouched, values } = useFormikContext<{
            stake?: string | number;
            max_stake?: string | number;
        }>();
        const is_number = type === 'number';
        const max_value = 999999999999;

        const handleButtonInputChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
            e?.preventDefault();

            // For tick_count field or duration field with ticks, ensure we only allow integer values
            if (name === 'tick_count' || (name === 'duration' && quick_strategy.form_data?.durationtype === 't')) {
                const intValue = Math.floor(Number(value));
                value = String(intValue);
            }

            // For stake field, ensure the value is within the allowed range
            if (name === 'stake') {
                const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 0.35;
                const max_stake = (quick_strategy?.additional_data as any)?.max_stake || 1000;

                if (Number(value) < min_stake) {
                    value = String(min_stake);
                } else if (Number(value) > max_stake) {
                    value = String(max_stake);
                }
            }

            onChange(name, value);
            setFieldTouched(name, true, true);
            setFieldValue(name, value);
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input_value = e.target.value;
            let value: number | string = 0;
            const max_characters = 12;

            // Clear any previous error message
            setErrorMessage(null);

            // Allow empty string or partial input to support backspace
            if (input_value === '' || input_value === '0' || input_value === '0.') {
                onChange(name, input_value);

                // Show error message for empty values in stake and max_stake fields
                if (name === 'stake' || name === 'max_stake') {
                    const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 0.35;
                    setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                }
                return;
            }

            if (max_characters && input_value.length >= max_characters) {
                value = input_value.slice(0, max_characters);
                value = is_number ? Number(value) : value;
            } else {
                value = is_number ? Number(input_value) : input_value;
            }

            // For tick_count field or duration field with ticks, ensure we only allow integer values
            if (
                is_number &&
                (name === 'tick_count' || (name === 'duration' && quick_strategy.form_data?.durationtype === 't')) &&
                !Number.isInteger(value)
            ) {
                value = Math.floor(Number(value));
            }

            // For stake field, check if value is within the allowed range
            if (name === 'stake' && is_number) {
                const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 0.35;
                const max_stake = (quick_strategy?.additional_data as any)?.max_stake || 1000;
                const numValue = Number(value);

                // Clear error message if value is valid
                if (numValue >= min_stake && numValue <= max_stake) {
                    setErrorMessage(null);
                } else {
                    // Show error message if value is less than minimum stake
                    if (numValue < min_stake) {
                        setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                    } else if (numValue > max_stake) {
                        // Allow entering any value but show error message
                        setErrorMessage(`Maximum stake allowed is ${max_stake}`);
                    }
                }

                // Cross-validate with max_stake
                const max_stake_value = values.max_stake;
                if (max_stake_value && Number(max_stake_value) < numValue) {
                    // If max stake is less than initial stake, show error
                    setErrorMessage(
                        `Initial stake (${numValue}) cannot be greater than max stake (${max_stake_value})`
                    );
                }
            }

            // For max_stake field, check if value is within the allowed range
            if (name === 'max_stake' && is_number) {
                const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 0.35;
                const max_stake = (quick_strategy?.additional_data as any)?.max_stake || 1000;
                const numValue = Number(value);

                // Clear error message if value is valid
                if (numValue >= min_stake && numValue <= max_stake) {
                    setErrorMessage(null);
                } else {
                    // Show error message if value is less than minimum stake
                    if (numValue < min_stake) {
                        setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                    } else if (numValue > max_stake) {
                        // Allow entering any value but show error message
                        setErrorMessage(`Maximum stake allowed is ${max_stake}`);
                    }
                }

                // Cross-validate with initial stake
                const initial_stake_value = values.stake;
                if (initial_stake_value && Number(initial_stake_value) > numValue) {
                    // If initial stake is greater than max stake, show error
                    setErrorMessage(`Maximum stake cannot be less than initial stake (${initial_stake_value})`);
                }
            }

            onChange(name, value);
        };

        return (
            <Field name={name} key={name} id={name}>
                {({ field, meta }: FieldProps) => {
                    const { error } = meta;
                    const has_error = error;
                    const is_exclusive_field = has_currency_unit;
                    return (
                        <div
                            className={classNames('qs__form__field qs__form__field__input', {
                                'no-top-spacing': attached,
                                'no-border-top': attached,
                            })}
                        >
                            <div
                                data-testid='qs-input-container'
                                onMouseEnter={() => setFocus(true)}
                                onMouseLeave={() => setFocus(false)}
                            >
                                <Popover
                                    alignment='bottom'
                                    message={error || error_message} // Prioritize backend error over client-side error
                                    is_open={!!(error || error_message) && (name === 'stake' || name === 'max_stake')} // Show error message for stake and max_stake fields
                                    zIndex='9999'
                                    classNameBubble='qs__warning-bubble'
                                    has_error
                                    should_disable_pointer_events
                                >
                                    <Input
                                        data_testId='qs-input'
                                        className={classNames(
                                            'qs__input',
                                            {
                                                error:
                                                    (has_error || !!error_message) &&
                                                    (name === 'stake' || name === 'max_stake'),
                                            },
                                            { highlight: loss_threshold_warning_data?.highlight_field?.includes(name) }
                                        )}
                                        type={type}
                                        leading_icon={
                                            is_number ? (
                                                <button
                                                    disabled={
                                                        disabled ||
                                                        (!!min && Number(field.value) === min) ||
                                                        (name === 'stake' &&
                                                            Number(field.value) <=
                                                                ((quick_strategy?.additional_data as any)?.min_stake ||
                                                                    0.35)) ||
                                                        Number(field.value) <= 1 // Disable minus button for all inputs when value is <= 1
                                                    }
                                                    data-testid='qs-input-decrease'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const min_stake =
                                                            (quick_strategy?.additional_data as any)?.min_stake || 0.35;
                                                        const current_value = Number(field.value);
                                                        const field_min = name === 'stake' ? min_stake : min || 1;

                                                        // For all fields
                                                        // If value is greater than 1, subtract 1 from the value
                                                        if (current_value > 1) {
                                                            const new_value = current_value - 1;
                                                            handleButtonInputChange(
                                                                e,
                                                                String(new_value % 1 ? new_value.toFixed(2) : new_value)
                                                            );
                                                            return;
                                                        }
                                                        // If value is less than or equal to 1 but greater than minimum, set to minimum
                                                        else if (current_value <= 1 && current_value > field_min) {
                                                            handleButtonInputChange(e, String(field_min));
                                                            return;
                                                        }
                                                        // If already at minimum, do nothing
                                                        else if (current_value <= field_min) {
                                                            return;
                                                        }
                                                    }}
                                                >
                                                    -
                                                </button>
                                            ) : undefined
                                        }
                                        trailing_icon={
                                            is_number ? (
                                                <button
                                                    disabled={
                                                        disabled ||
                                                        field.value == max_value ||
                                                        (!!max && field.value >= max)
                                                    }
                                                    data-testid='qs-input-increase'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const value = Number(field.value) + 1;
                                                        handleButtonInputChange(
                                                            e,
                                                            String(value % 1 ? value.toFixed(2) : value)
                                                        );
                                                    }}
                                                >
                                                    +
                                                </button>
                                            ) : null
                                        }
                                        {...field}
                                        disabled={disabled}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChange(e)}
                                        onBlur={e => {
                                            // Don't reset empty values, just show error message
                                            if (name === 'stake' || name === 'max_stake') {
                                                const min_stake =
                                                    (quick_strategy?.additional_data as any)?.min_stake || 0.35;
                                                const max_stake =
                                                    (quick_strategy?.additional_data as any)?.max_stake || 1000;
                                                const value = e.target.value;

                                                // For empty values, show error message but don't reset
                                                if (value === '' || value === '0' || value === '0.') {
                                                    setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                                                } else {
                                                    // For non-empty values, validate and show appropriate message
                                                    const numValue = Number(value);
                                                    if (numValue < min_stake) {
                                                        setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                                                    } else if (numValue > max_stake) {
                                                        setErrorMessage(`Maximum stake allowed is ${max_stake}`);
                                                    } else {
                                                        setErrorMessage(null);
                                                    }
                                                }

                                                // Cross-validate with the other stake field
                                                if (name === 'stake') {
                                                    // When initial stake changes, validate max_stake
                                                    const max_stake_value = values.max_stake;
                                                    if (max_stake_value && Number(max_stake_value) < Number(value)) {
                                                        // If max stake is less than initial stake, show error
                                                        setErrorMessage(
                                                            `Initial stake (${value}) cannot be greater than max stake (${max_stake_value})`
                                                        );
                                                    }
                                                } else if (name === 'max_stake') {
                                                    // When max stake changes, validate initial stake
                                                    const initial_stake_value = values.stake;
                                                    if (
                                                        initial_stake_value &&
                                                        Number(initial_stake_value) > Number(value)
                                                    ) {
                                                        // If initial stake is greater than max stake, show error
                                                        setErrorMessage(
                                                            `Maximum stake cannot be less than initial stake (${initial_stake_value})`
                                                        );
                                                    }
                                                }
                                            }
                                        }}
                                        placeholder={is_exclusive_field ? '0.00' : ''}
                                        bottom_label={is_exclusive_field ? currency : ''}
                                        max_characters={2}
                                        maxLength={2}
                                        inputMode={
                                            name === 'tick_count' ||
                                            (name === 'duration' && quick_strategy.form_data?.durationtype === 't')
                                                ? 'numeric'
                                                : undefined
                                        }
                                        pattern={
                                            name === 'tick_count' ||
                                            (name === 'duration' && quick_strategy.form_data?.durationtype === 't')
                                                ? '[0-9]*'
                                                : undefined
                                        }
                                        onKeyPress={
                                            name === 'tick_count' ||
                                            (name === 'duration' && quick_strategy.form_data?.durationtype === 't')
                                                ? e => {
                                                      if (e.key === '.') {
                                                          e.preventDefault();
                                                      }
                                                  }
                                                : undefined
                                        }
                                        onKeyUp={e => {
                                            // Check value on each keystroke for stake field
                                            if (name === 'stake' || name === 'max_stake') {
                                                const min_stake = (quick_strategy?.additional_data as any)?.min_stake;
                                                const max_stake = (quick_strategy?.additional_data as any)?.max_stake;
                                                const value = e.currentTarget.value;

                                                // For empty values, show error message but don't reset
                                                if (value === '' || value === '0' || value === '0.') {
                                                    setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                                                    return;
                                                }

                                                const numValue = Number(value);

                                                // Clear error message if value is valid
                                                if (numValue >= min_stake && numValue <= max_stake) {
                                                    setErrorMessage(null);
                                                    return;
                                                }

                                                // Show error message if value is less than minimum stake or greater than maximum
                                                if (numValue < min_stake) {
                                                    setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                                                } else if (numValue > max_stake) {
                                                    // Allow entering any value but show error message for maximum
                                                    setErrorMessage(`Maximum stake allowed is ${max_stake}`);
                                                }

                                                // Cross-validate with the other stake field
                                                if (name === 'stake') {
                                                    // When initial stake changes, validate max_stake
                                                    const max_stake_value = values.max_stake;
                                                    if (max_stake_value && Number(max_stake_value) < numValue) {
                                                        // If max stake is less than initial stake, show error
                                                        setErrorMessage(
                                                            `Initial stake (${numValue}) cannot be greater than max stake (${max_stake_value})`
                                                        );
                                                    }
                                                } else if (name === 'max_stake') {
                                                    // When max stake changes, validate initial stake
                                                    const initial_stake_value = values.stake;
                                                    if (initial_stake_value && Number(initial_stake_value) > numValue) {
                                                        // If initial stake is greater than max stake, show error
                                                        setErrorMessage(
                                                            `Maximum stake cannot be less than initial stake (${initial_stake_value})`
                                                        );
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Popover>
                            </div>
                        </div>
                    );
                }}
            </Field>
        );
    }
);

export default QSInput;
