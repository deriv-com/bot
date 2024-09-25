import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.smaa_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['input_list', 'period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Simple Moving Average Array {{ dummy }}', {
                variable: '%1',
                dummy: '%2',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'smaa',
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
            tooltip: localize('Calculates Simple Moving Average line from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: window.Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Simple Moving Average Array (SMAA)'),
            description: localize(
                'Similar to SMA, this block gives you the entire SMA line containing a list of all values for a given period.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    onchange: window.Blockly.Blocks.bb_statement.onchange,
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.smaa_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    const input = block.childValueToCode('input_list', 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD');
    const code = `${var_name} = Bot.smaa(${input}, ${period});\n`;

    return code;
};
