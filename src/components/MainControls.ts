import { PomodoroStates } from '../services/PomodoService/Pomodoro.types.js';
import PomodoroService from '../services/PomodoService/PomodoroService.js';
import { getOrThrowElement } from '../utils/getOrThrowElement.js';

/**
 * This class controls the actions and events
 * of the "Focus Button" and "End Session".
 *
 * More likely the main controls of the pomodoro
 */
class MainControls {
  focusTextEl: HTMLSpanElement;
  focusButtonEl: HTMLButtonElement;
  endSessionButtonEl: HTMLButtonElement;

  constructor() {
    // init elements
    this.focusTextEl = getOrThrowElement('#focus-text');
    this.focusButtonEl = getOrThrowElement('#focus-button');
    this.endSessionButtonEl = getOrThrowElement('#end-session-button');
  }

  init() {
    // init actions
    this.focusButtonEl.addEventListener(
      'click',
      this.handleFocusButtonClicked.bind(this)
    );
    this.endSessionButtonEl.addEventListener(
      'click',
      this.handleEndSession.bind(this)
    );

    // init subscriptions
    PomodoroService.state.subscribe(this.handleChangePomodoroState.bind(this));
  }

  handleFocusButtonClicked() {
    switch (PomodoroService.state.getValue()) {
      case 'pre-focus':
      case 'break':
        // IdleCheckerService.init();
        PomodoroService.onFocus();
        break;
      case 'pre-break':
      case 'focus':
        PomodoroService.onBreak();
        break;
      default:
    }
  }
  handleEndSession() {
    // IdleCheckerService.stop();
    PomodoroService.onReset();
  }

  handleChangePomodoroState(state: PomodoroStates) {
    this.focusButtonEl.classList.remove('focus-button--focus');
    this.focusButtonEl.classList.remove('focus-button--pre-break');
    this.focusButtonEl.classList.remove('focus-button--break');

    switch (state) {
      case 'pre-focus':
        this.focusTextEl.textContent = 'Start Focus';
        break;
      case 'focus':
        this.focusTextEl.textContent = 'Early Break';
        this.focusButtonEl.classList.add('focus-button--focus');
        break;
      case 'pre-break':
        this.focusTextEl.textContent = 'Take a Break';
        this.focusButtonEl.classList.add('focus-button--pre-break');
        break;
      case 'break':
        this.focusTextEl.textContent = 'End Break';
        this.focusButtonEl.classList.add('focus-button--break');
        break;
    }
  }

  public cleanup() {
    PomodoroService.state.unsubscribe(
      this.handleChangePomodoroState.bind(this)
    );
  }
}

export default MainControls;
