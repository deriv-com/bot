import { RefObject } from 'react';
import useEventListener from './useEventListener';

type Handler = (event: MouseEvent) => void;
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    validationFn?: (event: MouseEvent) => boolean,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
    useEventListener(mouseEvent, event => {
        const el = ref?.current;

        // Do nothing if clicking ref's element or descendent elements
        if (!el || el.contains(event.target as Node)) {
            return;
        }

        if (validationFn && !validationFn(event)) return;

        handler(event);
    });
}
