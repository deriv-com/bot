import { datadogRum } from '@datadog/browser-rum';

const getConfigValues = (is_production: boolean) => {
    if (is_production) {
        return {
            service: 'dbot',
            version: `v${process.env.REF_NAME}`,
            sessionReplaySampleRate: Number(process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE ?? 1),
            sessionSampleRate: Number(process.env.DATADOG_SESSION_SAMPLE_RATE ?? 10),
            env: 'production',
            applicationId: process.env.DATADOG_APPLICATION_ID ?? '',
            clientToken: process.env.DATADOG_CLIENT_TOKEN ?? '',
        };
    }
    return {
        service: 'staging-dbot',
        version: `v${process.env.REF_NAME}`,
        sessionReplaySampleRate: 0,
        sessionSampleRate: 100,
        env: 'staging',
        applicationId: process.env.DATADOG_APPLICATION_ID ?? '',
        clientToken: process.env.DATADOG_CLIENT_TOKEN ?? '',
    };
};

const initDatadog = (is_datadog_enabled: boolean) => {
    if (!is_datadog_enabled) return;
    if (process.env.APP_ENV === 'production' || process.env.APP_ENV === 'staging') {
        const is_production = process.env.APP_ENV === 'production';
        const {
            service,
            version,
            sessionReplaySampleRate,
            sessionSampleRate,
            env,
            applicationId = '',
            clientToken = '',
        } = getConfigValues(is_production) ?? {};

        datadogRum.init({
            service,
            version,
            sessionReplaySampleRate,
            sessionSampleRate,
            env,
            applicationId,
            clientToken,
            site: 'datadoghq.com',
            trackUserInteractions: true,
            trackResources: true,
            trackLongTasks: true,
            defaultPrivacyLevel: 'mask-user-input',
            enableExperimentalFeatures: ['clickmap'],
        });
    }
};

export default initDatadog;
