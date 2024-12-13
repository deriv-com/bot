export const tabs_title = Object.freeze({
    TAB_LOCAL: 'local_tab',
    TAB_GOOGLE: 'google_tab',
    TAB_RECENT: 'recent_tab',
});

export const clearInjectionDiv = (el_ref?: HTMLElement) => {
    const parent_element = el_ref;
    const child_element = el_ref?.getElementsByClassName('injectionDiv');
    if (parent_element && child_element && child_element?.length > 1) {
        parent_element?.removeChild(child_element[0]);
    }
};
