export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades';

export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export type RankCounts = [Rank, number];

export type Board = [Card, Card, Card, Card, Card];

export type HoleCards = [Card, Card];

export interface Card {
  rank: Rank;
  suit: Suit;
}

export enum HandCategory {
  HighCard = 1,
  OnePair = 2,
  TwoPair = 3,
  ThreeOfAKind = 4,
  Straight = 5,
  Flush = 6,
  FullHouse = 7,
  FourOfAKind = 8,
  StraightFlush = 9,
}

export interface HandResult {
  category: HandCategory;
  chosen5: Card[];
}

export interface PlayerHand {
  holeCards: HoleCards;
  board: Board;
}

export interface ComparisonResult {
  winners: number[];
  hands: HandResult[];
}
