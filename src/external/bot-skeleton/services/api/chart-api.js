import { generateDerivApiInstance, getLoginId, getToken } from './appId';

class ChartAPI {
    api;

    init = async () => {
        this.api = await generateDerivApiInstance();
        if (getLoginId()) {
            await this.api.authorize(getToken().token);
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
}

const chart_api = new ChartAPI();

export default chart_api;
