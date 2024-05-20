/* eslint-disble */
/**
 * Create a main workspace and add it to the SVG.
 * @param {!Element} svg SVG element with pattern defined.
 * @param {!window.Blockly.Options} options Dictionary of options.
 * @param {!window.Blockly.BlockDragSurfaceSvg} blockDragSurface Drag surface SVG
 *     for the blocks.
 * @param {!window.Blockly.WorkspaceDragSurfaceSvg} workspaceDragSurface Drag surface
 *     SVG for the workspace.
 * @return {!window.Blockly.Workspace} Newly created main workspace.
 * @private
 */
window.Blockly.createVirtualWorkspace_ = function (fragment, options, blockDragSurface, workspaceDragSurface) {
    options.parentWorkspace = null;
    const mainWorkspace = new window.Blockly.WorkspaceSvg(options, blockDragSurface, workspaceDragSurface);
    mainWorkspace.scale = options.zoomOptions.startScale;
    fragment.appendChild(mainWorkspace.createDom('blocklyMainBackground'));

    return mainWorkspace;
};
