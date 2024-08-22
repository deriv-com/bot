import { localize } from '@deriv-com/translations';

window.Blockly.Blocks.trade_definition_restartbuysell = {
    init() {
        this.jsonInit({
            message0: localize('Restart buy/sell on error (disable for better performance): {{ checkbox }}', {
                checkbox: '%1',
            }),
            args0: [
                {
                    type: 'field_image_checkbox',
                    name: 'TIME_MACHINE_ENABLED',
                    checked: false,
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
    required_inputs: ['TIME_MACHINE_ENABLED'],
};
window.Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_restartbuysell = () => {};
