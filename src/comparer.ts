
//  - compareHands      : compare deux HandResult, retourne >0 / <0 / 0
//  - compareAllPlayers : détermine le(s) gagnant(s) parmi N joueurs
 

import { Card, HandCategory, HandResult, PlayerHand, ComparisonResult } from './types';
import { evaluateBest7 } from './evaluator';


/** Vérifie si une main Straight est un wheel (5-high) */
function isWheelHand(hand: HandResult): boolean {
  if (hand.category !== HandCategory.Straight && hand.category !== HandCategory.StraightFlush) return false;
  const ranks = hand.chosen5.map(c => c.rank);
  return ranks[ranks.length - 1] === 14 && ranks[0] === 5;
}

/** Compare deux séquences de rangs carte par carte (décroissant = déjà trié) */
function compareRankSequence(a: Card[], b: Card[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i].rank !== b[i].rank) return a[i].rank - b[i].rank;
  }
  return 0;
}


function tieBreakStraight(a: HandResult, b: HandResult): number {
  const wheelA = isWheelHand(a);
  const wheelB = isWheelHand(b);

  const highA = wheelA ? 5 : a.chosen5[0].rank;
  const highB = wheelB ? 5 : b.chosen5[0].rank;
  return highA - highB;
}

function tieBreakFourOfAKind(a: HandResult, b: HandResult): number {
  const quadA = a.chosen5[0].rank;
  const quadB = b.chosen5[0].rank;
  if (quadA !== quadB) return quadA - quadB;
  return a.chosen5[4].rank - b.chosen5[4].rank;
}

function tieBreakFullHouse(a: HandResult, b: HandResult): number {
  const tripA = a.chosen5[0].rank;
  const tripB = b.chosen5[0].rank;
  if (tripA !== tripB) return tripA - tripB;
  return a.chosen5[3].rank - b.chosen5[3].rank;
}

function tieBreakFlush(a: HandResult, b: HandResult): number {
  return compareRankSequence(a.chosen5, b.chosen5);
}

function tieBreakThreeOfAKind(a: HandResult, b: HandResult): number {
  const tripA = a.chosen5[0].rank;
  const tripB = b.chosen5[0].rank;
  if (tripA !== tripB) return tripA - tripB;
  const k1 = a.chosen5[3].rank - b.chosen5[3].rank;
  if (k1 !== 0) return k1;
  return a.chosen5[4].rank - b.chosen5[4].rank;
}

function tieBreakTwoPair(a: HandResult, b: HandResult): number {
  const hp = a.chosen5[0].rank - b.chosen5[0].rank;
  if (hp !== 0) return hp;
  const lp = a.chosen5[2].rank - b.chosen5[2].rank;
  if (lp !== 0) return lp;
  return a.chosen5[4].rank - b.chosen5[4].rank;
}

function tieBreakOnePair(a: HandResult, b: HandResult): number {
  const pairDiff = a.chosen5[0].rank - b.chosen5[0].rank;
  if (pairDiff !== 0) return pairDiff;
  const k1 = a.chosen5[2].rank - b.chosen5[2].rank;
  if (k1 !== 0) return k1;
  const k2 = a.chosen5[3].rank - b.chosen5[3].rank;
  if (k2 !== 0) return k2;
  return a.chosen5[4].rank - b.chosen5[4].rank;
}

function tieBreakHighCard(a: HandResult, b: HandResult): number {
  return compareRankSequence(a.chosen5, b.chosen5);
}

export function compareHands(a: HandResult, b: HandResult): number {
  if (a.category !== b.category) return a.category - b.category;

  switch (a.category) {
    case HandCategory.StraightFlush: return tieBreakStraight(a, b);
    case HandCategory.FourOfAKind:   return tieBreakFourOfAKind(a, b);
    case HandCategory.FullHouse:     return tieBreakFullHouse(a, b);
    case HandCategory.Flush:         return tieBreakFlush(a, b);
    case HandCategory.Straight:      return tieBreakStraight(a, b);
    case HandCategory.ThreeOfAKind:  return tieBreakThreeOfAKind(a, b);
    case HandCategory.TwoPair:       return tieBreakTwoPair(a, b);
    case HandCategory.OnePair:       return tieBreakOnePair(a, b);
    case HandCategory.HighCard:      return tieBreakHighCard(a, b);
  }
}


export function compareAllPlayers(players: PlayerHand[]): ComparisonResult {
  const hands: HandResult[] = players.map(p => evaluateBest7(p.holeCards, p.board));

  // Trouver la meilleure main
  let best = hands[0];
  for (let i = 1; i < hands.length; i++) {
    if (compareHands(hands[i], best) > 0) best = hands[i];
  }

  // Tous les joueurs à égalité avec le meilleur
  const winners = hands
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => compareHands(h, best) === 0)
    .map(({ i }) => i);

  return { winners, hands };
}
