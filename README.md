# Texas Hold'em Hand Evaluator — TDD Exam

Évaluateur et comparateur de mains de poker Texas Hold'em en TypeScript, développé en TDD.

## Lancer les tests

```bash
npm install
npm test
```

## Lancer le CLI interactif

```bash
npm run cli
```

Le programme demande :
1. Le nombre de joueurs (≥ 2)
2. Les 5 cartes du board
3. Les 2 hole cards de chaque joueur

Puis affiche la meilleure main de chaque joueur et le(s) gagnant(s).

**Format des cartes** : `<rang><couleur>` séparés par des espaces.
- Rang : `2`–`9`, `10`, `J`, `Q`, `K`, `A`
- Couleur : `s` ♠ · `h` ♥ · `d` ♦ · `c` ♣
- Exemples : `As  Kh  10d  2c  Jh`

```
Board     : A♠  K♥  Q♦  J♠  10♣

Joueur 1  🏆
  Hole cards     : A♥  A♦
  Meilleure main : A♥  A♦  A♠  K♥  Q♦
  Catégorie      : Three of a Kind

Joueur 2
  Hole cards     : 2♥  3♦
  Meilleure main : A♠  K♥  Q♦  J♠  10♣
  Catégorie      : Straight
```

## Structure

```
src/
  types.ts      → Card, HandResult, PlayerHand, ComparisonResult, HandCategory
  evaluator.ts  → evaluateHand5(), evaluateBest7()
  comparer.ts   → compareHands(), compareAllPlayers()
  cli.ts        → CLI interactif
tests/
  01-hand-categories.test.ts     → 9 catégories (HighCard → StraightFlush)
  02-tie-break-rules.test.ts     → Tie-break sections 4.1 à 4.8
  03-best-of-7-selection.test.ts → Meilleure main parmi 7 cartes
  04-edge-cases.test.ts          → Wheel, steel wheel, flush >5 suited, ordering chosen5
  05-multi-player-comparison.test.ts → Multi-joueurs, split pot, exemples A–E
```
