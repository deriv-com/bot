import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.math_random_int = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('random integer from {{ start_number }} to {{ end_number }}', {
                start_number: '%1',
                end_number: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'FROM',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'TO',
                    check: 'Number',
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you a random number from within a set range'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Random integer'),
            description: localize('This block gives you a random number from within a set range.'),
        };
    },
    getRequiredValueInputs() {
        return {
            FROM: null,
            TO: null,
        };
    },
};

window.Blockly.JavaScript.math_random_int = block => {
    const argument0 = window.Blockly.JavaScript.valueToCode(block, 'FROM', window.Blockly.JavaScript.ORDER_COMMA) || '0';
    const argument1 = window.Blockly.JavaScript.valueToCode(block, 'TO', window.Blockly.JavaScript.ORDER_COMMA) || '0';

    // eslint-disable-next-line no-underscore-dangle
    const functionName = window.Blockly.JavaScript.provideFunction_('mathRandomInt', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${window.Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(a, b) {
            if (a > b) {
                // Swap a and b to ensure a is smaller.
                var c = a;
                a = b;
                b = c;
            }
            return Math.floor(Math.random() * (b - a + 1) + a);
        }`,
    ]);

    const code = `${functionName}(${argument0}, ${argument1})`;
    return [code, window.Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
