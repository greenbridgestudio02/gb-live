export type Song = {
  id: string;
  title: string;
  duration: string;
  description: string;
  stageNotes: string;
  nextAction: string;
  lyrics: string;
};

export type Show = {
  id: string;
  title: string;
  songs: Song[];
};