import { Observable } from "../../utils/Observable.js";

enum BackgroundMusicValues {
  BrownNoise = "brown_noise",
  ClockTicking = "clock_ticking",
}

/**
 * this class offers playing background noises offered by the app
 * e.g. brown noise, white noise, etc.
 */
class MusicService {
  public static localStorageKeys = {
    selectedMusicId: "selectedMusicId",
  };
  public isPlaying = new Observable<boolean>(false);
  public selectedMusicId = new Observable<BackgroundMusicValues>(
    BackgroundMusicValues.BrownNoise,
  );

  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;

  private musicFiles: Record<BackgroundMusicValues, string> = {
    [BackgroundMusicValues.BrownNoise]: "/audio/brown-noise.mp3",
    [BackgroundMusicValues.ClockTicking]: "/audio/clock-ticking.mp3",
  };

  async loadAudioFile(url: string) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }

  private static errorTexts = {
    audioFileUnsupported:
      "Cannot play music, your browser does not support the audio element.",
    invalidAudioFile: "missing audio file.",
  };

  constructor() {
    this.selectedMusicId.subscribe((musicId) => {
      localStorage.setItem(
        MusicService.localStorageKeys.selectedMusicId,
        musicId,
      );
    });
    this.syncSelectedMusicIdFromLocalStorage();
  }

  syncSelectedMusicIdFromLocalStorage() {
    const localStorageMusicId = localStorage.getItem(
      MusicService.localStorageKeys.selectedMusicId,
    );
    if (!MusicService.isValidMusicId(localStorageMusicId)) {
      return;
    }

    this.selectedMusicId.setValue(localStorageMusicId);
  }

  async play() {
    this.isPlaying.setValue(true);

    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (!this.audioBuffer) {
      await this.loadAudioFile(
        this.musicFiles[this.selectedMusicId.getValue()],
      );
    }

    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer!;
    this.sourceNode.loop = true; // Enables seamless looping

    this.gainNode = this.audioContext.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.sourceNode.loopStart = 0.1;
    this.sourceNode.start(0.1);
  }
  stop() {
    this.isPlaying.setValue(false);

    this.audioContext = null;
    this.audioBuffer = null;

    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
  }
  // public stop(): void {
  //   this.isPlaying.setValue(false);
  //
  //   const currentMusic = this.currentMusic;
  //   if (!currentMusic) {
  //     alert(MusicService.errorTexts.audioFileUnsupported);
  //     return;
  //   }
  //
  //   currentMusic.currentTime = 0;
  //   currentMusic.pause();
  // }

  public onSelectMusicId(backgroundMusicId: BackgroundMusicValues): void {
    // no need to process if the current is the same
    if (this.selectedMusicId.getValue() === backgroundMusicId) {
      return;
    }

    this.selectedMusicId.setValue(backgroundMusicId);

    if (!this.musicFiles[backgroundMusicId]) {
      alert(MusicService.errorTexts.invalidAudioFile);
      return;
    }

    // remove the currently playing buffer
    this.audioBuffer = null;

    // stop the currently playing sound
    this.stop();

    // play the new selected background music
    this.play();
  }

  static isValidMusicId(musicId: unknown): musicId is BackgroundMusicValues {
    if (typeof musicId !== "string") {
      return false;
    }

    return Object.values(BackgroundMusicValues).includes(
      musicId as BackgroundMusicValues,
    );
  }
}

export default MusicService;
