import { localize } from '@deriv-com/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

window.Blockly.Blocks.text_print = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('print {{ input_text }}', { input_text: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: window.Blockly.Colours.Special3.colour,
            colourSecondary: window.Blockly.Colours.Special3.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Displays a dialog window with a message'),
            category: window.Blockly.Categories.Text,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Print'),
            description: localize(
                'This block displays a dialog box with a customised message. When the dialog box is displayed, your strategy is paused and will only resume after you click "OK".'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.text_print = block => {
    const msg =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TEXT',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_NONE
        ) || "''";
    const code = `window.alert(${msg});\n`;
    return code;
};
