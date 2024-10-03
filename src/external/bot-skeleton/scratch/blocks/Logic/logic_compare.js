import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.logic_compare = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            args0: [
                {
                    type: 'input_value',
                    name: 'A',
                },
                {
                    type: 'field_dropdown',
                    name: 'OP',
                    options: [
                        ['=', 'EQ'],
                        ['\u2260', 'NEQ'],
                        ['\u200F<', 'LT'],
                        ['\u200F\u2264', 'LTE'],
                        ['\u200F>', 'GT'],
                        ['\u200F\u2265', 'GTE'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'B',
                },
            ],
            inputsInline: true,
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Compares two values'),
            category: window.Blockly.Categories.Logic,
        };
    },
    meta() {
        return {
            display_name: localize('Compare'),
            description: localize('This block compares two values and is used to build a conditional structure.'),
        };
    },
    getRequiredValueInputs() {
        return {
            A: null,
            B: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.logic_compare = block => {
    const operatorMapping = {
        EQ: '==',
        NEQ: '!=',
        LT: '<',
        LTE: '<=',
        GT: '>',
        GTE: '>=',
    };

    const operator = operatorMapping[block.getFieldValue('OP') || 'EQ'];
    const order = ['==', '!='].includes(operator)
        ? window.Blockly.JavaScript.javascriptGenerator.ORDER_EQUALITY
        : window.Blockly.JavaScript.javascriptGenerator.ORDER_RELATIONAL;

    const argument0 = window.Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'A', order) || 'false';
    const argument1 = window.Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'B', order) || 'false';

    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
};
