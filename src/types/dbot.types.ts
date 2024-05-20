// TODO: need to convert Dbot class to TS and write complete types
export type TBotSkeleton = {
    interpreter: unknown;
    workspace: Blockly.WorkspaceSvg | null;
    before_run_funcs: (() => boolean)[];
    initWorkspace: (
        public_path: string,
        store: unknown,
        api_helpers_store: unknown,
        is_mobile: boolean
    ) => Promise<void>;
    saveRecentWorkspace: () => void;
    addBeforeRunFunction: (func: () => void) => void;
    shouldRunBot: () => boolean;
    runBot: () => void;
    generateCode: (limitations?: Record<string, unknown>) => string;
    stopBot: () => void;
    terminateBot: () => void;
    terminateConnection: () => void;
    unselectBlocks: () => boolean;
    disableStrayBlocks: () => boolean;
    disableBlocksRecursively: (block: Blockly.Block) => void;
    checkForErroredBlocks: () => boolean;
    centerAndHighlightBlock: (block_id: string, should_animate?: boolean) => void;
    unHighlightAllBlocks: () => void;
    checkForRequiredBlocks: () => boolean;
    valueInputLimitationsListener: (event: unknown, force_check?: boolean) => void | boolean;
    getStrategySounds: () => unknown[];
    handleDragOver?: (event: unknown) => void;
    handleDropOver?: (event: unknown, handleFileChange: () => void) => void;
};
