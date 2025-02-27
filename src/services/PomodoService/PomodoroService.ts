import { Observable } from "../../utils/Observable.js";
import { TICK_IDS, TickWorker } from "../../utils/TickWorker.js";
import AlarmService from "../AlarmService/index.js";
import IntervalService from "../IntervalService/index.js";
import NotificationService from "../NotificationService.js";
import { PomodoroStates } from "./Pomodoro.types.js";

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
  private tickWorker: TickWorker;

  public static localStorageKeys = {
    focusTime: "focusTime",
  };

  public state = new Observable<PomodoroStates>("pre-focus");
  public remainingTime = new Observable<number>(IntervalService.focusTime);
  public focusTime: Observable<number>;
  public totalTime: Observable<number>;
  public isTimerRunning: boolean = false;

  private alarmService: AlarmService;

  private constructor() {
    if (PomodoroService.instance) {
      throw new Error(
        "Cannot create multiple instances of a Singleton. Use getInstance() instead.",
      );
    }
    const storedFocusTime = localStorage.getItem(
      PomodoroService.localStorageKeys.focusTime,
    );
    if (storedFocusTime && !isNaN(Number(storedFocusTime))) {
      this.focusTime = new Observable<number>(Number(storedFocusTime));
    } else {
      this.focusTime = new Observable<number>(0);
    }

    this.totalTime = new Observable<number>(0);

    this.alarmService = AlarmService.getInstance();
    this.tickWorker = new TickWorker();
    // Whenever the interval is changed, it should reset
    IntervalService.interval.subscribe(this.onReset.bind(this));
    this.listenToTicks();
    this.cleanup();
    this.focusTime.subscribe(this.storeFocusTimeToLocalStorage.bind(this));
  }

  private storeFocusTimeToLocalStorage(focusTime: number) {
    localStorage.setItem(
      PomodoroService.localStorageKeys.focusTime,
      focusTime.toString(),
    );
  }

  /**
   * Resets the pomodoro state to the initial state
   */
  public onReset(): void {
    if (this.alarmService.isPlayingAlarm.getValue()) {
      this.alarmService.stopAlarm();
    }
    this.isTimerRunning = false;
    this.remainingTime.setValue(IntervalService.focusTime);
    this.state.setValue("pre-focus");
    this.tickWorker.stop();
  }

  /**
   * Resets the focus timer back to 00:00
   */
  public onResetFocusTime(): void {
    this.focusTime.setValue(0);
  }

  /**
   * Resets the total time timer back to 00:00
   */
  public onResetTotalTime(): void {
    this.focusTime.setValue(0);
  }

  /**
   * Starts the "Focus" mode
   */
  public onFocus(): void {
    NotificationService.close();
    this.alarmService.stopAlarm();
    this.isTimerRunning = true;
    this.tickWorker.start();
    this.remainingTime.setValue(IntervalService.focusTime);
    this.state.setValue("focus");
  }

  /**
   * Starts the "Break" mode
   */
  public onBreak(): void {
    NotificationService.close();
    this.alarmService.stopAlarm();
    this.isTimerRunning = true;
    this.tickWorker.start();
    this.remainingTime.setValue(IntervalService.breakTime);
    this.state.setValue("break");
  }

  public static getInstance(): PomodoroService {
    if (!this.instance) {
      this.instance = new PomodoroService();
    }

    return this.instance;
  }

  /**
   * Listens to tick events from the worker and updates the timer.
   */
  private listenToTicks(): void {
    const worker = this.tickWorker.worker;

    // This happens when the browser doesn't support workers
    if (!worker) {
      return;
    }

    worker.addEventListener("message", (event) => {
      if (event.data === TICK_IDS.id && this.isTimerRunning) {
        this.countDown();

        this.countUpTotalTime();

        this.countUpFocusTime();

        // Countdown timer reaches 0
        if (this.remainingTime.getValue() <= 0) {
          this.onTimerFinished();
        }
      }
    });
  }

  private countDown(): void {
    this.remainingTime.setValue(this.remainingTime.getValue() - 1);
  }

  private countUpTotalTime(): void {
    this.totalTime.setValue(this.totalTime.getValue() + 1);
  }

  private countUpFocusTime(): void {
    // Only increase the focus time whilst in "focus" mode
    if (this.state.getValue() === "focus") {
      this.focusTime.setValue(this.focusTime.getValue() + 1);
    }
  }

  /**
   * When the timer has finished (like it reached 00:00)
   */
  private onTimerFinished(): void {
    this.alarmService.playAlarm();
    // TODO: Autoplay and idle should modify things here
    this.isTimerRunning = false;
    this.tickWorker.stop();

    // Timer ended whilst on "focus" mode
    if (this.state.getValue() === "focus") {
      this.state.setValue("pre-break");
      NotificationService.notify({
        callback: () => this.onBreak(),
        title: "Focus session complete",
        message: "Click to start your break",
      });

      return;
    }

    // Timer ended whilst on "break" mode
    if (this.state.getValue() === "break") {
      this.state.setValue("pre-focus");
      NotificationService.notify({
        callback: () => this.onFocus(),
        title: "Break over",
        message: "Click to start your next focus session",
      });
    }
  }

  /**
   * Cleanup before unloading the app
   */
  private cleanup(): void {
    window.addEventListener("beforeunload", () => {
      this.tickWorker.terminate();
      IntervalService.interval.unsubscribe(this.onReset.bind(this));
    });
  }
}

export default PomodoroService;
