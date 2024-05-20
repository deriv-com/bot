import { localize } from '@/utils/tmp/dummy';

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

window.Blockly.JavaScript.logic_ternary = block => {
    const valueIf = window.Blockly.JavaScript.valueToCode(block, 'IF', window.Blockly.JavaScript.ORDER_CONDITIONAL) || 'false';
    const valueThen = window.Blockly.JavaScript.valueToCode(block, 'THEN', window.Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';
    const valueElse = window.Blockly.JavaScript.valueToCode(block, 'ELSE', window.Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';

    const code = `(${valueIf} ? ${valueThen} : ${valueElse})`;
    return [code, window.Blockly.JavaScript.ORDER_CONDITIONAL];
};
