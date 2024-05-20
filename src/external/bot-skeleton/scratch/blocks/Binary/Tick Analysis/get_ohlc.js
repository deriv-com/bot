import { localize } from '@/utils/tmp/dummy';
import { config } from '../../../../constants/config';

window.Blockly.Blocks.get_ohlc = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('in candle list get # from end {{ input_number }}', { input_number: '%1' }),
            message1: localize('with interval: {{ candle_interval_type }}', { candle_interval_type: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'CANDLEINDEX',
                    check: 'Number',
                },
            ],
            args1: [
                {
                    type: 'field_dropdown',
                    name: 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals,
                },
            ],
            output: 'Candle',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you a specific candle from within the selected time interval.'),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Get candle'),
            description: localize('This block gives you a specific candle from within the selected time interval.'),
        };
    },
    getRequiredValueInputs() {
        return {
            CANDLEINDEX: null,
        };
    },
};

window.Blockly.JavaScript.get_ohlc = block => {
    const selectedGranularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    const granularity = selectedGranularity === 'default' ? 'undefined' : selectedGranularity;
    const index = window.Blockly.JavaScript.valueToCode(block, 'CANDLEINDEX', window.Blockly.JavaScript.ORDER_ATOMIC) || '1';

    const code = `Bot.getOhlcFromEnd({ index: ${index}, granularity: ${granularity} })`;
    return [code, window.Blockly.JavaScript.ORDER_ATOMIC];
};
