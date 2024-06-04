/**
 * ENUM for categories.
 * @const
 */
window.Blockly.Categories = {
    Trade_Definition: 'trade_parameters',
    Before_Purchase: 'purchase_conditions',
    During_Purchase: 'sell_conditions',
    After_Purchase: 'trade_results',
    Mathematical: 'math',
    Logic: 'logic',
    Text: 'text',
    Variables: 'variables',
    Functions: 'custom_functions',
    List: 'lists',
    Indicators: 'indicators',
    Time: 'time',
    Tick_Analysis: 'technical_analysis',
    Candle: 'candle',
    Miscellaneous: 'miscellaneous',
    Loop: 'loops',
};
window.Blockly.OUTPUT_SHAPE_HEXAGONAL = 1;
window.Blockly.OUTPUT_SHAPE_ROUND = 2;

window.Blockly.isNumber = str => {
    return /^\s*-?\d+(\.\d+)?\s*$/.test(str);
};
/**
 * Number of pixels the mouse must move before a drag starts.
 */
window.Blockly.DRAG_RADIUS = 3;

/**
 * Number of pixels the mouse must move before a drag/scroll starts from the
 * flyout.  Because the drag-intention is determined when this is reached, it is
 * larger than window.Blockly.DRAG_RADIUS so that the drag-direction is clearer.
 */
window.Blockly.FLYOUT_DRAG_RADIUS = 1;

window.Blockly.BlockSvg.SEP_SPACE_X = 8;

// @deriv/bot: Set the minimum width of a statement block to be wider than default.
window.Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 100 * window.Blockly.BlockSvg.GRID_UNIT;

// @deriv/bot: Root block hat replaces with standard rounded corner
window.Blockly.BlockSvg.START_HAT_PATH = `m 0,${window.Blockly.BlockSvg.CORNER_RADIUS} A ${window.Blockly.BlockSvg.CORNER_RADIUS}, ${window.Blockly.BlockSvg.CORNER_RADIUS} 0 0,1 ${window.Blockly.BlockSvg.CORNER_RADIUS},0`;

// @deriv/bot: Changed the height of a row in a statement block to be 10.
window.Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 10 * window.Blockly.BlockSvg.GRID_UNIT;

// @deriv/bot: visual improvement: changed editable field padding from 8 to 16
window.Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 16;

window.Blockly.Field.prototype.setText = function (e) {
    // eslint-disable-next-line no-param-reassign
    e !== null && (e = String(e)) !== this.text_ && ((this.text_ = e), this.forceRerender());
};

window.Blockly.FieldDropdown.prototype.isEmpty = function () {
    return this.menuGenerator_.length === 0 || !this.menuGenerator_[0][1];
};

window.Blockly.Xml.NODE_BLOCK = 'BLOCK';
window.Blockly.Xml.NODE_BUTTON = 'BUTTON';
window.Blockly.Xml.NODE_LABEL = 'LABEL';
window.Blockly.Xml.NODE_SHADOW = 'SHADOW';
window.Blockly.Xml.NODE_INPUT = 'INPUT';
