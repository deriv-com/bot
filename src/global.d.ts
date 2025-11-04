declare global {
    interface Window {
        __webpack_public_path__: string;
        Analytics: unknown;
        DD_RUM: object | undefined;
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
        DerivInterCom: {
            initialize: (config: IntercomConfig) => void;
        };
        Intercom: any;
        gapi: {
            load: (apis: string, callback: () => void) => void;
            client: {
                load: (discoveryDocs: string) => Promise<void>;
                setToken: (token: { access_token: string }) => void;
                drive: {
                    files: {
                        list: (params: any) => Promise<any>;
                        get: (params: any) => Promise<any>;
                        create: (params: any) => Promise<any>;
                    };
                };
            };
        };
        google: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: any) => any;
                    revoke: (token: string) => Promise<void>;
                };
            };
            picker: {
                Action: {
                    PICKED: string;
                    CANCEL: string;
                };
                DocsView: new () => any;
                PickerBuilder: new () => any;
            };
        };
    }

    const gapi: Window['gapi'];
    const google: Window['google'];
}

export {};
