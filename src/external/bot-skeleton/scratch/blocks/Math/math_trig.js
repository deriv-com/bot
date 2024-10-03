import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.math_trig = {
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
                        ['sin', 'SIN'],
                        ['cos', 'COS'],
                        ['tan', 'TAN'],
                        ['asin', 'ASIN'],
                        ['acos', 'ACOS'],
                        ['atan', 'ATAN'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'NUM',
                    check: 'Number',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Trigonometric functions'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Trigonometric functions'),
            description: localize('This block performs trigonometric functions.'),
        };
    },
    getRequiredValueInputs() {
        return {
            NUM: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.math_trig =
    window.Blockly.JavaScript.javascriptGenerator.forBlock.math_single;
