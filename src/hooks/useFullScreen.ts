import { MouseEvent, useCallback, useEffect, useState } from 'react';

const fullScreenControls = {
    exit: ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'],
    request: ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'],
    screenChange: ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'],
    screenElement: ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'],
} as const;

const useFullScreen = () => {
    const [isInFullScreenMode, setFullScreenMode] = useState(false);
    const { exit, request, screenChange, screenElement } = fullScreenControls;

    const onFullScreen = useCallback(
        () => setFullScreenMode(screenElement.some(element => document[element as keyof Document])),
        [screenElement]
    );

    useEffect(() => {
        screenChange.forEach(event => {
            document.addEventListener(event, onFullScreen, false);
        });

        return () => {
            screenChange.forEach(event => {
                document.removeEventListener(event, onFullScreen, false);
            });
        };
    }, [onFullScreen, screenChange]);

    const toggleFullScreenMode = (event?: MouseEvent<HTMLButtonElement>) => {
        event?.stopPropagation();

        const exitFullScreen = exit.find(method => document[method as keyof Document]);
        const requestFullScreen = request.find(method => document.documentElement[method as keyof HTMLElement]);

        if (isInFullScreenMode && exitFullScreen) {
            (document[exitFullScreen as keyof Document] as Document['exitFullscreen'])();
        } else if (requestFullScreen) {
            (document.documentElement[requestFullScreen as keyof HTMLElement] as HTMLElement['requestFullscreen'])();
        } else {
            setFullScreenMode(false); // fullscreen API is not enabled
        }
    };

    return { toggleFullScreenMode };
};

export default useFullScreen;
