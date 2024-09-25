import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.logic_operation = {
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
                        [localize('and'), 'AND'],
                        [localize('or'), 'OR'],
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
            tooltip: localize('Performs selected logic operation'),
            category: window.Blockly.Categories.Logic,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Logic operation'),
            description: localize('This block performs the "AND" or the "OR" logic operation.'),
        };
    },
    getRequiredValueInputs() {
        return {
            A: null,
            B: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.logic_operation = block => {
    const selectedOperator = block.getFieldValue('OP');

    let operator, order;

    if (selectedOperator === 'AND') {
        operator = '&&';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_LOGICAL_AND;
    } else if (selectedOperator === 'OR') {
        operator = '||';
        order = window.Blockly.JavaScript.javascriptGenerator.ORDER_LOGICAL_OR;
    }

    const argument0 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'A',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || 'false';
    const argument1 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'B',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || 'false';

    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
};
