import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.lists_isEmpty = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('list {{ input_list }} is empty', { input_list: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                    check: ['Array'],
                },
            ],
            inputsInline: true,
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Checks if a given list is empty'),
            category: window.Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('Is list empty?'),
            description: localize(
                'This block checks if a given list is empty. It returns “True” if the list is empty, “False” if otherwise.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.lists_isEmpty = block => {
    const list =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'VALUE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER
        ) || '[]';
    const isVariable = block.workspace.getAllVariables().findIndex(variable => variable.name === list) !== -1;

    const code = isVariable ? `!${list} || !${list}.length` : `!${list}.length`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_LOGICAL_NOT];
};
