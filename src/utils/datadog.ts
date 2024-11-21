import { datadogRum } from '@datadog/browser-rum';

/**
 * Gets the configuration values for datadog based on the environment.
 * It returns null if the environment is not staging or production.
 * @param {string} environment - The environment to get the configuration values for.
 * @example getConfigValues('staging');
 * @returns {object|null} - The configuration values for datadog.
 * **/
const getConfigValues = (environment: string) => {
    if (environment === 'production') {
        return {
            serviceName: 'deriv-bot',
            dataDogVersion: `deriv-bot-${process.env.REF_NAME}`,
            dataDogSessionReplaySampleRate: Number(process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE ?? 1),
            dataDogSessionSampleRate: Number(process.env.DATADOG_SESSION_SAMPLE_RATE ?? 10),
            dataDogEnv: 'production',
        };
    } else if (environment === 'staging') {
        return {
            serviceName: 'staging-dbot.deriv.com',
            dataDogVersion: `deriv-dbot-staging-v${process.env.REF_NAME}`,
            dataDogSessionReplaySampleRate: 0,
            dataDogSessionSampleRate: 100,
            dataDogEnv: 'staging',
        };
    }
};

/**
 * Initializes datadog for tracking user interactions, resources, long tasks, and frustrations on production or staging environments, conditionally based on environment variables.
 * It also masks user input and redacts sensitive data from the URL.
 *
 * @param {boolean} is_datadog_enabled - The parameter to enable or disable datadog tracking.
 * @example initDatadog(true);
 * @returns {void}
 * **/
const initDatadog = (is_datadog_enabled: boolean) => {
    if (!is_datadog_enabled) return;
    const DATADOG_APP_ID = process.env.DATADOG_APPLICATION_ID ?? '';
    const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ?? '';
    const isProduction = process.env.NODE_ENV === 'production';
    const isStaging = process.env.NODE_ENV === 'staging';

    const {
        dataDogSessionSampleRate = 0,
        dataDogSessionReplaySampleRate = 0,
        dataDogVersion = '',
        dataDogEnv = '',
        serviceName = '',
    } = getConfigValues(process.env.NODE_ENV ?? '') ?? {};

    // we do it in order avoid error "application id is not configured, no RUM data will be collected"
    // for test-links where application ID has not been configured and therefore RUM data will not be collected
    if (isProduction || isStaging) {
        datadogRum.init({
            applicationId: isStaging || isProduction ? DATADOG_APP_ID : '',
            clientToken: isStaging || isProduction ? DATADOG_CLIENT_TOKEN : '',
            site: 'datadoghq.com',
            service: serviceName,
            env: dataDogEnv,
            sessionSampleRate: dataDogSessionSampleRate,
            sessionReplaySampleRate: dataDogSessionReplaySampleRate,
            trackUserInteractions: true,
            trackResources: true,
            trackLongTasks: true,
            defaultPrivacyLevel: 'mask-user-input',
            version: dataDogVersion,
            enableExperimentalFeatures: ['clickmap'],
        });
    }
};

export default initDatadog;
