import { localize } from '@deriv-com/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

window.Blockly.Blocks.text_isEmpty = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('text {{ input_text }} is empty', { input_text: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                    check: ['String'],
                },
            ],
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Tests if a given text string is empty'),
            category: window.Blockly.Categories.Text,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Text Is empty'),
            description: localize('Tests whether a string of text is empty. Returns a boolean value (true or false).'),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.text_isEmpty = block => {
    const text =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'VALUE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER
        ) || "''";
    const isVariable = block.workspace.getAllVariables().findIndex(variable => variable.name === text) !== -1;

    const code = isVariable ? `!${text} || !${text}.length` : `!${text}.length`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_LOGICAL_NOT];
};
