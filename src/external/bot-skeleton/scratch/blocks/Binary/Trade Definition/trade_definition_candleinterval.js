import { localize } from '@/utils/tmp/dummy';
import { config } from '../../../../constants/config';

window.Blockly.Blocks.trade_definition_candleinterval = {
    init() {
        this.jsonInit({
            message0: localize('Default Candle Interval: {{ candle_interval_type }}', { candle_interval_type: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals.slice(1),
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange(/* event */) {
        if (!this.workspace || window.Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();
    },
    enforceLimitations: window.Blockly.Blocks.trade_definition_market.enforceLimitations,
};
window.Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_candleinterval = () => {};
