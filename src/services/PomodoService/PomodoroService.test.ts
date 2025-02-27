import * as TickWorkerJS from '../../utils/TickWorker.js';
import PomodoroService from './PomodoroService.js';

jest.mock('../../utils/TickWorker.js');

describe('scenario: saving focus time to local storage', () => {
  let pomodoroService: PomodoroService;
  let registeredEventListeners: Record<string, any> = {};

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear local storage
    localStorage.clear();
    // Reset the singleton
    (PomodoroService as any).instance = null;

    jest.spyOn(TickWorkerJS, 'TickWorker').mockReturnValue({
      createWorker: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      terminate: jest.fn(),
      worker: {
        postMessage: jest.fn(),
        terminate: jest.fn(),
        dispatchEvent: jest.fn(),
        addEventListener: jest.fn((event, handler) => {
          registeredEventListeners[event] = handler;
        }),
        onerror: jest.fn(),
        onmessage: jest.fn(),
        onmessageerror: jest.fn(),
        removeEventListener: jest.fn(),
      },
    });

    // Create a fresh instance for each test
    pomodoroService = PomodoroService.getInstance();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    (PomodoroService as any).instance = null;
  });

  describe('given the consumer starts a pomodoro session', () => {
    describe('when the focus time is updated', () => {
      test('then also updates local storage', () => {
        // Mock localStorage.setItem
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        // Make sure local storage has no value yet
        expect(
          localStorage.getItem(PomodoroService.localStorageKeys.focusTime)
        ).toBeNull();

        // Initial focus time should be 0
        expect(pomodoroService.focusTime.getValue()).toBe(0);

        // Start focus session
        pomodoroService.onFocus();

        // Verify timer is running
        expect(pomodoroService.isTimerRunning).toBe(true);
        expect(pomodoroService.state.getValue()).toBe('focus');

        // Simulate a tick event from the worker
        expect(registeredEventListeners['message']).toEqual(expect.any(Function));
        registeredEventListeners['message']({
          data: TickWorkerJS.TICK_IDS.id,
        });

        // Now focus time should be incremented
        expect(pomodoroService.focusTime.getValue()).toBe(1);

        // Verify localStorage was updated
        expect(setItemSpy).toHaveBeenCalledWith(
          PomodoroService.localStorageKeys.focusTime,
          '1'
        );
        expect(
          localStorage.getItem(PomodoroService.localStorageKeys.focusTime)
        ).toBe('1');
      });
    });

    describe('when the consumer starts a new session', () => {
      test('then loads the focus time from local storage', () => {
        // Setup localStorage with an existing value
        localStorage.setItem(PomodoroService.localStorageKeys.focusTime, '4');

        // Reset the singleton to force a new instance
        (PomodoroService as any).instance = null;

        // Get a new instance
        const newPomodoroService = PomodoroService.getInstance();

        // Verify it loaded the value from localStorage
        expect(newPomodoroService.focusTime.getValue()).toBe(4);
      });
    });
  });
});

describe('scenario: edge-case when loading invalid value from localStorage to focusTime', () => {
  describe('given the consumer starts the pomodoro session', () => {
    describe('when the stored focus time on the local storage is an invalid value', () => {
      test('then it should not read the value but instead default to 0', () => {
        // Setup localStorage with an invalid value
        localStorage.setItem(
          PomodoroService.localStorageKeys.focusTime,
          'test'
        );

        // Reset the singleton to force a new instance
        (PomodoroService as any).instance = null;

        // Get a new instance
        const newPomodoroService = PomodoroService.getInstance();

        // Verify it loaded the value from localStorage
        expect(newPomodoroService.focusTime.getValue()).toBe(0);
      });
    });
  });
});
