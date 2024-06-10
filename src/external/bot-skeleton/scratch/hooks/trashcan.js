/**
 * Inspect the contents of the trash.
 * @deriv/bot: Noop for us, restore original functionality when trashcan can be inspected.
 */
window.Blockly.Trashcan.prototype.click = function () {};

window.Blockly.Trashcan.prototype.setTrashcanPosition = (position_right, position_top) => {
    const trashcan_instance = window.Blockly.derivWorkspace?.trashcan?.svgGroup;
    trashcan_instance?.setAttribute('transform', `translate(${position_right}, ${position_top})`);
};
