import { Callback } from '@deriv-com/auth-client';
import { Button } from '@deriv-com/ui';

const CallbackPage = () => {
    return (
        <Callback
            onSignInSuccess={(tokens: Record<string, string>) => {
                const accountsList: Record<string, string> = {};

                for (const [key, value] of Object.entries(tokens)) {
                    if (key.startsWith('acct')) {
                        const tokenKey = key.replace('acct', 'token');
                        if (tokens[tokenKey]) {
                            accountsList[value] = tokens[tokenKey];
                        }
                    }
                }

                localStorage.setItem('accountsList', JSON.stringify(accountsList));

                localStorage.setItem('authToken', tokens.token1);
                localStorage.setItem('active_loginid', tokens.acct1);

                window.location.assign('/');
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
