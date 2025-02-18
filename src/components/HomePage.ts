import IntervalService from '../services/IntervalService/index.js';
import PomodoroService from '../services/PomodoService/PomodoroService.js';
import { getOrThrowElement } from '../utils/getOrThrowElement.js';
import { secondsToTimeString } from '../utils/secondsToTimeString.js';

class HomePage {
  private static instance: HomePage | null = null;

  public countdownTimerEl: HTMLParagraphElement;
  public focusButtonEl: HTMLButtonElement;
  public takeABreakButtonEl: HTMLButtonElement;
  public endSessionButtonEl: HTMLButtonElement;
  public intervalEls: NodeListOf<HTMLInputElement>;

  private constructor() {
    this.countdownTimerEl = getOrThrowElement('#countdown-timer');
    this.focusButtonEl = getOrThrowElement('#focus-button');
    this.takeABreakButtonEl = getOrThrowElement('#take-a-break-button');
    this.endSessionButtonEl = getOrThrowElement('#end-session-button');
    this.intervalEls = document.querySelectorAll('input[name="interval"]');
  }

  init() {
    this.initButtons();
    this.initIntervals();
    this.initCountdownTimer();
    this.initTitleChange();
  }

  private initButtons(): void {
    this.focusButtonEl.addEventListener('click', () =>
      PomodoroService.onFocus()
    );

    this.takeABreakButtonEl.addEventListener('click', () =>
      PomodoroService.onBreak()
    );

    this.endSessionButtonEl.addEventListener('click', () =>
      PomodoroService.onReset()
    );
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
      this.countdownTimerEl.textContent = secondsToTimeString(remainingTime);
    };

    // Set the initial value
    updateCountdownContent(PomodoroService.remainingTime.getValue());

    // Listen to changes on remaining time to reflect to the countdownTimer
    PomodoroService.remainingTime.subscribe(updateCountdownContent);

    // Cleanup
    window.addEventListener('beforeunload', () => {
      PomodoroService.remainingTime.unsubscribe(updateCountdownContent);
    });
  }

  private initTitleChange(): void {
    function modifyTitle(remainingTime: number) {
      if (PomodoroService.state.getValue() === 'focus') {
        document.title = `${secondsToTimeString(remainingTime)} - Focus`;
        return;
      }

      if (PomodoroService.state.getValue() === 'break') {
        document.title = `${secondsToTimeString(remainingTime)} - Break`;
        return;
      }
    }

    PomodoroService.remainingTime.subscribe(modifyTitle);
    // Cleanup
    window.addEventListener('beforeunload', () => {
      PomodoroService.remainingTime.unsubscribe(modifyTitle);
    });
  }

  public static getInstance(): HomePage {
    if (!this.instance) {
      this.instance = new HomePage();
    }

    return this.instance;
  }
}

export default HomePage.getInstance();
