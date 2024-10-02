import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../utils';

window.Blockly.Blocks.math_number = {
    init() {
        this.jsonInit(this.definition());

        const fieldInput = this.getField('NUM');
        fieldInput.setValidator(input => this.numberValidator(input));
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_number',
                    name: 'NUM',
                    value: 0,
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Please use `.` as a decimal separator for fractional numbers.'),
            category: window.Blockly.Categories.Mathematical,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Number'),
            description: localize(
                'Enter an integer or fractional number into this block. Please use `.` as a decimal separator for fractional numbers.'
            ),
        };
    },
    numberValidator(input) {
        if (/^-?([0][.]|[0-9]+[.])?([0]|[1-9]){1,}$/.test(input) && input < Number.MAX_SAFE_INTEGER) {
            return undefined;
        }
        return null;
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.math_number = block => {
    const code = block.getFieldValue('NUM');
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
