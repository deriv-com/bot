import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.logic_negate = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('not {{ boolean }}', { boolean: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'BOOL',
                },
            ],
            inputsInline: true,
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Converts a given True or False to the opposite value'),
            category: window.Blockly.Categories.Logic,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Logic negation'),
            description: localize('This block converts the boolean value (true or false) to its opposite.'),
        };
    },
    getRequiredValueInputs() {
        return {
            BOOL: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.logic_negate = block => {
    const order = window.Blockly.JavaScript.javascriptGenerator.ORDER_LOGICAL_NOT;
    const argument0 = window.Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'BOOL', order) || 'true';

    const code = `!${argument0}`;
    return [code, order];
};
