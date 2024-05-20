import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.math_random_float = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('random fraction'),
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you a random fraction between 0.0 to 1.0'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Random fraction number'),
            description: localize('This block gives you a random fraction between 0.0 to 1.0.'),
        };
    },
};

window.Blockly.JavaScript.math_random_float = () => ['Math.random()', window.Blockly.JavaScript.ORDER_FUNCTION_CALL];
