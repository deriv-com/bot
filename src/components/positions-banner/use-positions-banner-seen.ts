import React from 'react';

/**
 * Source of truth for whether the user has dismissed the mobile positions
 * banner modal. Backed by localStorage so it persists across sessions, and
 * exposed via a custom event so multiple subscribers (the modal itself, plus
 * suppressors like TourStartDialog) stay in sync within the same tab.
 *
 * Cross-tab updates already work for free via the native `storage` event,
 * but the most common case — modal and tour-start-dialog mounted in the
 * same tab — needs the custom event because `storage` doesn't fire in the
 * tab that triggered the write.
 */

export const POSITIONS_BANNER_SEEN_KEY = 'positions_banner_seen';
const EVENT_NAME = 'positions-banner-seen-change';

const readSeen = (): boolean => localStorage.getItem(POSITIONS_BANNER_SEEN_KEY) === 'true';

export const markPositionsBannerSeen = () => {
    localStorage.setItem(POSITIONS_BANNER_SEEN_KEY, 'true');
    window.dispatchEvent(new Event(EVENT_NAME));
};

export const usePositionsBannerSeen = (): boolean => {
    const [is_seen, setIsSeen] = React.useState<boolean>(readSeen);

    React.useEffect(() => {
        const handler = () => setIsSeen(readSeen());
        window.addEventListener(EVENT_NAME, handler);
        // Also pick up cross-tab dismissals.
        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener(EVENT_NAME, handler);
            window.removeEventListener('storage', handler);
        };
    }, []);

    return is_seen;
};
