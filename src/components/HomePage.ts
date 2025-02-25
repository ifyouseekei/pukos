import PomodoroService from "../services/PomodoService/PomodoroService.js";
import { DocumentTitles } from "../utils/documentTitles.constants.js";
import { secondsToMinuteString } from "../utils/timeFormatter.utils.js";
import IntervalsController from "./IntervalsController.js";
import MainControlsController from "./MainControlsController.js";
import TimerController from "./TimerController.js";

class HomePage {
  private static instance: HomePage | null = null;

  public cleanupCallbacks: Array<() => void> = [];

  private mainControls: MainControlsController;
  private intervalSwitch: IntervalsController;
  private pomodoroService: PomodoroService;
  private timerController: TimerController;

  private constructor() {
    this.mainControls = new MainControlsController();
    this.intervalSwitch = new IntervalsController();
    this.timerController = new TimerController();
    this.pomodoroService = PomodoroService.getInstance();
  }

  init() {
    this.initTitleChange();

    this.mainControls.init();
    this.intervalSwitch.init();
    this.timerController.init();
  }

  private initTitleChange(): void {
    const modifyTitle = (remainingTime: number) => {
      if (this.pomodoroService.state.getValue() === "focus") {
        document.title = DocumentTitles.focusMode(
          secondsToMinuteString(remainingTime),
        );
        return;
      }

      if (this.pomodoroService.state.getValue() === "break") {
        document.title = DocumentTitles.breakMode(
          secondsToMinuteString(remainingTime),
        );
        return;
      }
    };

    this.pomodoroService.remainingTime.subscribe(modifyTitle);

    // Cleanup
    this.cleanupCallbacks.push(() => {
      this.pomodoroService.remainingTime.unsubscribe(modifyTitle);
    });
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
