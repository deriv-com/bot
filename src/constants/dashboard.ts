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
        icon: 'IcPreview',
        label: 'Preview',
    },
    {
        type: STRATEGY.EDIT,
        icon: 'IcEdit',
        label: 'Edit',
    },
    {
        type: STRATEGY.SAVE,
        icon: 'IcSave',
        label: 'Save',
    },
    {
        type: STRATEGY.DELETE,
        icon: 'IcDelete',
        label: 'Delete',
    },
];
