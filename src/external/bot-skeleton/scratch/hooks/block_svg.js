import debounce from 'lodash.debounce';
import { localize } from '@deriv-com/translations';
import DBotStore from '../dbot-store';

window.Blockly.BlockSvg.prototype.addSelect = function () {
    if (!window.Blockly.derivWorkspace.isFlyoutVisible) {
        const { flyout } = DBotStore.instance;
        if (flyout) {
            flyout.setVisibility(false);
        }

        window.Blockly.utils.dom.addClass(/** @type {!Element} */ (this.svgGroup_), 'blocklySelected');
    }
};

/**
 * Set whether the block is disabled or not.
 * @param {boolean} disabled True if disabled.
 * @deriv/bot: Call updateDisabled() when setDisabled is called.
 */
window.Blockly.BlockSvg.prototype.setDisabled = function (disabled) {
    this.disabled = disabled;
    this.updateDisabled();
};

/**
 * Set whether the block is error highlighted or not.
 * @param {boolean} highlighted True if highlighted for error.
 */
window.Blockly.BlockSvg.prototype.setErrorHighlighted = function (
    should_be_error_highlighted,
    error_message = localize(
        'The block(s) highlighted in red are missing input values. Please update them and click "Run bot".'
    )
) {
    if (this.is_error_highlighted === should_be_error_highlighted) {
        return;
    }

    const highlight_class = 'block--error-highlighted';

    if (should_be_error_highlighted) {
        // Below function does its own checks to check if class already exists.
        window.Blockly.utils.dom.addClass(this.svgGroup_, highlight_class);
    } else {
        window.Blockly.utils.dom.removeClass(this.svgGroup_, highlight_class);
    }

    this.is_error_highlighted = should_be_error_highlighted;
    this.error_message = error_message;
};

// Highlight the block that is being executed
window.Blockly.BlockSvg.prototype.highlightExecutedBlock = function () {
    const highlight_block_class = 'block--execution-highlighted';
    if (!window.Blockly.utils.dom.hasClass(this.svgGroup_, highlight_block_class)) {
        window.Blockly.utils.dom.addClass(this.svgGroup_, highlight_block_class);
        setTimeout(() => {
            if (this.svgGroup_) {
                window.Blockly.utils.dom.removeClass(this.svgGroup_, highlight_block_class);
            }
        }, 1505);
    }
};

/**
 * Set block animation (Blink)
 */

window.Blockly.BlockSvg.prototype.blink = function () {
    const blink_class = 'block--blink';
    window.Blockly.utils.dom.addClass(this.svgGroup_, blink_class);

    setTimeout(() => {
        window.Blockly.utils.dom.removeClass(this.svgGroup_, blink_class);
    }, 2000);
};

/**
 * Set whether the block is collapsed or not.
 * @param {boolean} collapsed True if collapsed.
 */

/**
 * Toggles the collapse state of the block after a short delay to prevent workspace freezing.
 * @param {boolean} collapsed - Whether to collapse the block.
 */
window.Blockly.BlockSvg.prototype.toggleCollapseWithDelay = function (collapsed) {
    debounce(async () => {
        this.setCollapsed(collapsed);
    }, 100)();
};
