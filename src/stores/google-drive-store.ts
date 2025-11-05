import { action, makeObservable, observable } from 'mobx';
import { botNotification } from '@/components/bot-notification/bot-notification';
import { notification_message } from '@/components/bot-notification/bot-notification-utils';
import { button_status } from '@/constants/button-status';
import { config, importExternal } from '@/external/bot-skeleton';
import { getInitialLanguage, localize } from '@deriv-com/translations';
import {
    rudderStackSendUploadStrategyCompletedEvent,
    rudderStackSendUploadStrategyFailedEvent,
} from '../analytics/rudderstack-common-events';
import { getStrategyType } from '../analytics/utils';
import RootStore from './root-store';

export type TErrorWithStatus = Error & { status?: number; result?: { error: { message: string } } };

export type TFileOptions = {
    content: string;
    mimeType: string;
    name: string;
};

export type TPickerCallbackResponse = {
    action: string;
    docs: { id: string; name: string; driveError?: string }[];
};

export default class GoogleDriveStore {
    root_store: RootStore;
    bot_folder_name: string;
    client_id: string | undefined;
    app_id: string | undefined;
    api_key: string | undefined;
    scope: string | undefined;
    discovery_docs = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: any;
    access_token: string;
    upload_id?: string;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_authorised: observable,
            upload_id: observable,
            is_google_drive_token_valid: observable,
            setIsAuthorized: action.bound,
            saveFile: action.bound,
            loadFile: action.bound,
            setKey: action.bound,
            initialise: action.bound,
            signIn: action.bound,
            signOut: action.bound,
            getPickerLanguage: action.bound,
            checkFolderExists: action.bound,
            createSaveFilePicker: action.bound,
            createLoadFilePicker: action.bound,
            showGoogleDriveFilePicker: action.bound,
            setGoogleDriveTokenValid: action.bound,
            verifyGoogleDriveAccessToken: action.bound,
            onDriveConnect: action,
        });

        this.root_store = root_store;
        this.bot_folder_name = `Binary Bot - ${localize('Strategies')}`;
        this.setKey();
        this.client = null;
        this.access_token = localStorage.getItem('google_access_token') ?? '';
        setTimeout(() => {
            importExternal('https://accounts.google.com/gsi/client').then(() => this.initialiseClient());
            importExternal('https://apis.google.com/js/api.js').then(() => this.initialise());
        }, 3000);
    }

    is_google_drive_token_valid = true;
    is_authorised = !!localStorage.getItem('google_access_token');

    setGoogleDriveTokenValid = (is_google_drive_token_valid: boolean) => {
        this.is_google_drive_token_valid = is_google_drive_token_valid;
    };

    setKey = () => {
        const { SCOPE, DISCOVERY_DOCS } = config().GOOGLE_DRIVE;
        this.client_id = process.env.GD_CLIENT_ID;
        this.app_id = process.env.GD_APP_ID;
        this.api_key = process.env.GD_API_KEY;
        this.scope = SCOPE;
        this.discovery_docs = DISCOVERY_DOCS;
    };

    initialise = () => {
        gapi.load('client:picker', () => gapi.client.load(this.discovery_docs));
    };

    setGoogleDriveTokenExpiry = (seconds: number) => {
        const currentEpochTime = Math.floor(Date.now() / 1000);
        const expiry_time = currentEpochTime + seconds;
        localStorage.setItem('google_access_token_expiry', expiry_time.toString());
    };

    initialiseClient = () => {
        this.client = google.accounts.oauth2.initTokenClient({
            client_id: this.client_id,
            scope: this.scope,
            callback: (response: { expires_in?: number; access_token?: string; error?: any }) => {
                if (response?.access_token && !response?.error && response?.expires_in) {
                    this.access_token = response.access_token;
                    this.setIsAuthorized(true);
                    localStorage.setItem('google_access_token', response.access_token);
                    this.setGoogleDriveTokenExpiry(response.expires_in);
                    this.setGoogleDriveTokenValid(true);
                }
            },
        });
    };

    setIsAuthorized(is_authorized: boolean) {
        this.is_authorised = is_authorized;
    }
    private cleanupInvalidToken() {
        this.signOut();
        this.setGoogleDriveTokenValid(false);
        localStorage.removeItem('google_access_token_expiry');
        localStorage.removeItem('google_access_token');
        botNotification(notification_message().google_drive_error, undefined, { closeButton: false });
    }

    verifyGoogleDriveAccessToken = async () => {
        if (!this.access_token) return 'not_verified';

        // Use Google API as single source of truth (eliminates race conditions)
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
                headers: {
                    Authorization: `Bearer ${this.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Token validation failed');
            }

            const tokenInfo = await response.json();
            if (tokenInfo.error) {
                throw new Error(tokenInfo.error_description || 'Invalid token');
            }

            return 'verified';
        } catch (error) {
            this.cleanupInvalidToken();
            return 'not_verified';
        }
    };

    async signIn() {
        if (!this.is_authorised) {
            await this.client.requestAccessToken();
        }
    }

    async signOut() {
        if (this.access_token) {
            await window?.gapi?.client?.setToken({ access_token: '' });
            if (localStorage.getItem('google_access_token')) {
                await window?.google?.accounts?.oauth2?.revoke(this.access_token);
                localStorage?.removeItem('google_access_token');
            }
            this.access_token = '';
        }
        this.setIsAuthorized(false);
    }

    // eslint-disable-next-line class-methods-use-this
    getPickerLanguage() {
        const language = getInitialLanguage();

        if (language === 'zhTw') {
            return 'zh-TW';
        } else if (language === 'zhCn') {
            return 'zh-CN';
        }
        return language;
    }

    async saveFile(options: TFileOptions) {
        try {
            await this.signIn();
            if (this.access_token) gapi.client.setToken({ access_token: this.access_token });
            await this.checkFolderExists();
            await this.createSaveFilePicker('application/vnd.google-apps.folder', localize('Select a folder'), options);
        } catch (err) {
            if ((err as TErrorWithStatus).status === 401) {
                this.signOut();
                botNotification(notification_message().google_drive_error, undefined, { closeButton: false });
            } else {
                // Notify user of other errors
                botNotification(localize('Failed to save file to Google Drive. Please try again.'), undefined, {
                    closeButton: true,
                });
            }
            throw err; // Re-throw so caller knows it failed
        }
    }

    async loadFile() {
        if (!this.is_google_drive_token_valid) return;
        await this.signIn();

        if (this.access_token) gapi.client.setToken({ access_token: this.access_token });
        // Token validation is now handled in verifyGoogleDriveAccessToken() - no need for redundant API call

        const xml_doc = await this.createLoadFilePicker(
            'text/xml,application/xml',
            localize('Select a Deriv Bot Strategy')
        );

        return xml_doc;
    }

    async checkFolderExists() {
        const { files } = gapi.client.drive;
        const response = await files.list({ q: 'trashed=false' });
        const mime_type = 'application/vnd.google-apps.folder';
        const folder = response.result.files?.find(file => file.mimeType === mime_type);

        if (folder) {
            return;
        }

        await files.create({
            resource: {
                name: this.bot_folder_name,
                mimeType: mime_type,
            },
            fields: 'id',
        });
    }

    createSaveFilePicker(mime_type: string, title: string, options: TFileOptions) {
        const { setButtonStatus } = this.root_store.save_modal;
        return new Promise<void>((resolve, reject) => {
            const savePickerCallback = (data: TPickerCallbackResponse) => {
                if (data.action === google.picker.Action.PICKED) {
                    const folder_id = data.docs[0].id;
                    const strategy_file = new Blob([options.content], { type: options.mimeType });
                    const strategy_file_metadata = JSON.stringify({
                        name: options.name,
                        mimeType: options.mimeType,
                        parents: [folder_id],
                    });

                    const form_data = new FormData();
                    form_data.append('metadata', new Blob([strategy_file_metadata], { type: 'application/json' }));
                    form_data.append('file', strategy_file);

                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'json';
                    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
                    xhr.setRequestHeader('Authorization', `Bearer ${this.access_token}`);
                    xhr.setRequestHeader('Accept', 'application/json');
                    xhr.setRequestHeader('X-Goog-Upload-Protocol', 'multipart');

                    // Add comprehensive error handling for XHR request
                    xhr.timeout = 30000; // 30 seconds timeout

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            botNotification(localize('File saved successfully'), undefined, { closeButton: true });
                            setButtonStatus(button_status.NORMAL);
                            resolve();
                        } else if (xhr.status === 401) {
                            this.signOut();
                            botNotification(notification_message().google_drive_error, undefined, {
                                closeButton: false,
                            });
                            setButtonStatus(button_status.NORMAL);
                            reject(new Error('Authentication failed'));
                        } else {
                            const errorMsg = localize('Failed to save file. Please try again.');
                            botNotification(errorMsg, undefined, { closeButton: true });
                            setButtonStatus(button_status.NORMAL);
                            reject(new Error(errorMsg));
                        }
                    };

                    xhr.onerror = () => {
                        const errorMsg = localize('Network error occurred while saving file');
                        botNotification(errorMsg, undefined, { closeButton: true });
                        setButtonStatus(button_status.NORMAL);
                        reject(new Error(errorMsg));
                    };

                    xhr.ontimeout = () => {
                        const errorMsg = localize('Request timed out. Please try again.');
                        botNotification(errorMsg, undefined, { closeButton: true });
                        setButtonStatus(button_status.NORMAL);
                        reject(new Error(errorMsg));
                    };

                    xhr.send(form_data);
                } else if (data.action === google.picker.Action.CANCEL) {
                    setButtonStatus(button_status.NORMAL);
                    resolve(); // Resolve on cancel, not an error
                }
            };

            this.showGoogleDriveFilePicker(true, mime_type, title, savePickerCallback);
        });
    }

    onDriveConnect = async () => {
        if (this.is_authorised) {
            this.signOut();
        } else {
            this.signIn();
        }
    };

    createLoadFilePicker(mime_type: string, title: string) {
        return new Promise((resolve, reject) => {
            const loadPickerCallback = async (data: TPickerCallbackResponse) => {
                if (data.action === google.picker.Action.PICKED) {
                    const file = data.docs[0];
                    if (file?.driveError === 'NETWORK') {
                        rudderStackSendUploadStrategyFailedEvent({
                            upload_provider: 'google_drive' as any,
                            upload_id: this.upload_id,
                            upload_type: 'not_found',
                            error_message: 'File not found',
                            error_code: '404',
                        });
                    }

                    const file_name = file.name;
                    const fileId = file.id;
                    const { files } = gapi.client.drive;

                    try {
                        // Verify token is still valid before attempting download
                        const tokenStatus = await this.verifyGoogleDriveAccessToken();
                        if (tokenStatus !== 'verified') {
                            throw new Error('Access token is invalid or expired. Please re-authenticate.');
                        }

                        // Ensure gapi client has the current token
                        if (this.access_token) {
                            gapi.client.setToken({ access_token: this.access_token });
                        }

                        const response = await files.get({
                            fileId,
                            alt: 'media',
                        });

                        // Ensure we have valid XML content
                        if (!response.body || typeof response.body !== 'string') {
                            throw new Error('Invalid file content received');
                        }

                        // Improved XML validation with proper DOM parsing
                        try {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(response.body, 'text/xml');
                            const parserError = xmlDoc.getElementsByTagName('parsererror');
                            if (parserError.length > 0) {
                                throw new Error('Invalid XML structure');
                            }
                        } catch (e) {
                            throw new Error('File does not appear to be valid XML');
                        }

                        resolve({ xml_doc: response.body, file_name });
                        const upload_type = getStrategyType(response.body);
                        rudderStackSendUploadStrategyCompletedEvent({
                            upload_provider: 'google_drive',
                            upload_type,
                            upload_id: this.upload_id,
                        });
                    } catch (downloadError: any) {
                        // Handle specific error cases
                        let errorMessage = downloadError.message || 'Unknown error occurred';
                        let errorCode = '500';

                        if (downloadError.status === 403) {
                            errorMessage =
                                'Access denied. The file may not be accessible with current permissions. Please check file sharing settings or re-authenticate with broader permissions.';
                            errorCode = '403';
                        } else if (downloadError.status === 404) {
                            errorMessage =
                                'File not found. The file may have been deleted or you may not have permission to access it.';
                            errorCode = '404';
                        } else if (downloadError.status === 401) {
                            errorMessage = 'Authentication failed. Please sign out and sign in again.';
                            errorCode = '401';
                            // Force sign out on 401 errors
                            this.signOut();
                        }

                        // Add user notification for file load errors
                        botNotification(errorMessage, undefined, { closeButton: true });

                        rudderStackSendUploadStrategyFailedEvent({
                            upload_provider: 'google_drive' as any,
                            upload_id: this.upload_id,
                            upload_type: 'download_failed',
                            error_message: errorMessage,
                            error_code: errorCode,
                        });

                        // Use reject instead of throw to properly reject the Promise
                        reject(new Error(errorMessage));
                        return; // Exit early to prevent further execution
                    }
                }
            };

            this.showGoogleDriveFilePicker(false, mime_type, title, loadPickerCallback);
        });
    }

    showGoogleDriveFilePicker(
        is_save: boolean,
        mime_type: string,
        title: string,
        callback: (data: TPickerCallbackResponse) => void
    ) {
        const docs_view = new google.picker.DocsView();
        docs_view.setIncludeFolders(true);
        docs_view.setMimeTypes(mime_type);

        // Set to show only owned files without displaying the query in search box
        // Use setOwnedByMe() instead of setQuery() to apply filter in background
        docs_view.setOwnedByMe(true);

        if (is_save) {
            docs_view.setSelectFolderEnabled(true);
        }
        const picker = new google.picker.PickerBuilder();
        picker
            .setOrigin(`${window.location.protocol}//${window.location.host}`)
            .setTitle(localize(title))
            .setLocale(this.getPickerLanguage())
            .setAppId(this.app_id)
            .setOAuthToken(this.access_token)
            .addView(docs_view)
            .setDeveloperKey(this.api_key)
            .setSize(1051, 650)
            .setCallback(callback)
            .build()
            .setVisible(true);
    }
}
