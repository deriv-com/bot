import { localize } from '@deriv-com/translations';
import { modifyContextMenu } from '../../../../utils';

window.Blockly.Blocks.total_runs = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Number of runs'),
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the number of runs'),
            category: window.Blockly.Categories.Miscellaneous,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Number of runs'),
            description: localize(
                'This block gives you the total number of times your bot has run. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.'
            ),
        };
    },
    onchange: window.Blockly.Blocks.total_profit.onchange,
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.total_runs = () => [
    'Bot.getTotalRuns()',
    window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
