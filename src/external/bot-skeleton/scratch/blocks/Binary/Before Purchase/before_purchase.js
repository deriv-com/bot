import { localize } from '@deriv-com/translations';
import { appendCollapsedMainBlocksFields, excludeOptionFromContextMenu, modifyContextMenu } from '../../../utils';
import { purchase } from '../../images';

window.Blockly.Blocks.before_purchase = {
    init() {
        this.jsonInit(this.definition());
        this.setDeletable(false);
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            message1: '%1',
            message2: '%1',
            args0: [
                {
                    type: 'field_image',
                    src: purchase,
                    width: 25,
                    height: 25,
                    alt: 'P',
                },
                {
                    type: 'field_label',
                    text: localize('2. Purchase conditions'),
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'BEFOREPURCHASE_STACK',
                    check: 'Purchase',
                },
            ],
            args2: [
                {
                    type: 'field_image',
                    src: ' ', // this is here to add extra padding
                    width: 380,
                    height: 10,
                },
            ],
            colour: window.Blockly.Colours.RootBlock.colour,
            colourSecondary: window.Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: window.Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('Specify contract type and purchase conditions.'),
            category: window.Blockly.Categories.Before_Purchase,
        };
    },
    onchange(event) {
        if (
            event.type === window.Blockly.Events.BLOCK_CHANGE ||
            (event.type === window.Blockly.Events.BLOCK_DRAG && !event.isStart)
        ) {
            if (this.isCollapsed()) {
                appendCollapsedMainBlocksFields(this);
            }
        }
    },
    customContextMenu(menu) {
        const menu_items = [localize('Enable Block'), localize('Disable Block')];
        excludeOptionFromContextMenu(menu, menu_items);
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Purchase conditions'),
            description: localize(
                'This block is mandatory. Only one copy of this block is allowed. You can place the Purchase block (see below) here as well as conditional blocks to define your purchase conditions.'
            ),
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.before_purchase = block => {
    const stack = window.Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'BEFOREPURCHASE_STACK');

    const code = `BinaryBotPrivateBeforePurchase = function BinaryBotPrivateBeforePurchase() {
        Bot.highlightBlock('${block.id}');
        ${stack}
    };\n`;
    return code;
};
