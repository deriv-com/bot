export const waitForDomElement = (selector: string, observingParent?: Element) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
            return;
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(observingParent ?? document.body, {
            childList: true,
            subtree: true,
        });
    });
};
