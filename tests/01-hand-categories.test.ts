import { Board, HandCategory } from '../src/types';
import { evaluateHand5 } from '../src/evaluator';
import { createCard, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE } from './helpers';

describe('Hand category detection (evaluateHand5)', () => {

  describe('High Card', () => {
    it('should detect a high card hand (no pair, no flush, no straight)', () => {
      const cards : Board = [
        createCard(ACE, 'spades'),
        createCard(KING, 'hearts'),
        createCard(QUEEN, 'diamonds'),
        createCard(TEN, 'clubs'),
        createCard(EIGHT, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.HighCard);
    });

    it('should detect high card when ranks are all different and off-suit', () => {
      const cards : Board = [
        createCard(TWO, 'clubs'),
        createCard(FOUR, 'diamonds'),
        createCard(SIX, 'hearts'),
        createCard(NINE, 'spades'),
        createCard(JACK, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.HighCard);
    });
  });

  describe('One Pair', () => {
    it('should detect one pair of Aces', () => {
      const cards : Board = [
        createCard(ACE, 'spades'),
        createCard(ACE, 'hearts'),
        createCard(KING, 'diamonds'),
        createCard(QUEEN, 'clubs'),
        createCard(TWO, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.OnePair);
    });

    it('should detect one pair of 7s', () => {
      const cards : Board = [
        createCard(SEVEN, 'clubs'),
        createCard(SEVEN, 'diamonds'),
        createCard(THREE, 'hearts'),
        createCard(FIVE, 'spades'),
        createCard(JACK, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.OnePair);
    });
  });

  describe('Two Pair', () => {
    it('should detect two pair (Aces and Kings)', () => {
      const cards : Board = [
        createCard(ACE, 'spades'),
        createCard(ACE, 'clubs'),
        createCard(KING, 'hearts'),
        createCard(KING, 'diamonds'),
        createCard(QUEEN, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.TwoPair);
    });

    it('should detect two pair (5s and 3s)', () => {
      const cards : Board = [
        createCard(FIVE, 'spades'),
        createCard(FIVE, 'hearts'),
        createCard(THREE, 'clubs'),
        createCard(THREE, 'diamonds'),
        createCard(NINE, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.TwoPair);
    });
  });

  describe('Three of a Kind', () => {
    it('should detect three of a kind (trip Kings)', () => {
      const cards : Board = [
        createCard(KING, 'spades'),
        createCard(KING, 'hearts'),
        createCard(KING, 'diamonds'),
        createCard(ACE, 'clubs'),
        createCard(TWO, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.ThreeOfAKind);
    });

    it('should detect three of a kind (trip 4s)', () => {
      const cards : Board = [
        createCard(FOUR, 'clubs'),
        createCard(FOUR, 'hearts'),
        createCard(FOUR, 'spades'),
        createCard(EIGHT, 'diamonds'),
        createCard(TEN, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.ThreeOfAKind);
    });
  });

  describe('Straight', () => {
    it('should detect a normal straight (5-9)', () => {
      const cards : Board = [
        createCard(FIVE, 'clubs'),
        createCard(SIX, 'diamonds'),
        createCard(SEVEN, 'hearts'),
        createCard(EIGHT, 'spades'),
        createCard(NINE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.Straight);
    });

    it('should detect an Ace-high straight (10-A broadway)', () => {
      const cards : Board = [
        createCard(TEN, 'clubs'),
        createCard(JACK, 'diamonds'),
        createCard(QUEEN, 'hearts'),
        createCard(KING, 'spades'),
        createCard(ACE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.Straight);
    });

    it('should detect an Ace-low straight / wheel (A-2-3-4-5)', () => {
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

    it('should NOT detect a straight when the gap is too large', () => {
      const cards : Board = [
        createCard(TWO, 'clubs'),
        createCard(THREE, 'diamonds'),
        createCard(FOUR, 'hearts'),
        createCard(FIVE, 'spades'),
        createCard(SEVEN, 'clubs'), // gap: no 6
      ];
      const result = evaluateHand5(cards);
      expect(result.category).not.toBe(HandCategory.Straight);
    });

    it('should NOT detect a wrap-around straight (Q-K-A-2-3)', () => {
      const cards : Board = [
        createCard(QUEEN, 'clubs'),
        createCard(KING, 'diamonds'),
        createCard(ACE, 'hearts'),
        createCard(TWO, 'spades'),
        createCard(THREE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).not.toBe(HandCategory.Straight);
    });
  });

  describe('Flush', () => {
    it('should detect a flush (5 hearts, not a straight)', () => {
      const cards : Board = [
        createCard(ACE, 'hearts'),
        createCard(JACK, 'hearts'),
        createCard(NINE, 'hearts'),
        createCard(FOUR, 'hearts'),
        createCard(TWO, 'hearts'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.Flush);
    });

    it('should detect a flush (5 spades)', () => {
      const cards : Board = [
        createCard(KING, 'spades'),
        createCard(TEN, 'spades'),
        createCard(EIGHT, 'spades'),
        createCard(SIX, 'spades'),
        createCard(THREE, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.Flush);
    });

    it('should NOT detect a flush when cards are mixed suits', () => {
      const cards : Board = [
        createCard(ACE, 'hearts'),
        createCard(JACK, 'spades'),
        createCard(NINE, 'hearts'),
        createCard(FOUR, 'hearts'),
        createCard(TWO, 'hearts'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).not.toBe(HandCategory.Flush);
    });
  });

  describe('Full House', () => {
    it('should detect a full house (trip Aces, pair Kings)', () => {
      const cards : Board = [
        createCard(ACE, 'spades'),
        createCard(ACE, 'hearts'),
        createCard(ACE, 'diamonds'),
        createCard(KING, 'clubs'),
        createCard(KING, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.FullHouse);
    });

    it('should detect a full house (trip 3s, pair 9s)', () => {
      const cards : Board = [
        createCard(THREE, 'clubs'),
        createCard(THREE, 'hearts'),
        createCard(THREE, 'spades'),
        createCard(NINE, 'diamonds'),
        createCard(NINE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.FullHouse);
    });
  });

  describe('Four of a Kind', () => {
    it('should detect four of a kind (quad 7s)', () => {
      const cards : Board = [
        createCard(SEVEN, 'clubs'),
        createCard(SEVEN, 'diamonds'),
        createCard(SEVEN, 'hearts'),
        createCard(SEVEN, 'spades'),
        createCard(ACE, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.FourOfAKind);
    });

    it('should detect four of a kind (quad Aces)', () => {
      const cards : Board = [
        createCard(ACE, 'clubs'),
        createCard(ACE, 'diamonds'),
        createCard(ACE, 'hearts'),
        createCard(ACE, 'spades'),
        createCard(KING, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.FourOfAKind);
    });
  });

  describe('Straight Flush', () => {
    it('should detect a straight flush (5-9 all spades)', () => {
      const cards : Board = [
        createCard(FIVE, 'spades'),
        createCard(SIX, 'spades'),
        createCard(SEVEN, 'spades'),
        createCard(EIGHT, 'spades'),
        createCard(NINE, 'spades'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.StraightFlush);
    });

    it('should detect a royal flush (10-A all hearts) as StraightFlush', () => {
      const cards : Board = [
        createCard(TEN, 'hearts'),
        createCard(JACK, 'hearts'),
        createCard(QUEEN, 'hearts'),
        createCard(KING, 'hearts'),
        createCard(ACE, 'hearts'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.StraightFlush);
    });

    it('should detect an Ace-low straight flush / steel wheel (A-2-3-4-5 all diamonds)', () => {
      const cards : Board = [
        createCard(ACE, 'diamonds'),
        createCard(TWO, 'diamonds'),
        createCard(THREE, 'diamonds'),
        createCard(FOUR, 'diamonds'),
        createCard(FIVE, 'diamonds'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.StraightFlush);
    });

    it('should NOT be StraightFlush when flush but no straight', () => {
      const cards : Board = [
        createCard(ACE, 'clubs'),
        createCard(JACK, 'clubs'),
        createCard(NINE, 'clubs'),
        createCard(FOUR, 'clubs'),
        createCard(TWO, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.Flush);
    });

    it('should NOT be StraightFlush when straight but no flush', () => {
      const cards : Board = [
        createCard(SIX, 'clubs'),
        createCard(SEVEN, 'diamonds'),
        createCard(EIGHT, 'hearts'),
        createCard(NINE, 'spades'),
        createCard(TEN, 'clubs'),
      ];
      const result = evaluateHand5(cards);
      expect(result.category).toBe(HandCategory.Straight);
    });
  });

});
