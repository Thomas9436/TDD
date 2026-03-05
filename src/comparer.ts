
//  - compareHands      : compare deux HandResult, retourne >0 / <0 / 0
//  - compareAllPlayers : détermine le(s) gagnant(s) parmi N joueurs
 

import { Card, HandCategory, HandResult, PlayerHand, ComparisonResult } from './types';
import { evaluateBest7 } from './evaluator';


function isWheelHand(hand: HandResult): boolean {
  const isAnyKindOfStraight = hand.category === HandCategory.Straight || hand.category === HandCategory.StraightFlush;
  if (!isAnyKindOfStraight) return false;

  const ranks = hand.chosen5.map(card => card.rank);
  // Le wheel est ordonné [5,4,3,2,A] : premier rang = 5, dernier = As (14)
  const topCardIsFive  = ranks[0] === 5;
  const lastCardIsAce  = ranks[ranks.length - 1] === 14;
  return topCardIsFive && lastCardIsAce;
}

function compareCardsByRankSequence(cardsA: Card[], cardsB: Card[]): number {
  for (let position = 0; position < Math.min(cardsA.length, cardsB.length); position++) {
    const rankDiff = cardsA[position].rank - cardsB[position].rank;
    if (rankDiff !== 0) return rankDiff;
  }
  return 0; // égalité parfaite
}


function tieBreakStraight(handA: HandResult, handB: HandResult): number {
  const aIsWheel = isWheelHand(handA);
  const bIsWheel = isWheelHand(handB);

  const highestCardA = aIsWheel ? 5 : handA.chosen5[0].rank;
  const highestCardB = bIsWheel ? 5 : handB.chosen5[0].rank;
  return highestCardA - highestCardB;
}

function tieBreakFourOfAKind(handA: HandResult, handB: HandResult): number {
  // chosen5 = [carré×4, kicker×1]
  const quadRankA  = handA.chosen5[0].rank;
  const quadRankB  = handB.chosen5[0].rank;
  if (quadRankA !== quadRankB) return quadRankA - quadRankB;

  const kickerRankA = handA.chosen5[4].rank;
  const kickerRankB = handB.chosen5[4].rank;
  return kickerRankA - kickerRankB;
}

function tieBreakFullHouse(handA: HandResult, handB: HandResult): number {
  // chosen5 = [triplet×3, paire×2]
  const tripletRankA = handA.chosen5[0].rank;
  const tripletRankB = handB.chosen5[0].rank;
  if (tripletRankA !== tripletRankB) return tripletRankA - tripletRankB;

  const pairRankA = handA.chosen5[3].rank;
  const pairRankB = handB.chosen5[3].rank;
  return pairRankA - pairRankB;
}

function tieBreakFlush(handA: HandResult, handB: HandResult): number {
  return compareCardsByRankSequence(handA.chosen5, handB.chosen5);
}

function tieBreakThreeOfAKind(handA: HandResult, handB: HandResult): number {
  // chosen5 = [triplet×3, kicker1, kicker2]
  const tripletRankA = handA.chosen5[0].rank;
  const tripletRankB = handB.chosen5[0].rank;
  if (tripletRankA !== tripletRankB) return tripletRankA - tripletRankB;

  const firstKickerDiff  = handA.chosen5[3].rank - handB.chosen5[3].rank;
  if (firstKickerDiff !== 0) return firstKickerDiff;

  const secondKickerDiff = handA.chosen5[4].rank - handB.chosen5[4].rank;
  return secondKickerDiff;
}

function tieBreakTwoPair(handA: HandResult, handB: HandResult): number {
  // chosen5 = [hautePaire×2, bassePaire×2, kicker]
  const highPairDiff = handA.chosen5[0].rank - handB.chosen5[0].rank;
  if (highPairDiff !== 0) return highPairDiff;

  const lowPairDiff  = handA.chosen5[2].rank - handB.chosen5[2].rank;
  if (lowPairDiff !== 0) return lowPairDiff;

  const kickerDiff   = handA.chosen5[4].rank - handB.chosen5[4].rank;
  return kickerDiff;
}

function tieBreakOnePair(handA: HandResult, handB: HandResult): number {
  // chosen5 = [paire×2, kicker1, kicker2, kicker3]
  const pairRankDiff     = handA.chosen5[0].rank - handB.chosen5[0].rank;
  if (pairRankDiff !== 0) return pairRankDiff;

  const firstKickerDiff  = handA.chosen5[2].rank - handB.chosen5[2].rank;
  if (firstKickerDiff !== 0) return firstKickerDiff;

  const secondKickerDiff = handA.chosen5[3].rank - handB.chosen5[3].rank;
  if (secondKickerDiff !== 0) return secondKickerDiff;

  const thirdKickerDiff  = handA.chosen5[4].rank - handB.chosen5[4].rank;
  return thirdKickerDiff;
}

function tieBreakHighCard(handA: HandResult, handB: HandResult): number {
  return compareCardsByRankSequence(handA.chosen5, handB.chosen5);
}


export function compareHands(handA: HandResult, handB: HandResult): number {
  // Catégories différentes : la catégorie la plus haute gagne directement
  if (handA.category !== handB.category) return handA.category - handB.category;

  // Même catégorie : on applique le tie-break spécifique
  switch (handA.category) {
    case HandCategory.StraightFlush: return tieBreakStraight(handA, handB);
    case HandCategory.FourOfAKind:   return tieBreakFourOfAKind(handA, handB);
    case HandCategory.FullHouse:     return tieBreakFullHouse(handA, handB);
    case HandCategory.Flush:         return tieBreakFlush(handA, handB);
    case HandCategory.Straight:      return tieBreakStraight(handA, handB);
    case HandCategory.ThreeOfAKind:  return tieBreakThreeOfAKind(handA, handB);
    case HandCategory.TwoPair:       return tieBreakTwoPair(handA, handB);
    case HandCategory.OnePair:       return tieBreakOnePair(handA, handB);
    case HandCategory.HighCard:      return tieBreakHighCard(handA, handB);
  }
}


export function compareAllPlayers(players: PlayerHand[]): ComparisonResult {
  // Évaluer la meilleure main de chaque joueur
  const evaluatedHands: HandResult[] = players.map(player =>
    evaluateBest7(player.holeCards, player.board)
  );

  // Trouver la meilleure main parmi tous les joueurs
  let bestHand = evaluatedHands[0];
  for (let playerIndex = 1; playerIndex < evaluatedHands.length; playerIndex++) {
    const currentHand = evaluatedHands[playerIndex];
    if (compareHands(currentHand, bestHand) > 0) {
      bestHand = currentHand;
    }
  }

  // Collecter tous les joueurs à égalité avec la meilleure main (split pot)
  const winnerIndices = evaluatedHands
    .map((hand, playerIndex) => ({ hand, playerIndex }))
    .filter(({ hand }) => compareHands(hand, bestHand) === 0)
    .map(({ playerIndex }) => playerIndex);

  return { winners: winnerIndices, hands: evaluatedHands };
}
