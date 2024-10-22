import { Localize, localize } from '@deriv-com/translations';

const generateErrorMessage = (block_type, missing_space = 'workspace') => {
    return {
        missing: (
            <Localize
                i18n_default_text={`The {{block_type}} block is mandatory and cannot be deleted /disabled.`}
                values={{
                    block_type,
                }}
            />
        ),
        misplaced: (
            <Localize
                i18n_default_text={`The {{block_type}} block is misplaced from {{missing_space}}.`}
                values={{
                    block_type,
                    missing_space,
                }}
            />
        ),

        disabled: (
            <Localize
                i18n_default_text={`The {{block_type}} block is mandatory and cannot be deleted/disabled.`}
                values={{
                    block_type,
                }}
            />
        ),
        default: (
            <Localize
                i18n_default_text={`The {{block_type}} block is mandatory and cannot be deleted/disabled.`}
                values={{
                    block_type,
                }}
            />
        ),
    };
};

export const error_message_map = {
    trade_definition: generateErrorMessage(localize('Trade parameters')),
    trade_parameters: generateErrorMessage(localize('Trade parameters')),
    before_purchase: generateErrorMessage(localize('Purchase conditions')),
    purchase_conditions: generateErrorMessage(localize('Purchase conditions')),
    purchase: generateErrorMessage(localize('Purchase'), localize('purchase conditions')),
    trade_definition_tradeoptions: generateErrorMessage(localize('Trade options'), localize('trade parameters')),
    trade_definition_multiplier: generateErrorMessage(
        localize('Trade options multipliers'),
        localize('trade parameters')
    ),
};
