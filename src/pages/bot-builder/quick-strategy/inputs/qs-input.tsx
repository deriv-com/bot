import React, { MouseEvent, useEffect } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import Input from '@/components/shared_ui/input';
import Popover from '@/components/shared_ui/popover';
import { useStore } from '@/hooks/useStore';

// Helper function to format numbers based on currency
const formatNumberForCurrency = (value: number, currency?: string): string => {
    // Format the number based on the currency
    switch (currency) {
        case 'BTC':
            // For BTC, show 8 decimal places
            return value.toFixed(8);
        case 'ETH':
            // For ETH, show 6 decimal places
            return value.toFixed(6);
        case 'LTC':
            // For LTC, show 8 decimal places
            return value.toFixed(8);
        default:
            // For other currencies (USD, tUSDT, eUSDT), show 2 decimal places
            return value.toFixed(2);
    }
};

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
        const { loss_threshold_warning_data, is_dropdown_open: store_dropdown_open } = quick_strategy;
        const popoverRef = React.useRef<HTMLDivElement>(null);
        const [, setFocus] = React.useState(false);
        const [error_message, setErrorMessage] = React.useState<string | null>(null);
        const [local_dropdown_open, setLocalDropdownOpen] = React.useState(false);
        const { setFieldValue, setFieldTouched, values } = useFormikContext<{
            stake?: string | number;
            max_stake?: string | number;
        }>();

        // Use either the store's dropdown state or our local state
        const is_dropdown_open = store_dropdown_open || local_dropdown_open;

        // Set up a MutationObserver to detect when the dropdown opens/closes
        useEffect(() => {
            // Function to check if dropdown is open
            const checkDropdownState = () => {
                // Look for elements that might indicate an open dropdown
                const openDropdowns = document.querySelectorAll(
                    '.dropdown-open, [data-open="true"], [aria-expanded="true"]'
                );
                const dropdownMenus = document.querySelectorAll('.dropdown-menu, .select-dropdown, .menu-open');

                // Check if there's a dropdown with "Continuous Indices" text (from the screenshot)
                const continuousIndicesElements = Array.from(document.querySelectorAll('*')).filter(el =>
                    el.textContent?.includes('Continuous Indices')
                );

                // If any of these elements exist, consider the dropdown open
                const isOpen =
                    openDropdowns.length > 0 || dropdownMenus.length > 0 || continuousIndicesElements.length > 0;

                setLocalDropdownOpen(isOpen);
            };

            // Check initial state
            checkDropdownState();

            // Set up observer to watch for DOM changes
            const observer = new MutationObserver(checkDropdownState);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'aria-expanded', 'data-open'],
            });

            // Clean up
            return () => observer.disconnect();
        }, []);
        const is_number = type === 'number';
        const max_value = 999999999999;

        // Add useEffect to add a global style to hide all popovers when dropdown is open
        useEffect(() => {
            // Create a style element
            const styleElement = document.createElement('style');
            styleElement.id = 'hide-popovers-style';

            // Add CSS to hide all popovers when dropdown is open
            if (is_dropdown_open) {
                styleElement.textContent = `
                    .qs__warning-bubble {
                        display: none !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                    }
                `;
                document.head.appendChild(styleElement);
            } else {
                // Remove the style element when dropdown is closed
                const existingStyle = document.getElementById('hide-popovers-style');
                if (existingStyle) {
                    document.head.removeChild(existingStyle);
                }
            }

            // Cleanup function to remove the style element when component unmounts
            return () => {
                const existingStyle = document.getElementById('hide-popovers-style');
                if (existingStyle) {
                    document.head.removeChild(existingStyle);
                }
            };
        }, [is_dropdown_open]);

        // Add useEffect to watch for changes in stake values and update error message accordingly
        useEffect(() => {
            // For max_stake field: show error if initial stake > max stake
            if (name === 'max_stake' && values.stake && values.max_stake) {
                // Convert to numbers without limiting decimal places
                const initial_stake = parseFloat(String(values.stake));
                const max_stake = parseFloat(String(values.max_stake));

                if (initial_stake > max_stake) {
                    // If initial stake is greater than max stake, show error
                    setErrorMessage(`Initial stake cannot be greater than max stake`);

                    // Also update the UI to show the error state
                    const max_stake_input = document.querySelector('input[name="max_stake"]');
                    if (max_stake_input) {
                        // Add error class to the input
                        max_stake_input.closest('.qs__input')?.classList.add('error');

                        // Force the popover to show only if dropdown is not open
                        const popover = max_stake_input
                            .closest('.qs__form__field__input')
                            ?.querySelector('.qs__warning-bubble');
                        if (popover && !is_dropdown_open) {
                            popover.setAttribute('data-show', 'true');
                        } else if (popover) {
                            popover.removeAttribute('data-show');
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

                            // Try to force the popover to be visible by directly manipulating the DOM, but only if dropdown is not open
                            const popoverElement = max_stake_component.querySelector('.qs__warning-bubble');
                            if (popoverElement) {
                                if (!is_dropdown_open) {
                                    // Make the popover visible
                                    (popoverElement as HTMLElement).style.display = 'block';
                                    (popoverElement as HTMLElement).style.opacity = '1';
                                    (popoverElement as HTMLElement).style.visibility = 'visible';
                                    (popoverElement as HTMLElement).style.position = 'absolute';
                                    (popoverElement as HTMLElement).style.zIndex = '9999';
                                } else {
                                    // Hide the popover when dropdown is open
                                    (popoverElement as HTMLElement).style.display = 'none';
                                    (popoverElement as HTMLElement).style.opacity = '0';
                                    (popoverElement as HTMLElement).style.visibility = 'hidden';
                                }
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
        }, [name, values.stake, values.max_stake, is_dropdown_open]);

        const handleButtonInputChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
            e.preventDefault(); // Changed from e?.preventDefault() to ensure it always runs

            // For tick_count field or duration field with ticks, ensure we only allow integer values
            if (name === 'tick_count' || (name === 'duration' && quick_strategy.form_data?.durationtype === 't')) {
                const intValue = Math.floor(Number(value));
                value = String(intValue);
            }

            // For stake and max_stake fields, ensure the value is within the allowed range
            if (name === 'stake' || name === 'max_stake') {
                const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 1;
                const max_stake = (quick_strategy?.additional_data as any)?.max_stake || 1000;

                if (Number(value) < min_stake) {
                    value = String(min_stake);
                } else if (Number(value) > max_stake) {
                    value = String(max_stake);
                }
            }

            // For Accumulators trade type, we need to ensure the value is properly updated
            // in both Formik state and the store
            const is_accumulator = quick_strategy.selected_strategy.includes('ACCUMULATORS');

            // Note: We're not using window.userStakeValue anymore as it's not a proper approach
            // The userStakeValue ref in growth-rate-type.tsx will be updated when the form values change

            if (is_accumulator) {
                // For Accumulators, update the store first, then Formik state
                onChange(name, value);
                setFieldTouched(name, true, true);

                // Use a small timeout to ensure the value is updated in the DOM
                // This helps with synchronization issues between Formik and the store
                setTimeout(() => {
                    setFieldValue(name, value);
                }, 0);
            } else {
                // For Options, update Formik state first, then the store
                setFieldValue(name, value);
                setFieldTouched(name, true, true);
                onChange(name, value);
            }
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input_value = e.target.value;
            let value: number | string = 0;

            // Don't restrict the number of characters
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const max_characters = undefined;

            // Clear any previous error message
            setErrorMessage(null);

            // Check if the input is effectively zero (empty, '0', '0.', '0.00', etc.)
            const is_effectively_zero = input_value === '' || input_value === '0' || /^0\.0*$/.test(input_value);

            // Allow empty string or partial input to support backspace
            if (is_effectively_zero) {
                // Show error message for effectively zero values in fields
                if (name === 'stake' || name === 'max_stake') {
                    const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 1;
                    setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                }

                // For Accumulators trade type, we need to ensure the value is properly updated
                // in both Formik state and the store
                const is_accumulator = quick_strategy.selected_strategy.includes('ACCUMULATORS');

                if (is_accumulator) {
                    // For Accumulators, update the store first, then Formik state
                    onChange(name, input_value);
                    setFieldTouched(name, true, true);

                    // Use a small timeout to ensure the value is updated in the DOM
                    setTimeout(() => {
                        setFieldValue(name, input_value);
                    }, 0);
                } else {
                    // For Options, update Formik state first, then the store
                    setFieldValue(name, input_value);
                    setFieldTouched(name, true, true);
                    onChange(name, input_value);
                }
                return;
            }

            // Don't restrict the input value length
            value = is_number ? parseFloat(input_value) : input_value;

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
                const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 1;
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
                        console.log('test max_stake', max_stake);
                        // Allow entering any value but show error message
                        setErrorMessage(`Maximum stake allowed is ${max_stake}`);
                    }
                }

                // Note: We're not adding a custom error message for when initial stake > max stake
                // The standard error message will be displayed by the form validation
            }

            // For max_stake field, check if value is within the allowed range
            if (name === 'max_stake' && is_number) {
                const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 1;
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
                        console.log('test max_stake', max_stake);
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

            // For Accumulators trade type, we need to ensure the value is properly updated
            // in both Formik state and the store
            const is_accumulator = quick_strategy.selected_strategy.includes('ACCUMULATORS');

            if (is_accumulator) {
                // For Accumulators, update the store first, then Formik state
                onChange(name, value);
                setFieldTouched(name, true, true);

                // Use a small timeout to ensure the value is updated in the DOM
                setTimeout(() => {
                    setFieldValue(name, value);
                }, 0);
            } else {
                // For Options, update Formik state first, then the store
                setFieldValue(name, value);
                setFieldTouched(name, true, true);
                onChange(name, value);
            }
        };

        return (
            <Field name={name} key={name} id={name}>
                {({ field, meta }: FieldProps) => {
                    const { error } = meta;
                    const has_error = error;
                    const is_exclusive_field = has_currency_unit;

                    // Add useEffect to update error message when additional_data changes
                    useEffect(() => {
                        // If the field is effectively zero and it's a stake field, show the minimum stake error
                        if (name === 'stake' || name === 'max_stake') {
                            // Check if the input is effectively zero (empty, '0', '0.', '0.00', etc.)
                            const is_effectively_zero =
                                !field.value ||
                                field.value === '0' ||
                                (typeof field.value === 'string' && /^0\.0*$/.test(field.value));

                            if (is_effectively_zero) {
                                const min_stake = (quick_strategy?.additional_data as any)?.min_stake || 1;
                                setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                            }
                        }
                    }, [quick_strategy?.additional_data, field.value]);
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
                                <>
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
                                                        name === 'tick_count'),
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
                                                        ((name === 'stake' || name === 'max_stake') &&
                                                            Number(field.value) <=
                                                                ((quick_strategy?.additional_data as any)?.min_stake ||
                                                                    1)) ||
                                                        (name !== 'stake' &&
                                                            name !== 'max_stake' &&
                                                            Number(field.value) <= 1) // Only disable minus button for non-stake inputs when value is <= 1
                                                    }
                                                    data-testid='qs-input-decrease'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        e.preventDefault(); // Explicitly prevent default button behavior
                                                        const min_stake =
                                                            (quick_strategy?.additional_data as any)?.min_stake || 1;
                                                        const increment_step =
                                                            (quick_strategy?.additional_data as any)?.increment_step ||
                                                            1;
                                                        const current_value = Number(field.value);
                                                        const field_min =
                                                            name === 'stake' || name === 'max_stake'
                                                                ? min_stake
                                                                : min || 1;

                                                        // For stake and max_stake fields
                                                        if (name === 'stake' || name === 'max_stake') {
                                                            // If value is greater than minimum + increment_step, subtract increment_step
                                                            if (current_value > field_min + increment_step) {
                                                                const new_value = current_value - increment_step;
                                                                // Format the number based on the currency
                                                                const formatted_value = formatNumberForCurrency(
                                                                    new_value,
                                                                    currency
                                                                );
                                                                handleButtonInputChange(e, formatted_value);
                                                                return;
                                                            }
                                                            // If value is between minimum and minimum + increment_step, set to minimum
                                                            else if (
                                                                current_value > field_min &&
                                                                current_value <= field_min + increment_step
                                                            ) {
                                                                const formatted_value = formatNumberForCurrency(
                                                                    field_min,
                                                                    currency
                                                                );
                                                                handleButtonInputChange(e, formatted_value);
                                                                return;
                                                            }
                                                            // If already at minimum, do nothing
                                                            else if (current_value <= field_min) {
                                                                return;
                                                            }
                                                        }
                                                        // For profit, loss, and take_profit fields
                                                        else if (
                                                            name === 'profit' ||
                                                            name === 'loss' ||
                                                            name === 'take_profit'
                                                        ) {
                                                            // Get the increment step from additional_data
                                                            const increment_step =
                                                                (quick_strategy?.additional_data as any)
                                                                    ?.increment_step || 1;

                                                            // If value is greater than minimum + increment_step, subtract increment_step
                                                            if (current_value > field_min + increment_step) {
                                                                const new_value = current_value - increment_step;
                                                                // Format the number based on the currency
                                                                const formatted_value = formatNumberForCurrency(
                                                                    new_value,
                                                                    currency
                                                                );
                                                                handleButtonInputChange(e, formatted_value);
                                                                return;
                                                            }
                                                            // If value is between minimum and minimum + increment_step, set to minimum
                                                            else if (
                                                                current_value > field_min &&
                                                                current_value <= field_min + increment_step
                                                            ) {
                                                                const formatted_value = formatNumberForCurrency(
                                                                    field_min,
                                                                    currency
                                                                );
                                                                handleButtonInputChange(e, formatted_value);
                                                                return;
                                                            }
                                                            // If already at minimum, do nothing
                                                            else if (current_value <= field_min) {
                                                                return;
                                                            }
                                                        }
                                                        // For all other fields
                                                        else {
                                                            // If value is greater than 1, subtract 1 from the value
                                                            if (current_value > 1) {
                                                                const new_value = current_value - 1;
                                                                handleButtonInputChange(
                                                                    e,
                                                                    String(
                                                                        new_value % 1 ? new_value.toFixed(2) : new_value
                                                                    )
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
                                                        e.preventDefault(); // Explicitly prevent default button behavior
                                                        // Get the increment step from additional_data
                                                        const increment_step =
                                                            name === 'stake' ||
                                                            name === 'max_stake' ||
                                                            name === 'profit' ||
                                                            name === 'loss' ||
                                                            name === 'take_profit'
                                                                ? (quick_strategy?.additional_data as any)
                                                                      ?.increment_step || 1
                                                                : 1;

                                                        const value = Number(field.value) + increment_step;

                                                        // Format the value based on the currency if it's a stake, max_stake, profit, loss, or take_profit field
                                                        if (
                                                            name === 'stake' ||
                                                            name === 'max_stake' ||
                                                            name === 'profit' ||
                                                            name === 'loss' ||
                                                            name === 'take_profit'
                                                        ) {
                                                            const formatted_value = formatNumberForCurrency(
                                                                value,
                                                                currency
                                                            );
                                                            handleButtonInputChange(e, formatted_value);
                                                        } else {
                                                            handleButtonInputChange(
                                                                e,
                                                                String(value % 1 ? value.toFixed(2) : value)
                                                            );
                                                        }
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
                                                    (quick_strategy?.additional_data as any)?.min_stake || 1;
                                                const max_stake =
                                                    (quick_strategy?.additional_data as any)?.max_stake || 1000;
                                                const value = e.target.value;

                                                // Check if the input is effectively zero (empty, '0', '0.', '0.00', etc.)
                                                const is_effectively_zero =
                                                    value === '' || value === '0' || /^0\.0*$/.test(value);

                                                // For effectively zero values, show error message but don't reset
                                                if (is_effectively_zero) {
                                                    setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                                                } else {
                                                    // For non-empty values, validate and show appropriate message
                                                    const numValue = Number(value);

                                                    // // Prevent decimal values less than 1
                                                    // if (numValue < 1 && !Number.isInteger(numValue)) {
                                                    //     setFieldValue(name, 1);
                                                    //     return;
                                                    // }

                                                    if (numValue < min_stake) {
                                                        setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                                                    } else if (numValue > max_stake) {
                                                        console.log('test max_stake', max_stake);
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
                                        // Remove restrictions on number of characters
                                        max_characters={undefined}
                                        maxLength={undefined}
                                        pattern={
                                            name === 'tick_count' ||
                                            (name === 'duration' && quick_strategy.form_data?.durationtype === 't')
                                                ? '[0-9]*'
                                                : undefined
                                        }
                                        step='any' // Allow any decimal precision for all currencies
                                        onKeyPress={
                                            name === 'tick_count' ||
                                            (name === 'duration' && quick_strategy.form_data?.durationtype === 's')
                                                ? e => {
                                                      if (e.key === '.') {
                                                          e.preventDefault();
                                                      }
                                                  }
                                                : undefined
                                        }
                                        // Remove any restrictions on decimal input for cryptocurrency fields
                                        inputMode={
                                            (name === 'stake' ||
                                                name === 'max_stake' ||
                                                name === 'profit' ||
                                                name === 'loss' ||
                                                name === 'take_profit') &&
                                            (currency === 'BTC' || currency === 'ETH' || currency === 'LTC')
                                                ? 'decimal'
                                                : name === 'tick_count' ||
                                                    (name === 'duration' &&
                                                        quick_strategy.form_data?.durationtype === 't')
                                                  ? 'numeric'
                                                  : undefined
                                        }
                                        onKeyUp={e => {
                                            // Check value on each keystroke for stake field
                                            if (name === 'stake' || name === 'max_stake') {
                                                const min_stake =
                                                    (quick_strategy?.additional_data as any)?.min_stake || 1;
                                                const max_stake =
                                                    (quick_strategy?.additional_data as any)?.max_stake || 1000;
                                                const value = e.currentTarget.value;

                                                // Check if the input is effectively zero (empty, '0', '0.', '0.00', etc.)
                                                const is_effectively_zero =
                                                    value === '' || value === '0' || /^0\.0*$/.test(value);

                                                // For effectively zero values, show error message but don't reset
                                                if (is_effectively_zero) {
                                                    setErrorMessage(`Minimum stake allowed is ${min_stake}`);
                                                    return;
                                                }

                                                const numValue = Number(value);

                                                // // Prevent decimal values less than 1
                                                // if (numValue < 1 && !Number.isInteger(numValue)) {
                                                //     setFieldValue(name, 1);
                                                //     return;
                                                // }

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
                                                    console.log('test max_stake', max_stake);
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
                                    {/* Only render the Popover component when dropdown is not open */}
                                    {!is_dropdown_open && (
                                        <div ref={popoverRef}>
                                            <Popover
                                                alignment='bottom'
                                                message={error || error_message}
                                                is_open={
                                                    !!(error || error_message) &&
                                                    (name === 'stake' ||
                                                        name === 'max_stake' ||
                                                        name === 'loss' ||
                                                        name === 'profit' ||
                                                        name === 'take_profit' ||
                                                        name === 'tick_count' ||
                                                        name === 'size')
                                                }
                                                zIndex='9999'
                                                classNameBubble='qs__warning-bubble'
                                                has_error
                                                should_disable_pointer_events
                                                data-testid={`${name}-popover`}
                                            />
                                        </div>
                                    )}
                                </>
                            </div>
                        </div>
                    );
                }}
            </Field>
        );
    }
);

export default QSInput;
