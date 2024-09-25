import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

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
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.math_number_positive = block => {
    return window.Blockly.JavaScript.javascriptGenerator.forBlock.math_number(block);
};
