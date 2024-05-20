// deriv-bot: Reference the correct function of wrap. This is due to
// Scratch using different structure vs window.Blockly.
window.Blockly.utils.string = {
    wrap: window.Blockly.utils.wrap,
};
