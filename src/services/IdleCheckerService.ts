import { Observable } from '../utils/Observable.js'

class IdleCheckerService {
  private static instance: IdleCheckerService | null = null;
  isIdle: Observable<boolean>;

  private constructor() {
    if (IdleCheckerService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
    this.isIdle = new Observable<boolean>(false);
  }

  public init() {
    setTimeout(() => {
      console.log("test1");
    }, 10000);
  }

  public static getInstance(): IdleCheckerService {
    if (!this.instance) {
      this.instance = new IdleCheckerService();
    }
    return this.instance;
  }
}

export default IdleCheckerService.getInstance();
