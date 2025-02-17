import MainControlButtons from './MainControlButtons.js';
import PomodoroStateController from './PomodoroStateController.js';
import TimerWorker, { TICK_ID } from './TimerWorker.js';

class Pomodoro {
  private static instance: Pomodoro | null = null;

  // Classes
  timerWorker = TimerWorker.getInstance();

  private constructor() {
    if (Pomodoro.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
  }

  public static getInstance(): Pomodoro {
    if (!this.instance) {
      this.instance = new Pomodoro();
    }

    return this.instance;
  }

  public init() {
    // Initialize control buttons
    MainControlButtons.startFocusButtonEl.addEventListener(
      'click',
      this.onStartFocusClick.bind(this)
    );
    MainControlButtons.takeABreakButtonEl.addEventListener(
      'click',
      this.onTakeABreakClick.bind(this)
    );

    this.onSubscribeToPomodoroState();
    this.timerWorker.addEventListener(this.onTimerWorkerMessage.bind(this));
  }

  onStartFocusClick() {
    PomodoroStateController.onFocus();
  }

  onTakeABreakClick() {
    PomodoroStateController.onBreak();
  }

  onTimerWorkerMessage = ({ data }: { data: string }) => {
    if (data === TICK_ID) {
      this.onTick();
    }
  };

  onTick() {
    // const hasFinished: boolean = this.timeLeft.time_sec <= 0;

    // if (hasFinished) {
    //   return this.onTimerFinished();
    // }

    // this.timeLeft.countDown();
    // this.images.setOpacity(this.getTimeLeftPercentage());
    if (PomodoroStateController.state.getValue() === 'focus') {
      // this.totalFocusTime.countUp();
    }
  }

  onSubscribeToPomodoroState() {
    PomodoroStateController.state.subscribe((newValue) => {
      switch (newValue) {
        case 'focus':
          MainControlButtons.showFocusedState();
          break;
        case 'break':
          MainControlButtons.showTakingABreakState();
          break;
      }
    });
  }
}

export default Pomodoro.getInstance();
