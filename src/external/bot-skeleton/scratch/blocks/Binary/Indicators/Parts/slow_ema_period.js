import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.slow_ema_period = {
    init() {
        this.jsonInit({
            message0: localize('Slow EMA Period {{ input_number }}', { input_number: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'SLOW_EMA_PERIOD',
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
    allowed_parents: ['macda_statement'],
    getRequiredValueInputs() {
        return {
            SLOW_EMA_PERIOD: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.slow_ema_period = () => {};
