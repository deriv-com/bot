import React, { MouseEvent, useEffect } from 'react';
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

// Create a context to share error state between components
const MaxStakeErrorContext = React.createContext<{
    hasError: boolean;
    errorMessage: string | null;
    setError: (hasError: boolean, message: string | null) => void;
}>({
    hasError: false,
    errorMessage: null,
    setError: () => {},
});

// Create a provider component to wrap the QSInput components
export const MaxStakeErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const setError = React.useCallback((hasError: boolean, message: string | null) => {
        setHasError(hasError);
        setErrorMessage(message);
    }, []);

    return (
        <MaxStakeErrorContext.Provider value={{ hasError, errorMessage, setError }}>
            {children}
        </MaxStakeErrorContext.Provider>
    );
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

        // Add useEffect to watch for changes in stake values and update error message accordingly
        useEffect(() => {
            // For max_stake field: show error if initial stake > max stake
            if (name === 'max_stake' && values.stake && values.max_stake) {
                // Convert to numbers with fixed precision to handle floating point comparison correctly
                const initial_stake = parseFloat(Number(values.stake).toFixed(2));
                const max_stake = parseFloat(Number(values.max_stake).toFixed(2));

                if (initial_stake > max_stake) {
                    // If initial stake is greater than max stake, show error
                    setErrorMessage(`Initial stake cannot be greater than max stake`);

                    // Also update the UI to show the error state
                    const max_stake_input = document.querySelector('input[name="max_stake"]');
                    if (max_stake_input) {
                        // Add error class to the input
                        max_stake_input.closest('.qs__input')?.classList.add('error');

                        // Force the popover to show
                        const popover = max_stake_input
                            .closest('.qs__form__field__input')
                            ?.querySelector('.qs__warning-bubble');
                        if (popover) {
                            popover.setAttribute('data-show', 'true');
                        }
                    }
                } else {
                    // Clear error message if values are now valid
                    setErrorMessage(null);
                }
            }

            // For stake field: trigger validation on max_stake field when initial stake changes
            if (name === 'stake' && values.stake && values.max_stake) {
                // Convert to numbers with fixed precision to handle floating point comparison correctly
                const initial_stake = parseFloat(Number(values.stake).toFixed(2));
                const max_stake = parseFloat(Number(values.max_stake).toFixed(2));

                if (initial_stake > max_stake) {
                    // If initial stake is greater than max stake, update the max_stake field's error state
                    // Find the max_stake input and its popover
                    const max_stake_input = document.querySelector('input[name="max_stake"]');
                    if (max_stake_input) {
                        // Add error class to the input
                        const inputElement = max_stake_input.closest('.qs__input');
                        if (inputElement) {
                            inputElement.classList.add('error');
                        }

                        // Set error message on the max_stake field
                        const max_stake_component = document.querySelector('[data-testid="max_stake-popover"]');
                        if (max_stake_component) {
                            // Force the popover to be visible by setting a custom attribute
                            max_stake_component.setAttribute('data-force-show', 'true');

                            // Find the message element inside the popover
                            const messageElement = max_stake_component.querySelector('.qs__warning-bubble div');
                            if (messageElement) {
                                messageElement.textContent = 'Initial stake cannot be greater than max stake';
                            }

                            // Try to force the popover to be visible by directly manipulating the DOM
                            const popoverElement = max_stake_component.querySelector('.qs__warning-bubble');
                            if (popoverElement) {
                                // Make the popover visible
                                (popoverElement as HTMLElement).style.display = 'block';
                                (popoverElement as HTMLElement).style.opacity = '1';
                                (popoverElement as HTMLElement).style.visibility = 'visible';
                                (popoverElement as HTMLElement).style.position = 'absolute';
                                (popoverElement as HTMLElement).style.zIndex = '9999';
                            }
                        }

                        // Update the Formik state for the max_stake field
                        setFieldValue('max_stake', values.max_stake);
                        setFieldTouched('max_stake', true, true);

                        // Create a custom error message for the max_stake field
                        const errorMessage = 'Initial stake cannot be greater than max stake';

                        // Find all QSInput components for max_stake
                        const allMaxStakeInputs = document.querySelectorAll('input[name="max_stake"]');
                        allMaxStakeInputs.forEach(input => {
                            // Set a custom attribute to indicate there's an error
                            input.setAttribute('data-has-error', 'true');
                            input.setAttribute('data-error-message', errorMessage);

                            // Dispatch events to trigger validation
                            const blurEvent = new Event('blur', { bubbles: true });
                            input.dispatchEvent(blurEvent);

                            const keyupEvent = new Event('keyup', { bubbles: true });
                            input.dispatchEvent(keyupEvent);

                            // Create a custom event to notify the component of the error
                            const errorEvent = new CustomEvent('qs-error', {
                                detail: { message: errorMessage },
                                bubbles: true,
                            });
                            input.dispatchEvent(errorEvent);
                        });
                    }
                }
            }
        }, [name, values.stake, values.max_stake]);

        const handleButtonInputChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
            e?.preventDefault();

            // For tick_count field or duration field with ticks, ensure we only allow integer values
            if (name === 'tick_count' || name === 'duration') {
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
            if (input_value === '' || input_value === '0' || input_value === '0.' || input_value === '0.0') {
                onChange(name, input_value);

                // // Show error message for empty values in fields
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
            if (is_number && (name === 'tick_count' || name === 'duration') && !Number.isInteger(value)) {
                value = Math.floor(Number(value));
            }

            // For all number fields, prevent decimal values less than 1
            if (
                is_number &&
                typeof value === 'number' &&
                value < 1 &&
                !Number.isInteger(value) &&
                name !== 'stake' &&
                name !== 'max_stake' &&
                name !== 'take_profit'
            ) {
                value = 1;
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

                ``; // Note: We're not adding a custom error message for when initial stake > max stake
                // The standard error message will be displayed by the form validation
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
                    setErrorMessage(`Initial stake cannot be greater than max stake`);
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
                                    message={
                                        // For stake field in accumulator strategy, only show error (not error_message)
                                        name === 'stake' ? error : error || error_message
                                    }
                                    is_open={
                                        name === 'stake'
                                            ? !!error
                                            : !!(error || error_message) &&
                                              (name === 'stake' ||
                                                  name === 'max_stake' ||
                                                  name === 'loss' ||
                                                  name === 'profit' ||
                                                  name === 'take_profit' ||
                                                  name === 'tick_count' ||
                                                  name === 'size' ||
                                                  name === 'duration')
                                    } // Show error message for all input fields that need validation
                                    zIndex='9999'
                                    classNameBubble='qs__warning-bubble'
                                    has_error
                                    should_disable_pointer_events
                                    data-testid={`${name}-popover`}
                                    relative_render
                                    arrow_styles={{ left: '50%' }}
                                >
                                    <Input
                                        data_testId='qs-input'
                                        className={classNames(
                                            'qs__input',
                                            {
                                                error:
                                                    (has_error || !!error_message) &&
                                                    (name === 'stake' ||
                                                        name === 'max_stake' ||
                                                        name === 'loss' ||
                                                        name === 'profit' ||
                                                        name === 'take_profit' ||
                                                        name === 'tick_count' ||
                                                        name === 'duration'),
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
                                        onWheel={e => {
                                            // Prevent scrolling from changing the input value
                                            e.currentTarget.blur();
                                            e.preventDefault();
                                        }}
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

                                                // Cross-validate between stake and max_stake
                                                if (name === 'stake') {
                                                    // When initial stake changes, validate against max_stake
                                                    const max_stake_value = values.max_stake;
                                                    const numValue = Number(value);
                                                    // Convert to numbers with fixed precision to handle floating point comparison correctly
                                                    const numValueFixed = parseFloat(numValue.toFixed(2));
                                                    const maxStakeFixed = max_stake_value
                                                        ? parseFloat(Number(max_stake_value).toFixed(2))
                                                        : 0;

                                                    if (max_stake_value && maxStakeFixed < numValueFixed) {
                                                        // Don't show error on initial stake field
                                                        // Instead, trigger validation on the max stake field to show the error there
                                                        const max_stake_input =
                                                            document.querySelector('input[name="max_stake"]');
                                                        if (max_stake_input) {
                                                            // Update the max stake field value to trigger validation
                                                            // This ensures the max stake field listens to changes in the initial stake field
                                                            setFieldValue('max_stake', max_stake_value);
                                                            setFieldTouched('max_stake', true, true);

                                                            // Dispatch both blur and keyup events to ensure validation runs
                                                            const blurEvent = new Event('blur', { bubbles: true });
                                                            max_stake_input.dispatchEvent(blurEvent);

                                                            const keyupEvent = new Event('keyup', { bubbles: true });
                                                            max_stake_input.dispatchEvent(keyupEvent);
                                                        }
                                                    } else if (max_stake_value) {
                                                        // Clear error message if values are now valid
                                                        // Also trigger validation on the max_stake field to clear its error
                                                        const max_stake_input =
                                                            document.querySelector('input[name="max_stake"]');
                                                        if (max_stake_input) {
                                                            const event = new Event('keyup', { bubbles: true });
                                                            max_stake_input.dispatchEvent(event);
                                                        }
                                                    }
                                                } else if (name === 'max_stake') {
                                                    // When max stake changes, validate against initial stake
                                                    const initial_stake_value = values.stake;
                                                    const numValue = Number(value);
                                                    // Convert to numbers with fixed precision to handle floating point comparison correctly
                                                    const numValueFixed = parseFloat(numValue.toFixed(2));
                                                    const initialStakeFixed = initial_stake_value
                                                        ? parseFloat(Number(initial_stake_value).toFixed(2))
                                                        : 0;

                                                    if (initial_stake_value && initialStakeFixed > numValueFixed) {
                                                        // If initial stake is greater than max stake, show error
                                                        setErrorMessage(
                                                            `Initial stake cannot be greater than max stake`
                                                        );
                                                    } else {
                                                        // Clear error message if values are now valid
                                                        setErrorMessage(null);
                                                    }
                                                }
                                            }
                                        }}
                                        placeholder={is_exclusive_field ? '0.00' : ''}
                                        bottom_label={is_exclusive_field ? currency : ''}
                                        max_characters={2}
                                        maxLength={2}
                                        inputMode={name === 'tick_count' || name === 'duration' ? 'numeric' : undefined}
                                        pattern={name === 'tick_count' || name === 'duration' ? '[0-9]*' : undefined}
                                        onKeyPress={
                                            name === 'tick_count' || name === 'duration'
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
                                                const min_stake =
                                                    (quick_strategy?.additional_data as any)?.min_stake || 0.35;
                                                const max_stake =
                                                    (quick_strategy?.additional_data as any)?.max_stake || 1000;
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

                                                // Cross-validate between stake and max_stake
                                                if (name === 'stake') {
                                                    // When initial stake changes, validate against max_stake
                                                    const max_stake_value = values.max_stake;
                                                    const numValueFixed = parseFloat(Number(value).toFixed(2));
                                                    const maxStakeFixed = max_stake_value
                                                        ? parseFloat(Number(max_stake_value).toFixed(2))
                                                        : 0;

                                                    if (max_stake_value && maxStakeFixed < numValueFixed) {
                                                        // Don't show error on initial stake field
                                                        // Instead, trigger validation on the max stake field to show the error there
                                                        const max_stake_input =
                                                            document.querySelector('input[name="max_stake"]');
                                                        if (max_stake_input) {
                                                            // Update the max stake field value to trigger validation
                                                            // This ensures the max stake field listens to changes in the initial stake field
                                                            setFieldValue('max_stake', max_stake_value);
                                                            setFieldTouched('max_stake', true, true);

                                                            // Dispatch both blur and keyup events to ensure validation runs
                                                            const blurEvent = new Event('blur', { bubbles: true });
                                                            max_stake_input.dispatchEvent(blurEvent);

                                                            const keyupEvent = new Event('keyup', { bubbles: true });
                                                            max_stake_input.dispatchEvent(keyupEvent);
                                                        }
                                                    } else if (max_stake_value) {
                                                        // Clear error message if values are now valid
                                                        // Also trigger validation on the max_stake field to clear its error
                                                        const max_stake_input =
                                                            document.querySelector('input[name="max_stake"]');
                                                        if (max_stake_input) {
                                                            const event = new Event('keyup', { bubbles: true });
                                                            max_stake_input.dispatchEvent(event);
                                                        }
                                                    }
                                                } else if (name === 'max_stake') {
                                                    // When max stake changes, validate against initial stake
                                                    const initial_stake_value = values.stake;
                                                    const numValueFixed = parseFloat(Number(value).toFixed(2));
                                                    const initialStakeFixed = initial_stake_value
                                                        ? parseFloat(Number(initial_stake_value).toFixed(2))
                                                        : 0;

                                                    if (initial_stake_value && initialStakeFixed > numValueFixed) {
                                                        // If initial stake is greater than max stake, show error
                                                        setErrorMessage(
                                                            `Initial stake cannot be greater than max stake`
                                                        );
                                                    } else {
                                                        // Clear error message if values are now valid
                                                        setErrorMessage(null);
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
