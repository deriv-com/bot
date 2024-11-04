// connection-status-stream.ts (This will manage our observable stream)
import { BehaviorSubject } from 'rxjs';
import { TAuthData } from '@/types/api-types';

export enum CONNECTION_STATUS {
    OPENED = 'opened',
    CLOSED = 'closed',
    UNKNOWN = 'unknown',
}

// Initial connection status will be 'unknown'
export const connectionStatus$ = new BehaviorSubject<string>('unknown');
export const isAuthorizing$ = new BehaviorSubject<boolean>(false);
export const isAuthorized$ = new BehaviorSubject<boolean>(false);
export const account_list$ = new BehaviorSubject<TAuthData['account_list']>([]);
export const authData$ = new BehaviorSubject<TAuthData | null>(null);

// Create functions to easily update status
export const setConnectionStatus = (status: CONNECTION_STATUS) => {
    connectionStatus$.next(status);
};

// Set the authorized status
export const setIsAuthorized = (isAuthorized: boolean) => {
    isAuthorized$.next(isAuthorized);
};

// Set the authorizing status
export const setIsAuthorizing = (isAuthorizing: boolean) => {
    isAuthorizing$.next(isAuthorizing);
};

// Set the account list
export const setAccountList = (accountList: TAuthData['account_list']) => {
    account_list$.next(accountList);
};

// Set the auth data
export const setAuthData = (authData: TAuthData | null) => {
    if (authData?.loginid) {
        localStorage.setItem('active_loginid', authData.loginid);
    }
    authData$.next(authData);
};
