import React from 'react';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { Loader } from '@deriv-com/ui';

type AuthLoadingWrapperProps = {
    children: React.ReactNode;
};

const AuthLoadingWrapper = ({ children }: AuthLoadingWrapperProps) => {
    const { isSingleLoggingIn } = useOauth2();

    if (isSingleLoggingIn) {
        return <Loader isFullScreen />;
    }

    return <>{children}</>;
};

export default AuthLoadingWrapper;
