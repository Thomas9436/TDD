// - evaluateHand5  : évalue exactement 5 cartes
// - evaluateBest7  : choisit les 5 meilleures cartes parmi 7

import { Board, Card, HandCategory, HandResult, HoleCards, Rank, RankCounts } from './types';
import { compareHands } from './comparer';

export function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map(combo => [first, ...combo]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

export function rankValue(rank: Rank): number {
  return rank as number;
}

function rankGroups(cards: Card[]): RankCounts[] {
  const map = new Map<Rank, number>();

  for (const c of cards) map.set(c.rank, (map.get(c.rank) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
}

function detectStraightHighCard(cards: Card[]): Rank | null {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const ranks = sorted.map(c => c.rank);

  // Straight normale
  let isNormal = true;
  for (let i = 0; i < 4; i++) {
    if (ranks[i] - ranks[i + 1] !== 1) { isNormal = false; break; }
  }
  if (isNormal) return ranks[0];

  // Wheel : A-2-3-4-5 (As = 14 compté comme 1)
  const rankSet = new Set(ranks);
  if (rankSet.has(14) && rankSet.has(2) && rankSet.has(3) && rankSet.has(4) && rankSet.has(5)) {
    return 5 
  }

  return null;
}

/** Retourne les 5 cartes ordonnées pour une straight (wheel : 5,4,3,2,A) */
function straightOrder(cards: Card[]): Card[] {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const ranks = sorted.map(c => c.rank);
  // Wheel
  if (ranks[0] === 14 && ranks[1] === 5) {
    // [A,5,4,3,2] → on veut [5,4,3,2,A]
    return [...sorted.slice(1), sorted[0]];
  }
  return sorted;
}


export function evaluateHand5(cards: Board): HandResult {
  const isFlush = cards.every(c => c.suit === cards[0].suit);
  const straightHigh = detectStraightHighCard(cards);

  // --- Straight Flush ---
  if (isFlush && straightHigh !== null) {
    const chosen5 = straightOrder(cards);
    return { category: HandCategory.StraightFlush, chosen5 };
  }

  const groups = rankGroups(cards);
  const counts = groups.map(g => g[1]);

  // --- Four of a Kind ---
  if (counts[0] === 4) {
    const quadRank = groups[0][0];
    const kicker = groups[1][0];
    const chosen5 = [
      ...cards.filter(c => c.rank === quadRank),
      ...cards.filter(c => c.rank === kicker),
    ];
    return { category: HandCategory.FourOfAKind, chosen5 };
  }

  // --- Full House ---
  if (counts[0] === 3 && counts[1] === 2) {
    const tripRank = groups[0][0];
    const pairRank = groups[1][0];
    const chosen5 = [
      ...cards.filter(c => c.rank === tripRank),
      ...cards.filter(c => c.rank === pairRank),
    ];
    return { category: HandCategory.FullHouse, chosen5 };
  }

  // --- Flush ---
  if (isFlush) {
    const chosen5 = [...cards].sort((a, b) => b.rank - a.rank);
    return { category: HandCategory.Flush, chosen5 };
  }

  // --- Straight ---
  if (straightHigh !== null) {
    const chosen5 = straightOrder(cards);
    return { category: HandCategory.Straight, chosen5 };
  }

  // --- Three of a Kind ---
  if (counts[0] === 3) {
    const tripRank = groups[0][0];
    const kickers = groups.slice(1).map(g => g[0]).sort((a, b) => b - a);
    const chosen5 = [
      ...cards.filter(c => c.rank === tripRank),
      ...kickers.map(r => cards.find(c => c.rank === r)!),
    ];
    return { category: HandCategory.ThreeOfAKind, chosen5 };
  }

  // --- Two Pair ---
  if (counts[0] === 2 && counts[1] === 2) {
    const highPair = groups[0][0];
    const lowPair  = groups[1][0];
    const kicker   = groups[2][0];
    const chosen5 = [
      ...cards.filter(c => c.rank === highPair),
      ...cards.filter(c => c.rank === lowPair),
      cards.find(c => c.rank === kicker)!,
    ];
    return { category: HandCategory.TwoPair, chosen5 };
  }

  // --- One Pair ---
  if (counts[0] === 2) {
    const pairRank = groups[0][0];
    const kickers = groups.slice(1).map(g => g[0]).sort((a, b) => b - a);
    const chosen5 = [
      ...cards.filter(c => c.rank === pairRank),
      ...kickers.map(r => cards.find(c => c.rank === r)!),
    ];
    return { category: HandCategory.OnePair, chosen5 };
  }

  // --- High Card ---
  const chosen5 = [...cards].sort((a, b) => b.rank - a.rank);
  return { category: HandCategory.HighCard, chosen5 };
}


export function evaluateBest7(holeCards: HoleCards, board: Board): HandResult {
  const allCards = [...holeCards, ...board];
  const combos = combinations(allCards, 5) as Board[];
  let best: HandResult | null = null;
  for (const combo of combos) {
    const result = evaluateHand5(combo);
    if (best === null || compareHands(result, best) > 0) {
      best = result;
    }
  }
  return best!;
}
