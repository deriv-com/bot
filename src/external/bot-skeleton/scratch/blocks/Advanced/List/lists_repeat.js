import { localize } from '@deriv-com/translations';
import { emptyTextValidator, modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.lists_repeat = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('create list with item {{ input_item }} repeated {{ number }} times', {
                input_item: '%1',
                number: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'ITEM',
                },
                {
                    type: 'input_value',
                    name: 'NUM',
                },
            ],
            inputsInline: true,
            output: null,
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Creates a list by repeating a given item'),
            category: window.Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('Repeat an item'),
            description: localize('Creates a list with a given item repeated for a specific number of times.'),
        };
    },
    getRequiredValueInputs() {
        return {
            ITEM: emptyTextValidator,
            NUM: emptyTextValidator,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.lists_repeat = block => {
    // eslint-disable-next-line no-underscore-dangle
    const function_name = window.Blockly.JavaScript.javascriptGenerator.provideFunction_('listsRepeat', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${window.Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(value, n) {
            var array = [];
            for (var i = 0; i < n; i++) {
                array[i] = value;
            }
            return array;
        }`,
    ]);

    const element =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'ITEM',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || 'null';
    const repeat_count =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'NUM',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';
    const code = `${function_name}(${element}, ${repeat_count})`;

    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
