import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.block_holder = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            args0: [
                {
                    type: 'field_label',
                    text: 'Ignore',
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_statement',
                    name: 'USELESS_STACK',
                    check: null,
                },
            ],
            colour: window.Blockly.Colours.RootBlock.colour,
            colourSecondary: window.Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: window.Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('Put your blocks in here to prevent them from being removed'),
            category: window.Blockly.Categories.Miscellaneous,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Ignore'),
            description: localize(
                'Use this block if you want some instructions to be ignored when your bot runs. Instructions within this block won’t be executed.'
            ),
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.block_holder = () => '';
