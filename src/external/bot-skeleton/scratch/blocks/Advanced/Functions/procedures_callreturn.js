import { localize } from '@deriv-com/translations';

window.Blockly.Blocks.procedures_callreturn = {
    init() {
        this.arguments = [];
        this.previousDisabledState = false;
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2',
            args0: [
                {
                    type: 'field_label',
                    name: 'NAME',
                    text: this.id,
                },
                {
                    type: 'input_dummy',
                    name: 'TOPROW',
                },
            ],
            output: null,
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Special2.colour,
            colourSecondary: window.Blockly.Colours.Special2.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special2.colourTertiary,
            tooltip: localize('Custom function'),
            category: window.Blockly.Categories.Functions,
            inputsInline: true,
        };
    },
    meta() {
        return {
            display_name: localize('Custom function'),
            description: '',
        };
    },
    onchange: window.Blockly.Blocks.procedures_callnoreturn.onchange,
    getProcedureDefinition: window.Blockly.Blocks.procedures_callnoreturn.getProcedureDefinition,
    getProcedureCall: window.Blockly.Blocks.procedures_callnoreturn.getProcedureCall,
    renameProcedure: window.Blockly.Blocks.procedures_callnoreturn.renameProcedure,
    setProcedureParameters: window.Blockly.Blocks.procedures_callnoreturn.setProcedureParameters,
    updateShape: window.Blockly.Blocks.procedures_callnoreturn.updateShape,
    mutationToDom: window.Blockly.Blocks.procedures_callnoreturn.mutationToDom,
    domToMutation: window.Blockly.Blocks.procedures_callnoreturn.domToMutation,
    getVarModels: window.Blockly.Blocks.procedures_callnoreturn.getVarModels,
    customContextMenu: window.Blockly.Blocks.procedures_callnoreturn.customContextMenu,
    defType: 'procedures_defreturn',
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.procedures_callreturn = block => {
    // eslint-disable-next-line no-underscore-dangle
    const functionName = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'),
        window.Blockly.Procedures.CATEGORY_NAME
    );
    const args = block.arguments.map(
        (arg, i) =>
            window.Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                `ARG${i}`,
                window.Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
            ) || 'null'
    );

    const code = `${functionName}(${args.join(', ')})`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
