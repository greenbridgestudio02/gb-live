# GreenBridge Live — Décisions de conception

Ce document conserve les décisions structurantes du projet GreenBridge Live.

Les scénarios décrivent ce qui arrive sur scène.
Les décisions décrivent la manière dont GreenBridge Live doit y répondre.

---

## D001 — La règle des deux secondes

Toute action essentielle pendant un spectacle doit être accessible ou réalisable en moins de deux secondes.

Cette règle concerne notamment :

- Suivant ;
- Précédent ;
- STOP / Pause ;
- Setlist ;
- Recherche ;
- Favoris ;
- sélection rapide d'un autre morceau.

Cette règle est prioritaire dans la conception du mode scène.

---

## D002 — La setlist est une intention, pas une contrainte

La setlist représente l'ordre prévu du spectacle.

Le musicien peut à tout moment :

- changer le prochain morceau ;
- sauter un morceau ;
- jouer un morceau non prévu ;
- répondre à une demande du public ;
- modifier l'ordre de la suite du spectacle.

GreenBridge Live ne doit jamais obliger le musicien à respecter l'ordre initial.

---

## D003 — Le musicien décide

GreenBridge Live n'est pas un assistant artistique chargé de choisir les morceaux.

Le musicien sait quel titre il souhaite jouer.

GreenBridge Live doit lui permettre d'accéder à ce titre aussi rapidement que possible.

---

## D004 — Les paroles sont prioritaires en mode scène

Les paroles occupent la majeure partie de l'écran.

Les commandes restent accessibles mais ne doivent pas gêner la lecture.

L'interface doit être adaptée à une tablette placée juste au-dessus du clavier et consultée par de courts coups d'œil.

---

## D005 — Le STOP / Pause est permanent

Pendant un spectacle, une commande STOP / Pause doit toujours être immédiatement accessible.

Un seul appui suffit pour suspendre GreenBridge Live.

Aucune confirmation préalable ne doit empêcher l'arrêt.

---

## D006 — Sécuriser avant de questionner

Lors d'un STOP / Pause, GreenBridge Live commence par :

1. arrêter le défilement ;
2. mémoriser la position ;
3. conserver le morceau courant ;
4. conserver l'état du spectacle.

Seulement ensuite, le logiciel peut proposer au musicien de préciser la raison de l'interruption.

Cette information reste facultative.

---

## D007 — Une interruption n'impose pas la reprise

Après une interruption, le musicien peut décider de :

- reprendre exactement où il s'était arrêté ;
- recommencer le morceau ;
- choisir un autre morceau ;
- reprendre la setlist ailleurs ;
- rester en attente.

GreenBridge Live ne présume jamais de la décision du musicien.

---

## D008 — Les interruptions sont illimitées

Un spectacle peut comporter autant d'interruptions que nécessaire.

Elles peuvent être prévues ou imprévues.

Exemples :

- entracte ;
- allocution ;
- discours ;
- intervention ;
- service du traiteur ;
- animation ;
- incident technique ;
- autre.

---

## D009 — Plusieurs entractes sont possibles

L'entracte n'est pas un événement unique.

Un même spectacle peut comporter plusieurs entractes.

Chaque entracte possède son propre début et sa propre reprise.

---

## D010 — Setlist, Recherche et Favoris restent accessibles

Même pendant le spectacle, le musicien doit pouvoir accéder rapidement à :

- la setlist ;
- la recherche ;
- ses favoris.

Ces trois fonctions constituent les principaux moyens de sortir du déroulement prévu.

---

## D011 — Une demande du public ne modifie rien automatiquement

Une demande de chanson est une information destinée au musicien.

Elle ne doit jamais :

- lancer automatiquement le morceau ;
- modifier automatiquement la setlist ;
- imposer le prochain titre.

Le musicien reste seul décisionnaire.

---

## D012 — Le morceau joué et la position dans la setlist sont deux notions différentes

Le morceau actuellement joué peut ne pas être celui prévu à cet endroit de la setlist.

GreenBridge Live doit donc conserver séparément :

- la position dans la setlist ;
- le morceau actuellement joué.

Cela permet de faire un détour puis de revenir au déroulement prévu.

---

## D013 — Le musicien et le public ont deux interfaces différentes

Les deux affichages sont synchronisés mais répondent à des besoins différents.

### Musicien

Priorité à :

- la lisibilité ;
- la position dans les paroles ;
- la navigation ;
- la setlist ;
- la recherche ;
- les favoris ;
- le STOP / Pause.

### Public

Priorité à :

- la présentation ;
- les paroles ;
- le mode karaoké ;
- les informations d'entracte ;
- les éventuelles demandes de chansons.

---

## D014 — Le karaoké public suit la progression du morceau

L'affichage public pourra mettre en évidence la phrase actuellement chantée.

La synchronisation doit être partagée avec le système de paroles du musicien afin de ne pas maintenir deux chronologies différentes.

---

## D015 — Le défilement des paroles doit pouvoir être automatisé

Chaque morceau pourra posséder les informations nécessaires à son défilement automatique.

Le système doit permettre :

- un démarrage contrôlé ;
- un défilement progressif ;
- un arrêt immédiat ;
- une reprise fiable.

Une synchronisation plus précise par phrases pourra être ajoutée.

---

## D016 — Le mode scène doit être simple sans être simpliste

Réduire le nombre d'informations affichées ne doit jamais supprimer la capacité du musicien à réagir à l'imprévu.

GreenBridge Live doit rester un outil de scène puissant, même lorsque son interface paraît simple.

---

# Principe de décision

Lorsqu'une nouvelle fonction est envisagée, quatre questions doivent être posées :

1. Quel problème réel de scène résout-elle ?
2. Peut-elle respecter la règle des deux secondes lorsqu'elle est critique ?
3. Que se passe-t-il lorsque le spectacle ne se déroule pas comme prévu ?
4. Peut-elle rester discrète lorsqu'elle n'est pas utilisée ?

GreenBridge Live doit s'adapter au spectacle.

Le spectacle ne doit jamais avoir à s'adapter à GreenBridge Live.