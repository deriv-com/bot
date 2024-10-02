import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.math_constant = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CONSTANT',
                    options: [
                        ['\u03C0', 'PI'],
                        ['\u2107', 'E'],
                        ['\u03d5', 'GOLDEN_RATIO'],
                        ['sqrt(2)', 'SQRT2'],
                        ['sqrt(\u00bd)', 'SQRT1_2'],
                        ['\u221e', 'INFINITY'],
                    ],
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you the selected constant values.'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Mathematical constants'),
            description: localize('This block gives you the selected constant values.'),
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.math_constant = block => {
    const constant = block.getFieldValue('CONSTANT');

    let code, order;

    if (constant === 'PI') {
        code = 'Math.PI';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
    } else if (constant === 'E') {
        code = 'Math.E';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
    } else if (constant === 'GOLDEN_RATIO') {
        code = '(1 + Math.sqrt(5)) / 2';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_DIVISION;
    } else if (constant === 'SQRT2') {
        code = 'Math.SQRT2';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
    } else if (constant === 'SQRT1_2') {
        code = 'Math.SQRT1_2';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
    } else if (constant === 'INFINITY') {
        code = 'Infinity';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC;
    }

    return [code, order];
};
