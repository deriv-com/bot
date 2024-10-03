import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.is_candle_black = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Is candle {{ input_candle }} black?', { input_candle: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'OHLCOBJ',
                    check: 'Candle',
                },
            ],
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns "True" if the given candle is black'),
            category: window.Blockly.Categories.Candle,
        };
    },
    meta() {
        return {
            display_name: localize('Is candle black?'),
            description: localize(
                'This block returns “True” if the last candle is black. It can be placed anywhere on the canvas except within the Trade parameters root block.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    getRequiredValueInputs() {
        return {
            OHLCOBJ: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.is_candle_black = block => {
    const ohlcObj =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'OHLCOBJ',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '{}';

    const code = `Bot.isCandleBlack(${ohlcObj})`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
