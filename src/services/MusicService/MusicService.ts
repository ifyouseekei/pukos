import { Observable } from "../../utils/Observable.js";

enum BackgroundMusicIds {
  BrownNoise = "backgroundMusic__brownNoise",
  WhiteNoise = "backgroundMusic__whiteNoise",
}

/**
 * this class offers playing background noises offered by the app
 * e.g. brown noise, white noise, etc.
 */
class MusicService {
  public isPlaying = new Observable<boolean>(false);
  public selectedMusicId = new Observable<BackgroundMusicIds>(
    BackgroundMusicIds.BrownNoise,
  );

  private static errorTexts = {
    audioFileUnsupported:
      "Cannot play music, your browser does not support the audio element.",
  };

  // audio files can be nullable since not all browsers supported them at the moment.
  // TODO: we prob need to make this dynamic later on, but for now, its only 2 so we do this
  private backgroundMusics: Record<
    BackgroundMusicIds,
    HTMLAudioElement | null
  > = {
    [BackgroundMusicIds.BrownNoise]: null,
    [BackgroundMusicIds.WhiteNoise]: null,
  };

  constructor() {
    // TODO: we prob need to make this dynamic later on, but for now, its only 2 so we do this
    this.backgroundMusics[BackgroundMusicIds.BrownNoise] =
      document.getElementById(
        BackgroundMusicIds.BrownNoise,
      ) as HTMLAudioElement | null;

    this.backgroundMusics[BackgroundMusicIds.WhiteNoise] =
      document.getElementById(
        BackgroundMusicIds.WhiteNoise,
      ) as HTMLAudioElement | null;
  }

  get currentMusic(): HTMLAudioElement | null {
    return this.backgroundMusics[this.selectedMusicId.getValue()];
  }

  public play(): void {
    this.isPlaying.setValue(true);

    const currentMusic = this.currentMusic;
    if (!currentMusic) {
      alert(MusicService.errorTexts.audioFileUnsupported);
      return;
    }

    currentMusic.currentTime = 0;
    currentMusic.play();
  }

  public stop(): void {
    this.isPlaying.setValue(false);

    const currentMusic = this.currentMusic;
    if (!currentMusic) {
      alert(MusicService.errorTexts.audioFileUnsupported);
      return;
    }

    currentMusic.currentTime = 0;
    currentMusic.pause();
  }

  public onSelectMusicId(backgroundMusicId: BackgroundMusicIds): void {
    // no need to process if the current is the same
    if (this.selectedMusicId.getValue() === backgroundMusicId) {
      return;
    }

    this.selectedMusicId.setValue(backgroundMusicId);

    if (!this.isPlaying) {
      return;
    }

    if (!this.backgroundMusics[backgroundMusicId]) {
      return;
    }

    // stop the currently playing sound
    this.stop();

    // play the new selected background music
    this.play();
  }
}

export default MusicService;
