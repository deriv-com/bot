import { localize } from '@deriv-com/translations';
import { emptyTextValidator, modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.totimestamp = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('To timestamp {{ input_datetime }} {{ dummy }}', { input_datetime: '%1', dummy: '%2' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'DATETIME',
                },
                {
                    // Extra dummy for spacing.
                    type: 'input_dummy',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize(
                'Converts a string representing a date/time string into seconds since Epoch. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825. Time and time zone offset are optional.'
            ),
            category: window.Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Convert to timestamp'),
            description: localize(
                'This block converts a string of text that represents the date and time into seconds since the Unix Epoch (1 January 1970). The time and time zone offset are optional. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    getRequiredValueInputs() {
        return {
            DATETIME: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.totimestamp = block => {
    const datetime_string = window.Blockly.JavaScript.javascriptGenerator.valueToCode(
        block,
        'DATETIME',
        window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
    );
    const code = `Bot.dateTimeStringToTimestamp(${datetime_string})`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
