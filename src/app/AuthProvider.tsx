import { memo, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { GetLandingCompanyResult } from '@/stores/client-store';
import {
    useAuthData,
    useGetAccountStatus,
    useGetSettings,
    useLandingCompany,
    useWebsiteStatus,
} from '@deriv-com/api-hooks';

const AuthProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
    const { logout, isAuthorizing } = useAuthData();
    const { data: accountStatus } = useGetAccountStatus();
    const { data: accountSettings } = useGetSettings();
    const { data: websiteStatus } = useWebsiteStatus({
        refetchOnWindowFocus: false,
    });
    const { data: landingCompany } = useLandingCompany({
        payload: {
            landing_company: accountSettings?.country_code ?? '',
        },
        enabled: !!accountSettings?.country_code,
    });

    const { client } = useStore() ?? {
        client: {
            setApiHookLogout: () => {},
            setAccountStatus: () => {},
            setAccountSettings: () => {},
            setWebsiteStatus: () => {},
            setLandingCompany: () => {},
            setSwitchBroadcast: () => {},
        },
    };

    useEffect(() => {
        if (client) {
            client.setApiHookLogout(logout);
        }
    }, [logout, client]);

    useEffect(() => {
        if (client && accountStatus) {
            client.setAccountStatus(accountStatus);
        }
    }, [accountStatus, client]);

    useEffect(() => {
        if (client && accountSettings) {
            client.setAccountSettings(accountSettings);
        }
    }, [accountSettings, client]);

    useEffect(() => {
        if (client && websiteStatus) {
            client.setWebsiteStatus(websiteStatus);
        }
    }, [websiteStatus, client]);

    useEffect(() => {
        if (client && landingCompany) {
            client.setLandingCompany(landingCompany as GetLandingCompanyResult);
        }
    }, [landingCompany, client]);

    useEffect(() => {
        if (client) {
            client.setSwitchBroadcast(isAuthorizing);
        }
    }, [isAuthorizing, client]);

    return <>{children}</>;
});

AuthProvider.displayName = 'AuthProvider';

export default AuthProvider;
