# Texas Hold'em Hand Evaluator — TDD Exam

## Description

Implémentation en TypeScript d'un évaluateur et comparateur de mains de poker Texas Hold'em, développé entièrement en TDD (Test-Driven Development).

## Lancer les tests

```bash
npm install
npm test           # run all tests with coverage
npm run test:watch # watch mode
```

## Structure du projet

```
src/
  types.ts      → Interfaces Card, HandResult, PlayerHand, ComparisonResult + enum HandCategory
  evaluator.ts  → evaluateHand5(), evaluateBest7()
  comparer.ts   → compareHands(), compareAllPlayers()
tests/
  helpers.ts                     → Utilitaires partagés (c(), constantes de rangs)
  01-hand-categories.test.ts     → Détection des 9 catégories
  02-tie-break-rules.test.ts     → Règles de tie-break (sections 4.1 à 4.8)
  03-best-of-7-selection.test.ts → Sélection best-of-7 (trous + board)
  04-edge-cases.test.ts          → Cas limites (wheel, flush >5 suited, ordering chosen5)
  05-multi-player-comparison.test.ts → Comparaison multi-joueurs, exemples du sujet
```

## API publique

### `evaluateHand5(cards: Card[]): HandResult`
Reçoit exactement 5 cartes et retourne la catégorie + les 5 cartes ordonnées.

### `evaluateBest7(holeCards: [Card, Card], board: [Card, Card, Card, Card, Card]): HandResult`
Choisit automatiquement la meilleure combinaison de 5 cartes parmi les 7 disponibles.

### `compareHands(a: HandResult, b: HandResult): number`
Retourne `> 0` si `a > b`, `< 0` si `a < b`, `0` si égalité.

### `compareAllPlayers(players: PlayerHand[]): ComparisonResult`
Retourne les indices des gagnants et la main évaluée de chaque joueur.

## Ordering de `chosen5`

| Catégorie        | Ordre des 5 cartes retournées                              |
|------------------|------------------------------------------------------------|
| StraightFlush    | Plus haute carte → plus basse (wheel : 5,4,3,2,A)         |
| FourOfAKind      | Les 4 cartes du carré, puis le kicker                      |
| FullHouse        | Le triplet (×3), puis la paire (×2)                        |
| Flush            | Ordre décroissant des rangs                                |
| Straight         | Plus haute carte → plus basse (wheel : 5,4,3,2,A)         |
| ThreeOfAKind     | Le triplet (×3), puis kickers décroissants                 |
| TwoPair          | Haute paire, basse paire, kicker                           |
| OnePair          | La paire, puis kickers décroissants                        |
| HighCard         | Ordre décroissant des rangs                                |

## Hypothèses sur les entrées

- On suppose qu'il n'y a **pas de cartes dupliquées** dans l'ensemble des 7 cartes d'un joueur (2 trous + 5 board).
- Les entrées invalides (< 5 cartes, doublons) ne sont pas validées — comportement indéfini.

## Ce qui est hors-scope

- Règles de mise (blinds, antes, side pots)
- Jokers / wildcards
- Hiérarchie des couleurs pour le tie-break (les couleurs ne servent qu'à détecter un flush)
