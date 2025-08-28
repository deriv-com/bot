import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import { getMobileSourceInfo, registerPWA, trackPWAEvent } from './utils/pwa-utils';
import './styles/index.scss';

AnalyticsInitializer();

// Track PWA launch if applicable
const mobileSourceInfo = getMobileSourceInfo();
if (mobileSourceInfo.isPWALaunch) {
    trackPWAEvent('pwa_app_launched', {
        source: 'mobile',
        launchTime: new Date().toISOString(),
    });
} else if (mobileSourceInfo.isMobileSource) {
    trackPWAEvent('mobile_source_detected', {
        source: 'mobile',
        isStandalone: mobileSourceInfo.isStandalone,
    });
}

// Register PWA service worker (Chrome only - skips Safari and Firefox)
registerPWA()
    .then(registration => {
        if (registration) {
            trackPWAEvent('service_worker_registered', {
                scope: registration.scope,
                source: mobileSourceInfo.isMobileSource ? 'mobile' : 'web',
                browser: 'chrome',
            });
        } else {
            trackPWAEvent('service_worker_disabled_non_chrome', {
                source: mobileSourceInfo.isMobileSource ? 'mobile' : 'web',
                userAgent: navigator.userAgent,
            });
        }
    })
    .catch(error => {
        console.error('PWA service worker registration failed:', error);
        trackPWAEvent('service_worker_registration_failed', {
            error: error instanceof Error ? error.message : String(error),
            source: mobileSourceInfo.isMobileSource ? 'mobile' : 'web',
        });
    });

ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
