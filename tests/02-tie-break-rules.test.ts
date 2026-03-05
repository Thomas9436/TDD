import { Card, HandCategory, HandResult } from '../src/types';
import { compareHands } from '../src/comparer';
import { createCard, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE, createHandResult } from './helpers';

describe('Tie-break rules (compareHands)', () => {

  describe('Cross-category ranking', () => {
    it('StraightFlush beats FourOfAKind', () => {
      const sf = createHandResult(HandCategory.StraightFlush, [
        createCard(NINE, 'spades'), createCard(EIGHT, 'spades'), createCard(SEVEN, 'spades'),
        createCard(SIX, 'spades'), createCard(FIVE, 'spades'),
      ]);
      const foak = createHandResult(HandCategory.FourOfAKind, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'), createCard(ACE, 'hearts'), createCard(ACE, 'spades'),
        createCard(KING, 'clubs'),
      ]);
      expect(compareHands(sf, foak)).toBeGreaterThan(0);
    });

    it('FourOfAKind beats FullHouse', () => {
      const foak = createHandResult(HandCategory.FourOfAKind, [
        createCard(TWO, 'clubs'), createCard(TWO, 'diamonds'), createCard(TWO, 'hearts'), createCard(TWO, 'spades'),
        createCard(THREE, 'clubs'),
      ]);
      const fh = createHandResult(HandCategory.FullHouse, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'), createCard(ACE, 'hearts'),
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
      ]);
      expect(compareHands(foak, fh)).toBeGreaterThan(0);
    });

    it('FullHouse beats Flush', () => {
      const fh = createHandResult(HandCategory.FullHouse, [
        createCard(TWO, 'clubs'), createCard(TWO, 'diamonds'), createCard(TWO, 'hearts'),
        createCard(THREE, 'clubs'), createCard(THREE, 'diamonds'),
      ]);
      const flush = createHandResult(HandCategory.Flush, [
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'),
        createCard(JACK, 'clubs'), createCard(NINE, 'clubs'),
      ]);
      expect(compareHands(fh, flush)).toBeGreaterThan(0);
    });

    it('Flush beats Straight', () => {
      const flush = createHandResult(HandCategory.Flush, [
        createCard(TWO, 'hearts'), createCard(THREE, 'hearts'), createCard(FOUR, 'hearts'),
        createCard(SIX, 'hearts'), createCard(EIGHT, 'hearts'),
      ]);
      const straight = createHandResult(HandCategory.Straight, [
        createCard(TEN, 'clubs'), createCard(NINE, 'diamonds'), createCard(EIGHT, 'hearts'),
        createCard(SEVEN, 'spades'), createCard(SIX, 'clubs'),
      ]);
      expect(compareHands(flush, straight)).toBeGreaterThan(0);
    });

    it('Straight beats ThreeOfAKind', () => {
      const straight = createHandResult(HandCategory.Straight, [
        createCard(SIX, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(THREE, 'spades'), createCard(TWO, 'clubs'),
      ]);
      const toak = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'), createCard(ACE, 'hearts'),
        createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'),
      ]);
      expect(compareHands(straight, toak)).toBeGreaterThan(0);
    });

    it('ThreeOfAKind beats TwoPair', () => {
      const toak = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(TWO, 'clubs'), createCard(TWO, 'diamonds'), createCard(TWO, 'hearts'),
        createCard(FOUR, 'clubs'), createCard(THREE, 'clubs'),
      ]);
      const twopair = createHandResult(HandCategory.TwoPair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
        createCard(QUEEN, 'clubs'),
      ]);
      expect(compareHands(toak, twopair)).toBeGreaterThan(0);
    });

    it('TwoPair beats OnePair', () => {
      const twopair = createHandResult(HandCategory.TwoPair, [
        createCard(TWO, 'clubs'), createCard(TWO, 'diamonds'),
        createCard(THREE, 'clubs'), createCard(THREE, 'diamonds'),
        createCard(FOUR, 'clubs'),
      ]);
      const onepair = createHandResult(HandCategory.OnePair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'), createCard(JACK, 'clubs'),
      ]);
      expect(compareHands(twopair, onepair)).toBeGreaterThan(0);
    });

    it('OnePair beats HighCard', () => {
      const onepair = createHandResult(HandCategory.OnePair, [
        createCard(TWO, 'clubs'), createCard(TWO, 'diamonds'),
        createCard(THREE, 'clubs'), createCard(FOUR, 'clubs'), createCard(FIVE, 'clubs'),
      ]);
      const highcard = createHandResult(HandCategory.HighCard, [
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(JACK, 'spades'), createCard(NINE, 'clubs'),
      ]);
      expect(compareHands(onepair, highcard)).toBeGreaterThan(0);
    });
  });

  describe('4.1 Straight tie-break (highest card)', () => {
    it('9-high straight beats 8-high straight', () => {
      const s9 = createHandResult(HandCategory.Straight, [
        createCard(NINE, 'clubs'), createCard(EIGHT, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(SIX, 'spades'), createCard(FIVE, 'clubs'),
      ]);
      const s8 = createHandResult(HandCategory.Straight, [
        createCard(EIGHT, 'clubs'), createCard(SEVEN, 'diamonds'), createCard(SIX, 'hearts'),
        createCard(FIVE, 'spades'), createCard(FOUR, 'clubs'),
      ]);
      expect(compareHands(s9, s8)).toBeGreaterThan(0);
    });

    it('Ace-high straight beats 9-high straight', () => {
      const broadway = createHandResult(HandCategory.Straight, [
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(JACK, 'spades'), createCard(TEN, 'clubs'),
      ]);
      const s9 = createHandResult(HandCategory.Straight, [
        createCard(NINE, 'clubs'), createCard(EIGHT, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(SIX, 'spades'), createCard(FIVE, 'clubs'),
      ]);
      expect(compareHands(broadway, s9)).toBeGreaterThan(0);
    });

    it('Wheel (5-high) loses to any higher straight', () => {
      const wheel = createHandResult(HandCategory.Straight, [
        createCard(FIVE, 'clubs'), createCard(FOUR, 'diamonds'), createCard(THREE, 'hearts'),
        createCard(TWO, 'spades'), createCard(ACE, 'clubs'),
      ]);
      const s6 = createHandResult(HandCategory.Straight, [
        createCard(SIX, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(THREE, 'spades'), createCard(TWO, 'clubs'),
      ]);
      expect(compareHands(wheel, s6)).toBeLessThan(0);
    });

    it('Two identical straights (same high card) are a tie', () => {
      const s1 = createHandResult(HandCategory.Straight, [
        createCard(KING, 'clubs'), createCard(QUEEN, 'diamonds'), createCard(JACK, 'hearts'),
        createCard(TEN, 'spades'), createCard(NINE, 'clubs'),
      ]);
      const s2 = createHandResult(HandCategory.Straight, [
        createCard(KING, 'hearts'), createCard(QUEEN, 'spades'), createCard(JACK, 'clubs'),
        createCard(TEN, 'diamonds'), createCard(NINE, 'hearts'),
      ]);
      expect(compareHands(s1, s2)).toBe(0);
    });
  });

  describe('4.2 Four of a Kind tie-break', () => {
    it('higher quad rank wins', () => {
      const quadK = createHandResult(HandCategory.FourOfAKind, [
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'), createCard(KING, 'hearts'), createCard(KING, 'spades'),
        createCard(TWO, 'clubs'),
      ]);
      const quadQ = createHandResult(HandCategory.FourOfAKind, [
        createCard(QUEEN, 'clubs'), createCard(QUEEN, 'diamonds'), createCard(QUEEN, 'hearts'), createCard(QUEEN, 'spades'),
        createCard(ACE, 'clubs'),
      ]);
      expect(compareHands(quadK, quadQ)).toBeGreaterThan(0);
    });

    it('equal quad rank: higher kicker wins', () => {
      const quadAceA = createHandResult(HandCategory.FourOfAKind, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'), createCard(ACE, 'hearts'), createCard(ACE, 'spades'),
        createCard(KING, 'clubs'),
      ]);
      const quadAceB = createHandResult(HandCategory.FourOfAKind, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'), createCard(ACE, 'hearts'), createCard(ACE, 'spades'),
        createCard(QUEEN, 'clubs'),
      ]);
      expect(compareHands(quadAceA, quadAceB)).toBeGreaterThan(0);
    });

    it('equal quad rank and equal kicker is a tie', () => {
      const a = createHandResult(HandCategory.FourOfAKind, [
        createCard(SEVEN, 'clubs'), createCard(SEVEN, 'diamonds'), createCard(SEVEN, 'hearts'), createCard(SEVEN, 'spades'),
        createCard(ACE, 'clubs'),
      ]);
      const b = createHandResult(HandCategory.FourOfAKind, [
        createCard(SEVEN, 'clubs'), createCard(SEVEN, 'diamonds'), createCard(SEVEN, 'hearts'), createCard(SEVEN, 'spades'),
        createCard(ACE, 'hearts'),
      ]);
      expect(compareHands(a, b)).toBe(0);
    });
  });

  describe('4.3 Full House tie-break', () => {
    it('higher triplet rank wins', () => {
      const fhK = createHandResult(HandCategory.FullHouse, [
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'), createCard(KING, 'hearts'),
        createCard(TWO, 'clubs'), createCard(TWO, 'diamonds'),
      ]);
      const fhQ = createHandResult(HandCategory.FullHouse, [
        createCard(QUEEN, 'clubs'), createCard(QUEEN, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
      ]);
      expect(compareHands(fhK, fhQ)).toBeGreaterThan(0);
    });

    it('equal triplet rank: higher pair rank wins', () => {
      const fhTripAcesPairK = createHandResult(HandCategory.FullHouse, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'), createCard(ACE, 'hearts'),
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
      ]);
      const fhTripAcesPairQ = createHandResult(HandCategory.FullHouse, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'), createCard(ACE, 'hearts'),
        createCard(QUEEN, 'clubs'), createCard(QUEEN, 'diamonds'),
      ]);
      expect(compareHands(fhTripAcesPairK, fhTripAcesPairQ)).toBeGreaterThan(0);
    });

    it('same triplet and pair is a tie', () => {
      const a = createHandResult(HandCategory.FullHouse, [
        createCard(NINE, 'clubs'), createCard(NINE, 'diamonds'), createCard(NINE, 'hearts'),
        createCard(THREE, 'clubs'), createCard(THREE, 'spades'),
      ]);
      const b = createHandResult(HandCategory.FullHouse, [
        createCard(NINE, 'clubs'), createCard(NINE, 'diamonds'), createCard(NINE, 'spades'),
        createCard(THREE, 'hearts'), createCard(THREE, 'diamonds'),
      ]);
      expect(compareHands(a, b)).toBe(0);
    });
  });

  describe('4.4 Flush tie-break (descending ranks)', () => {
    it('higher top card wins', () => {
      const flushA = createHandResult(HandCategory.Flush, [
        createCard(ACE, 'hearts'), createCard(TEN, 'hearts'), createCard(EIGHT, 'hearts'),
        createCard(SIX, 'hearts'), createCard(TWO, 'hearts'),
      ]);
      const flushK = createHandResult(HandCategory.Flush, [
        createCard(KING, 'hearts'), createCard(TEN, 'hearts'), createCard(EIGHT, 'hearts'),
        createCard(SIX, 'hearts'), createCard(TWO, 'hearts'),
      ]);
      expect(compareHands(flushA, flushK)).toBeGreaterThan(0);
    });

    it('equal top card: second card decides', () => {
      const f1 = createHandResult(HandCategory.Flush, [
        createCard(ACE, 'clubs'), createCard(QUEEN, 'clubs'), createCard(TEN, 'clubs'),
        createCard(EIGHT, 'clubs'), createCard(TWO, 'clubs'),
      ]);
      const f2 = createHandResult(HandCategory.Flush, [
        createCard(ACE, 'clubs'), createCard(JACK, 'clubs'), createCard(TEN, 'clubs'),
        createCard(EIGHT, 'clubs'), createCard(TWO, 'clubs'),
      ]);
      expect(compareHands(f1, f2)).toBeGreaterThan(0);
    });

    it('all five ranks equal → tie', () => {
      const f1 = createHandResult(HandCategory.Flush, [
        createCard(ACE, 'spades'), createCard(KING, 'spades'), createCard(QUEEN, 'spades'),
        createCard(JACK, 'spades'), createCard(NINE, 'spades'),
      ]);
      const f2 = createHandResult(HandCategory.Flush, [
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'),
        createCard(JACK, 'clubs'), createCard(NINE, 'clubs'),
      ]);
      expect(compareHands(f1, f2)).toBe(0);
    });
  });

  describe('4.5 Three of a Kind tie-break', () => {
    it('higher triplet rank wins', () => {
      const tripK = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'), createCard(KING, 'hearts'),
        createCard(ACE, 'spades'), createCard(TWO, 'clubs'),
      ]);
      const tripQ = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(QUEEN, 'clubs'), createCard(QUEEN, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(ACE, 'spades'), createCard(KING, 'clubs'),
      ]);
      expect(compareHands(tripK, tripQ)).toBeGreaterThan(0);
    });

    it('equal triplet: first kicker decides', () => {
      const t1 = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(FIVE, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FIVE, 'hearts'),
        createCard(ACE, 'spades'), createCard(TWO, 'clubs'),
      ]);
      const t2 = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(FIVE, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FIVE, 'hearts'),
        createCard(KING, 'spades'), createCard(TWO, 'clubs'),
      ]);
      expect(compareHands(t1, t2)).toBeGreaterThan(0);
    });

    it('equal triplet and first kicker: second kicker decides', () => {
      const t1 = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(FIVE, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FIVE, 'hearts'),
        createCard(ACE, 'spades'), createCard(KING, 'clubs'),
      ]);
      const t2 = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(FIVE, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FIVE, 'hearts'),
        createCard(ACE, 'spades'), createCard(QUEEN, 'clubs'),
      ]);
      expect(compareHands(t1, t2)).toBeGreaterThan(0);
    });

    it('all equal → tie', () => {
      const t1 = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(FIVE, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FIVE, 'hearts'),
        createCard(ACE, 'spades'), createCard(KING, 'clubs'),
      ]);
      const t2 = createHandResult(HandCategory.ThreeOfAKind, [
        createCard(FIVE, 'clubs'), createCard(FIVE, 'diamonds'), createCard(FIVE, 'spades'),
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'),
      ]);
      expect(compareHands(t1, t2)).toBe(0);
    });
  });

  describe('4.6 Two Pair tie-break', () => {
    it('higher top pair wins', () => {
      const tp1 = createHandResult(HandCategory.TwoPair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(THREE, 'clubs'), createCard(THREE, 'diamonds'),
        createCard(TWO, 'clubs'),
      ]);
      const tp2 = createHandResult(HandCategory.TwoPair, [
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
        createCard(QUEEN, 'clubs'), createCard(QUEEN, 'diamonds'),
        createCard(ACE, 'clubs'),
      ]);
      expect(compareHands(tp1, tp2)).toBeGreaterThan(0);
    });

    it('equal top pair: lower pair decides', () => {
      const tp1 = createHandResult(HandCategory.TwoPair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(QUEEN, 'clubs'), createCard(QUEEN, 'diamonds'),
        createCard(TWO, 'clubs'),
      ]);
      const tp2 = createHandResult(HandCategory.TwoPair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(JACK, 'clubs'), createCard(JACK, 'diamonds'),
        createCard(KING, 'clubs'),
      ]);
      expect(compareHands(tp1, tp2)).toBeGreaterThan(0);
    });

    it('equal both pairs: kicker decides', () => {
      const tp1 = createHandResult(HandCategory.TwoPair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
        createCard(QUEEN, 'clubs'),
      ]);
      const tp2 = createHandResult(HandCategory.TwoPair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
        createCard(JACK, 'clubs'),
      ]);
      expect(compareHands(tp1, tp2)).toBeGreaterThan(0);
    });

    it('equal both pairs and kicker → tie', () => {
      const tp1 = createHandResult(HandCategory.TwoPair, [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(FIVE, 'clubs'), createCard(FIVE, 'diamonds'),
        createCard(ACE, 'clubs'),
      ]);
      const tp2 = createHandResult(HandCategory.TwoPair, [
        createCard(TEN, 'spades'), createCard(TEN, 'hearts'),
        createCard(FIVE, 'hearts'), createCard(FIVE, 'spades'),
        createCard(ACE, 'hearts'),
      ]);
      expect(compareHands(tp1, tp2)).toBe(0);
    });
  });

  describe('4.7 One Pair tie-break', () => {
    it('higher pair rank wins', () => {
      const pairA = createHandResult(HandCategory.OnePair, [
        createCard(ACE, 'clubs'), createCard(ACE, 'diamonds'),
        createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'), createCard(JACK, 'clubs'),
      ]);
      const pairK = createHandResult(HandCategory.OnePair, [
        createCard(KING, 'clubs'), createCard(KING, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(QUEEN, 'clubs'), createCard(JACK, 'clubs'),
      ]);
      expect(compareHands(pairA, pairK)).toBeGreaterThan(0);
    });

    it('equal pair: first kicker decides', () => {
      const p1 = createHandResult(HandCategory.OnePair, [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(FOUR, 'clubs'), createCard(TWO, 'clubs'),
      ]);
      const p2 = createHandResult(HandCategory.OnePair, [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(KING, 'clubs'), createCard(FOUR, 'clubs'), createCard(TWO, 'clubs'),
      ]);
      expect(compareHands(p1, p2)).toBeGreaterThan(0);
    });

    it('equal pair and first kicker: second kicker decides', () => {
      const p1 = createHandResult(HandCategory.OnePair, [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'), createCard(TWO, 'clubs'),
      ]);
      const p2 = createHandResult(HandCategory.OnePair, [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(QUEEN, 'clubs'), createCard(TWO, 'clubs'),
      ]);
      expect(compareHands(p1, p2)).toBeGreaterThan(0);
    });

    it('equal pair and two kickers: third kicker decides', () => {
      const p1 = createHandResult(HandCategory.OnePair, [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'),
      ]);
      const p2 = createHandResult(HandCategory.OnePair, [
        createCard(TEN, 'clubs'), createCard(TEN, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'), createCard(JACK, 'clubs'),
      ]);
      expect(compareHands(p1, p2)).toBeGreaterThan(0);
    });

    it('all equal → tie', () => {
      const p1 = createHandResult(HandCategory.OnePair, [
        createCard(EIGHT, 'clubs'), createCard(EIGHT, 'diamonds'),
        createCard(ACE, 'clubs'), createCard(KING, 'clubs'), createCard(QUEEN, 'clubs'),
      ]);
      const p2 = createHandResult(HandCategory.OnePair, [
        createCard(EIGHT, 'spades'), createCard(EIGHT, 'hearts'),
        createCard(ACE, 'spades'), createCard(KING, 'spades'), createCard(QUEEN, 'spades'),
      ]);
      expect(compareHands(p1, p2)).toBe(0);
    });
  });

  describe('4.8 High Card tie-break (descending ranks)', () => {
    it('higher first card wins', () => {
      const hc1 = createHandResult(HandCategory.HighCard, [
        createCard(ACE, 'clubs'), createCard(TEN, 'diamonds'), createCard(EIGHT, 'hearts'),
        createCard(SIX, 'spades'), createCard(TWO, 'clubs'),
      ]);
      const hc2 = createHandResult(HandCategory.HighCard, [
        createCard(KING, 'clubs'), createCard(TEN, 'diamonds'), createCard(EIGHT, 'hearts'),
        createCard(SIX, 'spades'), createCard(TWO, 'clubs'),
      ]);
      expect(compareHands(hc1, hc2)).toBeGreaterThan(0);
    });

    it('equal first four cards: fifth card decides', () => {
      const hc1 = createHandResult(HandCategory.HighCard, [
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(JACK, 'spades'), createCard(NINE, 'clubs'),
      ]);
      const hc2 = createHandResult(HandCategory.HighCard, [
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(JACK, 'spades'), createCard(EIGHT, 'clubs'),
      ]);
      expect(compareHands(hc1, hc2)).toBeGreaterThan(0);
    });

    it('all five cards equal → tie', () => {
      const hc1 = createHandResult(HandCategory.HighCard, [
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(JACK, 'spades'), createCard(NINE, 'clubs'),
      ]);
      const hc2 = createHandResult(HandCategory.HighCard, [
        createCard(ACE, 'spades'), createCard(KING, 'hearts'), createCard(QUEEN, 'clubs'),
        createCard(JACK, 'diamonds'), createCard(NINE, 'spades'),
      ]);
      expect(compareHands(hc1, hc2)).toBe(0);
    });
  });

});
