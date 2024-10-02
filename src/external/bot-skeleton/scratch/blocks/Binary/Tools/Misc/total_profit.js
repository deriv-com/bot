import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.total_profit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Total profit/loss'),
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the total profit/loss'),
            category: window.Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Total profit/loss'),
            description: localize(
                'This block gives you the total profit/loss of your trading strategy since your bot started running. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.'
            ),
        };
    },
    onchange(event) {
        if (!this.workspace || window.Blockly.derivWorkspace.isFlyoutVisible || this.workspace.isDragging()) {
            return;
        }

        if (
            (event.type === window.Blockly.Events.BLOCK_DRAG && !event.isStart) ||
            (event.type === window.Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id))
        ) {
            const input_statement = this.getRootInputTargetBlock();

            if (input_statement === 'INITIALIZATION') {
                this.unplug(true);
            }
        }
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.Blocks.total_profit_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Total Profit String'),
            output: 'String',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the total profit in string format'),
            category: window.Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Total Profit String'),
            description: localize('Total Profit String Description'),
        };
    },
    onchange: window.Blockly.Blocks.total_profit.onchange,
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.total_profit = () => [
    'Bot.getTotalProfit(false)',
    window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
window.Blockly.JavaScript.javascriptGenerator.forBlock.total_profit_string = () => [
    'Bot.getTotalProfit(true)',
    window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
