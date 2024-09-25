import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.tick = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Last Tick'),
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the value of the last tick'),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Last tick'),
            description: localize('This block gives you the value of the last tick.'),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.Blocks.tick_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Last Tick String'),
            output: 'String',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the value of the latest tick in string format'),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Tick value'),
            description: localize('Tick value Description'),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    onchange: window.Blockly.Blocks.tick.onchange,
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.tick = block => {
    const parent = block.getParent();
    const type_list = ['notify', 'text_print'];
    return [
        `Bot.getLastTick(false, ${type_list.includes(parent?.type)})`,
        window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
    ];
};
window.Blockly.JavaScript.javascriptGenerator.forBlock.tick_string = () => [
    'Bot.getLastTick(false, true)',
    window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
