let tmp_localize: any;

export const setLocalize = (localize: any) => {
    tmp_localize = localize;
};

export const localize = (tString: string, values?: Record<string, unknown>): string => {
    return tmp_localize(tString, values);
};
