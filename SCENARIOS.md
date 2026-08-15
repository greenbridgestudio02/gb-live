# GreenBridge Live — Scénarios de scène

Ce document décrit des situations réelles auxquelles GreenBridge Live doit savoir répondre.

Une fonctionnalité doit répondre à un besoin concret de scène et non simplement à une possibilité technique.

---

## S001 — Interruption immédiate et imprévue

### Situation

Le musicien est en train de jouer.

Un organisateur, un intervenant ou une autre personne lui demande soudainement de s'arrêter.

La raison et la durée de l'interruption peuvent être inconnues.

### Réponse de GreenBridge Live

Le musicien doit pouvoir appuyer immédiatement sur STOP / Pause.

GreenBridge Live doit alors :

- arrêter le défilement des paroles ;
- mémoriser la position courante ;
- conserver le morceau actif ;
- conserver l'état du spectacle ;
- permettre une reprise ultérieure.

Aucune question ne doit être posée avant l'arrêt.

La raison de l'interruption pourra éventuellement être renseignée ensuite.

---

## S002 — Reprise après une interruption

### Situation

Après quelques secondes ou plusieurs minutes d'interruption, le musicien reçoit l'autorisation de reprendre.

### Réponse de GreenBridge Live

Le musicien doit pouvoir :

- reprendre le morceau interrompu ;
- recommencer ce morceau ;
- choisir un autre morceau ;
- revenir à la setlist.

GreenBridge Live ne doit jamais imposer la manière de reprendre.

---

## S003 — Plusieurs interruptions pendant une même soirée

### Situation

Un spectacle peut être interrompu plusieurs fois :

- allocution ;
- discours ;
- intervention d'un organisateur ;
- service du traiteur ;
- animation ;
- problème technique ;
- autre événement imprévu.

### Réponse de GreenBridge Live

Le nombre d'interruptions ne doit pas être limité.

Chaque interruption doit être indépendante et ne doit jamais empêcher une nouvelle interruption plus tard dans la soirée.

---

## S004 — Entracte prévu

### Situation

Le musicien souhaite interrompre volontairement sa prestation pendant quelques minutes.

Il peut y avoir plusieurs entractes pendant le même spectacle.

### Réponse de GreenBridge Live

Le système passe en mode Entracte.

Côté musicien :

- le spectacle est suspendu ;
- la position dans le déroulement est conservée ;
- la setlist reste accessible ;
- les favoris restent accessibles ;
- la recherche reste accessible ;
- les demandes du public restent consultables.

Côté public, un écran spécifique peut indiquer que le spectacle reprendra prochainement.

---

## S005 — Changement du prochain morceau

### Situation

Le prochain morceau prévu dans la setlist ne correspond plus à l'ambiance de la salle.

Le musicien sait quel autre titre il souhaite jouer.

### Réponse de GreenBridge Live

Le musicien doit pouvoir sélectionner rapidement un autre morceau.

La setlist constitue l'ordre prévu mais ne doit jamais empêcher cette décision.

Le changement doit pouvoir être effectué en moins de deux secondes lorsque le titre est immédiatement accessible.

---

## S006 — Demande d'un titre par le public

### Situation

Un spectateur demande un morceau précis qui n'est pas le prochain morceau prévu.

### Réponse de GreenBridge Live

Le musicien doit pouvoir utiliser la recherche pour retrouver immédiatement le titre demandé.

Il doit ensuite pouvoir choisir de le jouer sans perdre le fil du spectacle.

Après le morceau demandé, il doit pouvoir revenir naturellement à sa setlist.

GreenBridge Live ne décide jamais si la demande doit être acceptée.

---

## S007 — Utilisation des favoris

### Situation

Certains morceaux sont régulièrement utilisés pour :

- répondre à une demande ;
- effectuer un rappel ;
- modifier rapidement l'ambiance ;
- remplacer un morceau prévu.

### Réponse de GreenBridge Live

Les favoris doivent être accessibles directement depuis le mode scène.

Ils constituent un raccourci vers les morceaux choisis par le musicien.

---

## S008 — Modification de la setlist pendant le spectacle

### Situation

Le musicien décide que plusieurs morceaux doivent désormais être joués dans un ordre différent.

### Réponse de GreenBridge Live

La setlist doit pouvoir être réorganisée pendant le spectacle sans interrompre le morceau courant et sans perdre l'historique des morceaux déjà joués.

---

## S009 — Paroles pendant le morceau

### Situation

Le musicien connaît généralement son morceau mais consulte ponctuellement l'écran pour retrouver une phrase ou vérifier où il en est.

### Réponse de GreenBridge Live

Les paroles doivent :

- occuper la majeure partie de l'écran ;
- être lisibles en un coup d'œil ;
- défiler automatiquement ;
- suivre la progression définie pour le morceau ;
- pouvoir être arrêtées immédiatement ;
- reprendre de manière fiable.

L'interface ne doit pas obliger le musicien à chercher visuellement la ligne utile.

---

## S010 — Affichage destiné au public

### Situation

Le public dispose d'un écran ou d'un vidéoprojecteur différent de l'écran du musicien.

### Réponse de GreenBridge Live

L'affichage public peut présenter :

- les paroles par blocs ;
- la phrase en cours ;
- un mode karaoké ;
- un écran d'attente ;
- un écran d'entracte.

L'affichage public est synchronisé avec le spectacle mais possède sa propre présentation.

---

## S011 — Demandes du public pendant un entracte

### Situation

Le musicien est en entracte mais le public peut continuer à demander des morceaux.

### Réponse de GreenBridge Live

Les demandes peuvent continuer à être reçues pendant l'entracte.

Elles ne doivent jamais modifier automatiquement la setlist.

À la reprise, le musicien décide librement :

- de jouer un titre demandé ;
- de l'ajouter pour plus tard ;
- de l'ignorer ;
- de reprendre simplement la setlist.

---

## S012 — Fin anticipée ou prolongation du spectacle

### Situation

La durée réelle d'un événement ne correspond pas toujours à ce qui était prévu.

Le musicien peut devoir terminer plus tôt ou, au contraire, continuer plus longtemps.

### Réponse de GreenBridge Live

Le logiciel ne doit jamais considérer la durée ou le nombre de morceaux prévus comme une obligation.

Le musicien doit pouvoir terminer le spectacle à tout moment ou continuer avec d'autres morceaux.

---

# Principe général

La scène est imprévisible.

GreenBridge Live doit toujours préserver trois choses :

1. la liberté de décision du musicien ;
2. la continuité du spectacle ;
3. la capacité de retrouver immédiatement où l'on en était.

Le déroulement prévu aide le musicien.

Il ne l'enferme jamais.