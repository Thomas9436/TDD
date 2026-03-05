import { Board, Card, HandCategory, HandResult, Rank, Suit } from '../src/types';

export function createCard(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

export function createHandResult(category: HandCategory, chosen5: Card[]): HandResult {
  return { category, chosen5 };
}

export const TWO   = 2  as Rank;
export const THREE = 3  as Rank;
export const FOUR  = 4  as Rank;
export const FIVE  = 5  as Rank;
export const SIX   = 6  as Rank;
export const SEVEN = 7  as Rank;
export const EIGHT = 8  as Rank;
export const NINE  = 9  as Rank;
export const TEN   = 10 as Rank;
export const JACK  = 11 as Rank;
export const QUEEN = 12 as Rank;
export const KING  = 13 as Rank;
export const ACE   = 14 as Rank;
