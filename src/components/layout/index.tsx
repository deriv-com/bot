import clsx from 'clsx';
import { Outlet } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import Footer from './footer';
import AppHeader from './header';
import Body from './main-body';
import './layout.scss';

const Layout = () => {
    const { isDesktop } = useDevice();
    const isCallbackPage = window.location.pathname === '/callback';

    return (
        <div className={clsx('layout', { responsive: isDesktop })}>
            {!isCallbackPage && <AppHeader />}
            <Body>
                <Outlet />
            </Body>
            {isDesktop && <Footer />}
        </div>
    );
};

export default Layout;
