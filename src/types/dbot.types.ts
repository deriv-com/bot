export type TBotSkeleton = {
    interpreter: unknown;
    workspace: window.Blockly.WorkspaceSvg | null;
    before_run_funcs: (() => boolean)[];
    initWorkspace: (
        public_path: string,
        store: unknown,
        // api_helpers_store: unknown,
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
    disableBlocksRecursively: (block: window.Blockly.Block) => void;
    checkForErroredBlocks: () => boolean;
    centerAndHighlightBlock: (block_id: string, should_animate?: boolean) => void;
    unHighlightAllBlocks: () => void;
    checkForRequiredBlocks: () => boolean;
    valueInputLimitationsListener: (event: unknown, force_check?: boolean) => void | boolean;
    getStrategySounds: () => unknown[];
    handleDragOver?: (event: unknown) => void;
    handleDropOver?: (event: unknown, handleFileChange: () => void) => void;
};
