import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.variables_set = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            type: 'field_variable',
            message0: localize('set {{ variable }} to {{ value }}', {
                variable: '%1',
                value: '%2',
            }),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('item'),
                },
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            colour: window.Blockly.Colours.Special2.colour,
            colourSecondary: window.Blockly.Colours.Special2.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special2.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Sets variable value'),
            category: window.Blockly.Categories.Variables,
        };
    },
    meta() {
        return {
            display_name: localize('Set variable'),
            description: localize('Assigns a given value to a variable'),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.variables_set = block => {
    const argument0 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'VALUE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '0';
    // eslint-disable-next-line no-underscore-dangle
    const varName = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'),
        window.Blockly.Variables.CATEGORY_NAME
    );

    const code = `${varName} = ${argument0};\n`;
    return code;
};
