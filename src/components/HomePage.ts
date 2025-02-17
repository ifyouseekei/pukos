import PomodoroService from '../services/PomodoService/PomodoroService.js';
import { getOrThrowElement } from '../utils/getOrThrowElement.js';
import { secondsToTimeString } from '../utils/secondsToTimeString.js';

class HomePage {
  private static instance: HomePage | null = null;

  public countdownTimerEl: HTMLParagraphElement;
  public focusButtonEl: HTMLButtonElement;
  public takeABreakButtonEl: HTMLButtonElement;
  public endSessionButtonEl: HTMLButtonElement;

  private constructor() {
    this.countdownTimerEl = getOrThrowElement('#countdown-timer');
    this.focusButtonEl = getOrThrowElement('#focus-button');
    this.takeABreakButtonEl = getOrThrowElement('#take-a-break-button');
    this.endSessionButtonEl = getOrThrowElement('#end-session-button');
  }

  init() {
    this.focusButtonEl.addEventListener(
      'click',
      this.handleFocusClick.bind(this)
    );

    this.takeABreakButtonEl.addEventListener(
      'click',
      this.handleBreakClick.bind(this)
    );

    this.endSessionButtonEl.addEventListener(
      'click',
      this.handleEndSessionClick.bind(this)
    );

    this.countdownTimerEl.textContent = secondsToTimeString(
      PomodoroService.remainingTime.getValue()
    );

    PomodoroService.remainingTime.subscribe(
      this.handleRemainingTimeChange.bind(this)
    );
  }

  handleFocusClick() {
    PomodoroService.onFocus();
  }

  handleBreakClick() {
    PomodoroService.onBreak();
  }

  handleEndSessionClick() {
    PomodoroService.onReset();
  }

  handleRemainingTimeChange(remainingTime: number) {
    this.countdownTimerEl.textContent = secondsToTimeString(remainingTime);
  }

  public static getInstance(): HomePage {
    if (!this.instance) {
      this.instance = new HomePage();
    }

    return this.instance;
  }
}

export default HomePage.getInstance();
