declare class IdleDetector {
  static requestPermission(): Promise<'granted' | 'denied'>;
  start(options: { threshold: number; signal?: AbortSignal }): Promise<void>;
  userState: 'active' | 'idle';
  screenState: 'locked' | 'unlocked';
  addEventListener(
    type: 'change',
    listener: (this: IdleDetector, ev: Event) => any
  ): void;
}

type AppResponseType<T extends unknown> = [T, null] | [null, Error];