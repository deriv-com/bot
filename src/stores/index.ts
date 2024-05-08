import TestStore from './ui-store';

export default class RootStore {
    public ui: TestStore;

    constructor() {
        this.ui = new TestStore();
    }
}
