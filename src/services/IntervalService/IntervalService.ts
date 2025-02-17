import { Observable } from '../../utils/Observable.js';

const LOCAL_STORAGE_KEY = 'pomodoroInterval';
export type Intervals = '25:5' | '50:10' | '90:30';
const INTERVALS_ENUM: Record<
  Intervals,
  { focusTime: number; breakTime: number }
> = {
  '25:5': {
    focusTime: 25 * 60,
    breakTime: 5 * 60,
  },
  '50:10': {
    focusTime: 50 * 60,
    breakTime: 10 * 60,
  },
  '90:30': {
    focusTime: 90 * 60,
    breakTime: 30 * 60,
  },
};
const intervals = Object.keys(INTERVALS_ENUM);

class IntervalService {
  private static instance: IntervalService | null = null;
  public interval = new Observable<Intervals>('25:5');

  private constructor() {
    if (IntervalService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }

    this.loadIntervalFromStorage();
  }

  public get focusTime(): number {
    return INTERVALS_ENUM[this.interval.getValue()].focusTime;
  }

  public get breakTime(): number {
    return INTERVALS_ENUM[this.interval.getValue()].breakTime;
  }

  public setInterval(interval: Intervals) {
    if (this.isIntervalValid(interval)) {
      this.interval.setValue(interval);
      this.saveIntervalToStorage(interval);
    }
  }

  // Load the saved interval from localStorage (if any)
  private loadIntervalFromStorage(): void {
    const savedInterval = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedInterval && this.isIntervalValid(savedInterval)) {
      this.interval.setValue(savedInterval as Intervals);
    }
  }

  // Save the current interval to localStorage
  private saveIntervalToStorage(interval: Intervals): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, interval);
  }

  public static getInstance(): IntervalService {
    if (!this.instance) {
      this.instance = new IntervalService();
    }

    return this.instance;
  }

  public isIntervalValid(value?: unknown): value is Intervals {
    if (typeof value !== 'string') {
      return false;
    }

    return intervals.includes(value as Intervals);
  }
}

export default IntervalService.getInstance();
