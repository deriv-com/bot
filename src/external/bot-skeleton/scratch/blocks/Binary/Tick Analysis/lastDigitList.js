import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.lastDigitList = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Last digits list'),
            output: 'Array',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the list of last digits of 1000 recent tick values'),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Last Digits List'),
            description: localize('This block gives you a list of the last digits of the last 1000 tick values.'),
        };
    },
};

window.Blockly.JavaScript.lastDigitList = () => ['Bot.getLastDigitList()', window.Blockly.JavaScript.ORDER_ATOMIC];
