import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.useless_block = {
    init() {
        this.jsonInit({
            message0: '%1',
            args0: [
                {
                    type: 'field_label',
                    text: localize('Conversion Helper Block'),
                    class: 'blocklyTextRootBlockHeader',
                },
            ],
            colour: window.Blockly.Colours.RootBlock.colour,
            colourSecondary: window.Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: window.Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('This block was required to correctly convert your old strategy.'),
            category: window.Blockly.Categories.Miscellaneous,
            nextStatement: null,
            previousStatement: null,
        });
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.useless_block = () => {};
