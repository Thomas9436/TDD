/**
 * CLI interactif Texas Hold'em
 *
 * Utilisation :
 *   npx ts-node src/cli.ts
 *
 * L'utilisateur saisit :
 *   - le nombre de joueurs
 *   - les 5 cartes du board
 *   - pour chaque joueur ses 2 hole cards
 *
 * Le programme affiche les mains et le(s) gagnant(s).
 */

import * as readline from 'readline';
import { Card, HandCategory, HoleCards, Board, Rank, Suit } from './types';
import { compareAllPlayers } from './comparer';

// ---------------------------------------------------------------------------
// Affichage
// ---------------------------------------------------------------------------

const SUIT_SYMBOL: Record<Suit, string> = {
  spades:   '♠',
  hearts:   '♥',
  diamonds: '♦',
  clubs:    '♣',
};

const RANK_LABEL: Record<number, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8',
  9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A',
};

const CATEGORY_LABEL: Record<HandCategory, string> = {
  [HandCategory.HighCard]:      'High Card',
  [HandCategory.OnePair]:       'One Pair',
  [HandCategory.TwoPair]:       'Two Pair',
  [HandCategory.ThreeOfAKind]:  'Three of a Kind',
  [HandCategory.Straight]:      'Straight',
  [HandCategory.Flush]:         'Flush',
  [HandCategory.FullHouse]:     'Full House',
  [HandCategory.FourOfAKind]:   'Four of a Kind',
  [HandCategory.StraightFlush]: 'Straight Flush',
};

function formatCard(card: Card): string {
  return `${RANK_LABEL[card.rank]}${SUIT_SYMBOL[card.suit]}`;
}

function formatCards(cards: Card[]): string {
  return cards.map(formatCard).join('  ');
}

// ---------------------------------------------------------------------------
// Parsing des cartes
//
// Format accepté : <rang><couleur>
//   rang    : 2-9, 10, J, Q, K, A  (insensible à la casse)
//   couleur : s (spades), h (hearts), d (diamonds), c (clubs)
//
// Exemples : As  Kh  10d  2c  Jh
// ---------------------------------------------------------------------------

const RANK_INPUT: Record<string, Rank> = {
  '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
  '10':10,'j':11,'q':12,'k':13,'a':14,
};

const SUIT_INPUT: Record<string, Suit> = {
  s: 'spades', h: 'hearts', d: 'diamonds', c: 'clubs',
};

function parseCard(token: string): Card | null {
  const t = token.trim().toLowerCase();
  // rang = tout sauf le dernier caractère (couleur)
  const suitChar = t[t.length - 1];
  const rankStr  = t.slice(0, -1);

  const rank = RANK_INPUT[rankStr];
  const suit = SUIT_INPUT[suitChar];

  if (!rank || !suit) return null;
  return { rank, suit };
}

function parseCards(input: string, expected: number): Card[] | string {
  const tokens = input.trim().split(/\s+/);
  if (tokens.length !== expected) {
    return `Attendu ${expected} carte(s), reçu ${tokens.length}.`;
  }
  const cards: Card[] = [];
  for (const token of tokens) {
    const card = parseCard(token);
    if (!card) return `Carte invalide : "${token}". Format : As, Kh, 10d, 2c, Jh…`;
    cards.push(card);
  }
  return cards;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

async function askCards(prompt: string, count: number): Promise<Card[]> {
  while (true) {
    const input = await ask(prompt);
    const result = parseCards(input, count);
    if (typeof result === 'string') {
      console.log(`  ❌  ${result}`);
    } else {
      return result;
    }
  }
}

async function main(): Promise<void> {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   Texas Hold\'em — Hand Evaluator     ║');
  console.log('╚══════════════════════════════════════╝\n');
  console.log('Format des cartes : rang + couleur, séparés par des espaces.');
  console.log('  rang    : 2-9  10  J  Q  K  A');
  console.log('  couleur : s=♠  h=♥  d=♦  c=♣');
  console.log('  exemple : As Kh 10d 2c Jh\n');

  // Nombre de joueurs
  let numberOfPlayers = 0;
  while (numberOfPlayers < 2) {
    const input = await ask('Nombre de joueurs (2 minimum) : ');
    numberOfPlayers = parseInt(input, 10);
    if (isNaN(numberOfPlayers) || numberOfPlayers < 2) {
      console.log('  ❌  Veuillez entrer un nombre >= 2.');
      numberOfPlayers = 0;
    }
  }

  console.log('');

  // Board (5 cartes communes)
  const boardCards = await askCards('Board (5 cartes communes) : ', 5);
  const board = boardCards as Board;

  console.log(`  → Board : ${formatCards(board)}\n`);

  // Hole cards de chaque joueur
  const players: { holeCards: HoleCards; board: Board }[] = [];

  for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
    const holeCards = await askCards(`Joueur ${playerIndex + 1} — hole cards (2 cartes) : `, 2) as HoleCards;
    console.log(`  → Joueur ${playerIndex + 1} : ${formatCards(holeCards)}\n`);
    players.push({ holeCards, board });
  }

  // Évaluation
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`  Board     : ${formatCards(board)}\n`);

  const result = compareAllPlayers(players);

  for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
    const hand     = result.hands[playerIndex];
    const holeCards = players[playerIndex].holeCards;
    const isWinner = result.winners.includes(playerIndex);

    console.log(`  Joueur ${playerIndex + 1}  ${isWinner ? '🏆' : '  '}`);
    console.log(`    Hole cards : ${formatCards([...holeCards])}`);
    console.log(`    Meilleure main : ${formatCards(hand.chosen5)}`);
    console.log(`    Catégorie      : ${CATEGORY_LABEL[hand.category]}`);
    console.log('');
  }

  // Résultat final
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (result.winners.length === 1) {
    console.log(`\n  🏆  Joueur ${result.winners[0] + 1} remporte la manche !\n`);
  } else {
    const winnerLabels = result.winners.map(i => `Joueur ${i + 1}`).join(' et ');
    console.log(`\n  🤝  Égalité ! Split pot entre ${winnerLabels}.\n`);
  }

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
