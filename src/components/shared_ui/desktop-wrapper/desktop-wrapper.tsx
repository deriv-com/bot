import React from 'react';
import { isDesktop } from '@/components/shared/utils/screen';

type TDesktopProps = {
    children: React.ReactNode;
};

const Desktop = ({ children }: TDesktopProps) => {
    if (!isDesktop()) return null;
    return <React.Fragment>{children}</React.Fragment>;
};

export default Desktop;
