import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.period = {
    init() {
        this.jsonInit({
            message0: localize('Period {{ input_period }}', { input_period: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'PERIOD',
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
    allowed_parents: [
        'bb_statement',
        'bba_statement',
        'ema_statement',
        'emaa_statement',
        'macda_statement',
        'rsi_statement',
        'rsia_statement',
        'sma_statement',
        'smaa_statement',
    ],
    getRequiredValueInputs() {
        return {
            PERIOD: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.period = () => {};
