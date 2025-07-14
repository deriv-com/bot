import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import { registerPWA, trackPWAEvent } from './utils/pwa-utils';
import './styles/index.scss';

AnalyticsInitializer();

// Register PWA service worker
registerPWA()
    .then(registration => {
        if (registration) {
            console.log('PWA service worker registered successfully');
            trackPWAEvent('service_worker_registered', { scope: registration.scope });
        } else {
            console.log('PWA service worker registration failed or not supported');
            trackPWAEvent('service_worker_not_supported');
        }
    })
    .catch(error => {
        console.error('PWA service worker registration failed:', error);
        trackPWAEvent('service_worker_registration_failed', {
            error: error instanceof Error ? error.message : String(error),
        });
    });

ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
