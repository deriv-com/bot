import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.rsi_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['input_list', 'period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Relative Strength Index {{ dummy }}', {
                variable: '%1',
                dummy: '%2',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'rsi',
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
            tooltip: localize('Relative Strength Index (RSI) from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: window.Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Relative Strength Index (RSI)'),
            description: localize(
                'RSI is a technical analysis tool that helps you identify the market trend. It will give you a value from 0 to 100. An RSI value of 70 and above means that the asset is overbought and the current trend may reverse, while a value of 30 and below means that the asset is oversold.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    onchange: window.Blockly.Blocks.bb_statement.onchange,
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.rsi_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    const input = block.childValueToCode('input_list', 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD');
    const code = `${var_name} = Bot.rsi(${input}, ${period});\n`;

    return code;
};
