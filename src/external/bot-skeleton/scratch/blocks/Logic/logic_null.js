import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.logic_null = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            inputsInline: true,
            message0: 'null',
            output: null,
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block assigns a null value to an item or statement.'),
            category: window.Blockly.Categories.Logic,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Null'),
            description: localize('This block assigns a null value to an item or statement.'),
        };
    },
};
window.Blockly.JavaScript.javascriptGenerator.forBlock.logic_null = () => [
    'null',
    window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
