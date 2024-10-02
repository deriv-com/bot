import { config } from '../../constants/config';

// Structure is { '<outerHtml />': { height: 1, width: 1 } }
window.Blockly.Block.Dimensions = {};

window.Blockly.Block.prototype.getDisplayName = function () {
    if (this.meta) {
        const block_meta = this.meta();
        return block_meta && block_meta.display_name;
    }
    return this.type;
};

window.Blockly.Block.prototype.getSiblings = function () {
    const siblings = [this];
    ['getPreviousBlock', 'getNextBlock'].forEach(functionName => {
        let block = this[functionName]();
        while (block !== null) {
            const parent = this.getParent();
            if (parent && parent.id === block.id) {
                break;
            }

            siblings.push(block);
            block = block[functionName]();
        }
    });
    return siblings;
};

window.Blockly.Block.prototype.getChildByType = function (type) {
    return this.getDescendants().find(child => child.type === type);
};

window.Blockly.Block.prototype.getChildFieldValue = function (childType, childField) {
    const childBlock = this.getChildByType(childType);
    if (childBlock) {
        const value = childBlock.getFieldValue(childField);
        return value;
    }
    return null;
};

window.Blockly.Block.prototype.childValueToCode = function (childType, childField) {
    const childBlock = this.getChildByType(childType);
    return (
        childBlock &&
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            childBlock,
            childField,
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        )
    );
};

window.Blockly.Block.prototype.getBlocksInStatement = function (statementInputName) {
    const blocksInStatement = [];
    const firstBlock = this.getInputTargetBlock(statementInputName);

    if (firstBlock) {
        return firstBlock.getSiblings();
    }
    return blocksInStatement;
};

window.Blockly.Block.prototype.getLastConnectionInStatement = function (statement_input_name) {
    const first_block_in_stack = this.getInputTargetBlock(statement_input_name);

    if (first_block_in_stack) {
        return first_block_in_stack.lastConnectionInStack();
    }

    const statement_input = this.getInput(statement_input_name);
    return statement_input.connection;
};

/**
 * Get whether this block is enabled or not.
 * @return {boolean} True if enabled.
 */
window.Blockly.Block.prototype.isEnabled = function () {
    return !this.disabled;
};

window.Blockly.Block.prototype.isDescendantOf = function (type) {
    let parentBlock = this.getParent();
    while (parentBlock !== null) {
        if (parentBlock.type === type) {
            return true;
        }
        parentBlock = parentBlock.getParent();
    }
    return false;
};

window.Blockly.Block.prototype.getTopParent = function () {
    let parent = this.getParent();
    while (parent !== null) {
        const nextParent = parent.getParent();
        if (!nextParent) {
            return parent;
        }
        parent = nextParent;
    }
    return null;
};

window.Blockly.Block.getDimensions = function (block_node) {
    // Attempt to retrieve dimensions from memory rather than recalculating.
    const existing_dimensions_key = Object.keys(window.Blockly.Block.Dimensions).find(
        outer_html => block_node.outerHTML === outer_html
    );

    if (existing_dimensions_key) {
        return window.Blockly.Block.Dimensions[existing_dimensions_key];
    }

    const options = new window.Blockly.Options({
        media: 'assets/media/',
        renderer: 'zelos',
        theme: window.Blockly.Themes.zelos_renderer,
    });
    const el_injection_div = document.createElement('div');

    // Create a headless workspace to calculate xmlList block dimensions
    const workspace = window.Blockly.inject(el_injection_div, options);
    const block = window.Blockly.Xml.domToBlock(block_node, workspace);
    const block_hw = block.getHeightWidth();

    workspace.dispose();
    window.Blockly.Block.Dimensions[block_node.outerHTML] = block_hw;
    return block_hw;
};

window.Blockly.Block.prototype.isMainBlock = function () {
    return config().mainBlocks.includes(this.type);
};

window.Blockly.Block.prototype.isIndependentBlock = function () {
    return config().INDEPEDENT_BLOCKS.includes(this.type);
};

/**
 * Return the parent block or null if this block is at the top level.
 * @return {window.Blockly.Block} The block that holds the current block.
 */
window.Blockly.Block.prototype.getRootInputTargetBlock = function () {
    let input_name;
    let current_block = this.getParent();

    while (current_block) {
        const root_block = this.getRootBlock();
        const current_input = root_block.getInputWithBlock(current_block);

        if (current_input && current_input.name) {
            input_name = current_input.name;
        }

        current_block = current_block.getParent();
    }

    return input_name;
};

/**
 * Returns whether the block has an error highlighted descendant.
 */
window.Blockly.Block.prototype.hasErrorHighlightedDescendant = function () {
    const hasHighlightedDescendant = child_blocks =>
        child_blocks.some(child_block => {
            const is_self_highlighted = child_block.is_error_highlighted;
            const is_descendant_highlighted = hasHighlightedDescendant(child_block.getChildren());

            return is_self_highlighted || is_descendant_highlighted;
        });

    return hasHighlightedDescendant(this.getChildren());
};

window.Blockly.Block.isDynamic = function (block_type) {
    return /^((procedures_)|(variables_)|(math_change$))/.test(block_type);
};

// TODO: Do not remove this
// overwriting the doClassValidation_ method to handle
// dropdown values
window.Blockly.FieldDropdown.prototype.doClassValidation_ = function (newValue) {
    this.text_ = null;
    const text = this?.selectedOption?.[0];
    this.setText(text ?? '');
    return newValue;
};
