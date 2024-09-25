import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.lists_sort = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('sort {{ sort_type }} {{ sort_direction }} {{ input_list }}', {
                sort_type: '%1',
                sort_direction: '%2',
                input_list: '%3',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'TYPE',
                    options: [
                        [localize('numeric'), 'NUMERIC'],
                        [localize('alphabetic'), 'TEXT'],
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'DIRECTION',
                    options: [
                        [localize('ascending'), '1'],
                        [localize('descending'), '-1'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'LIST',
                },
            ],
            inputsInline: true,
            output: 'Array',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Sorts the items in a given list'),
            category: window.Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('Sort list'),
            description: localize(
                'Sorts the items in a given list, by their numeric or alphabetical value, in either ascending or descending order.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            LIST: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.lists_sort = block => {
    const list =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'LIST',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL
        ) || '[]';
    const direction = block.getFieldValue('DIRECTION') === '1' ? 1 : -1;
    const type = block.getFieldValue('TYPE');
    // eslint-disable-next-line no-underscore-dangle
    const getCompareFunctionName = window.Blockly.JavaScript.javascriptGenerator.provideFunction_(
        'listsGetSortCompare',
        [
            // eslint-disable-next-line no-underscore-dangle
            `function ${window.Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(type, direction) {
            var compareFuncs = {
                NUMERIC: function(a, b) {
                    return parseFloat(a) - parseFloat(b);
                },
                TEXT: function(a, b) {
                    return a.toString() > b.toString() ? 1 : -1;
                }
            };

            return function(a, b) {
                return compareFuncs[type](a, b) * direction; 
            }
        }`,
        ]
    );

    const code = `${list}.sort().slice(0).sort(${getCompareFunctionName}("${type}", ${direction}))`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
