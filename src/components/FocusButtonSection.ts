import { PomodoroStates } from '../services/PomodoService/Pomodoro.types.js';
import PomodoroService from '../services/PomodoService/PomodoroService';
import { getOrThrowElement } from '../utils/getOrThrowElement.js';

class FocusButtonSection {
  focusTextEl: HTMLSpanElement;
  focusButtonEl: HTMLButtonElement;

  constructor() {
    // init elements
    this.focusTextEl = getOrThrowElement('#focus-text');
    this.focusButtonEl = getOrThrowElement('#focus-button');
  }

  init() {
    // init actions
    this.focusButtonEl.addEventListener('click', this.handleClick.bind(this));

    // init subscriptions
    PomodoroService.state.subscribe(this.handleChangePomodoroState.bind(this));
  }

  handleClick() {
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

  handleChangePomodoroState(state: PomodoroStates) {
    switch (state) {
      case 'break':
      case 'pre-focus':
        this.focusTextEl.textContent = 'Start Focus';
        break;
      case 'focus':
        this.focusTextEl.textContent = 'Early Break';
        break;
      case 'pre-break':
        this.focusTextEl.textContent = 'Take a Break';
        break;
    }
  }
}

export default FocusButtonSection;
