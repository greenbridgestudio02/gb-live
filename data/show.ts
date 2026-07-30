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
        "Déclencher l’ambiance lumineuse et préparer le morceau « Mon amour ».",
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
    },
    {
      id: "entre-deux-rives",
      title: "Entre deux rives",
      duration: "05:05",
      description: "Séquence centrale du spectacle",
      stageNotes:
        "Laisser davantage d’espace entre les phrases musicales.",
      nextAction:
        "Préparer l’ambiance du morceau « Le pont ».",
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
    },
  ],
};