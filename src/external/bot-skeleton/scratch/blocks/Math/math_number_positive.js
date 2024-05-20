import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.math_number_positive = {
    init: window.Blockly.Blocks.math_number.init,
    definition: window.Blockly.Blocks.math_number.definition,
    meta() {
        return {
            display_name: localize('Math Number Positive'),
            description: localize('Math Number Description'),
        };
    },
    numberValidator(input) {
        if (/^([0][.]|[0-9]+[.])?([0]|[1-9]){1,}$/.test(input) && input < Number.MAX_SAFE_INTEGER) {
            return undefined;
        }
        return null;
    },
};

window.Blockly.JavaScript.math_number_positive = window.Blockly.JavaScript.math_number;
