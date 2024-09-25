import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.logic_ternary = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('test {{ condition }}', { condition: '%1' }),
            message1: localize('if true {{ return_value }}', { return_value: '%1' }),
            message2: localize('if false {{ return_value }}', { return_value: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'IF',
                    check: 'Boolean',
                },
            ],
            args1: [
                {
                    type: 'input_value',
                    name: 'THEN',
                },
            ],
            args2: [
                {
                    type: 'input_value',
                    name: 'ELSE',
                },
            ],
            inputsInline: true,
            output: null,
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize(
                'This block tests if a given value is true or false and returns “True” or “False” accordingly.'
            ),
            category: window.Blockly.Categories.Logic,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Test value'),
            description: localize(
                'This block tests if a given value is true or false and returns “True” or “False” accordingly.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            IF: null,
            THEN: null,
            ELSE: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.logic_ternary = block => {
    const valueIf =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'IF',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL
        ) || 'false';
    const valueThen =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'THEN',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL
        ) || 'null';
    const valueElse =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'ELSE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL
        ) || 'null';

    const code = `(${valueIf} ? ${valueThen} : ${valueElse})`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL];
};
