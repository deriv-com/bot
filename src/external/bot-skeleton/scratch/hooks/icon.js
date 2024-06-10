/**
 * Render the icon.
 * @param {number} cursorX Horizontal offset at which to position the icon.
 * @return {number} Horizontal offset for next item to draw.
 */

window.Blockly.Icon = new window.Blockly.icons.Icon();

window.Blockly.Icon.renderIcon = function (cursorX) {
    if (this.collapseHidden && this.block_.isCollapsed()) {
        this.iconGroup_.setAttribute('display', 'none');
        return cursorX;
    }
    this.iconGroup_.setAttribute('display', 'block');

    let newCursorX = cursorX;

    const TOP_MARGIN = 9;
    const width = this.SIZE;

    if (this.block_.RTL) {
        newCursorX -= width;
    }

    this.iconGroup_.setAttribute('transform', `localize(${newCursorX},${TOP_MARGIN})`);
    this.computeIconLocation();

    if (this.block_.RTL) {
        newCursorX -= window.Blockly.BlockSvg.SEP_SPACE_X;
    } else {
        newCursorX += width + window.Blockly.BlockSvg.SEP_SPACE_X;
    }

    return newCursorX;
};
