import { useAuthData } from '@deriv-com/api-hooks';
import { Button } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';

import './header.scss';

export const Header = () => {
    const { isAuthorized, activeLoginid, logout } = useAuthData();
    const { getOauthURL } = URLUtils;

    return (
        <header className='header'>
            <div>
                {!(isAuthorized || activeLoginid) ? (
                    <div>
                        <Button
                            size='sm'
                            variant='outlined'
                            color='primary-light'
                            onClick={() => {
                                window.location.href = getOauthURL();
                            }}
                        >
                            Login
                        </Button>
                    </div>
                ) : (
                    <Button size='sm' variant='outlined' color='primary-light' onClick={logout}>
                        Logout
                    </Button>
                )}
            </div>
        </header>
    );
};
