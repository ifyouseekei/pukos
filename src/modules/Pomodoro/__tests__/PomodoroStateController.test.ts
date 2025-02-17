import PomodoroStateController from '../PomodoroStateController';

describe('PomodoroStateController', () => {
  let controller: typeof PomodoroStateController;

  beforeEach(() => {
    // Reset singleton instance before each test
    controller = PomodoroStateController;
    controller.state.setValue('pre-focus'); // Reset state
  });

  test('should initialize with the correct default values', () => {
    expect(controller.state.getValue()).toBe('pre-focus');
    expect(controller.focusTime.getValue()).toBe(0);
    expect(controller.totalTime.getValue()).toBe(0);
  });
});
