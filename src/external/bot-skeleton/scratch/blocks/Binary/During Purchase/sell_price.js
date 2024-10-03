import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.sell_price = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Sell profit/loss'),
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the profit/loss from selling at market price'),
            category: window.Blockly.Categories.During_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Profit/loss from selling'),
            description: localize(
                'This block gives you the potential profit or loss if you decide to sell your contract.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    restricted_parents: ['during_purchase'],
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.sell_price = () => {
    const code = 'Bot.getSellPrice()';
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
