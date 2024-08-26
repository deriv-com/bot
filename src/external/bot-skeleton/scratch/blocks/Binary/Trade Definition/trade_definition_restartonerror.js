import { localize } from '@deriv-com/translations';

window.Blockly.Blocks.trade_definition_restartonerror = {
    init() {
        this.jsonInit({
            message0: localize('Restart last trade on error (bot ignores the unsuccessful trade): {{ checkbox }}', {
                checkbox: '%1',
            }),
            args0: [
                {
                    type: 'field_image_checkbox',
                    name: 'RESTARTONERROR',
                    checked: true,
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setNextStatement(false);
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
    required_inputs: ['RESTARTONERROR'],
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_restartonerror = () => {};
