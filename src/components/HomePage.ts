import IntervalService from '../services/IntervalService/index.js';
import PomodoroService from '../services/PomodoService/PomodoroService.js';
import { getOrThrowElement } from '../utils/getOrThrowElement.js';
import {
  secondsToFormattedTime,
  secondsToMinuteString,
} from '../utils/timeFormatter.utils.js';
import FocusButtonSection from './FocusButtonSection.js';

class HomePage {
  private static instance: HomePage | null = null;

  public countdownTimerEl: HTMLSpanElement;
  public totalFocusTimeEl: HTMLSpanElement;
  public intervalEls: NodeListOf<HTMLInputElement>;
  public cleanupCallbacks: Array<() => void> = [];

  private focusButtonSection: FocusButtonSection;

  private constructor() {
    this.countdownTimerEl = getOrThrowElement('#countdown-timer');
    this.totalFocusTimeEl = getOrThrowElement('#total-focus-time');
    this.intervalEls = document.querySelectorAll('input[name="interval"]');
    this.focusButtonSection = new FocusButtonSection();
  }

  init() {
    this.initIntervals();
    this.initCountdownTimer();
    this.initTotalFocusTime();
    this.initTitleChange();
    this.focusButtonSection.init();
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
    this.focusButtonSection.cleanup();
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
