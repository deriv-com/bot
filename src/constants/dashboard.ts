import { localize } from '@/utils/tmp/dummy';

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
        icon: '/ic-open.svg',
    },
    {
        type: STRATEGY.SAVE,
        icon: '/ic-save.svg',
    },
    {
        type: STRATEGY.DELETE,
        icon: '/ic-delete.svg',
    },
];

export const CONTEXT_MENU_MOBILE = [
    {
        type: STRATEGY.PREVIEW_LIST,
        icon: 'IcPreview',
        label: localize('Preview'),
    },
    {
        type: STRATEGY.EDIT,
        icon: 'IcEdit',
        label: localize('Edit'),
    },
    {
        type: STRATEGY.SAVE,
        icon: 'IcSave',
        label: localize('Save'),
    },
    {
        type: STRATEGY.DELETE,
        icon: 'IcDelete',
        label: localize('Delete'),
    },
];
