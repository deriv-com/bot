import { localize } from '@/utils/tmp/dummy';
import { emptyTextValidator } from '../../../../utils';

window.Blockly.Blocks.notify_telegram = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'Notify Telegram {{ dummy }} Access Token: {{ input_access_token }} Chat ID: {{ input_chat_id }} Message: {{ input_message }}',
                {
                    dummy: '%1',
                    input_access_token: '%2',
                    input_chat_id: '%3',
                    input_message: '%4',
                }
            ),
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
            colour: window.Blockly.Colours.Special3.colour,
            colourSecondary: window.Blockly.Colours.Special3.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Sends a message to Telegram'),
            category: window.Blockly.Categories.Miscellaneous,
        };
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

window.Blockly.JavaScript.notify_telegram = block => {
    const access_token =
        window.Blockly.JavaScript.valueToCode(block, 'TELEGRAM_ACCESS_TOKEN', window.Blockly.JavaScript.ORDER_ATOMIC) || '';
    const chat_id = window.Blockly.JavaScript.valueToCode(block, 'TELEGRAM_CHAT_ID', window.Blockly.JavaScript.ORDER_ATOMIC) || '';
    const message = window.Blockly.JavaScript.valueToCode(block, 'TELEGRAM_MESSAGE', window.Blockly.JavaScript.ORDER_ATOMIC) || '';

    if (!access_token || !chat_id || !message) {
        return '';
    }

    const code = `Bot.notifyTelegram(${access_token}, ${chat_id}, ${message});\n`;
    return code;
};
