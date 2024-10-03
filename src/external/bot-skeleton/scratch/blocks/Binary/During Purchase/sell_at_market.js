import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.sell_at_market = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Sell at market price'),
            colour: window.Blockly.Colours.Special1.colour,
            colourSecondary: window.Blockly.Colours.Special1.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Use this block to sell your contract at the market price.'),
            category: window.Blockly.Categories.During_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Sell at market price'),
            description: localize('Use this block to sell your contract at the market price.'),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    restricted_parents: ['during_purchase'],
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.sell_at_market = () => 'Bot.sellAtMarket();\n';
