import { action, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { toMoment } from '@/utils/time';

const UPDATE_TIME_INTERVAL = 1000;

type Error = {
    type: string;
    header: string;
    message: string;
    redirect_label: string;
    redirectOnClick: () => void;
    should_show_refresh: boolean;
    redirect_to: string;
    should_clear_error_on_click: boolean;
    should_redirect: boolean;
};

export default class CommonStore {
    server_time = toMoment();
    update_time_interval: NodeJS.Timeout | undefined;
    current_language = '';
    is_socket_opened = false;
    error: Partial<Error> | undefined;
    has_error = false;

    constructor() {
        makeObservable(this, {
            current_language: observable,
            server_time: observable,
            is_socket_opened: observable,
            error: observable,
            has_error: observable,
            setServerTime: action,
            updateServerTime: action,
            setCurrentLanguage: action,
            setSocketOpened: action,
            setError: action,
            showError: action,
        });
    }

    setCurrentLanguage = (lang: string) => {
        this.current_language = lang;
    };

    setServerTime = (time: moment.Moment, error: boolean) => {
        if (error) return;

        this.server_time = time;

        if (this.update_time_interval) {
            clearInterval(this.update_time_interval);
        }

        this.update_time_interval = setInterval(() => this.updateServerTime(), UPDATE_TIME_INTERVAL);
    };

    updateServerTime = () => {
        this.server_time = moment(this.server_time).add(UPDATE_TIME_INTERVAL, 'milliseconds');
    };

    setSocketOpened = (opened: boolean) => {
        this.is_socket_opened = opened;
    };

    setError = (has_error: boolean, error: Partial<Error>) => {
        this.has_error = has_error;
        this.error = has_error
            ? {
                  type: error ? error.type : 'info',
                  ...(error && {
                      header: error.header,
                      message: error.message,
                      redirect_label: error.redirect_label,
                      redirectOnClick: error.redirectOnClick,
                      should_show_refresh: error.should_show_refresh,
                      redirect_to: error.redirect_to,
                      should_clear_error_on_click: error.should_clear_error_on_click,
                      should_redirect: error.should_redirect,
                      setError: this.setError,
                  }),
              }
            : undefined;
    };

    showError = ({
        message,
        header,
        redirect_label,
        redirectOnClick,
        should_show_refresh,
        redirect_to,
        should_clear_error_on_click,
        should_redirect,
    }: Partial<Error>) => {
        this.setError(true, {
            header,
            message,
            redirect_label,
            redirectOnClick,
            should_show_refresh,
            redirect_to,
            should_clear_error_on_click,
            type: 'error',
            should_redirect,
        });
    };
}
