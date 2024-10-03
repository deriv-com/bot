import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.check_sell = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Sell is available'),
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('True if active contract can be sold before expiration at current market price'),
            category: window.Blockly.Categories.During_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Can contract be sold?'),
            description: localize(
                'This block helps you check if your contract can be sold. If your contract can be sold, it returns “True”. Otherwise, it returns an empty string.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    restricted_parents: ['during_purchase'],
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.check_sell = () => {
    const code = 'Bot.isSellAvailable()';
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
