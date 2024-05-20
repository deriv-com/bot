/**
 * Find all user-created variables that are in use in the workspace.
 * For use by generators.
 * To get a list of all variables on a workspace, including unused variables,
 * call Workspace.getAllVariables.
 * @deriv/bot: Required for JS generator to work.
 * @param {!window.Blockly.Workspace} ws The workspace to search for variables.
 * @return {!Array.<!window.Blockly.VariableModel>} Array of variable models.
 */
window.Blockly.Variables.allUsedVarModels = function (ws) {
    const blocks = ws.getAllBlocks(false);
    const variableHash = Object.create(null);

    // Iterate through every block and add each variable to the hash.
    blocks.forEach(block => {
        const blockVariables = block.getVarModels();
        if (blockVariables) {
            blockVariables.forEach(blockVariable => {
                const id = blockVariable.getId();
                if (id) {
                    variableHash[id] = blockVariable;
                }
            });
        }
    });

    // Flatten the hash into a list.
    const variableList = [];
    Object.keys(variableHash).forEach(id => {
        variableList.push(variableHash[id]);
    });

    return variableList;
};

/**
 * Generate DOM objects representing a variable field.
 * @param {!window.Blockly.VariableModel} variableModel The variable model to
 *     represent.
 * @return {Element} The generated DOM.
 * @public
 */
window.Blockly.Variables.generateVariableFieldDom = function (variableModel) {
    /* Generates the following XML:
     * <field name="VAR" id="goKTKmYJ8DhVHpruv" variabletype="int">foo</field>
     */
    const field = document.createElement('field');

    field.setAttribute('name', 'VAR');
    field.setAttribute('id', variableModel.getId());
    field.setAttribute('variabletype', variableModel.type);

    const name = document.createTextNode(variableModel.name);
    field.appendChild(name);
    return field;
};
