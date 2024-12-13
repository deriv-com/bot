import Cookies from 'js-cookie';
import { getAppId, LocalStore, MAX_MOBILE_WIDTH } from '@/components/shared';
import { Analytics } from '@deriv-com/analytics';
import getCountry from '../getCountry';
import FIREBASE_INIT_DATA from '../remote_config.json';

export const AnalyticsInitializer = async () => {
    const account_type = LocalStore?.get('active_loginid')
        ?.match(/[a-zA-Z]+/g)
        ?.join('');

    if (process.env.REMOTE_CONFIG_URL) {
        const flags = await fetch(process.env.REMOTE_CONFIG_URL)
            .then(res => res.json())
            .catch(() => FIREBASE_INIT_DATA);
        if (process.env.RUDDERSTACK_KEY && flags?.tracking_rudderstack) {
            let ppc_campaign_cookies = Cookies.get('utm_data') as unknown as Record<string, string> | null;

            if (!ppc_campaign_cookies) {
                ppc_campaign_cookies = {
                    utm_source: 'no source',
                    utm_medium: 'no medium',
                    utm_campaign: 'no campaign',
                    utm_content: 'no content',
                };
            }

            const config = {
                growthbookKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey: flags.marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
                growthbookOptions: {
                    disableCache: process.env.APP_ENV !== 'production',
                    attributes: {
                        account_type: account_type === 'null' ? 'unlogged' : account_type,
                        app_id: String(getAppId()),
                        device_type: window.innerWidth <= MAX_MOBILE_WIDTH ? 'mobile' : 'desktop',
                        device_language: navigator?.language || 'en-EN',
                        user_language: LocalStore?.get('i18n_language')
                            ? JSON.parse(LocalStore.get('i18n_language')?.toLowerCase())
                            : undefined,
                        country: await getCountry(),
                        utm_source: ppc_campaign_cookies?.utm_source,
                        utm_medium: ppc_campaign_cookies?.utm_medium,
                        utm_campaign: ppc_campaign_cookies?.utm_campaign,
                        utm_content: ppc_campaign_cookies?.utm_content,
                        domain: window.location.hostname,
                        url: window.location.href,
                    },
                },
            };
            await Analytics?.initialise(config);
        }
    }
};
