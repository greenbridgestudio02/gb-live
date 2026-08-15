import type { Show } from "../types/show";

export const show: Show = {
  id: "pont-avert-live",
  title: "Pont-Avert Live",

  songs: [
    {
      id: "ouverture",
      title: "Ouverture",
      duration: "03:20",
      description: "Introduction du spectacle",
      stageNotes:
        "Commencer au piano seul. Laisser respirer l’introduction avant de lancer les éléments visuels.",
      nextAction:
        "Préparer le morceau « Mon amour ».",
      lyrics: `Introduction instrumentale

Aucune parole pour ce morceau.`,
    },
    {
  id: "mon-amour",
  title: "Mon amour",
  duration: "04:15",
  description: "Premier morceau chanté",
  stageNotes:
    "Vérifier le niveau du micro avant l’entrée de la voix.",
  nextAction:
    "Préparer la transition vers « Entre deux rives ».",

  lyrics: `Couplet 1

Paroles provisoires du morceau « Mon amour ».

Refrain

Texte à remplacer par les paroles définitives.`,

  lyricLines: [
    {
      time: 0,
      text: "Couplet 1",
    },
    {
      time: 4,
      text: "Paroles provisoires du morceau « Mon amour ».",
    },
    {
      time: 10,
      text: "Refrain",
    },
    {
      time: 14,
      text: "Texte à remplacer par les paroles définitives.",
    },
  ],
},
    {
      id: "entre-deux-rives",
      title: "Entre deux rives",
      duration: "05:05",
      description: "Séquence centrale du spectacle",
      stageNotes:
        "Laisser davantage d’espace entre les phrases musicales.",
      nextAction:
        "Préparer le morceau « Le pont ».",
      lyrics: `Couplet 1

Paroles provisoires du morceau « Entre deux rives ».

Refrain

Texte à remplacer par les paroles définitives.`,
    },
    {
      id: "le-pont",
      title: "Le pont",
      duration: "04:40",
      description: "Morceau emblématique du spectacle",
      stageNotes:
        "Accentuer progressivement la dynamique.",
      nextAction:
        "Préparer le final du spectacle.",
      lyrics: `Couplet 1

Paroles provisoires du morceau « Le pont ».

Refrain

Texte à remplacer par les paroles définitives.`,
    },
    {
      id: "final",
      title: "Final",
      duration: "06:10",
      description: "Conclusion du spectacle",
      stageNotes:
        "Prendre le temps de laisser retomber la dernière note.",
      nextAction:
        "Fin du spectacle.",
      lyrics: `Final du spectacle

Paroles provisoires à remplacer par le texte définitif.`,
    },
  ],
};