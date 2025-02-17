import { Observable } from '../../utils/Observable';

class PomodoroTimerController {
  private static instance: PomodoroTimerController | null = null;

  /**
   * The total time the user is in "focus mode"
   */
  focusTime = new Observable<number>(0);

  /**
   * The total time the user is in "ALL modes (Break/Focus/Etc)"
   */
  totalTime = new Observable<number>(0);

  private constructor() {
    if (PomodoroTimerController.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
  }

  public static getInstance(): PomodoroTimerController {
    if (!this.instance) {
      this.instance = new PomodoroTimerController();
    }

    return this.instance;
  }

  onCountUp(type: 'focusTime' | 'totalTime') {
    if (type === 'focusTime') {
      this.focusTime.setValue(this.focusTime.getValue() + 1);
    } else if (type === 'totalTime') {
      this.totalTime.setValue(this.totalTime.getValue() + 1);
    }
  }
}

export default PomodoroTimerController.getInstance();
