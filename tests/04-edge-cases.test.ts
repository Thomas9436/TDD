import { Board, Card, HandCategory, HoleCards } from '../src/types';
import { evaluateHand5, evaluateBest7 } from '../src/evaluator';
import { createCard, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE } from './helpers';
import { compareHands } from '../src/comparer';

describe('Edge cases', () => {

  describe('Ace-low straight (wheel)', () => {
    it('wheel is a valid straight (5-high)', () => {
      const cards : Board = [
        createCard(ACE, 'clubs'),
        createCard(TWO, 'diamonds'),
        createCard(THREE, 'hearts'),
        createCard(FOUR, 'spades'),
        createCard(FIVE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.Straight);
    });

    it('wheel chosen5 ordering: 5,4,3,2,A (Ace is low)', () => {
      const cards : Board = [
        createCard(ACE, 'clubs'),
        createCard(TWO, 'diamonds'),
        createCard(THREE, 'hearts'),
        createCard(FOUR, 'spades'),
        createCard(FIVE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      const ranks = result.chosen5.map(card => card.rank);
      expect(ranks).toEqual([FIVE, FOUR, THREE, TWO, ACE]);
    });

    it('6-high straight beats the wheel', () => {
      const wheel = evaluateHand5([
        createCard(ACE, 'clubs'), createCard(TWO, 'diamonds'), createCard(THREE, 'hearts'),
        createCard(FOUR, 'spades'), createCard(FIVE, 'clubs'),
      ]);
      const s6 = evaluateHand5([
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(FIVE, 'spades'), createCard(SIX, 'clubs'),
      ]);

      expect(compareHands(s6, wheel)).toBeGreaterThan(0);
    });

    it('wheel best-of-7: detected from 7 cards including A 2 3 4 5', () => {
      const hole: HoleCards = [
        createCard(FIVE, 'clubs'), createCard(KING, 'diamonds'),
      ];
      const board: Board = [
        createCard(ACE, 'clubs'), createCard(TWO, 'diamonds'), createCard(THREE, 'hearts'),
        createCard(FOUR, 'spades'), createCard(NINE, 'diamonds'),
      ];
      const result = evaluateBest7(hole, board);
      expect(result.category).toBe(HandCategory.Straight);
      const ranks = result.chosen5.map(card => card.rank);
      expect(ranks).toEqual([FIVE, FOUR, THREE, TWO, ACE]);
    });
  });

  describe('Flush with 6+ suited cards available', () => {
    it('picks the 5 highest-ranked flush cards when 6 suited are available', () => {
      const hole: HoleCards = [
        createCard(SIX, 'hearts'), createCard(KING, 'diamonds'),
      ];
      const board: Board = [
        createCard(ACE, 'hearts'), createCard(JACK, 'hearts'), createCard(NINE, 'hearts'),
        createCard(FOUR, 'hearts'), createCard(TWO, 'clubs'),
      ];
      const result = evaluateBest7(hole, board);
      expect(result.category).toBe(HandCategory.Flush);
      const ranks = result.chosen5.map((card: Card) => card.rank).sort((a: number, b: number) => b - a);
      expect(ranks).toEqual([ACE, JACK, NINE, SIX, FOUR]);
    });

    it('with 7 suited cards picks the best 5 (highest ranks)', () => {
      // All 7 cards are hearts
      const hole: HoleCards = [
        createCard(ACE, 'hearts'), createCard(KING, 'hearts'),
      ];
      const board: Board = [
        createCard(QUEEN, 'hearts'), createCard(JACK, 'hearts'), createCard(NINE, 'hearts'),
        createCard(SIX, 'hearts'), createCard(TWO, 'hearts'),
      ];
      const result = evaluateBest7(hole, board);
      // StraightFlush if A K Q J 9 → not a straight flush (no 10)
      // Best flush = A K Q J 9
      const ranks = result.chosen5.map((card: Card) => card.rank).sort((a: number, b: number) => b - a);
      expect(ranks).toEqual([ACE, KING, QUEEN, JACK, NINE]);
    });
  });

  describe('Steel wheel (A-2-3-4-5 suited)', () => {
    it('steel wheel is a StraightFlush', () => {
      const cards : Board = [
        createCard(ACE, 'diamonds'), createCard(TWO, 'diamonds'), createCard(THREE, 'diamonds'),
        createCard(FOUR, 'diamonds'), createCard(FIVE, 'diamonds'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.StraightFlush);
    });

    it('steel wheel chosen5 ordering: 5,4,3,2,A (Ace is low)', () => {
      const cards : Board = [
        createCard(ACE, 'diamonds'), createCard(TWO, 'diamonds'), createCard(THREE, 'diamonds'),
        createCard(FOUR, 'diamonds'), createCard(FIVE, 'diamonds'),
      ];
      const result = evaluateHand5(cards);
      const ranks = result.chosen5.map(card => card.rank);
      expect(ranks).toEqual([FIVE, FOUR, THREE, TWO, ACE]);
    });
  });

  describe('chosen5 ordering per category', () => {
    it('FourOfAKind: quad cards first (×4), then kicker', () => {
      const cards : Board = [
        createCard(SEVEN, 'clubs'), createCard(SEVEN, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(SEVEN, 'spades'), createCard(ACE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      // Les 4 premières cartes doivent être les 7
      expect(result.chosen5.slice(0, 4).every(card => card.rank === SEVEN)).toBe(true);
      // La 5ème doit être le kicker As
      expect(result.chosen5[4].rank).toBe(ACE);
    });

    it('FullHouse: triplet first (×3), then pair (×2)', () => {
      const cards : Board = [
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'), createCard(KING, 'hearts'),
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
      ];
      const result = evaluateHand5(cards);
      // Les 3 premières cartes doivent être les Rois
      expect(result.chosen5.slice(0, 3).every(card => card.rank === KING)).toBe(true);
      // Les 2 dernières doivent être les As
      expect(result.chosen5.slice(3, 5).every(card => card.rank === ACE)).toBe(true);
    });

    it('TwoPair: higher pair first, lower pair second, kicker last', () => {
      const cards : Board = [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
        createCard(QUEEN, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.chosen5[0].rank).toBe(ACE);
      expect(result.chosen5[1].rank).toBe(ACE);
      expect(result.chosen5[2].rank).toBe(KING);
      expect(result.chosen5[3].rank).toBe(KING);
      expect(result.chosen5[4].rank).toBe(QUEEN);
    });

    it('OnePair: pair first, then kickers in descending order', () => {
      const cards : Board = [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.chosen5[0].rank).toBe(TEN);
      expect(result.chosen5[1].rank).toBe(TEN);
      expect(result.chosen5[2].rank).toBe(ACE);
      expect(result.chosen5[3].rank).toBe(KING);
      expect(result.chosen5[4].rank).toBe(QUEEN);
    });

    it('Straight (non-wheel): descending order', () => {
      const cards : Board = [
        createCard(NINE, 'clubs'), createCard(EIGHT, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(SIX, 'spades'), createCard(FIVE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      const ranks = result.chosen5.map(card => card.rank);
      expect(ranks).toEqual([NINE, EIGHT, SEVEN, SIX, FIVE]);
    });

    it('Flush: descending order', () => {
      const cards : Board = [
        createCard(TWO, 'hearts'), createCard(KING, 'hearts'), createCard(ACE, 'hearts'),
        createCard(NINE, 'hearts'), createCard(FIVE, 'hearts'),
      ];
      const result = evaluateHand5(cards);
      const ranks = result.chosen5.map(card => card.rank);
      expect(ranks).toEqual([ACE, KING, NINE, FIVE, TWO]);
    });

    it('HighCard: descending order', () => {
      const cards : Board = [
        createCard(TWO, 'clubs'), createCard(ACE, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(KING, 'spades'), createCard(FIVE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      const ranks = result.chosen5.map(card => card.rank);
      expect(ranks).toEqual([ACE, KING, SEVEN, FIVE, TWO]);
    });
  });

  describe('No wrap-around straight', () => {
    it('Q-K-A-2-3 is NOT a straight', () => {
      const cards : Board = [
        createCard(QUEEN, 'clubs'), createCard(KING, 'diamonds'), createCard(ACE, 'hearts'),
        createCard(TWO, 'spades'), createCard(THREE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).not.toBe(HandCategory.Straight);
      expect(result.category).not.toBe(HandCategory.StraightFlush);
    });

    it('J-Q-K-A-2 is NOT a straight', () => {
      const cards : Board = [
        createCard(JACK, 'clubs'), createCard(QUEEN, 'diamonds'), createCard(KING, 'hearts'),
        createCard(ACE, 'spades'), createCard(TWO, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).not.toBe(HandCategory.Straight);
    });
  });

});
