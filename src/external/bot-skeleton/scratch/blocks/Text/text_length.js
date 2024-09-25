import { localize } from '@deriv-com/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

window.Blockly.Blocks.text_length = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('length of {{ input_text }}', { input_text: '%1' }),
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
            tooltip: localize('Text String Length'),
            category: window.Blockly.Categories.Text,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Text String Length'),
            description: localize(
                'Returns the number of characters of a given string of text, including numbers, spaces, punctuation marks, and symbols.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.text_length = block => {
    const text =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'VALUE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL
        ) || "''";

    const code = `${text}.length`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER];
};
