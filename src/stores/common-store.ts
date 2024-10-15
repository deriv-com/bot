import { action, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { toMoment } from '@/utils/time';

const UPDATE_TIME_INTERVAL = 1000;

export default class CommonStore {
    server_time = toMoment();
    update_time_interval: NodeJS.Timeout | undefined;
    current_language = '';
    is_socket_opened = false;

    //TODO: fix missing properties
    showError = false;
    has_error = false;
    setError = () => {};

    constructor() {
        makeObservable(this, {
            current_language: observable,
            server_time: observable,
            is_socket_opened: observable,
            setServerTime: action,
            updateServerTime: action,
            setCurrentLanguage: action,
            setSocketOpened: action,
        });
    }

    setCurrentLanguage(lang: string) {
        this.current_language = lang;
    }

    setServerTime(time: moment.Moment, error: boolean) {
        if (error) return;

        this.server_time = time;

        if (this.update_time_interval) {
            clearInterval(this.update_time_interval);
        }

        this.update_time_interval = setInterval(() => this.updateServerTime(), UPDATE_TIME_INTERVAL);
    }

    updateServerTime() {
        this.server_time = moment(this.server_time).add(UPDATE_TIME_INTERVAL, 'milliseconds');
    }

    setSocketOpened(opened: boolean) {
        this.is_socket_opened = opened;
    }
}
