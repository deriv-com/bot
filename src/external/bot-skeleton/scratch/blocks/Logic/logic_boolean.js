import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.logic_boolean = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BOOL',
                    options: [
                        [localize('true'), 'TRUE'],
                        [localize('false'), 'FALSE'],
                    ],
                },
            ],
            inputsInline: true,
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns either True or False'),
            category: window.Blockly.Categories.Logic,
        };
    },
    meta() {
        return {
            display_name: localize('True-False'),
            description: localize('This is a single block that returns a boolean value, either true or false.'),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.logic_boolean = block => {
    const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
