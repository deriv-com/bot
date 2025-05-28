import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { generateOAuthURL } from '@/components/shared';
import { removeCookies } from '@/components/shared/utils/storage/storage';
import { isStaging as isStaging_util } from '@/components/shared/utils/url/helpers';
import { api_base } from '@/external/bot-skeleton';
import { setAuthData } from '@/external/bot-skeleton/services/api/observables/connection-status-stream';
import { requestSessionActive } from '@deriv-com/auth-client';

type UseTMBReturn = {
    handleLogout: () => void;
    isOAuth2Enabled: boolean;
    is_tmb_enabled: boolean;
    onRenderTMBCheck: () => Promise<void>;
    isTmbEnabled: () => Promise<boolean>;
};

interface TokenItem {
    loginid?: string;
    token?: string;
    cur?: string;
}

const TMBState = {
    isInitialized: false,
    checkInProgress: false,
};

const useTMB = (): UseTMBReturn => {
    const hasLoggedRef = useRef(false);

    if (!hasLoggedRef.current) {
        hasLoggedRef.current = true;
    }

    const isEndpointPage = useMemo(() => window.location.pathname.includes('endpoint'), []);
    const isCallbackPage = useMemo(() => window.location.pathname === '/callback', []);
    const domains = useMemo(
        () => ['deriv.com', 'deriv.dev', 'binary.sx', 'pages.dev', 'localhost', 'deriv.be', 'deriv.me'],
        []
    );
    const currentDomain = useMemo(() => window.location.hostname.split('.').slice(-2).join('.'), []);

    const isProduction = useMemo(() => process.env.APP_ENV === 'production', []);
    const isStaging = useMemo(() => process.env.APP_ENV === 'staging', []);
    const isOAuth2Enabled = useMemo(() => isProduction || isStaging, [isProduction, isStaging]);
    const [is_tmb_enabled, setIsTmbEnabled] = useState(JSON.parse(localStorage.getItem('is_tmb_enabled') || 'false'));
    const authTokenRef = useRef(localStorage.getItem('authToken'));

    const isTmbEnabled = useCallback(async () => {
        const storedValue = localStorage.getItem('is_tmb_enabled');
        try {
            const url = isStaging_util()
                ? 'https://app-config-staging.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
                : 'https://app-config-prod.firebaseio.com/remote_config/oauth/is_tmb_enabled.json';
            const response = await fetch(url);
            const result = await response.json();

            const isEnabled = storedValue !== null ? storedValue === 'true' : !!result.dbot;
            // Update localStorage with the result so non-React components can access it
            localStorage.setItem('is_tmb_enabled', isEnabled.toString());
            return isEnabled;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            // by default it will fallback to true if firebase error happens
            const isEnabled = storedValue !== null ? storedValue === 'true' : true;
            // Update localStorage with the result so non-React components can access it
            localStorage.setItem('is_tmb_enabled', 'false');
            return isEnabled;
        }
    }, []);

    useEffect(() => {
        if (!TMBState.isInitialized) {
            TMBState.isInitialized = true;
        }

        // Check TMB status on mount
        isTmbEnabled().then(enabled => {
            setIsTmbEnabled(enabled);
        });
    }, [isTmbEnabled]);

    const logout = useCallback(async () => {
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('active_loginid');
            localStorage.removeItem('clientAccounts');
            localStorage.removeItem('accountsList');
            // Redirect to OAuth authentication instead of just logging out
            window.location.replace(generateOAuthURL());
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to redirect to OAuth:', error);
            return handleLogout();
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            if (authTokenRef.current) await logout();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to logout', error);
        }
        removeCookies('affiliate_token', 'affiliate_tracking', 'utm_data', 'onfido_token', 'gclid');
        if (domains.includes(currentDomain)) {
            Cookies.set('logged_state', 'false', {
                domain: currentDomain,
                expires: 30,
                path: '/',
                secure: true,
            });
        }
    }, [logout, domains, currentDomain]);

    const getActiveSessions = useCallback(async () => {
        try {
            return await requestSessionActive();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to get active sessions', error);
        }
    }, []);

    const processTokens = useCallback((tokens: TokenItem[]) => {
        const accountsList: Record<string, string> = {};
        const clientAccounts: Record<string, { loginid: string; token: string; currency: string }> = {};

        tokens.forEach((token: TokenItem) => {
            if (token.loginid && token.token) {
                accountsList[token.loginid] = token.token;
                clientAccounts[token.loginid] = {
                    loginid: token.loginid,
                    token: token.token,
                    currency: token.cur || '',
                };
            }
        });

        return { accountsList, clientAccounts };
    }, []);

    // Get account from URL query parameter
    const getAccountFromURL = useCallback(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('account');
    }, []);

    const onRenderTMBCheck = useCallback(async () => {
        if (isCallbackPage) return;
        if (TMBState.checkInProgress) return;

        TMBState.checkInProgress = true;

        try {
            const activeSessions = await getActiveSessions();

            if (!activeSessions?.active && !isEndpointPage) {
                console.error('Failed to get active sessions: No data returned');
                TMBState.checkInProgress = false;

                try {
                    window.location.replace(generateOAuthURL());
                } catch (error) {
                    console.error('Failed to redirect to OAuth:', error);
                    return handleLogout();
                }
                return;
            } else if (activeSessions?.active) {
                if (Array.isArray(activeSessions.tokens) && activeSessions.tokens.length > 0) {
                    const { accountsList, clientAccounts } = processTokens(activeSessions.tokens);

                    localStorage.setItem('accountsList', JSON.stringify(accountsList));
                    localStorage.setItem('clientAccounts', JSON.stringify(clientAccounts));

                    const accountParam = getAccountFromURL();

                    let selectedToken = activeSessions.tokens[0];
                    if (accountParam) {
                        const matchingToken = activeSessions.tokens.find(
                            (token: TokenItem) => token.cur === accountParam
                        );
                        if (matchingToken) {
                            selectedToken = matchingToken;
                        }
                    }

                    if (selectedToken.loginid && selectedToken.token) {
                        localStorage.setItem('authToken', selectedToken.token);
                        localStorage.setItem('active_loginid', selectedToken.loginid);

                        authTokenRef.current = selectedToken.token;

                        if (api_base) {
                            api_base.init(true).then(() => {
                                if (selectedToken.loginid) {
                                    setAuthData({
                                        loginid: selectedToken.loginid,
                                        currency: selectedToken.cur || '',
                                        token: selectedToken.token, // Keeping token property, despite TypeScript error Need to check this later
                                    });
                                }
                            });
                        }
                    }
                }

                if (domains.includes(currentDomain)) {
                    Cookies.set('logged_state', 'true', {
                        domain: currentDomain,
                        expires: 30,
                        path: '/',
                        secure: true,
                    });
                }
            }
        } finally {
            TMBState.checkInProgress = false;
        }
    }, [isCallbackPage, getActiveSessions, isEndpointPage, handleLogout, processTokens, domains, currentDomain]);

    return useMemo(
        () => ({
            handleLogout,
            isOAuth2Enabled,
            is_tmb_enabled,
            onRenderTMBCheck,
            isTmbEnabled,
        }),
        [handleLogout, isOAuth2Enabled, is_tmb_enabled, onRenderTMBCheck, isTmbEnabled]
    );
};

export default useTMB;
