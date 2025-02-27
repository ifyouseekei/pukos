import MusicService from '../services/MusicService/MusicService.js';
import IntervalsController from './IntervalsController.js';
import MainControlsController from './MainControlsController.js';
import MusicController from './MusicController.js';
import TimerController from './TimerController.js';

class HomePage {
  private static instance: HomePage | null = null;

  /** controllers */
  private mainControls: MainControlsController;
  private intervalsController: IntervalsController;
  private timerController: TimerController;
  private musicController: MusicController;

  public cleanupCallbacks: Array<() => void> = [];

  private constructor() {
    this.mainControls = new MainControlsController();
    this.intervalsController = new IntervalsController();
    this.timerController = new TimerController();
    this.musicController = new MusicController(new MusicService());
  }

  init() {
    this.mainControls.init();
    this.intervalsController.init();
    this.timerController.init();
    this.musicController.init();
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

window.addEventListener('unload', HomePage.getInstance().cleanup);

export default HomePage.getInstance();
