import clsx from 'clsx';

import { useDevice } from '@deriv-com/ui';

import Footer from './footer';
import { Header } from './header';
import Body from './main-body';

import './layout.scss';

type TLayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<TLayoutProps> = ({ children }) => {
    const { isDesktop } = useDevice();

    return (
        <div className={clsx('layout', { responsive: isDesktop })}>
            <Header />
            <Body>{children}</Body>
            <Footer />
        </div>
    );
};

export default Layout;
