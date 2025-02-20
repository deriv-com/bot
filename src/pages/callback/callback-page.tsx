import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import { Callback } from '@deriv-com/auth-client';
import { Button } from '@deriv-com/ui';

const CallbackPage = () => {
    return (
        <Callback
            onSignInSuccess={async (tokens: Record<string, string>) => {
                const accountsList: Record<string, string> = {};
                const clientAccounts: Record<string, { loginid: string; token: string; currency: string }> = {};

                for (const [key, value] of Object.entries(tokens)) {
                    if (key.startsWith('acct')) {
                        const tokenKey = key.replace('acct', 'token');
                        if (tokens[tokenKey]) {
                            accountsList[value] = tokens[tokenKey];
                            clientAccounts[value] = {
                                loginid: value,
                                token: tokens[tokenKey],
                                currency: '',
                            };
                        }
                    } else if (key.startsWith('cur')) {
                        const accKey = key.replace('cur', 'acct');
                        if (tokens[accKey]) {
                            clientAccounts[tokens[accKey]].currency = value;
                        }
                    }
                }

                localStorage.setItem('accountsList', JSON.stringify(accountsList));
                localStorage.setItem('clientAccounts', JSON.stringify(clientAccounts));

                let is_token_set = false;
                const api = await generateDerivApiInstance();
                if (api) {
                    const { authorize, error } = await api.authorize(tokens.token1);
                    localStorage.setItem('callback_token', authorize.toString());
                    api.disconnect();
                    if (!error) {
                        const clientAccountsArray = Object.values(clientAccounts);
                        const firstId = authorize?.account_list[0]?.loginid;
                        const filteredTokens = clientAccountsArray.filter(account => account.loginid === firstId);
                        if (filteredTokens.length) {
                            localStorage.setItem('authToken', filteredTokens[0].token);
                            localStorage.setItem('active_loginid', filteredTokens[0].loginid);
                            is_token_set = true;
                        }
                    }
                }
                if (!is_token_set) {
                    localStorage.setItem('authToken', tokens.token1);
                    localStorage.setItem('active_loginid', tokens.acct1);
                }

                const query_param_currency = sessionStorage.getItem('query_param_currency');
                window.location.assign(query_param_currency ? `/?account=${query_param_currency}` : '/');
            }}
            renderReturnButton={() => {
                return (
                    <Button
                        className='callback-return-button'
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        {'Return to Bot'}
                    </Button>
                );
            }}
        />
    );
};

export default CallbackPage;
