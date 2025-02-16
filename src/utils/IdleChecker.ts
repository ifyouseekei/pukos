import { Observable } from './Observable.js';

class IdleChecker {
  private static instance: IdleChecker | null = null;
  isIdle: Observable<boolean>;

  private constructor() {
    if (IdleChecker.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
    this.isIdle = new Observable<boolean>(false);
  }

  public static getInstance(): IdleChecker {
    if (!this.instance) {
      this.instance = new IdleChecker();
    }
    return this.instance;
  }
}

export default IdleChecker.getInstance();
