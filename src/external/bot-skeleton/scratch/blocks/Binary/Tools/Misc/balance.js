import { localize } from '@deriv-com/translations';
import { config } from '../../../../../constants/config';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.balance = {
    init() {
        this.jsonInit(this.definition());
        const balanceTypeField = this.getField('BALANCE_TYPE');
        balanceTypeField.setValidator(value => {
            if (value === 'STR') {
                this.setOutput(true, 'String');
            } else if (value === 'NUM') {
                this.setOutput(true, 'Number');
            }
            this.initSvg();
            return undefined;
        });
    },
    definition() {
        return {
            message0: localize('Balance: %1'),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BALANCE_TYPE',
                    options: config().lists.BALANCE_TYPE,
                },
            ],
            output: null,
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block returns account balance'),
            category: window.Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Account balance'),
            description: localize(
                'This block gives you the balance of your account either as a number or a string of text.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.balance = block => {
    const balanceType = block.getFieldValue('BALANCE_TYPE');

    const code = `Bot.getBalance('${balanceType}')`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
