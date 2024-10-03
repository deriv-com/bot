import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.variables_get = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            type: 'variables_get',
            message0: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('item'),
                },
            ],
            output: null,
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Special4.colour,
            colourSecondary: window.Blockly.Colours.Special4.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special4.colourTertiary,
            tooltip: localize('Gets variable value'),
            category: window.Blockly.Categories.Variables,
        };
    },
    meta() {
        return {
            display_name: localize('User-defined variable'),
            description: '',
        };
    },
    onchange(event) {
        if (event.type === window.Blockly.Events.VAR_RENAME) {
            const all_blocks = this.workspace.getAllBlocks();
            const function_blocks = all_blocks.filter(block => block.category_ === 'custom_functions');
            const old_param = event.oldName;
            const new_param = event.newName;
            function_blocks.forEach(block => {
                if (block.arguments?.length) {
                    const param_index = block.arguments.findIndex(item => item === old_param);
                    if (param_index !== -1) {
                        block.arguments[param_index] = new_param;
                        const param_field = block.getField('PARAMS');
                        if (param_field) {
                            block.setFieldValue(`${localize('with: ')} ${block.arguments.join(', ')}`, 'PARAMS');
                        }
                        const with_field = block.getField('WITH');
                        if (with_field) {
                            block.updateShape();
                        }
                    }
                }
            });
        }
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.variables_get = block => {
    // eslint-disable-next-line no-underscore-dangle
    const code = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
