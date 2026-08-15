# GreenBridge Live — Roadmap

Cette roadmap décrit l'ordre de développement fonctionnel de GreenBridge Live.

La priorité n'est pas d'accumuler des fonctionnalités.
La priorité est d'obtenir le plus rapidement possible un outil réellement utilisable sur scène.

---

## Phase 0 — Fondations du projet

- [x] Projet Next.js fonctionnel
- [x] Structure de base de l'application
- [x] Gestion des données de morceaux
- [x] SongList
- [x] Player
- [x] Sélection d'un morceau
- [x] Navigation entre les morceaux
- [x] Affichage des paroles
- [x] Définition de la vision produit
- [x] Scénarios de scène
- [x] Décisions de conception

---

## Phase 1 — Mode Scène

### Objectif

Obtenir une première version de GreenBridge Live que le musicien pourrait réellement utiliser pendant un concert.

### Interface principale

- [ ] Créer le Mode Scène
- [ ] Donner la priorité visuelle aux paroles
- [ ] Afficher clairement le morceau courant
- [ ] Afficher la position dans la setlist
- [ ] Grandes zones tactiles adaptées à la scène

### Commandes permanentes

- [ ] Précédent
- [ ] Suivant
- [ ] Setlist
- [ ] Recherche
- [ ] Favoris
- [ ] STOP / Pause

### Navigation libre

- [ ] Jouer un morceau différent du prochain morceau prévu
- [ ] Conserver séparément le morceau courant et la position dans la setlist
- [ ] Revenir facilement au déroulement prévu
- [ ] Sauter un morceau
- [ ] Modifier le prochain morceau

---

## Phase 2 — STOP, interruptions et entractes

### STOP immédiat

- [ ] STOP accessible en permanence
- [ ] Arrêt en un seul geste
- [ ] Suspension du défilement
- [ ] Mémorisation de la position
- [ ] Conservation du contexte du spectacle

### Reprise

Après un STOP :

- [ ] Reprendre à la position mémorisée
- [ ] Recommencer le morceau
- [ ] Choisir un autre morceau
- [ ] Revenir à la setlist
- [ ] Rester en attente

### Interruptions

- [ ] Autoriser plusieurs interruptions
- [ ] Raison facultative de l'interruption
- [ ] Allocution
- [ ] Discours
- [ ] Traiteur
- [ ] Animation
- [ ] Incident technique
- [ ] Autre

### Entractes

- [ ] Créer le mode Entracte
- [ ] Autoriser plusieurs entractes par spectacle
- [ ] Conserver l'état du spectacle
- [ ] Préparer librement le morceau de reprise

---

## Phase 3 — Setlist vivante

- [ ] Afficher les morceaux déjà joués
- [ ] Afficher le morceau courant
- [ ] Afficher les morceaux restant à jouer
- [ ] Réorganiser la setlist pendant le spectacle
- [ ] Sauter temporairement un morceau
- [ ] Jouer un morceau hors setlist
- [ ] Revenir ensuite au bon endroit
- [ ] Conserver l'ordre réellement joué

---

## Phase 4 — Recherche et Favoris

### Recherche

- [ ] Recherche instantanée par titre
- [ ] Résultats adaptés à une utilisation tactile
- [ ] Jouer immédiatement un résultat
- [ ] Ajouter éventuellement un morceau à la suite du spectacle

### Favoris

- [ ] Ajouter ou retirer un favori
- [ ] Accès aux favoris depuis le Mode Scène
- [ ] Jouer immédiatement un favori

### Objectif

Permettre au musicien d'accéder au morceau qu'il a en tête en respectant autant que possible la règle des deux secondes.

---

## Phase 5 — Paroles intelligentes

- [ ] Défilement automatique
- [ ] Démarrage contrôlé
- [ ] Pause du défilement
- [ ] Reprise fiable
- [ ] Réglage du défilement par morceau
- [ ] Synchronisation par phrases
- [ ] Mise en évidence de la phrase courante

### Éditeur de synchronisation

Objectif : éviter la saisie manuelle de chronométrages complexes.

- [ ] Lancer la chanson
- [ ] Appuyer sur une touche à chaque nouvelle phrase
- [ ] Enregistrer automatiquement les repères temporels
- [ ] Permettre de corriger les repères

---

## Phase 6 — Mode Public

Créer une interface indépendante destinée à un second écran ou à un vidéoprojecteur.

- [ ] Page Public dédiée
- [ ] Synchronisation avec le morceau courant
- [ ] Affichage des paroles par blocs
- [ ] Mise en évidence de la phrase courante
- [ ] Écran d'attente
- [ ] Écran Entracte
- [ ] Écran de fin de spectacle

---

## Phase 7 — Mode Karaoké

- [ ] Utiliser la synchronisation des paroles existante
- [ ] Mettre en évidence la phrase chantée
- [ ] Différencier paroles passées, actuelles et à venir
- [ ] Présentation adaptée au public
- [ ] Activation morceau par morceau

Le karaoké ne doit pas nécessiter une deuxième synchronisation des paroles.

---

## Phase 8 — Demandes du public

- [ ] Permettre au public de rechercher les morceaux disponibles
- [ ] Envoyer une demande au musicien
- [ ] Recevoir les demandes pendant le spectacle
- [ ] Continuer à recevoir les demandes pendant un entracte
- [ ] Regrouper les demandes identiques
- [ ] Accepter ou ignorer librement une demande
- [ ] Ne jamais modifier automatiquement la setlist

---

## Phase 9 — Journal du spectacle

GreenBridge Live pourra conserver le déroulement réel de la prestation.

- [ ] Heure de début
- [ ] Morceaux réellement joués
- [ ] Ordre réellement joué
- [ ] Interruptions
- [ ] Entractes
- [ ] Heure des reprises
- [ ] Demandes du public
- [ ] Titres demandés puis joués
- [ ] Heure de fin

---

## Phase 10 — Fiabilité scène

Avant toute utilisation réelle :

- [ ] Tester l'application sur tablette
- [ ] Tester l'utilisation tactile
- [ ] Tester en faible luminosité
- [ ] Tester les erreurs de manipulation
- [ ] Tester plusieurs heures de fonctionnement
- [ ] Tester les interruptions successives
- [ ] Tester les changements de morceaux rapides
- [ ] Tester une perte de connexion du Mode Public
- [ ] Vérifier qu'une panne de l'affichage public ne perturbe jamais le musicien

---

# Priorité actuelle

La priorité de développement est :

**PHASE 1 — MODE SCÈNE**

Nous ne devons pas attendre que toutes les fonctions de GreenBridge Live soient terminées pour commencer les essais en conditions réelles.

Dès que le Mode Scène atteint un niveau suffisant de fiabilité, il doit être testé dans une vraie situation de jeu.

Les retours du terrain alimenteront ensuite SCENARIOS.md, DECISIONS.md et cette roadmap.

---

# Règle générale

Une phase peut évoluer si l'expérience de scène démontre que nos hypothèses étaient mauvaises.

La roadmap est un guide.

Elle n'est pas une contrainte.

Comme la setlist.