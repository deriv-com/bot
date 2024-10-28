import ReactDOM from 'react-dom/client';
import App from './app/App';
import { AnalyticsInitializer } from './utils/analytics';
import './styles/index.scss';

AnalyticsInitializer();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
