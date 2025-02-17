class MainControlButtons {
  private static instance: MainControlButtons | null = null;

  startFocusButtonEl: HTMLButtonElement;
  takeABreakButtonEl: HTMLButtonElement;

  private constructor() {
    const focusButtonEl = document.querySelector('#focus-button');
    if (!focusButtonEl) {
      throw new Error('Focus button is missing from DOM');
    }
    this.startFocusButtonEl = focusButtonEl as HTMLButtonElement;

    const takeABreakButtonEl = document.querySelector('#take-break-button');
    if (!takeABreakButtonEl) {
      throw new Error('Focus button is missing from DOM');
    }
    this.takeABreakButtonEl = takeABreakButtonEl as HTMLButtonElement;
  }

  public static getInstance(): MainControlButtons {
    if (!this.instance) {
      this.instance = new MainControlButtons();
    }

    return this.instance;
  }

  /**
   * When the user is in "focus" mode
   */
  showFocusedState() {
    this.takeABreakButtonEl.style.display = 'flex';
    this.startFocusButtonEl.style.display = 'none';
  }

  /**
   * When the user is in "break" mode
   */
  showTakingABreakState() {
    this.startFocusButtonEl.style.display = 'flex';
    this.takeABreakButtonEl.style.display = 'none';
  }
}

export default MainControlButtons.getInstance();
