import { localize } from '@/utils/tmp/dummy';

window.Blockly.Blocks.epoch = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Seconds Since Epoch'),
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the number of seconds since January 1st, 1970'),
            category: window.Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Second Since Epoch'),
            description: localize('This block returns the number of seconds since January 1st, 1970.'),
        };
    },
};

window.Blockly.JavaScript.epoch = () => ['Bot.getTime()', window.Blockly.JavaScript.ORDER_ATOMIC];
