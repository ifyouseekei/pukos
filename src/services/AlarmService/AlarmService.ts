import { Observable } from '../../utils/Observable.js';

/**
 * This class controls audio related functions
 * e.g. When timer has finished, and play background music
 */
class AlarmService {
  private static instance: AlarmService | null = null;
  isPlayingAlarm = new Observable<boolean>(false);
  private alarmAudio: HTMLAudioElement | null;

  private constructor() {
    if (AlarmService.instance) {
      throw new Error(
        'Cannot create multiple instances of a Singleton. Use getInstance() instead.'
      );
    }
    this.alarmAudio = document.getElementById(
      'pomodoroAlertAudio'
    ) as HTMLAudioElement | null;
    this.init();
    this.cleanup();
  }

  public static getInstance(): AlarmService {
    if (!this.instance) {
      this.instance = new AlarmService();
    }

    return this.instance;
  }

  init() {
    if (this.alarmAudio) {
      this.alarmAudio.addEventListener('ended', this.onAlarmEnded.bind(this));
    }
  }

  /**
   * Handles when the alarm's audio time has ended
   */
  onAlarmEnded() {
    if (this.alarmAudio) {
      this.alarmAudio.currentTime = 0;
    }
    this.isPlayingAlarm.setValue(false);
  }

  /**
   * Handles playing the alarm,
   * This is usually called when the timer has finished for focus/break
   */
  playAlarm(): void {
    if (!this.alarmAudio) {
      return;
    }

    this.isPlayingAlarm.setValue(true);
    this.alarmAudio.currentTime = 0;
    this.alarmAudio.play();
  }

  /**
   * Handles stopping the alarm,
   * This is usually called when the alarm is still running and the user decides to do an action (e.g. focus)
   */
  stopAlarm(): void {
    if (!this.alarmAudio) {
      return;
    }

    this.isPlayingAlarm.setValue(false);
    this.alarmAudio.currentTime = 0;
    this.alarmAudio.pause();
  }

  private cleanup(): void {
    window.addEventListener('beforeunload', () => {
      this.stopAlarm();
    });
  }
}

export default AlarmService;
