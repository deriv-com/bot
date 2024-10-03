import { localize } from '@deriv-com/translations';
import { emptyTextValidator, modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.notify_telegram = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Notify Telegram %1 Access Token: %2 Chat ID: %3 Message: %4'),
            args0: [
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_ACCESS_TOKEN',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_CHAT_ID',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_MESSAGE',
                },
            ],
            inputsInline: true,
            colour: window.Blockly.Colours.Special3.colour,
            colourSecondary: window.Blockly.Colours.Special3.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Sends a message to Telegram'),
            category: window.Blockly.Categories.Miscellaneous,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Notify Telegram'),
            description: localize('This block sends a message to a Telegram channel.'),
        };
    },
    getRequiredValueInputs() {
        return {
            TELEGRAM_ACCESS_TOKEN: emptyTextValidator,
            TELEGRAM_CHAT_ID: emptyTextValidator,
            TELEGRAM_MESSAGE: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.notify_telegram = block => {
    const access_token =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TELEGRAM_ACCESS_TOKEN',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '';
    const chat_id =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TELEGRAM_CHAT_ID',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '';
    const message =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TELEGRAM_MESSAGE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '';

    if (!access_token || !chat_id || !message) {
        return '';
    }

    const code = `Bot.notifyTelegram(${access_token}, ${chat_id}, ${message});\n`;
    return code;
};
