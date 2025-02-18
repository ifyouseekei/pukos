import { Observable } from '../../utils/Observable.js';

export const LOCAL_STORAGE_KEY = 'pomodoroInterval';
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

export class IntervalService {
  private static instance: IntervalService | null = null;
  public interval: Observable<Intervals>;

  private constructor() {
    if (IntervalService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }

    const savedInterval = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedInterval && this.isIntervalValid(savedInterval)) {
      this.interval = new Observable<Intervals>(savedInterval as Intervals);
    } else {
      this.interval = new Observable<Intervals>('25:5');
    }
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
