import { useEffect } from 'react';
import { useEventListener, useMap } from 'usehooks-ts';
import { useDevice } from '@deriv-com/ui';
import useQueryString from './useQueryString';

type TUseModalManagerConfig = {
    shouldReinitializeModals?: boolean;
};

type TShowModalOptions = {
    shouldClearPreviousModals?: boolean;
    shouldStackModals?: boolean;
};

type THideModalOptions = {
    shouldHideAllModals?: boolean;
    shouldHidePreviousModals?: boolean;
};

const MODAL_QUERY_SEPARATOR = ',';

/**
 * Hook to manage states for showing/hiding multiple modals
 * Use this hook when you are managing more than 1 modal to show/hide
 *
 * @example
 * ```
 * const {isModalOpenFor, showModal} = useModalManager()
 *
 * return (
 *      <>
 *          <ModalA isOpen={isModalOpenFor('ModalA')} />
 *          <ModalB isOpen={isModalOpenFor('ModalB')} />
 *          <button onClick={() => showModal('ModalA')}>...</button>
 *      </>
 * )
 * ```
 */
export default function useModalManager(config?: TUseModalManagerConfig) {
    const { deleteQueryString, queryString, setQueryString } = useQueryString();
    const { isDesktop } = useDevice();

    const [isModalOpenScopes, actions] = useMap();

    const syncModalParams = () => {
        if (!queryString.modal) actions.setAll([]);

        if (config?.shouldReinitializeModals !== undefined && config.shouldReinitializeModals === false) {
            deleteQueryString('modal');
        } else {
            // sync modal query string in the URL with the initial modal open scopes
            const modalHash = queryString.modal;
            if (modalHash) {
                const modalKeys = modalHash.split(MODAL_QUERY_SEPARATOR);
                const currentModal = modalKeys.slice(-1)[0];
                actions.setAll([]);
                modalKeys.forEach(modalKey => {
                    actions.set(modalKey, !isDesktop);
                });
                actions.set(currentModal, true);
            }
        }
    };

    useEffect(() => {
        // only sync the modal open states with the URL params when initial mount...
        syncModalParams();
    }, []);

    useEffect(() => {
        if (!queryString?.modal) actions.reset();
    }, [queryString?.modal]);

    // ...or when the user clicks the back button
    useEventListener('popstate', () => {
        syncModalParams();
    });

    const hideModal = (options?: THideModalOptions) => {
        const modalHash = queryString.modal;

        if (modalHash) {
            let modalIds = modalHash.split(MODAL_QUERY_SEPARATOR);
            if (options?.shouldHideAllModals) {
                isModalOpenScopes.forEach((_, key) => {
                    actions.set(key, false);
                    deleteQueryString('modal');
                });
            } else if (options?.shouldHidePreviousModals) {
                if (modalIds.length > 1) {
                    const firstModalId = modalIds.shift();
                    modalIds.forEach(modalId => {
                        actions.set(modalId, false); // Hide each modal except the first
                    });
                    modalIds = [firstModalId ?? '']; // Reset modalIds to only contain the first modal ID

                    setQueryString({
                        modal: firstModalId,
                    });
                } else if (modalIds.length === 1) {
                    setQueryString({
                        modal: modalIds[0],
                    });
                } else {
                    deleteQueryString('modal');
                }
            } else {
                const currentModalId = modalIds.pop();
                const previousModalId = modalIds.slice(-1)[0];
                if (previousModalId) {
                    actions.set(currentModalId, false);
                    actions.set(previousModalId, true);
                } else {
                    actions.set(currentModalId, false);
                }
                if (modalIds.length === 0) {
                    deleteQueryString('modal');
                } else {
                    setQueryString({
                        modal: modalIds.join(MODAL_QUERY_SEPARATOR),
                    });
                }
            }
        }
    };

    /**
     * Keep the previous modal ids in the URL query strings separated by ','
     * This way, when there is a new modal to be shown, we can track the previous modals from the query string based on the last 2 segments
     *
     * Example:
     * - ModalA is shown, URL becomes /...?modal=ModalA (current modal is ModalA, there is no previous modal)
     * - ModalB is shown next, URL becomes /...?modal=ModalA,ModalB (current modal is ModalB, previous modal is ModalA)
     * - ModalC is shown next, URL becomes /...?modal=ModalA,ModalB,ModalC (current modal is ModalC, previous modal is ModalB)
     * - ModalC is closed, URL becomes becomes /...?modal=modalA,ModalB (current modal is ModalB, previous modal is ModalA)
     */
    const showModal = (modalId: string, options?: TShowModalOptions) => {
        const modalHash = queryString.modal;

        if (modalHash) {
            const modalIds = modalHash.split(MODAL_QUERY_SEPARATOR);
            const currentModalId = modalIds.slice(-1)[0];

            if (currentModalId === modalId) return;
            // If shouldStackModals is false, clear the modal stack
            if (options?.shouldStackModals === false) {
                actions.set(currentModalId, false);
            } else {
                // set the previous modal open state to false if shouldStackModals is false, otherwise set it to true (default true for mobile)
                // set the new modal open state to true
                actions.set(currentModalId, options?.shouldStackModals || !isDesktop);
            }
            actions.set(modalId, true);
            // push the state of the new modal to the hash
            modalIds.push(modalId);
            setQueryString({
                modal: options?.shouldClearPreviousModals ? modalId : modalIds.join(MODAL_QUERY_SEPARATOR),
            });
        } else {
            actions.set(modalId, true);
            setQueryString({
                modal: modalId,
            });
        }
    };

    const isModalOpenFor = (modalKey: string) => {
        return isModalOpenScopes.get(modalKey) || false;
    };

    return {
        hideModal,
        isModalOpenFor,
        showModal,
    };
}
