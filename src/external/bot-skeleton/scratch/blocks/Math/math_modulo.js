import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.math_modulo = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('remainder of {{ number1 }} ÷ {{ number2 }}', {
                number1: '%1',
                number2: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'DIVIDEND',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'DIVISOR',
                    check: 'Number',
                },
            ],
            inputsInline: true,
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the remainder after a division'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Remainder after division'),
            description: localize('Returns the remainder after the division of the given numbers.'),
        };
    },
    getRequiredValueInputs() {
        return {
            DIVIDEND: null,
            DIVISOR: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.math_modulo = block => {
    const argument0 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'DIVIDEND',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS
        ) || '0';
    const argument1 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'DIVISOR',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS
        ) || '0';

    const code = `${argument0} % ${argument1}`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS];
};
