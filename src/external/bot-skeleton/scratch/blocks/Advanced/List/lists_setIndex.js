import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.lists_setIndex = {
    init() {
        this.MODE_OPTIONS = [
            [localize('set'), 'SET'],
            [localize('insert at'), 'INSERT'],
        ];
        this.WHERE_OPTIONS = [
            [localize('#'), 'FROM_START'],
            [localize('# from end'), 'FROM_END'],
            [localize('first'), 'FIRST'],
            [localize('last'), 'LAST'],
            [localize('random'), 'RANDOM'],
        ];

        this.appendValueInput('LIST').setCheck('Array').appendField(localize('in list'));
        this.appendDummyInput().appendField(new window.Blockly.FieldDropdown(this.MODE_OPTIONS), 'MODE');
        this.appendDummyInput('AT');
        this.appendValueInput('TO').appendField(localize('as'));

        const block_color =
            window.Blockly.Colours.Base.colour ||
            window.Blockly.Colours.Base.colourSecondary ||
            window.Blockly.Colours.Base.colourTertiary;
        this.setColour(block_color);

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(
            localize(
                'This block replaces a specific item in a list with another given item. It can also insert the new item in the list at a specific position.'
            )
        );
        this.updateAt(true);
    },
    meta() {
        return {
            display_name: localize('Set list item'),
            description: localize(
                'This block replaces a specific item in a list with another given item. It can also insert the new item in the list at a specific position.'
            ),
            category: window.Blockly.Categories.List,
        };
    },
    mutationToDom() {
        const container = document.createElement('mutation');
        const isAt = this.getInput('AT').type === window.Blockly.INPUT_VALUE;

        container.setAttribute('at', isAt);
        return container;
    },
    domToMutation(xmlElement) {
        const isAt = xmlElement.getAttribute('at') !== 'false';
        this.updateAt(isAt);
    },
    updateAt(isAt) {
        this.removeInput('AT', true);

        if (isAt) {
            this.appendValueInput('AT').setCheck('Number');
        } else {
            this.appendDummyInput('AT');
        }

        const menu = new window.Blockly.FieldDropdown(this.WHERE_OPTIONS, value => {
            const newAt = ['FROM_START', 'FROM_END'].includes(value);
            if (newAt !== isAt) {
                this.updateAt(newAt);
                this.setFieldValue(value, 'WHERE');
                return null;
            }
            return undefined;
        });

        this.moveInputBefore('AT', 'TO');
        this.getInput('AT').appendField(menu, 'WHERE');
        this.initSvg();
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.lists_setIndex = block => {
    const mode = block.getFieldValue('MODE') || 'SET';
    const where = block.getFieldValue('WHERE') || 'FIRST';
    const value =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TO',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || 'null';

    let list =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'LIST',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER
        ) || '[]';

    const cacheList = () => {
        if (list.match(/^\w+$/)) {
            return '';
        }

        // eslint-disable-next-line no-underscore-dangle
        const listVar = window.Blockly.JavaScript.variableDB_.getDistinctName(
            'tmpList',
            window.Blockly.Variables.CATEGORY_NAME
        );
        const code = `var ${listVar} = ${list};\n`;

        list = listVar;
        return code;
    };

    let code;

    if (where === 'FIRST') {
        if (mode === 'SET') {
            code = `${list}[0] = ${value};\n`;
        } else if (mode === 'INSERT') {
            code = `${list}.unshift(${value});\n`;
        }
    } else if (where === 'LAST') {
        if (mode === 'SET') {
            code = cacheList();
            code += `${list}[${list}.length - 1] = ${value};\n`;
        } else if (mode === 'INSERT') {
            code = `${list}.push(${value});\n`;
        }
    } else if (where === 'FROM_START') {
        const at = window.Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT');
        if (mode === 'SET') {
            code = `${list}[${at}] = ${value};\n`;
        } else if (mode === 'INSERT') {
            code = `${list}.splice(${at}, 0, ${value});\n`;
        }
    } else if (where === 'FROM_END') {
        const at = window.Blockly.JavaScript.javascriptGenerator.getAdjusted(
            block,
            'AT',
            1,
            false,
            window.Blockly.JavaScript.javascriptGenerator.ORDER_SUBTRACTION
        );
        code = cacheList();
        if (mode === 'SET') {
            code = `${list}[${list}.length - ${at}] = ${value};\n`;
        } else if (mode === 'INSERT') {
            code = `${list}.splice(${list}.length - ${at}, 0, ${value});\n`;
        }
    } else if (where === 'RANDOM') {
        code = cacheList();

        // eslint-disable-next-line no-underscore-dangle
        const xVar = window.Blockly.JavaScript.variableDB_.getDistinctName(
            'tmpX',
            window.Blockly.Variables.CATEGORY_NAME
        );

        code += `var ${xVar} = Math.floor(Math.random() * ${list}.length);\n`;

        if (mode === 'SET') {
            code += `${list}[${xVar}] = ${value};\n`;
        } else if (mode === 'INSERT') {
            code += `${list}.splice(${xVar}, 0, ${value});\n`;
        }
    }

    return code;
};
