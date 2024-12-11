const generateErrorMessage = async (block_type, missing_space) => {
    const { localize } = await import('@deriv-com/translations');
    if (!missing_space) missing_space = localize('workspace');

    return {
        missing: localize('The {{block_type}} block is mandatory and cannot be deleted/disabled.', {
            block_type,
        }),
        misplaced: localize('The {{block_type}} block is misplaced from {{missing_space}}.', {
            block_type,
            missing_space,
        }),
        disabled: localize('The {{block_type}} block is mandatory and cannot be deleted/disabled.', {
            block_type,
        }),
        default: localize('The {{block_type}} block is mandatory and cannot be deleted/disabled.', {
            block_type,
        }),
    };
};

export const error_message_map = () => ({
    trade_definition: generateErrorMessage('Trade parameters'),
    trade_parameters: generateErrorMessage('Trade parameters'),
    before_purchase: generateErrorMessage('Purchase conditions'),
    purchase_conditions: generateErrorMessage('Purchase conditions'),
    purchase: generateErrorMessage('Purchase', 'purchase conditions'),
    trade_definition_tradeoptions: generateErrorMessage('Trade options', 'trade parameters'),
    trade_definition_multiplier: generateErrorMessage('Trade options multipliers', 'trade parameters'),
    trade_definition_accumulator: generateErrorMessage('Trade options accumulators', 'trade parameters'),
});
