import IdleCheckerService from '../services/IdleCheckerService.js';
import IntervalService from '../services/IntervalService/index.js';
import PomodoroService from '../services/PomodoService/PomodoroService.js';
import { getOrThrowElement } from '../utils/getOrThrowElement.js';
import {
  secondsToFormattedTime,
  secondsToMinuteString,
} from '../utils/timeFormatter.utils.js';

class HomePage {
  private static instance: HomePage | null = null;

  public countdownTimerEl: HTMLSpanElement;
  public totalFocusTimeEl: HTMLSpanElement;
  public focusButtonEl: HTMLButtonElement;
  public takeABreakButtonEl: HTMLButtonElement;
  public endSessionButtonEl: HTMLButtonElement;
  public intervalEls: NodeListOf<HTMLInputElement>;
  public cleanupCallbacks: Array<() => void> = [];

  private constructor() {
    this.countdownTimerEl = getOrThrowElement('#countdown-timer');
    this.totalFocusTimeEl = getOrThrowElement('#total-focus-time');
    this.focusButtonEl = getOrThrowElement('#focus-button');
    this.takeABreakButtonEl = getOrThrowElement('#take-a-break-button');
    this.endSessionButtonEl = getOrThrowElement('#end-session-button');
    this.intervalEls = document.querySelectorAll('input[name="interval"]');
  }

  init() {
    this.initButtons();
    this.initIntervals();
    this.initCountdownTimer();
    this.initTotalFocusTime();
    this.initTitleChange();
  }

  private initButtons(): void {
    this.focusButtonEl.addEventListener('click', () => {
      IdleCheckerService.init();
      PomodoroService.onFocus();
    });

    this.takeABreakButtonEl.addEventListener('click', () => {
      PomodoroService.onBreak();
    });

    this.endSessionButtonEl.addEventListener('click', () => {
      IdleCheckerService.stop();
      PomodoroService.onReset();
    });
  }

  private initIntervals(): void {
    // Initialize interval value
    this.intervalEls.forEach((intervalEl) => {
      if (intervalEl.value === IntervalService.interval.getValue()) {
        intervalEl.checked = true;
      }
    });

    // Listen to interval change
    this.intervalEls.forEach((intervalEl) => {
      intervalEl.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (!target.checked) {
          return;
        }

        // Check
        const selectedInterval = target.value;
        if (!IntervalService.isIntervalValid(selectedInterval)) {
          return;
        }

        IntervalService.setInterval(selectedInterval);
      });
    });
  }

  private initCountdownTimer(): void {
    const updateCountdownContent = (remainingTime: number) => {
      this.countdownTimerEl.textContent = secondsToMinuteString(remainingTime);
    };

    // Set the initial value
    updateCountdownContent(PomodoroService.remainingTime.getValue());

    // Listen to changes on remaining time to reflect to the countdownTimer
    PomodoroService.remainingTime.subscribe(updateCountdownContent);

    // Cleanup
    this.cleanupCallbacks.push(() => {
      PomodoroService.remainingTime.unsubscribe(updateCountdownContent);
    });
  }

  private initTotalFocusTime(): void {
    const updateTotalFocusTimeContent = (focusTime: number) => {
      this.totalFocusTimeEl.textContent = secondsToFormattedTime(focusTime);
    };

    // Set the initial value
    updateTotalFocusTimeContent(PomodoroService.focusTime.getValue());

    // Listen to changes
    PomodoroService.focusTime.subscribe(updateTotalFocusTimeContent);

    // Cleanup
    this.cleanupCallbacks.push(() => {
      PomodoroService.remainingTime.unsubscribe(updateTotalFocusTimeContent);
    });
  }

  private initTitleChange(): void {
    function modifyTitle(remainingTime: number) {
      if (PomodoroService.state.getValue() === 'focus') {
        document.title = `${secondsToMinuteString(remainingTime)} - Focus`;
        return;
      }

      if (PomodoroService.state.getValue() === 'break') {
        document.title = `${secondsToMinuteString(remainingTime)} - Break`;
        return;
      }
    }

    PomodoroService.remainingTime.subscribe(modifyTitle);

    // Cleanup
    this.cleanupCallbacks.push(() => {
      PomodoroService.remainingTime.unsubscribe(modifyTitle);
    });
  }

  cleanup(): void {
    this.cleanupCallbacks.forEach((cb) => cb());
  }

  public static getInstance(): HomePage {
    if (!this.instance) {
      this.instance = new HomePage();
    }

    return this.instance;
  }
}

window.addEventListener('unload', HomePage.getInstance().cleanup);

export default HomePage.getInstance();
