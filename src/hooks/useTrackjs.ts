import { TrackJS } from 'trackjs';

const { TRACKJS_TOKEN } = process.env;

/**
 * Custom hook to initialize TrackJS.
 * @returns {Object} An object containing the `init` function.
 */
const useTrackjs = () => {
    const activeLoginid = '';
    const isProduction = process.env.NODE_ENV === 'production';
    const initTrackJS = () => {
        try {
            if (!TrackJS.isInstalled()) {
                TrackJS.install({
                    application: 'standalone-deriv-bot',
                    dedupe: false,
                    enabled: isProduction,
                    token: TRACKJS_TOKEN!,
                    userId: activeLoginid ?? 'undefined',
                    version: (document.querySelector('meta[name=version]') as HTMLMetaElement)?.content ?? 'undefined',
                });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize TrackJS', error);
        }
    };

    return { initTrackJS };
};

export default useTrackjs;
