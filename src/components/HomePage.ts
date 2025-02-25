import IntervalsController from "./IntervalsController.js";
import MainControlsController from "./MainControlsController.js";
import TimerController from "./TimerController.js";

class HomePage {
  private static instance: HomePage | null = null;

  /** controllers */
  private mainControls: MainControlsController;
  private intervalsController: IntervalsController;
  private timerController: TimerController;

  public cleanupCallbacks: Array<() => void> = [];

  private constructor() {
    this.mainControls = new MainControlsController();
    this.intervalsController = new IntervalsController();
    this.timerController = new TimerController();
  }

  init() {
    this.mainControls.init();
    this.intervalsController.init();
    this.timerController.init();
  }

  cleanup(): void {
    this.cleanupCallbacks.forEach((cb) => cb());
    this.mainControls.cleanup();
  }

  public static getInstance(): HomePage {
    if (!this.instance) {
      this.instance = new HomePage();
    }

    return this.instance;
  }
}

window.addEventListener("unload", HomePage.getInstance().cleanup);

export default HomePage.getInstance();
