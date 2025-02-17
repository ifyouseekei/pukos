import { Observable } from '../../utils/Observable.js';
import TickWorker from '../../utils/TickWorker.js';
import AudioService from '../AudioService/AudioService.js';
import { PomodoroStates } from './Pomodoro.types.js';

/**
 * This class controls the pomodoro function of the app
 * This is designed to be consumed by components
 *
 * Mainly focusing on:
 * - Focus
 * - Break
 * - Timer
 * - Focus Timer
 */
class PomodoroService {
  private static instance: PomodoroService | null = null;
  // private timerWorker = TimerWorker.getInstance();
  // private stateController = PomodoroStateController.getInstance();
  private tickWorker: TickWorker;

  state = new Observable<PomodoroStates>('pre-focus');
  remainingTime = new Observable<number>(60 * 60 * 25); // TODO: Interval
  focusTime = new Observable<number>(0);
  totalTime = new Observable<number>(0);

  private constructor() {
    if (PomodoroService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }

    this.tickWorker = new TickWorker();
    this.listenToTicks();
  }

  public onFocus(): void {
    this.state.setValue('focus');
  }

  public onBreak(): void {
    this.state.setValue('break');
  }

  private onTimerFinished(): void {
    AudioService.playAlarm();

    if (this.state.getValue() === 'focus') {
      this.state.setValue('pre-break');
    } else if (this.state.getValue() === 'break') {
      this.state.setValue('pre-focus');
    }
  }

  /**
   * Listens to tick events from the worker and updates the timer.
   */
  private listenToTicks(): void {
    const worker = this.tickWorker.worker;
    if (worker) {
      worker.addEventListener('message', () => {

      });
    }
  }

  public static getInstance(): PomodoroService {
    if (!this.instance) {
      this.instance = new PomodoroService();
    }

    return this.instance;
  }
}
