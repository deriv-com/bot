import { localize } from '@deriv-com/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.ohlc_values = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'Make a List of {{ candle_property }} values in candles list with interval: {{ candle_interval_type }}',
                {
                    candle_property: '%1',
                    candle_interval_type: '%2',
                }
            ),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OHLCFIELD_LIST',
                    options: config().ohlcFields,
                },
                {
                    type: 'field_dropdown',
                    name: 'CANDLEINTERVAL_LIST',
                    options: config().candleIntervals,
                },
            ],
            output: 'Array',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize(
                'Returns a list of specific values from a candle list according to selected time interval'
            ),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Create a list of candle values (1)'),
            description: localize(
                'This block gives you the selected candle value from a list of candles within the selected time interval.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.ohlc_values = block => {
    const selectedGranularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    const granularity = selectedGranularity === 'default' ? 'undefined' : selectedGranularity;
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');

    const code = `Bot.getOhlc({ field: '${ohlcField}', granularity: ${granularity} })`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
