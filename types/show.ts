export type LyricLine = {
  time: number;
  text: string;
};

export type SongKind = "vocal" | "instrumental";

export type Song = {
  id: string;
  title: string;
  duration: string;
  description: string;
  stageNotes: string;
  nextAction: string;

  kind?: SongKind;

  lyrics: string;

  lyricLines?: LyricLine[];
};

export type Show = {
  id: string;
  title: string;
  songs: Song[];
};