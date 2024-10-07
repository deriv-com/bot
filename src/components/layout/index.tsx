import React, { lazy, Suspense } from 'react';
import clsx from 'clsx';
import { useDevice } from '@deriv-com/ui';
import './layout.scss';

const Footer = lazy(() => import('./footer'));
const AppHeader = lazy(() => import('./header'));
const Body = lazy(() => import('./main-body'));

type TLayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<TLayoutProps> = ({ children }) => {
    const { isDesktop } = useDevice();

    return (
        <div className={clsx('layout', { responsive: isDesktop })}>
            <Suspense fallback={<div>Loading header...</div>}>
                <AppHeader />
            </Suspense>
            <Suspense fallback={<div>Loading content...</div>}>
                <Body>{children}</Body>
            </Suspense>
            {isDesktop && (
                <Suspense fallback={<div>Loading footer...</div>}>
                    <Footer />
                </Suspense>
            )}
        </div>
    );
};

export default Layout;
