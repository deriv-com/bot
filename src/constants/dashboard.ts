// import { localize } from '@/utils/tmp/dummy';

export const STRATEGY = {
    EDIT: 'edit',
    SAVE: 'save',
    DELETE: 'delete',
    PREVIEW: 'preview',
    PREVIEW_LIST: 'list',
    INIT: 'init',
};

export const MENU_DESKTOP = [
    {
        type: STRATEGY.EDIT,
        icon: 'icons/ic-open.svg',
    },
    {
        type: STRATEGY.SAVE,
        icon: 'icons/ic-save.svg',
    },
    {
        type: STRATEGY.DELETE,
        icon: 'icons/ic-delete.svg',
    },
];

export const CONTEXT_MENU_MOBILE = [
    {
        type: STRATEGY.PREVIEW_LIST,
        icon: 'icons/ic-preview.svg',
        label: 'Preview',
    },
    {
        type: STRATEGY.EDIT,
        icon: 'icons/ic-edit.svg',
        label: 'Edit',
    },
    {
        type: STRATEGY.SAVE,
        icon: 'icons/ic-save.svg',
        label: 'Save',
    },
    {
        type: STRATEGY.DELETE,
        icon: 'icons/ic-delete.svg',
        label: 'Delete',
    },
];
