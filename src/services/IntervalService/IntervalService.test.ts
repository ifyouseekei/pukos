import { LOCAL_STORAGE_KEY, IntervalService } from './IntervalService.js';

describe('IntervalService', () => {
  afterEach(() => {
    localStorage.clear();
    (IntervalService as any).instance = null;
  });

  describe('initializing', () => {
    test('should have default values', () => {
      const intervalService = IntervalService.getInstance();
      expect(intervalService.interval.getValue()).toBe('25:5');
    });

    test('should load saved interval from localStorage', () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, '90:30');
      const instance = IntervalService.getInstance();
      expect(instance.interval.getValue()).toBe('90:30');
    });
  });

  describe('changing interval', () => {
    test('should not allow invalid intervals', () => {
      const instance = IntervalService.getInstance();

      // @ts-expect-error - intentionally passing an invalid value
      instance.setInterval('invalid');
      expect(instance.interval.getValue()).toBe('25:5'); // Default remains unchanged
    });
    test('should be able to change and store to localStorage', () => {
      const instance = IntervalService.getInstance();

      expect(instance.interval.getValue()).toBe('25:5');
      instance.setInterval('50:10');
      expect(instance.interval.getValue()).toBe('50:10');
      expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('50:10');
    });
  });
});
