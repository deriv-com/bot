import { useEffect } from 'react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { useDevice } from '@deriv-com/ui';
import Footer from './footer';
import AppHeader from './header';
import Body from './main-body';
import './layout.scss';

function hasAllKeys(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = new Set(Object.keys(obj2));
    return keys1.every(key => keys2.has(key));
}

const Layout = () => {
    const { isDesktop } = useDevice();

    const { isOAuth2Enabled } = useOauth2();

    const isCallbackPage = window.location.pathname === '/callback';
    const isLoggedInCookie = Cookies.get('logged_state') === 'true';
    const isEndpointPage = window.location.pathname.includes('endpoint');
    const checkClientAccount = JSON.parse(localStorage.getItem('clientAccounts') ?? '{}');
    const checkAccountList = JSON.parse(localStorage.getItem('accountList') ?? '{}');
    const cookiesAccount = JSON.parse(Cookies.get('client.accounts') ?? '{}');
    const isAccountPresent = hasAllKeys(checkClientAccount, cookiesAccount);

    console.log('clientAccounts', { checkClientAccount, checkAccountList, isAccountPresent });

    useEffect(() => {
        if (isLoggedInCookie && isOAuth2Enabled && !isEndpointPage && !isCallbackPage && !isAccountPresent) {
            console.log('requestOidcAuthentication');
            requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        }
    }, [isLoggedInCookie, isOAuth2Enabled, isEndpointPage, isCallbackPage, isAccountPresent]);

    return (
        <div className={clsx('layout', { responsive: isDesktop })}>
            {!isCallbackPage && <AppHeader />}
            <Body>
                <Outlet />
            </Body>
            {!isCallbackPage && isDesktop && <Footer />}
        </div>
    );
};

export default Layout;
