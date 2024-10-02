import { localize } from '@deriv-com/translations';
import { config } from '../../../../../constants/config';
import { modifyContextMenu } from '../../../../utils';

// This block is a remnant of a very old Binary Bot version.
// needs to be here for backward compatibility.
window.Blockly.Blocks.barrier_offset = {
    init() {
        this.jsonInit({
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BARRIEROFFSET_IN',
                    options: config().BARRIER_TYPES,
                },
            ],
            output: null,
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Adds a sign to a number to create a barrier offset. (deprecated)'),
            category: window.Blockly.Categories.Miscellaneous,
        });
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.barrier_offset = () => {};
