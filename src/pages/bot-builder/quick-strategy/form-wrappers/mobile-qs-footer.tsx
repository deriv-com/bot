import React from 'react';
import { useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import { rudderStackSendQsRunStrategyEvent } from '@/analytics/rudderstack-quick-strategy';
import Button from '@/components/shared_ui/button';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import useQsSubmitHandler from '../form-wrappers/useQsSubmitHandler';
import { TFormValues } from '../types';
import { QsSteps } from './trade-constants';

type TMobileQSFooter = {
    current_step: QsSteps;
    setCurrentStep: (current_step: QsSteps) => void;
};

export const MobileQSFooter = observer(({ current_step, setCurrentStep }: TMobileQSFooter) => {
    const { quick_strategy } = useStore();
    const { selected_strategy } = quick_strategy;
    const { isValid, values } = useFormikContext<TFormValues>();
    const { handleSubmit } = useQsSubmitHandler();
    const is_verified_or_completed_step =
        current_step === QsSteps.StrategyVerified || current_step === QsSteps.StrategyCompleted;
    const is_selected_strategy_step = current_step === QsSteps.StrategySelect;

    const onRun = () => {
        rudderStackSendQsRunStrategyEvent({
            form_values: values,
            selected_strategy,
        });
        handleSubmit();
    };

    const onBack = () => {
        setCurrentStep(QsSteps.StrategySelect);
    };

    return (
        <>
            {is_verified_or_completed_step && (
                <div className='qs__body__content__footer'>
                    <Button secondary disabled={is_selected_strategy_step} onClick={onBack}>
                        {localize('Back')}
                    </Button>
                    <Button
                        primary
                        data-testid='qs-run-button'
                        type='submit'
                        onClick={e => {
                            e.preventDefault();
                            onRun();
                        }}
                        disabled={!isValid}
                    >
                        {localize('Run')}
                    </Button>
                </div>
            )}
        </>
    );
});

export default MobileQSFooter;
