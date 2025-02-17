import { Observable } from '../../utils/Observable.js';

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

class IntervalService {
  private static instance: IntervalService | null = null;
  public interval = new Observable<Intervals>('25:5');

  private constructor() {
    if (IntervalService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
  }

  public get focusTime(): number {
    return INTERVALS_ENUM[this.interval.getValue()].focusTime;
  }

  public get breakTime(): number {
    return INTERVALS_ENUM[this.interval.getValue()].breakTime;
  }

  public setInterval(interval: Intervals) {
    this.interval.setValue(interval);
  }

  public static getInstance(): IntervalService {
    if (!this.instance) {
      this.instance = new IntervalService();
    }

    return this.instance;
  }
}

export default IntervalService.getInstance();
