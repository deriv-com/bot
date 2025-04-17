import Cookies from 'js-cookie';
import { observer as globalObserver } from '@/external/bot-skeleton/utils/observer';
import { generateDerivApiInstance, getLoginId, getToken } from './appId';

class ChartAPI {
    api;

    onsocketclose() {
        this.reconnectIfNotConnected();
    }

    init = async (force_create_connection = false) => {
        if (!this.api || force_create_connection) {
            if (this.api?.connection) {
                this.api.disconnect();
                this.api.connection.removeEventListener('close', this.onsocketclose.bind(this));
            }
            this.api = await generateDerivApiInstance();
            this.api?.connection.addEventListener('close', this.onsocketclose.bind(this));
        }
        if (getLoginId()) {
            try {
                const { error } = await this.api.authorize(getToken().token);
                if (error && error.code === 'InvalidToken' && Cookies.get('logged_state') === 'true') {
                    // Emit an event that can be caught by the application to retrigger OIDC authentication
                    globalObserver.emit('InvalidToken', { error });

                    // Clear localStorage similar to client.logout to ensure proper cleanup
                    localStorage.removeItem('active_loginid');
                    localStorage.removeItem('accountsList');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('clientAccounts');
                }
            } catch (e) {
                console.error('Error authorizing chart API:', e);
            }
        }
        this.getTime();
    };

    getTime() {
        if (!this.time_interval) {
            this.time_interval = setInterval(() => {
                this.api.send({ time: 1 });
            }, 30000);
        }
    }

    reconnectIfNotConnected = () => {
        // eslint-disable-next-line no-console
        console.log('chart connection state: ', this.api?.connection?.readyState);
        if (this.api?.connection?.readyState && this.api?.connection?.readyState > 1) {
            // eslint-disable-next-line no-console
            console.log('Info: Chart connection to the server was closed, trying to reconnect.');
            this.init(true);
        }
    };
}

const chart_api = new ChartAPI();

export default chart_api;
