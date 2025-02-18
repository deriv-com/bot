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

const Layout = () => {
    const { isDesktop } = useDevice();

    const { isOAuth2Enabled } = useOauth2();

    const isCallbackPage = window.location.pathname === '/callback';
    const isLoggedInCookie = Cookies.get('logged_state') === 'true';
    const isEndpointPage = window.location.pathname.includes('endpoint');
    const checkClientAccount = JSON.parse(localStorage.getItem('clientAccounts') ?? '{}');
    const checkAccountList = JSON.parse(localStorage.getItem('api_account_list') ?? '{}');
    const areAccountsEqual = Object.keys(checkClientAccount).length === Object.keys(checkAccountList).length;

    console.log('clientAccounts', {
        checkClientAccount,
        checkAccountList,
        areAccountsEqual,
    });

    useEffect(() => {
        if (isLoggedInCookie && isOAuth2Enabled && !isEndpointPage && !isCallbackPage) {
            console.log('requestOidcAuthentication');
            requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            });
        }
    }, [isLoggedInCookie, isOAuth2Enabled, isEndpointPage, isCallbackPage]);

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
