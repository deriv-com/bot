import { localize } from '@/utils/tmp/dummy';

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
};

window.Blockly.JavaScript.useless_block = () => {};
