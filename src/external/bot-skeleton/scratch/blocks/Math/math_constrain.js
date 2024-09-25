import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

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
            inputsInline: true,
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
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.math_constrain = block => {
    const argument0 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'VALUE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';
    const argument1 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'LOW',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';
    const argument2 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'HIGH',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';

    const code = `Math.min(Math.max(${argument0}, ${argument1}), ${argument2})`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
