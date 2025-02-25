import PomodoroService from "../services/PomodoService/PomodoroService.js";
import { getOrThrowElement } from "../utils/getOrThrowElement.js";
import {
  secondsToFormattedTime,
  secondsToMinuteString,
} from "../utils/timeFormatter.utils";

/**
 * this class is responsible for updating UI changes regarding
 * countdown of pomodoro timer, adding-up total focus time and etc (future updates)
 */
class TimerController {
  public countdownTimerEl: HTMLSpanElement;
  public totalFocusTimeEl: HTMLSpanElement;
  public resetFocusTimeEl: HTMLButtonElement;

  public cleanupCallbacks: Array<() => void> = [];
  private pomodoroService: PomodoroService;

  public constructor() {
    this.countdownTimerEl = getOrThrowElement("#countdown-timer");
    this.totalFocusTimeEl = getOrThrowElement("#total-focus-time");
    this.resetFocusTimeEl = getOrThrowElement("#reset-focus-time");
    this.pomodoroService = PomodoroService.getInstance();
  }

  public init() {
    this.resetFocusTimeEl.addEventListener(
      "click",
      this.handleResetFocusTimeClicked.bind(this),
    );

    this.initCountdownTimer();
    this.initTotalFocusTime();
  }

  private handleResetFocusTimeClicked(): void {
    this.pomodoroService.onResetFocusTime();
  }

  private initCountdownTimer(): void {
    const updateCountdownContent = (remainingTime: number) => {
      this.countdownTimerEl.textContent = secondsToMinuteString(remainingTime);
    };

    // Set the initial value
    updateCountdownContent(this.pomodoroService.remainingTime.getValue());

    // Listen to changes on remaining time to reflect to the countdownTimer
    this.pomodoroService.remainingTime.subscribe(updateCountdownContent);

    // Cleanup
    this.cleanupCallbacks.push(() => {
      this.pomodoroService.remainingTime.unsubscribe(updateCountdownContent);
    });
  }

  private initTotalFocusTime(): void {
    const updateTotalFocusTimeContent = (focusTime: number) => {
      this.totalFocusTimeEl.textContent = secondsToFormattedTime(focusTime);
    };

    // Set the initial value
    updateTotalFocusTimeContent(this.pomodoroService.focusTime.getValue());

    // Listen to changes
    this.pomodoroService.focusTime.subscribe(updateTotalFocusTimeContent);

    // Cleanup
    this.cleanupCallbacks.push(() => {
      this.pomodoroService.remainingTime.unsubscribe(
        updateTotalFocusTimeContent,
      );
    });
  }

  cleanup(): void {
    this.cleanupCallbacks.forEach((cb) => cb());
  }
}

export default TimerController;
