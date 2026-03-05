import { Board, HandCategory, HoleCards } from '../src/types';
import { evaluateBest7 } from '../src/evaluator';
import { createCard, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE } from './helpers';

describe('Best-of-7 selection (evaluateBest7)', () => {

  describe('Both hole cards used', () => {
    it('should use both hole cards to form a full house', () => {
      const hole: HoleCards = [
        createCard(ACE, 'clubs'), createCard(ACE, 'hearts'),
      ];
      const board: Board = [
        createCard(KING, 'spades'), createCard(KING, 'hearts'), createCard(KING, 'diamonds'),
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'),
      ];
      const result = evaluateBest7(hole, board);
      expect(result.category).toBe(HandCategory.FullHouse);
      expect(result.chosen5).toHaveLength(5);
    });

    it('should pick the best flush using hole cards that contribute to suit', () => {
      const hole: HoleCards = [
        createCard(SIX, 'hearts'), createCard(KING, 'diamonds'),
      ];
      const board: Board = [
        createCard(ACE, 'hearts'), createCard(JACK, 'hearts'), createCard(NINE, 'hearts'),
        createCard(FOUR, 'hearts'), createCard(TWO, 'clubs'),
      ];
      const result = evaluateBest7(hole, board);
      expect(result.category).toBe(HandCategory.Flush);
      expect(result.chosen5.every(card => card.suit === 'hearts')).toBe(true);
      const ranks = result.chosen5.map(card => card.rank).sort((a, b) => b - a);
      expect(ranks).toEqual([ACE, JACK, NINE, SIX, FOUR]);
    });
  });

  describe('One hole card used', () => {
    it('should form a straight using one hole card', () => {
      const hole: HoleCards = [
        createCard(ACE, 'clubs'), createCard(THREE, 'diamonds'),
      ];
      const board: Board = [
        createCard(TEN, 'clubs'), createCard(JACK, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(KING, 'spades'), createCard(TWO, 'diamonds'),
      ];
      const result = evaluateBest7(hole, board);
      expect(result.category).toBe(HandCategory.Straight);
      expect(result.chosen5.map(card => card.rank).sort((a, b) => b - a))
        .toEqual([ACE, KING, QUEEN, JACK, TEN]);
    });
  });

  describe('Board plays (0 hole cards used)', () => {
    it('should use the board entirely when it is better than any 7-card combo', () => {
      const hole: HoleCards = [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
      ];
      const board: Board = [
        createCard(FIVE, 'clubs'), createCard(SIX, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(EIGHT, 'spades'), createCard(NINE, 'diamonds'),
      ];
      const result = evaluateBest7(hole, board);
      expect(result.category).toBe(HandCategory.Straight);
    });
  });

  describe('chosen5 must be a subset of the 7 available cards', () => {
    it('all 5 chosen cards must come from hole + board', () => {
      const hole: HoleCards = [
        createCard(ACE, 'spades'), createCard(KING, 'spades'),
      ];
      const board: Board = [
        createCard(QUEEN, 'spades'), createCard(JACK, 'spades'), createCard(TEN, 'spades'),
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'),
      ];
      const result = evaluateBest7(hole, board);
      const available = [...hole, ...board];
      for (const card of result.chosen5) {
        const found = available.some(
          av => av.rank === card.rank && av.suit === card.suit
        );
        expect(found).toBe(true);
      }
    });

    it('chosen5 must contain exactly 5 cards', () => {
      const hole: HoleCards = [
        createCard(TWO, 'clubs'), createCard(SEVEN, 'diamonds'),
      ];
      const board: Board = [
        createCard(THREE, 'hearts'), createCard(NINE, 'spades'), createCard(JACK, 'clubs'),
        createCard(QUEEN, 'diamonds'), createCard(ACE, 'hearts'),
      ];
      const result = evaluateBest7(hole, board);
      expect(result.chosen5).toHaveLength(5);
    });
  });

  describe('Quads on board — kicker decides (Example E)', () => {
    it('player 1 wins with Ace kicker vs Queen kicker', () => {
      const hole1: HoleCards = [
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'),
      ];
      const board: Board = [
        createCard(SEVEN, 'clubs'), createCard(SEVEN, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(SEVEN, 'spades'), createCard(TWO, 'diamonds'),
      ];
      const result1 = evaluateBest7(hole1, board);
      expect(result1.category).toBe(HandCategory.FourOfAKind);
      
      const nonQuad = result1.chosen5.filter(card => card.rank !== SEVEN);
      expect(nonQuad).toHaveLength(1);
      expect(nonQuad[0].rank).toBe(ACE);
    });
  });

});
