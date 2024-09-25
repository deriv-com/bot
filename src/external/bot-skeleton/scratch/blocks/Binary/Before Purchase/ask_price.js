import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.ask_price = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Ask Price {{ contract_type }}', { contract_type: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PURCHASE_LIST',
                    options: [['', '']],
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block returns the purchase price for the selected trade type.'),
            category: window.Blockly.Categories.Before_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Purchase price'),
            description: localize(
                'This block returns the purchase price for the selected trade type. This block can be used only in the "Purchase conditions" root block.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    onchange: window.Blockly.Blocks.purchase.onchange,
    populatePurchaseList: window.Blockly.Blocks.purchase.populatePurchaseList,
    enforceLimitations: window.Blockly.Blocks.purchase.enforceLimitations,
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.ask_price = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');

    const code = `Bot.getAskPrice('${purchaseList}')`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
