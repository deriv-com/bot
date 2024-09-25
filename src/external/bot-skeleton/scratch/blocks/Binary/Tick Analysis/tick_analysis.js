import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.tick_analysis = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            args0: [
                {
                    type: 'field_label',
                    text: localize('The content of this block is called on every tick'),
                    class: 'blocklyTextTickAnalysis',
                },
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_statement',
                    name: 'TICKANALYSIS_STACK',
                    check: null,
                },
            ],
            colour: window.Blockly.Colours.RootBlock.colour,
            colourSecondary: window.Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: window.Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('You can use this block to analyze the ticks, regardless of your trades'),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Run on every tick'),
            description: localize(
                'The content of this block is called on every tick. Place this block outside of any root block.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.tick_analysis = block => {
    const stack = window.Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'TICKANALYSIS_STACK') || '';
    const code = `
    BinaryBotPrivateTickAnalysisList.push(function BinaryBotPrivateTickAnalysis() {
        ${stack}
    });\n`;
    return code;
};
