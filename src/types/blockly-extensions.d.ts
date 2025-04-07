// Type declarations for Blockly extensions used in the project
interface Window {
    Blockly: {
        derivWorkspace?: {
            getTopBlocks: () => any[];
            current_strategy_id?: string;
        };
        Xml?: {
            workspaceToDom: (workspace: any) => any;
            domToText: (dom: any) => string;
        };
        utils?: {
            xml?: {
                textToDom: (text: string) => any;
            };
            idGenerator?: {
                genUid: () => string;
            };
            genUid?: () => string;
        };
        mainWorkspace?: any;
    };
}
