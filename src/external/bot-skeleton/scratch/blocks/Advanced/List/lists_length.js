import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.lists_length = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('length of {{ input_list }}', { input_list: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you the total number of items in a given list.'),
            category: window.Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('List Length'),
            description: localize('This block gives you the total number of items in a given list.'),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: null,
        };
    },
};

window.Blockly.JavaScript.lists_length = block => {
    const list = window.Blockly.JavaScript.valueToCode(block, 'VALUE', window.Blockly.JavaScript.ORDER_MEMBER) || '[]';

    const code = `${list}.length`;
    return [code, window.Blockly.JavaScript.ORDER_MEMBER];
};
