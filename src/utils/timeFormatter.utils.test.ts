import { secondsToFormattedTime, secondsToMinuteString } from './timeFormatter.utils';

describe('given below one minute', () => {
  test('it should display MM:ss format', () => {
    expect(secondsToMinuteString(30)).toBe('00:30');
    expect(secondsToMinuteString(20)).toBe('00:20');
    expect(secondsToMinuteString(0)).toBe('00:00');
  });
});
describe('given above one minute, but less than an hour', () => {
  test('it should display MM:ss format', () => {
    expect(secondsToMinuteString(3599)).toBe('59:59');
    expect(secondsToMinuteString(60)).toBe('01:00');
  });
});
describe('given above one hour', () => {
  test('it should display MM:ss format', () => {
    expect(secondsToMinuteString(3600)).toBe('60:00');
    expect(secondsToMinuteString(3601)).toBe('60:01');
  });
});
describe('given invalid values', () => {
    test('it should show "--:--"', () => {
    // @ts-expect-error - intentionally passing an invalid value
    expect(secondsToMinuteString(null)).toBe('--:--');

    // @ts-expect-error - intentionally passing an invalid value
    expect(secondsToMinuteString(undefined)).toBe('--:--');

    expect(secondsToMinuteString(NaN)).toBe('--:--');

    // @ts-expect-error - intentionally passing an invalid value
    expect(secondsToMinuteString({})).toBe('--:--');
  });
});

describe('TESTING secondsToFormattedTime', () => {
  describe('given valid values', () => {
    test('it should convert to expected value', () => {
      expect(secondsToFormattedTime(3600)).toBe('01:00:00');
      expect(secondsToFormattedTime(800000)).toBe('222:13:20');
      expect(secondsToFormattedTime(20)).toBe('00:20');
      expect(secondsToFormattedTime(61)).toBe('01:01');
      expect(secondsToFormattedTime(60)).toBe('01:00');
      expect(secondsToFormattedTime(0)).toBe('00:00');
    })
  });
  describe('given invalid values', () => {
    test('it should show "--:--"', () => {
      // @ts-expect-error - intentionally passing an invalid value
      expect(secondsToFormattedTime(null)).toBe('--:--');

      // @ts-expect-error - intentionally passing an invalid value
      expect(secondsToFormattedTime(undefined)).toBe('--:--');

      expect(secondsToFormattedTime(NaN)).toBe('--:--');

      expect(secondsToFormattedTime(-2)).toBe('--:--');

      // @ts-expect-error - intentionally passing an invalid value
      expect(secondsToFormattedTime({})).toBe('--:--');
    });
  });
});
