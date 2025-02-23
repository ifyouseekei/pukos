import AlarmService from './AlarmService.js';

describe('AlarmService', () => {
  let alarmAudioMock: HTMLAudioElement;

  beforeEach(() => {
    alarmAudioMock = {
      play: jest.fn(),
      pause: jest.fn(),
      currentTime: 0,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLAudioElement;

    document.getElementById = jest.fn(() => alarmAudioMock) as any;

    // Reset singleton instance
    (AlarmService as any).instance = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initializing', () => {
    test('should create a singleton instance', () => {
      const instance1 = AlarmService.getInstance();
      const instance2 = AlarmService.getInstance();

      expect(instance1).toBe(instance2); // Ensure it's the same instance
    });

    test('should initialize with isPlayingAlarm as false', () => {
      const instance = AlarmService.getInstance();
      expect(instance.isPlayingAlarm.getValue()).toBe(false);
    });

    test('should set up an event listener for alarm end', () => {
      AlarmService.getInstance();
      expect(alarmAudioMock.addEventListener).toHaveBeenCalledWith(
        'ended',
        expect.any(Function)
      );
    });
  });

  describe('playing alarm', () => {
    test('should play alarm and set isPlayingAlarm to true', () => {
      const instance = AlarmService.getInstance();
      instance.playAlarm();

      expect(instance.isPlayingAlarm.getValue()).toBe(true);
      expect(alarmAudioMock.currentTime).toBe(0);
      expect(alarmAudioMock.play).toHaveBeenCalled();
    });
  });

  describe('stopping alarm', () => {
    test('should stop alarm and set isPlayingAlarm to false', () => {
      const instance = AlarmService.getInstance();
      instance.playAlarm();
      instance.stopAlarm();

      expect(instance.isPlayingAlarm.getValue()).toBe(false);
      expect(alarmAudioMock.currentTime).toBe(0);
      expect(alarmAudioMock.pause).toHaveBeenCalled();
    });
  });

  describe('onAlarmEnded', () => {
    test('should reset currentTime and set isPlayingAlarm to false', () => {
      const instance = AlarmService.getInstance();
      instance.playAlarm();
      instance.onAlarmEnded();

      expect(instance.isPlayingAlarm.getValue()).toBe(false);
      expect(alarmAudioMock.currentTime).toBe(0);
    });
  });
});
