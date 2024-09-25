import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.timeout = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('{{ dummy }} {{ stack_input }} Run after {{ number }} second(s)', {
                dummy: '%1',
                stack_input: '%2',
                number: '%3',
            }),
            args0: [
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_statement',
                    name: 'TIMEOUTSTACK',
                },
                {
                    type: 'input_value',
                    name: 'SECONDS',
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Run the blocks inside after a given number of seconds'),
            category: window.Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Delayed run'),
            description: localize(
                'This block delays execution for a given number of seconds. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    getRequiredValueInputs() {
        return {
            SECONDS: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.timeout = block => {
    const stack = window.Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'TIMEOUTSTACK');
    const seconds =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'SECONDS',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '1';

    const code = `sleep(${seconds});\n${stack}\n`;
    return code;
};
