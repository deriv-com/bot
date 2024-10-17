import { memo, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { GetLandingCompanyResult } from '@/stores/client-store';
import { toMoment } from '@/utils/time';
import {
    useAuthData,
    useGetAccountStatus,
    useGetSettings,
    useLandingCompany,
    useTime,
    useWebsiteStatus,
} from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';

const CoreStoreProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
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
    const { data: serverTime, error: serverTimeError } = useTime({
        refetchInterval: 15000,
    });
    const { currentLang } = useTranslations();

    const { client, common } = useStore() ?? {
        client: {
            setApiHookLogout: () => {},
            setAccountStatus: () => {},
            setAccountSettings: () => {},
            setWebsiteStatus: () => {},
            setLandingCompany: () => {},
            setSwitchBroadcast: () => {},
        },
        common: {
            setServerTime: () => {},
            setCurrentLanguage: () => {},
        },
    };

    useEffect(() => {
        if (common && currentLang) {
            common.setCurrentLanguage(currentLang);
        }
    }, [currentLang, common]);

    useEffect(() => {
        if (common && serverTime) {
            common.setServerTime(toMoment(serverTime), !!serverTimeError);
        }
    }, [serverTime, common, serverTimeError]);

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

CoreStoreProvider.displayName = 'CoreStoreProvider';

export default CoreStoreProvider;
