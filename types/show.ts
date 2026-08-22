export type LyricLine = {
  time: number;
  text: string;
};

export type SongKind =
  | "vocal"
  | "instrumental";

export type MontageMidiConfig = {
  enabled: boolean;

  channel: number;

  bankMsb: number;

  bankLsb: number;

  program: number;

  liveSetBank?: number;

  liveSetPage?: number;

  liveSetSlot?: number;
};

export type Song = {
  id: string;

  title: string;

  duration: string;

  description: string;

  stageNotes: string;

  nextAction: string;

  kind?: SongKind;

  bpm?: number;

  key?: string;

  lyrics: string;

  lyricLines?: LyricLine[];

  needsLyricsSync?: boolean;

  montage?: MontageMidiConfig;
};

export type Show = {
  id: string;

  title: string;

  songs: Song[];
};