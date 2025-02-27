export const TICK_IDS = {
  start: "start",
  stop: "stop",
  id: "tick",
};
/**
 * TickWorker manages a web worker for ticking every second.
 * Used in the Pomodoro timer to keep track of time in the background.
 *
 * ## Usage in Pomodoro timer:
 * - Starts ticking every second when a Pomodoro **Focus** session begins.
 * - Continues ticking during **Break** sessions.
 * - Stops ticking when the timer is paused or the session ends.
 * - Terminates when the user **exits the Pomodoro session**.
 */
export class TickWorker {
  worker: Worker | null = null;

  constructor() {
    this.createWorker();
  }

  /**
   * Creates and initializes a Web Worker for time ticking.
   */
  public createWorker() {
    const workerCode = () => {
      let intervalId: NodeJS.Timeout;
      self.addEventListener("message", ({ data }) => {
        const { action } = data;
        if (action === "start") {
          clearInterval(intervalId);
          const oneSecondMs = 1000;
          intervalId = setInterval(() => {
            self.postMessage("tick");
          }, oneSecondMs);
        } else if (action === "stop") {
          clearInterval(intervalId);
        }
      });
    };

    let code = workerCode.toString();
    code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

    const blob = new Blob([code], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(workerUrl);
  }

  /**
   * Starts the ticking process, usually when a Pomodoro session begins.
   */
  start(): void {
    this.worker?.postMessage({ action: TICK_IDS.start });
  }

  /**
   * Stops the ticking process, usually when the timer is paused or session ends.
   */
  stop(): void {
    this.worker?.postMessage({ action: TICK_IDS.stop });
  }

  /**
   * Terminates the worker, freeing up resources.
   * This should be called when the Pomodoro session ends and won't restart soon.
   */
  terminate(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
