export const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    const get_path = path.startsWith('/') ? path : `/${path}`;

    return `/${l.pathname.split('/')[1]}${get_path}`;
};

export function setBotPublicPath(path: string) {
    window.__webpack_public_path__ = '';
    window.__webpack_public_path__ = path; // eslint-disable-line no-global-assign
}

export const getImageLocation = (image_name: string) => `assets/images/${image_name}`;

setBotPublicPath(getUrlBase('/'));
