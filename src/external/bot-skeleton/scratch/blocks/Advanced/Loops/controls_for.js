import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.controls_for = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'count with {{ variable }} from {{ start_number }} to {{ end_number }} by {{ step_size }}',
                {
                    variable: '%1',
                    start_number: '%2',
                    end_number: '%3',
                    step_size: '%4',
                }
            ),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: null,
                },
                {
                    type: 'input_value',
                    name: 'FROM',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'TO',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'BY',
                    check: 'Number',
                },
            ],
            message1: localize('do %1'),
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            inputsInline: true,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize(
                'This block uses the variable “i” to control the iterations. With each iteration, the value of “i” is determined by the items in a given list.'
            ),
            category: window.Blockly.Categories.Loop,
        };
    },
    meta() {
        return {
            display_name: localize('Iterate (1)'),
            description: localize(
                'This block uses the variable “i” to control the iterations. With each iteration, the value of “i” is determined by the items in a given list.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            FROM: null,
            TO: null,
            BY: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.controls_for = block => {
    // eslint-disable-next-line no-underscore-dangle
    const variable0 = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    const argument0 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'FROM',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '0';
    const argument1 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TO',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '0';
    const increment =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'BY',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '1';

    let branch = window.Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'DO');
    branch = window.Blockly.JavaScript.javascriptGenerator.addLoopTrap(branch, block.id);

    let code = '';

    if (
        window.Blockly.isNumber(argument0) &&
        window.Blockly.isNumber(argument1) &&
        window.Blockly.isNumber(increment)
    ) {
        const up = parseFloat(argument0) <= parseFloat(argument1);
        const operator = up ? '<=' : '>=';
        const step = Math.abs(parseFloat(increment));

        const assignment = `${variable0} = ${argument0}`;
        const condition = `${variable0} ${operator} ${argument1}`;
        const statement = `${variable0} ${up ? '+=' : '-='} ${step}`;

        code = `
        for (${assignment}; ${condition}; ${statement}) {
            ${branch}
        }\n`;
    } else {
        // Cache non-trivial values to variables to prevent repeated look-ups.
        let startVar = argument0;
        if (!argument0.match(/^\w+$/) && !window.Blockly.isNumber(argument0)) {
            // eslint-disable-next-line no-underscore-dangle
            startVar = window.Blockly.JavaScript.variableDB_.getDistinctName(
                `${variable0}_start`,
                window.Blockly.Variables.CATEGORY_NAME
            );
            code = `var ${startVar} = ${argument0};\n`;
        }

        let endVar = argument1;
        if (!argument1.match(/^\w+$/) && !window.Blockly.isNumber(argument1)) {
            // eslint-disable-next-line no-underscore-dangle
            endVar = window.Blockly.JavaScript.variableDB_.getDistinctName(
                `${variable0}_end`,
                window.Blockly.Variables.CATEGORY_NAME
            );
            code += `var ${endVar} = ${argument1};\n`;
        }

        // Determine loop direction at start, in case one of the bounds changes during loop execution.
        // eslint-disable-next-line no-underscore-dangle
        const incVar = window.Blockly.JavaScript.variableDB_.getDistinctName(
            `${variable0}_inc`,
            window.Blockly.Variables.CATEGORY_NAME
        );
        const incVal = window.Blockly.isNumber(increment) ? Math.abs(increment) : `Math.abs(${increment})`;

        code += `
        var ${incVar} = ${incVal};
        if (${startVar} > ${endVar}) {
            ${incVar} = -${incVar};
        }
        for (
           ${variable0} = ${startVar}; 
           ${incVar} >= 0 ? ${variable0} <= ${endVar} : ${variable0} >= ${endVar};
           ${variable0} += ${incVar}
        ) {
            ${branch};
        }\n`;
    }

    return code;
};
