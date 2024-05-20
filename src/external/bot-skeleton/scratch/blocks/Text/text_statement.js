import { localize } from '@/utils/tmp/dummy';
import { minusIconDark } from '../images';
import { runIrreversibleEvents } from '../../utils';

window.Blockly.Blocks.text_statement = {
    required_parent_type: 'text_join',
    init() {
        this.required_parent_id = '';
        const field_image = new window.Blockly.FieldImage(minusIconDark, 25, 25, '', this.onIconClick.bind(this));
        this.jsonInit(this.definition());
        this.appendDummyInput('REMOVE_ICON').appendField(field_image);
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            category: window.Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Text Statement'),
            description: '',
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        const surround_parent = this.getSurroundParent();

        if (event.type === window.Blockly.Events.BLOCK_CREATE) {
            this.setMovable(true);
            if (!this.required_parent_id && surround_parent?.type === this.required_parent_type) {
                this.required_parent_id = surround_parent.id;
            }
        }

        if (event.type === window.Blockly.Events.END_DRAG) {
            const stack_blocks = window.Blockly.getMainWorkspace().getBlockById(event.blockId);

            if (this.required_parent_id && (!surround_parent || surround_parent.id !== this.required_parent_id)) {
                const original_parent = window.Blockly.getMainWorkspace().getBlockById(this.required_parent_id);

                if (original_parent) {
                    const first_block_in_stack = original_parent.getInputTargetBlock('STACK');

                    if (first_block_in_stack) {
                        const last_connection = original_parent.getLastConnectionInStatement('STACK');
                        runIrreversibleEvents(() => {
                            last_connection.connect(this.previousConnection);
                        });
                    } else {
                        runIrreversibleEvents(() => {
                            original_parent.getInput('STACK').connection.connect(stack_blocks.previousConnection);
                        });
                    }
                }
            }
        }
    },
    onIconClick: window.Blockly.Blocks.lists_statement.onIconClick,
};

window.Blockly.JavaScript.text_statement = block => {
    const code = `String(${window.Blockly.JavaScript.valueToCode(block, 'TEXT', window.Blockly.JavaScript.ORDER_ATOMIC)})`;
    return [code, window.Blockly.JavaScript.ORDER_ATOMIC];
};
