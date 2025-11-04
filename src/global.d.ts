// Google Drive API Type Definitions
interface DriveFileListParams {
    pageSize?: number;
    fields?: string;
    q?: string;
}

interface DriveFileGetParams {
    fileId: string;
    alt?: string;
}

interface DriveFileCreateParams {
    resource?: {
        name?: string;
        mimeType?: string;
        parents?: string[];
    };
    fields?: string;
}

interface DriveFileListResponse {
    result: {
        files?: Array<{
            id: string;
            name: string;
            mimeType?: string;
        }>;
    };
}

interface DriveFileGetResponse {
    body: string;
    status?: number;
    headers?: Record<string, string>;
}

interface DriveFileCreateResponse {
    result: {
        id: string;
        name: string;
    };
}

interface TokenClientConfig {
    client_id: string | undefined;
    scope: string | undefined;
    callback: (response: {
        access_token?: string;
        expires_in?: number;
        error?: { error: string; error_description?: string };
    }) => void;
}

interface TokenClient {
    requestAccessToken: () => Promise<void>;
}

interface DocsView {
    setIncludeFolders: (include: boolean) => void;
    setMimeTypes: (types: string) => void;
    setOwnedByMe: (owned: boolean) => void;
    setSelectFolderEnabled: (enabled: boolean) => void;
    setQuery: (query: string) => void;
}

// Improved type safety for picker callback data
interface PickerData {
    action: string;
    docs: Array<{
        id: string;
        name: string;
        driveError?: string;
        mimeType?: string;
    }>;
}

interface PickerBuilder {
    setOrigin: (origin: string) => PickerBuilder;
    setTitle: (title: string) => PickerBuilder;
    setLocale: (locale: string) => PickerBuilder;
    setAppId: (appId: string | undefined) => PickerBuilder;
    setOAuthToken: (token: string) => PickerBuilder;
    addView: (view: DocsView) => PickerBuilder;
    setDeveloperKey: (key: string | undefined) => PickerBuilder;
    setSize: (width: number, height: number) => PickerBuilder;
    setCallback: (callback: (data: PickerData) => void) => PickerBuilder;
    build: () => { setVisible: (visible: boolean) => void };
}

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
                        list: (params: DriveFileListParams) => Promise<DriveFileListResponse>;
                        get: (params: DriveFileGetParams) => Promise<DriveFileGetResponse>;
                        create: (params: DriveFileCreateParams) => Promise<DriveFileCreateResponse>;
                    };
                };
            };
        };
        google: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: TokenClientConfig) => TokenClient;
                    revoke: (token: string) => Promise<void>;
                };
            };
            picker: {
                Action: {
                    PICKED: string;
                    CANCEL: string;
                };
                DocsView: new () => DocsView;
                PickerBuilder: new () => PickerBuilder;
            };
        };
    }

    const gapi: Window['gapi'];
    const google: Window['google'];
}

export {};
