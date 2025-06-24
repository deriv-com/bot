import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import './styles/index.scss';

// Detect Safari browser
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Add class to HTML element if Safari
if (isSafari) {
    document.documentElement.classList.add('safari-browser');
}

AnalyticsInitializer();

ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
