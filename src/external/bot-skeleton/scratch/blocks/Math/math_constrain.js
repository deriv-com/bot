import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.math_constrain = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('constrain {{ number }} low {{ low_number }} high {{ high_number }}', {
                number: '%1',
                low_number: '%2',
                high_number: '%3',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'LOW',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'HIGH',
                    check: 'Number',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block constrains a given number so that it is within a set range.'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Constrain within a range'),
            description: localize('This block constrains a given number so that it is within a set range.'),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: null,
            LOW: null,
            HIGH: null,
        };
    },
};

window.Blockly.JavaScript.math_constrain = block => {
    const argument0 = window.Blockly.JavaScript.valueToCode(block, 'VALUE', window.Blockly.JavaScript.ORDER_COMMA) || '0';
    const argument1 = window.Blockly.JavaScript.valueToCode(block, 'LOW', window.Blockly.JavaScript.ORDER_COMMA) || '0';
    const argument2 = window.Blockly.JavaScript.valueToCode(block, 'HIGH', window.Blockly.JavaScript.ORDER_COMMA) || '0';

    const code = `Math.min(Math.max(${argument0}, ${argument1}), ${argument2})`;
    return [code, window.Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
