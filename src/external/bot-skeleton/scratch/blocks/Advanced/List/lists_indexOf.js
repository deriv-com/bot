import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.lists_indexOf = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'in list {{ input_list }} find {{ first_or_last }} occurence of item {{ input_value }}',
                {
                    input_list: '%1',
                    first_or_last: '%2',
                    input_value: '%3',
                }
            ),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
                {
                    type: 'field_dropdown',
                    name: 'END',
                    options: [
                        [localize('first'), 'FIRST'],
                        [localize('last'), 'LAST'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'FIND',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you the position of an item in a given list.'),
            category: window.Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('List item position'),
            description: localize('This block gives you the position of an item in a given list.'),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: null,
            FIND: null,
        };
    },
};

window.Blockly.JavaScript.lists_indexOf = block => {
    const operator = block.getFieldValue('END') === 'FIRST' ? 'indexOf' : 'lastIndexOf';
    const item = window.Blockly.JavaScript.valueToCode(block, 'FIND', window.Blockly.JavaScript.ORDER_NONE) || "''";
    const list = window.Blockly.JavaScript.valueToCode(block, 'VALUE', window.Blockly.JavaScript.ORDER_MEMBER) || "''";

    const code = `${list}.${operator}(${item})`;

    if (block.workspace.options.oneBasedIndex) {
        return [`${code} + 1`, window.Blockly.JavaScript.ORDER_ADDITION];
    }

    return [code, window.Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
