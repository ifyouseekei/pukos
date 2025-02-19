import { Observable } from '../utils/Observable.js'

declare global {
    interface Window {
        IdleDetector?: any;
    }
}
class IdleCheckerService {
  private static instance: IdleCheckerService | null = null;
  isIdle: Observable<boolean>;
  idleDetector: any;

  private constructor() {
    if (IdleCheckerService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
    this.isIdle = new Observable<boolean>(false);
    this.idleDetector = null;
  }

  async init() {
    if (!("IdleDetector" in window)) {
      console.warn("Idle Detection API not supported in this browser.");
      return;
    }

    try {
      // Request permission to use Idle Detection API
      const permission = await navigator.permissions.query({ name: "idle-detection" as any});

      if (permission.state !== "granted") {
        console.warn("Idle Detection permission denied.");
        return;
      }

      this.idleDetector = new window.IdleDetector();

      // Set idle detection threshold (seconds)
      await this.idleDetector.start({
        threshold: 60_000, // 5 minutes
        signal: new AbortController().signal // Allows stopping if needed
      });

      // Listen for idle/active changes
      this.idleDetector.addEventListener("change", () => {
        console.log(`User state: ${this.idleDetector.userState}`);
        console.log(`Screen state: ${this.idleDetector.screenState}`);

        if (this.idleDetector.userState === "idle") {
          console.log("User is idle! Perform logout or warning action.");
          // Trigger an API call, log out, etc.
        }
      });

      console.log("Idle Detector initialized.");
    } catch (error) {
      console.error("Idle Detection failed:", error);
    }
  }

  public static getInstance(): IdleCheckerService {
    if (!this.instance) {
      this.instance = new IdleCheckerService();
    }
    return this.instance;
  }
}

export default IdleCheckerService.getInstance();
