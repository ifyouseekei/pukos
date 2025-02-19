import { Observable } from '../utils/Observable.js';

declare global {
  interface Window {
    IdleDetector?: any;
  }
}
class IdleCheckerService {
  private static instance: IdleCheckerService | null = null;
  private static idleThreshold = 60_000;
  private controller = new AbortController();
  private signal = this.controller.signal;

  isIdle: Observable<boolean>;

  private constructor() {
    if (IdleCheckerService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
    this.isIdle = new Observable<boolean>(false);
  }

  private requestPermission() {
    return IdleDetector.requestPermission();
  }

  async init() {
    if (!('IdleDetector' in window)) {
      console.warn('Idle Detection API not supported in this browser.');
      return;
    }

    if ((await this.requestPermission()) !== 'granted') {
      console.error('Idle detection permission denied.');
      return;
    }

    try {
      // Request permission to use Idle Detection API
      const permission = await navigator.permissions.query({
        name: 'idle-detection' as any,
      });

      if (permission.state !== 'granted') {
        console.warn('Idle Detection permission denied.');
        return;
      }

      const idleDetector = new window.IdleDetector();

      // Initialize new abort signal since abort signal can only be used once
      this.controller = new AbortController();
      this.signal = this.controller.signal;

      // Set idle detection threshold (seconds)
      await idleDetector.start({
        threshold: IdleCheckerService.idleThreshold,
        signal: this.signal, // Allows stopping if needed
      });

      // Listen for idle/active changes
      idleDetector.addEventListener('change', () => {
        console.log(`User state: ${idleDetector.userState}`);
        console.log(`Screen state: ${idleDetector.screenState}`);

        if (idleDetector.userState === 'idle') {
          console.log('User is idle! Perform logout or warning action.');
        }
      });

      console.log('Idle Detector initialized.');
    } catch (error) {
      console.error('Idle Detection failed:', error);
    }
  }

  public stop() {
    this.controller.abort();
    console.log('Idle Detector stopped');
  }

  public static getInstance(): IdleCheckerService {
    if (!this.instance) {
      this.instance = new IdleCheckerService();
    }
    return this.instance;
  }
}

window.addEventListener('beforeunload', () => {
  IdleCheckerService.getInstance().stop();
});

export default IdleCheckerService.getInstance();
