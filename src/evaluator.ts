// - evaluateHand5  : évalue exactement 5 cartes
// - evaluateBest7  : choisit les 5 meilleures cartes parmi 7

import { Board, Card, HandCategory, HandResult, HoleCards, Rank, RankCounts } from './types';
import { compareHands } from './comparer';

export function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [firstElement, ...remainingElements] = arr;
  const combosWithFirst    = combinations(remainingElements, k - 1).map(combo => [firstElement, ...combo]);
  const combosWithoutFirst = combinations(remainingElements, k);
  return [...combosWithFirst, ...combosWithoutFirst];
}

export function rankValue(rank: Rank): number {
  return rank as number;
}


function groupCardsByRank(cards: Card[]): RankCounts[] {
  const occurrencesByRank = new Map<Rank, number>();

  for (const card of cards) {
    occurrencesByRank.set(card.rank, (occurrencesByRank.get(card.rank) ?? 0) + 1);
  }

  return [...occurrencesByRank.entries()].sort(
    (a, b) => b[1] - a[1] || b[0] - a[0] 
  );
}


function detectStraightHighestCard(cards: Card[]): Rank | null {
  const sortedByRankDesc = [...cards].sort((a, b) => b.rank - a.rank);
  const ranks = sortedByRankDesc.map(c => c.rank);

  // Suite normale : chaque carte est exactement 1 de moins que la précédente
  const isConsecutive = ranks.every((rank, i) => i === 0 || ranks[i - 1] - rank === 1);
  if (isConsecutive) return ranks[0];

  // Wheel (A-2-3-4-5) : l'As (14) compte comme un 1 sous le 2
  const rankSet = new Set(ranks);
  const isWheel = rankSet.has(14) && rankSet.has(2) && rankSet.has(3) && rankSet.has(4) && rankSet.has(5);
  if (isWheel) return 5 as Rank; // 5-high straight

  return null;
}

function orderStraightCards(cards: Card[]): Card[] {
  const sortedByRankDesc = [...cards].sort((a, b) => b.rank - a.rank);

  const topCard    = sortedByRankDesc[0];
  const secondCard = sortedByRankDesc[1];

  // Wheel : après tri desc on obtient [A,5,4,3,2], on déplace l'As en fin de tableau
  const isWheelOrder = topCard.rank === 14 && secondCard.rank === 5;
  if (isWheelOrder) {
    const aceCard           = sortedByRankDesc[0];
    const remainingCards    = sortedByRankDesc.slice(1);
    return [...remainingCards, aceCard]; // → [5,4,3,2,A]
  }

  return sortedByRankDesc;
}

export function evaluateHand5(cards: Board): HandResult {
  const allSameSuit   = cards.every(card => card.suit === cards[0].suit);
  const straightHigh  = detectStraightHighestCard(cards);

  // --- Straight Flush (ou Steel Wheel) ---
  if (allSameSuit && straightHigh !== null) {
    const chosen5 = orderStraightCards(cards);
    return { category: HandCategory.StraightFlush, chosen5 };
  }

  // Groupes de rangs : ex [[K,3],[A,1],[2,1]] pour trip Kings
  const rankGroupsSorted    = groupCardsByRank(cards);
  const groupOccurrences    = rankGroupsSorted.map(group => group[1]);

  // --- Four of a Kind : un groupe de 4 ---
  if (groupOccurrences[0] === 4) {
    const quadRank   = rankGroupsSorted[0][0];
    const kickerRank = rankGroupsSorted[1][0];
    const chosen5 = [
      ...cards.filter(card => card.rank === quadRank),   
      ...cards.filter(card => card.rank === kickerRank), 
    ];
    return { category: HandCategory.FourOfAKind, chosen5 };
  }

  // --- Full House : un groupe de 3 + un groupe de 2 ---
  if (groupOccurrences[0] === 3 && groupOccurrences[1] === 2) {
    const tripletRank = rankGroupsSorted[0][0];
    const pairRank    = rankGroupsSorted[1][0];
    const chosen5 = [
      ...cards.filter(card => card.rank === tripletRank),
      ...cards.filter(card => card.rank === pairRank), 
    ];
    return { category: HandCategory.FullHouse, chosen5 };
  }

  // --- Flush : 5 cartes de la même couleur (pas de suite) ---
  if (allSameSuit) {
    const chosen5 = [...cards].sort((a, b) => b.rank - a.rank);
    return { category: HandCategory.Flush, chosen5 };
  }

  // --- Straight : suite sans flush ---
  if (straightHigh !== null) {
    const chosen5 = orderStraightCards(cards);
    return { category: HandCategory.Straight, chosen5 };
  }

  // --- Three of a Kind : un groupe de 3, les autres sont des kickers ---
  if (groupOccurrences[0] === 3) {
    const tripletRank  = rankGroupsSorted[0][0];
    const kickerRanks  = rankGroupsSorted.slice(1).map(g => g[0]).sort((a, b) => b - a);
    const chosen5 = [
      ...cards.filter(card => card.rank === tripletRank),
      ...kickerRanks.map(kickerRank => cards.find(card => card.rank === kickerRank)!),
    ];
    return { category: HandCategory.ThreeOfAKind, chosen5 };
  }

  // --- Two Pair : deux groupes de 2 + un kicker ---
  if (groupOccurrences[0] === 2 && groupOccurrences[1] === 2) {
    const highPairRank = rankGroupsSorted[0][0];
    const lowPairRank  = rankGroupsSorted[1][0];
    const kickerRank   = rankGroupsSorted[2][0];
    const chosen5 = [
      ...cards.filter(card => card.rank === highPairRank), 
      ...cards.filter(card => card.rank === lowPairRank),  
      cards.find(card => card.rank === kickerRank)!,       
    ];
    return { category: HandCategory.TwoPair, chosen5 };
  }

  // --- One Pair : un groupe de 2 + trois kickers ---
  if (groupOccurrences[0] === 2) {
    const pairRank    = rankGroupsSorted[0][0];
    const kickerRanks = rankGroupsSorted.slice(1).map(g => g[0]).sort((a, b) => b - a);
    const chosen5 = [
      ...cards.filter(card => card.rank === pairRank),
      ...kickerRanks.map(kickerRank => cards.find(card => card.rank === kickerRank)!),
    ];
    return { category: HandCategory.OnePair, chosen5 };
  }

  // --- High Card : aucune combinaison, toutes les cartes triées ---
  const chosen5 = [...cards].sort((a, b) => b.rank - a.rank);
  return { category: HandCategory.HighCard, chosen5 };
}

export function evaluateBest7(holeCards: HoleCards, board: Board): HandResult {
  const sevenCards = [...holeCards, ...board];
  const allFiveCardCombos = combinations(sevenCards, 5) as Board[];

  let bestHand: HandResult | null = null;

  for (const fiveCardCombo of allFiveCardCombos) {
    const evaluatedHand = evaluateHand5(fiveCardCombo);
    const isFirstCombo  = bestHand === null;
    const isBetterThanBest = !isFirstCombo && compareHands(evaluatedHand, bestHand!) > 0;

    if (isFirstCombo || isBetterThanBest) {
      bestHand = evaluatedHand;
    }
  }

  return bestHand!;
}
