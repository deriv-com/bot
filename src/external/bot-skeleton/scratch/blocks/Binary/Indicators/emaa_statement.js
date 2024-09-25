import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.emaa_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['input_list', 'period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Exponential Moving Average Array {{ dummy }}', {
                variable: '%1',
                dummy: '%2',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'emaa',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STATEMENT',
                    check: null,
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Calculates Exponential Moving Average (EMA) list from a list of values with a period'),
            previousStatement: null,
            nextStatement: null,
            category: window.Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Exponential Moving Average Array (EMAA)'),
            description: localize(
                'This block is similar to EMA, except that it gives you the entire EMA line based on the input list and the given period.'
            ),
        };
    },
    onchange: window.Blockly.Blocks.bb_statement.onchange,
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.emaa_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    const input = block.childValueToCode('input_list', 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD');
    const code = `${var_name} = Bot.emaa(${input}, ${period});\n`;

    return code;
};
