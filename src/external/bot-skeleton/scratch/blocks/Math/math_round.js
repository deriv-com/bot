import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

// https://github.com/google/blockly/blob/master/generators/javascript/math.js
window.Blockly.Blocks.math_round = {
    /**
     * Check if a number is even, odd, prime, whole, positive, or negative
     * or if it is divisible by certain number. Returns true or false.
     * @this window.Blockly.Block
     */
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OP',
                    options: [
                        ['round', 'ROUND'],
                        ['round up', 'ROUNDUP'],
                        ['round down', 'ROUNDDOWN'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'NUM',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Rounds a given number to an integer'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Rounding operation'),
            description: localize(
                'This block rounds a given number according to the selection: round, round up, round down.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            NUM: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.math_round = block => {
    const operation = block.getFieldValue('OP');
    const argument0 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'NUM',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '0';

    let code;

    if (operation === 'ROUND') {
        code = `Math.round(${argument0})`;
    } else if (operation === 'ROUNDUP') {
        code = `Math.ceil(${argument0})`;
    } else if (operation === 'ROUNDDOWN') {
        code = `Math.floor(${argument0})`;
    }

    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
