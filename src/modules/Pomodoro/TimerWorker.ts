const START_TICK = 'start';
const STOP_TICK = 'stop';
export const TICK_ID = 'tick';

const workerCode = () => {
  let intervalId: NodeJS.Timeout;
  self.addEventListener('message', ({ data }) => {
    const { action } = data;
    if (action === START_TICK) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        self.postMessage(TICK_ID);
      }, 1000);
    } else if (action === STOP_TICK) {
      clearInterval(intervalId);
    }
  });
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

export default class TimerWorker {
  private static instance: TimerWorker | null = null;
  worker: Worker | null = null;

  private constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(worker_script);
    }
  }

  start() {
    if (!this.worker) {
      alert('Web Workers are not supported in this browser.');
      return;
    }
    this.worker.postMessage({ action: START_TICK });
  }

  stop() {
    if (!this.worker) {
      alert('Web Workers are not supported in this browser.');
      return;
    }
    this.worker.postMessage({ action: STOP_TICK });
  }

  addEventListener(handler: (this: Worker, ev: MessageEvent<any>) => void) {
    if (!this.worker) {
      return;
    }
    this.worker.addEventListener('message', handler);
  }

  public static getInstance(): TimerWorker {
    if (!this.instance) {
      this.instance = new TimerWorker();
    }

    return this.instance;
  }
}
