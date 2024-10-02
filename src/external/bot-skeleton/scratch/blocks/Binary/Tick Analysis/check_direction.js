import { localize } from '@deriv-com/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

window.Blockly.Blocks.check_direction = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Direction is {{ direction_type }}', { direction_type: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CHECK_DIRECTION',
                    options: config().lists.CHECK_DIRECTION,
                },
            ],
            output: 'Boolean',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('True if the market direction matches the selection'),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Market direction'),
            description: localize(
                'This block is used to determine if the market price moves in the selected direction or not. It gives you a value of “True” or “False”.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.check_direction = block => {
    const checkWith = block.getFieldValue('CHECK_DIRECTION');

    const code = `Bot.checkDirection('${checkWith}')`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
