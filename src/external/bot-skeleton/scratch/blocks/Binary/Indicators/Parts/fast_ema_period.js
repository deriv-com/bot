import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.fast_ema_period = {
    init() {
        this.jsonInit({
            message0: localize('Fast EMA Period {{ input_number }}', { input_number: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'FAST_EMA_PERIOD',
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
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    onchange: window.Blockly.Blocks.input_list.onchange,
    allowed_parents: ['macda_statement'],
    getRequiredValueInputs() {
        return {
            FAST_EMA_PERIOD: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.fast_ema_period = () => {};
