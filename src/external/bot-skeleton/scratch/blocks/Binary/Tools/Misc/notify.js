import { localize } from '@deriv-com/translations';
import { config } from '../../../../../constants/config';
import { emptyTextValidator, modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.notify = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'Notify {{ notification_type }} with sound: {{ notification_sound }} {{ input_message }}',
                {
                    notification_type: '%1',
                    notification_sound: '%2',
                    input_message: '%3',
                }
            ),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'NOTIFICATION_TYPE',
                    options: config().lists.NOTIFICATION_TYPE,
                },
                {
                    type: 'field_dropdown',
                    name: 'NOTIFICATION_SOUND',
                    options: config().lists.NOTIFICATION_SOUND,
                },
                {
                    type: 'input_value',
                    name: 'MESSAGE',
                    check: null,
                },
            ],
            colour: window.Blockly.Colours.Special3.colour,
            colourSecondary: window.Blockly.Colours.Special3.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Displays a notification and optionally play selected sound'),
            category: window.Blockly.Categories.Miscellaneous,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Notify'),
            description: localize(
                'This block displays a message. You can specify the color of the message and choose from 6 different sound options.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            MESSAGE: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.notify = block => {
    const notificationType = block.getFieldValue('NOTIFICATION_TYPE');
    const sound = block.getFieldValue('NOTIFICATION_SOUND');
    const message_block = block.getInputTargetBlock('MESSAGE');
    let variable_name = null;

    if (message_block.type === 'variables_get') {
        const variable_id = message_block.getFieldValue('VAR');
        variable_name = window.Blockly.derivWorkspace.getVariableById(variable_id).name;
    }

    const message =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'MESSAGE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || `"${localize('<empty message>')}"`;

    const code = `Bot.notify({ className: 'journal__text--${notificationType}', message: ${message}, sound: '${sound}', block_id: '${block.id}', variable_name: '${variable_name}' });\n`;
    return code;
};
