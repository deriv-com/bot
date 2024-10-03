import { localize } from '@deriv-com/translations';
import { config } from '../../../../../constants/config';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.read_ohlc_obj = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Read {{ candle_property }} value in candle {{ input_candle }}', {
                candle_property: '%1',
                input_candle: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OHLCFIELD_LIST',
                    options: config().ohlcFields,
                },
                {
                    type: 'input_value',
                    name: 'OHLCOBJ',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you the selected candle value.'),
            category: window.Blockly.Categories.Candle,
        };
    },
    meta() {
        return {
            display_name: localize('Read candle value (2)'),
            description: localize('This block gives you the selected candle value.'),
        };
    },
    getRequiredValueInputs() {
        return {
            OHLCOBJ: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.read_ohlc_obj = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    const ohlcObj =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'OHLCOBJ',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '{}';

    const code = `Bot.candleField(${ohlcObj}, '${ohlcField}')`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
