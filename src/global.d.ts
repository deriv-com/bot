declare global {
    interface Window {
        __webpack_public_path__: string;
        enable_freshworks_live_chat: boolean;
        Analytics: unknown;
        DD_RUM: object | undefined;
        FreshChat: {
            initialize: (config: FreshChatConfig) => void;
        };
        GrowthbookFeatures: { [key: string]: boolean };
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
            close_chat: VoidFunction;
        };
        LiveChatWidget: {
            call: (key: string, value?: object | string) => void;
            init: () => void;
            on: (
                key: string,
                callback: (data: { state: { availability: string; visibility: string } }) => void
            ) => void;
        };
        dataLayer: {
            push: (event: { [key: string]: boolean | number | string; event: string }) => void;
        };
        fcSettings: {
            [key: string]: unknown;
        };
        fcWidget: {
            close: VoidFunction;
            hide: VoidFunction;
            isInitialized: () => boolean;
            isLoaded: () => boolean;
            on: (key: string, callback: VoidFunction) => void;
            open: VoidFunction;
            setConfig: (config: Record<string, Record<string, unknown>>) => void;
            show: VoidFunction;
            user: {
                setLocale: (locale: string) => void;
                clear: VoidFunction;
            };
        };
        fcWidgetMessengerConfig: {
            config: Record<string, Record<string, unknown>>;
        };
    }
}

export {};
