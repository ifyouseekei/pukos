import { secondsToTimeString } from './secondsToTimeString';

describe('given below one minute', () => {
  test('it should display MM:ss format', () => {
    expect(secondsToTimeString(30)).toBe('00:30');
    expect(secondsToTimeString(20)).toBe('00:20');
    expect(secondsToTimeString(0)).toBe('00:00');
  });
});
describe('given above one minute, but less than an hour', () => {
  test('it should display MM:ss format', () => {
    expect(secondsToTimeString(3599)).toBe('59:59');
    expect(secondsToTimeString(60)).toBe('01:00');
  });
});
describe('given above one hour', () => {
  test('it should display MM:ss format', () => {
    expect(secondsToTimeString(3600)).toBe('60:00');
    expect(secondsToTimeString(3601)).toBe('60:01');
  });
});
describe('given invalid values', () => {
  test('it should throw an error', () => {
    // @ts-expect-error - intentionally passing an invalid value
    expect(secondsToTimeString(null)).toBe('--:--');

    // @ts-expect-error - intentionally passing an invalid value
    expect(secondsToTimeString(undefined)).toBe('--:--');

    expect(secondsToTimeString(NaN)).toBe('--:--');

    // @ts-expect-error - intentionally passing an invalid value
    expect(secondsToTimeString({})).toBe('--:--');
  });
});
