export type LyricLine = {
  time: number;
  text: string;
};

export type Song = {
  id: string;
  title: string;
  duration: string;
  description: string;
  stageNotes: string;
  nextAction: string;

  lyrics: string;

  lyricLines?: LyricLine[];
};

export type Show = {
  id: string;
  title: string;
  songs: Song[];
};