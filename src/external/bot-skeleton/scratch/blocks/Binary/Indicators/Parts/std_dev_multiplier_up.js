import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.std_dev_multiplier_up = {
    init() {
        this.jsonInit({
            message0: localize('Standard Deviation Up Multiplier {{ input_number }}', { input_number: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'UPMULTIPLIER',
                    check: null,
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange: window.Blockly.Blocks.input_list.onchange,
    allowed_parents: ['bb_statement', 'bba_statement'],
    getRequiredValueInputs() {
        return {
            UPMULTIPLIER: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.std_dev_multiplier_up = () => {};
