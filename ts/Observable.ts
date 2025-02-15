class Observable {
    constructor() {
        if (!Observable.instance) {
            this.observers = []; // Store observers (subscribers)
            Observable.instance = this;
        }
        return Observable.instance;
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observer.forEach(observer => observer(data));
    }
}
