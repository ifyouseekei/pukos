export class Observable<T> {
  private observers: Array<(data: T) => void> = [];
  private value: T; // Holds the current value

  constructor(initialValue: T) {
    this.value = initialValue; // Set the default value
  }

  // Subscribe an observer
  subscribe(observer: (data: T) => void): void {
    this.observers.push(observer);
  }

  // Unsubscribe an observer
  unsubscribe(observer: (data: T) => void): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // Get the current value
  getValue(): T {
    return this.value;
  }

  // Set a new value and notify observers
  setValue(newValue: T): void {
    if (this.value !== newValue) {
      // Only notify if value changed
      this.value = newValue;
      this.notify();
    }
  }

  // Notify all observers with the new value
  private notify(): void {
    this.observers.forEach((observer) => observer(this.value));
  }
}
