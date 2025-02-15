class IdleObservable extends Observable{
    constructor() {
        super();
        if (!Idle.instance) {
            this.observers = []; // Store observers (subscribers)
            Idle.instance = this;
        }
        return Idle.instance;
    }

    setState(newState) {
        this.state = newState;
        this.notify(this.state); // Notify all observers
    }
}

// Create a single instance and freeze it
const instance = new IdleObservable();
Object.freeze(instance);

export default instance;
