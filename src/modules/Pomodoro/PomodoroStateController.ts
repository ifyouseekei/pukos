import { Observable } from '../../utils/Observable.js';
import { PomodoroStates } from './Pomodoro.types.js';

class PomodoroStateController {
  private static instance: PomodoroStateController | null = null;

  state: Observable<PomodoroStates>;

  // The time the user is in 'focus' mode
  focusTime: Observable<number>;

  // The time the user is in either 'focus' or 'break' mode
  totalTime: Observable<number>;

  private constructor() {
    if (PomodoroStateController.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }

    this.state = new Observable<PomodoroStates>('pre-focus');
    this.focusTime = new Observable<number>(0);
    this.totalTime = new Observable<number>(0);
  }

  public static getInstance(): PomodoroStateController {
    if (!this.instance) {
      this.instance = new PomodoroStateController();
    }

    return this.instance;
  }

  onFocus(): void {
    this.state.setValue('focus');
  }

  onBreak(): void {
    this.state.setValue('break');
  }
}

export default PomodoroStateController.getInstance();
