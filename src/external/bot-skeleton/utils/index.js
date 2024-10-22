export { setColors } from '../scratch/hooks/colours';
export { getContractTypeName } from './contract';
export { timeSince } from './date-time-helper';
export { createError, trackAndEmitError } from './error';
export { handleError, initErrorHandlingListener, removeErrorHandlingEventListener } from './error-handling';
export { importExternal } from './html-helper';
export {
    convertStrategyToIsDbot,
    getSavedWorkspaces,
    removeExistingWorkspace,
    saveWorkspaceToRecent,
} from './local-storage';
export { observer } from './observer';
export { compareXml, extractBlocksFromXml, pipe, sortBlockChild } from './strategy-helper';
export { onWorkspaceResize } from './workspace';
