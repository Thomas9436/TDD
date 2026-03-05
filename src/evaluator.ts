// - evaluateHand5  : évalue exactement 5 cartes
// - evaluateBest7  : choisit les 5 meilleures cartes parmi 7


import { Board, HandResult, HoleCards, Rank } from './types';

export function evaluateHand5(_cards: Board): HandResult {
  throw new Error('Not implemented yet');
}

export function evaluateBest7(
  _holeCards: HoleCards,
  _board: Board,
): HandResult {
  throw new Error('Not implemented yet');
}


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
