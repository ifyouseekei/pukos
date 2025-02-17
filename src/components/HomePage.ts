import IntervalService, {
  Intervals,
  INTERVALS_ENUM,
} from '../services/IntervalService/IntervalService.js';
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

    // Initialize interval value
    this.intervalEls.forEach((intervalEl) => {
      if (intervalEl.value === IntervalService.interval.getValue()) {
        intervalEl.checked = true;
      }
    });

    // Listen to interval change
    this.intervalEls.forEach((intervalEl) => {
      intervalEl.addEventListener(
        'change',
        this.handleIntervalChange.bind(this)
      );
    });

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

  handleIntervalChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.checked) {
      return;
    }

    // Check
    const selectedInterval = target.value;
    if (!isIntervalValid(selectedInterval)) {
      return;
    }

    IntervalService.setInterval(selectedInterval);
  }

  public static getInstance(): HomePage {
    if (!this.instance) {
      this.instance = new HomePage();
    }

    return this.instance;
  }
}

const validIntervals = Object.keys(INTERVALS_ENUM);
function isIntervalValid(value?: unknown): value is Intervals {
  if (typeof value !== 'string') {
    return false;
  }

  return validIntervals.includes(value as Intervals);
}

export default HomePage.getInstance();
