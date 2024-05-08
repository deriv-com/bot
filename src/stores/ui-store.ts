import { action, makeObservable, observable } from 'mobx';

export default class TestStore {
    isAuthorized = true;
    constructor() {
        makeObservable(this, {
            isAuthorized: observable,
            setIsAuthorized: action,
        });
    }

    setIsAuthorized = (value: boolean) => {
        this.isAuthorized = value;
    };
}
