import MusicService from '../services/MusicService/MusicService';
import { getOrThrowElement } from '../utils/getOrThrowElement';

class MusicController {
  private playStopButtonEl: HTMLButtonElement;

  /** list of background music to choose from */
  private backgroundMusicListEl: NodeListOf<HTMLInputElement>;

  private musicService: MusicService;

  public constructor(musicService: MusicService) {
    this.playStopButtonEl = getOrThrowElement('#play-stop-music-button');
    this.backgroundMusicListEl = document.querySelectorAll(
      'input[name="background_music"]'
    );
    this.musicService = musicService;
  }

  public init() {
    this.playStopButtonEl.addEventListener(
      'click',
      this.handlePlayStopButtonClick.bind(this)
    );

    // sets the selected interval on load
    this.backgroundMusicListEl.forEach((backgroundMusicEl) => {
      if (
        backgroundMusicEl.value === this.musicService.selectedMusicId.getValue()
      ) {
        backgroundMusicEl.checked = true;
      }
    });

    // listen to changes if the user selects a new music
    this.backgroundMusicListEl.forEach((backgroundMusicEl) => {
      backgroundMusicEl.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (!target.checked) {
          return;
        }

        const selectedMusic = target.value;
        if (!MusicService.isValidMusicId(selectedMusic)) {
          return;
        }

        this.musicService.onSelectMusicId(selectedMusic);
      });
    });

    this.musicService.isPlaying.subscribe(this.listenToIsPlaying.bind(this));
  }

  private handlePlayStopButtonClick() {
    if (this.musicService.isPlaying.getValue()) {
      this.musicService.stop();
    } else {
      this.musicService.play();
    }
  }

  private listenToIsPlaying(isPlaying: boolean) {
    this.setPlayStopButtonTitle(isPlaying ? 'stop' : 'play');
  }

  private setPlayStopButtonTitle(variant: 'play' | 'stop') {
    this.playStopButtonEl.textContent =
      variant === 'play' ? 'Play Music' : 'Stop Music';
  }
}

export default MusicController;
