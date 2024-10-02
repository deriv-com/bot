import { localize } from '@deriv-com/translations';
import { config } from '../../../../../constants/config';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.ohlc_values_in_list = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Make a list of {{ candle_property }} values from candles list {{ candle_list }}', {
                candle_property: '%1',
                candle_list: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OHLCFIELD_LIST',
                    options: config().ohlcFields,
                },
                {
                    type: 'input_value',
                    name: 'OHLCLIST',
                },
            ],
            output: 'Array',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns a list of specific values from a given candle list'),
            category: window.Blockly.Categories.Candle,
        };
    },
    meta() {
        return {
            display_name: localize('Create a list of candle values (2)'),
            description: localize('This block gives you the selected candle value from a list of candles.'),
        };
    },
    getRequiredValueInputs() {
        return {
            OHLCLIST: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.ohlc_values_in_list = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST') || 'open';
    const ohlcList =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'OHLCLIST',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '[]';

    const code = `Bot.candleValues(${ohlcList}, '${ohlcField}')`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
