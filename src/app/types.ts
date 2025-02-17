export type Account = {
    loginid: string;
    token: string;
    currency?: string;
};

export type AccountsList = {
    [key: string]: string;
};

export type ClientAccounts = {
    [key: string]: Account;
};

export type ActiveAccount = {
    currency?: string;
    loginid: string;
    token: string;
};

export type LoginInfo = {
    currency?: string;
    loginid: string;
    token: string;
};

export type AuthorizeResponse = {
    authorize?: {
        account_list: Array<{
            loginid: string;
        }>;
    };
    error?: unknown;
};

export type ApiInstance = {
    authorize: (token: string) => Promise<AuthorizeResponse>;
    disconnect: () => void;
};

export type LoginInfoItem = {
    token: string;
    loginid: string;
};

export type LocalStorageToken = {
    loginInfo: LoginInfoItem[];
    paramsToDelete: string[];
};
