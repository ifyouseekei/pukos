describe("TESTING initialization", () => {
  describe("GIVEN the consumer initializes the MusicService", () => {
    describe("WHEN the MusicService is initialized", () => {
      test("THEN it should initialize default values without error", () => {});
    });

    describe("WHEN the MusicService is played", () => {
      test("THEN it should play the default selected music", () => {});
    });

    describe("WHEN the MusicService is played when a saved music is stored in the localhost", () => {
      test("THEN it should play the default selected music from the localhost and not from the memory", () => {});
    });
  });
});

describe("TESTING playing and stopping music", () => {
  describe("GIVEN the MusicService is already initialized", () => {
    describe("WHEN the consumer plays the music", () => {
      test("THEN it should play the currently selected music", () => {});
    });

    describe("WHEN the consumer stops the music", () => {
      test("THEN it should stop the currently playing music", () => {});
    });

    describe("WHEN the consumer plays the music again", () => {
      test("THEN it should play the currently selected music from the start (00:00)", () => {});
    });
  });
});

describe("TESTING selection of music", () => {
  describe("GIVEN the MusicService is already initialized, but is not yet playing", () => {
    describe("WHEN the consumer selects a new music", () => {
      test("THEN it selects a new music and play the music", () => {});
    });

    describe("WHEN the consumer selects another music again", () => {
      test("THEN it should stop the currently selected music and play the new one", () => {});
    });
  });
});

describe("TESTING edge case - browser doesn't support audio files", () => {
  describe("GIVEN the MusicService is initialized", () => {
    describe("WHEN the consumer tries to play a music", () => {
      test("THEN it should not play anything and displays an alert", () => {});
    });
  });
});
