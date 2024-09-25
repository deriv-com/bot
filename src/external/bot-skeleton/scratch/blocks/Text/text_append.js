import { localize } from '@deriv-com/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

window.Blockly.Blocks.text_append = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('to {{ variable }} append text {{ input_text }}', {
                variable: '%1',
                input_text: '%2',
            }),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('text'),
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Appends a given text to a variable'),
            category: window.Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Text Append'),
            description: localize('Appends a given text to a variable.'),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.text_append = block => {
    const forceString = value => {
        const strRegExp = /^\s*'([^']|\\')*'\s*$/;
        if (strRegExp.test(value)) {
            return value;
        }
        return `String(${value})`;
    };

    // eslint-disable-next-line no-underscore-dangle
    const varName = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    const value =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TEXT',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_NONE
        ) || "''";

    const code = `${varName} += ${forceString(value)};\n`;
    return code;
};
