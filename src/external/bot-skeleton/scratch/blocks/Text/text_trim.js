import { localize } from '@/utils/tmp/dummy';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

window.Blockly.Blocks.text_trim = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('trim spaces from {{ side }} of {{ input_text }}', { side: '%1', input_text: '%2' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MODE',
                    options: [
                        [localize('both sides'), 'BOTH'],
                        [localize('left side'), 'LEFT'],
                        [localize('right side'), 'RIGHT'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            output: 'String',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Trims spaces'),
            category: window.Blockly.Categories.Text,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Trim spaces'),
            description: localize('Trims the spaces within a given string or text.'),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.text_trim = block => {
    const operators = {
        LEFT: ".replace(/^[\\s\\xa0]+/, '')",
        RIGHT: ".replace(/[\\s\\xa0]+$/, '')",
        BOTH: '.trim()',
    };

    const operator = operators[block.getFieldValue('MODE')];
    const text =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TEXT',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER
        ) || "''";

    const code = `${text}${operator}`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
