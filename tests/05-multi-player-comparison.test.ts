import { Board, Card, HandCategory, PlayerHand } from '../src/types';
import { compareAllPlayers } from '../src/comparer';
import { createCard, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE } from './helpers';

// Shorthand pour créer un PlayerHand
function player(
  h1: Card, h2: Card,
  b1: Card, b2: Card,
  b3: Card, b4: Card,
  b5: Card
) {
  return {
    holeCards: [h1, h2] as [Card, Card],
    board: [b1, b2, b3, b4, b5] as [Card, Card, Card, Card, Card],
  };
}

describe('Multi-player comparison (compareAllPlayers)', () => {

  describe('Head-to-head (2 players)', () => {
    it('player with higher category wins', () => {
      const board: Board = [
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(NINE, 'spades'), createCard(JACK, 'clubs'),
      ];

      // P1 : one pair Aces
      const p1 : PlayerHand = { holeCards: [createCard(ACE, 'clubs'), createCard(ACE, 'diamonds')], board };
      // P2 : high card
      const p2 : PlayerHand = { holeCards: [createCard(KING, 'clubs'), createCard(QUEEN, 'diamonds')], board };

      const result = compareAllPlayers([p1, p2]);
      expect(result.winners).toEqual([0]); // P1 wins
    });

    it('same category: better hand wins', () => {
      const board: Board = [
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(NINE, 'spades'), createCard(JACK, 'clubs'),
      ] 

      // P1 : one pair Aces
      const p1 : PlayerHand = { holeCards: [createCard(ACE, 'clubs'), createCard(ACE, 'diamonds')], board };
      // P2 : one pair Kings
      const p2 : PlayerHand = { holeCards: [createCard(KING, 'clubs'), createCard(KING, 'diamonds')], board };

      const result = compareAllPlayers([p1, p2]);
      expect(result.winners).toEqual([0]); // P1 (Aces) wins
    });

    it('equal hands → split pot (winners contains both indices)', () => {
      const board: Board = [
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(JACK, 'spades'), createCard(TEN, 'clubs'),
      ];

      // Both players have weak hole cards; board straight A-K-Q-J-10 plays
      const p1 : PlayerHand = { holeCards: [createCard(TWO, 'clubs'), createCard(THREE, 'diamonds')], board };
      const p2 : PlayerHand = { holeCards: [createCard(FOUR, 'spades'), createCard(FIVE, 'hearts')], board };
      const result = compareAllPlayers([p1, p2]);
      expect(result.winners).toHaveLength(2);
      expect(result.winners).toContain(0);
      expect(result.winners).toContain(1);
    });
  });

  describe('Three players', () => {
    it('one clear winner among 3', () => {
      const board : Board = [
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(FIVE, 'spades'), createCard(KING, 'clubs'),
      ]

      // P1 : straight A-2-3-4-5 vs 2-3-4-5-6 → 6-high straight
      const p1 : PlayerHand = { holeCards: [createCard(SIX, 'clubs'), createCard(SEVEN, 'diamonds')], board };
      // P2 : trip Kings + pair 2-3
      // P3 : high card
      const p2 : PlayerHand = { holeCards: [createCard(KING, 'diamonds'), createCard(KING, 'hearts')], board };
      
      const p3 : PlayerHand = { holeCards: [createCard(JACK, 'clubs'), createCard(QUEEN, 'diamonds')], board };
      const result = compareAllPlayers([p1, p2, p3]);
      // Straight > Three of a Kind → P1 wins
      expect(result.winners).toEqual([0]);
    });

    it('two tied players beat the third', () => {
      const board: Board = [
        createCard(ACE, 'clubs'), createCard(KING, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(JACK, 'spades'), createCard(TWO, 'clubs'),
      ];

      const p1 : PlayerHand = { holeCards: [createCard(TEN, 'clubs'), createCard(THREE, 'diamonds')], board };
      const p2 : PlayerHand = { holeCards: [createCard(TEN, 'spades'), createCard(FIVE, 'hearts')], board };
      const p3 : PlayerHand = { holeCards: [createCard(NINE, 'clubs'), createCard(EIGHT, 'diamonds')], board };

      const result = compareAllPlayers([p1, p2, p3]);
      expect(result.winners).toHaveLength(2);
      expect(result.winners).toContain(0);
      expect(result.winners).toContain(1);
      expect(result.winners).not.toContain(2);
    });
  });

  describe('Example D — Board plays (split pot)', () => {
    it('both players use the board straight, result is a tie', () => {
      const board : Board = [
        createCard(FIVE, 'clubs'), createCard(SIX, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(EIGHT, 'spades'), createCard(NINE, 'diamonds'),
      ] 

      const p2 : PlayerHand = { holeCards: [createCard(KING, 'clubs'), createCard(QUEEN, 'diamonds')], board };
      const p1 : PlayerHand = { holeCards: [createCard(ACE, 'clubs'), createCard(ACE, 'diamonds')], board };

      const result = compareAllPlayers([p1, p2]);
      expect(result.winners).toHaveLength(2);
      expect(result.hands[0].category).toBe(HandCategory.Straight);
      expect(result.hands[1].category).toBe(HandCategory.Straight);
    });
  });

  describe('Example E — Quads on board, kicker decides', () => {
    it('player 1 wins with Ace kicker over player 2 with Queen kicker', () => {
      const board : Board = [
        createCard(SEVEN, 'clubs'), createCard(SEVEN, 'diamonds'), createCard(SEVEN, 'hearts'),
        createCard(SEVEN, 'spades'), createCard(TWO, 'diamonds'),
      ] 

      const p2 : PlayerHand = { holeCards: [createCard(QUEEN, 'clubs'), createCard(JACK, 'clubs')], board };
      const p1 : PlayerHand = { holeCards: [createCard(ACE, 'clubs'), createCard(KING, 'clubs')], board };

      const result = compareAllPlayers([p1, p2]);
      expect(result.winners).toEqual([0]); // P1 wins
      expect(result.hands[0].category).toBe(HandCategory.FourOfAKind);
      expect(result.hands[1].category).toBe(HandCategory.FourOfAKind);
    });
  });

  describe('ComparisonResult structure', () => {
    it('hands array has one entry per player', () => {
      const board : Board = [
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(FIVE, 'spades'), createCard(SIX, 'clubs'),
      ] 

      const p2 : PlayerHand = { holeCards: [createCard(KING, 'clubs'), createCard(EIGHT, 'diamonds')], board };
      const p1 : PlayerHand = { holeCards: [createCard(ACE, 'clubs'), createCard(SEVEN, 'diamonds')], board };
      const p3 : PlayerHand = { holeCards: [createCard(QUEEN, 'clubs'), createCard(NINE, 'diamonds')], board };
      const result = compareAllPlayers([p1, p2, p3]);
      expect(result.hands).toHaveLength(3);
      // Every hand must have category and chosen5
      for (const hand of result.hands) {
        expect(hand.category).toBeDefined();
        expect(hand.chosen5).toHaveLength(5);
      }
    });

    it('winners array is non-empty', () => {
      const board : Board = [
        createCard(TWO, 'clubs'), createCard(THREE, 'diamonds'), createCard(FOUR, 'hearts'),
        createCard(FIVE, 'spades'), createCard(SIX, 'clubs'),
      ] 

      const p1 : PlayerHand = { holeCards: [createCard(ACE, 'clubs'), createCard(ACE, 'diamonds')], board };
      const p2 : PlayerHand = { holeCards: [createCard(TWO, 'hearts'), createCard(NINE, 'spades')], board };

      const result = compareAllPlayers([p1, p2]);
      expect(result.winners.length).toBeGreaterThan(0);
    });
  });

  describe('Example A — Ace-low straight (wheel), single player', () => {
    it('evaluates wheel correctly', () => {
      const board : Board = [
        createCard(ACE, 'clubs'), createCard(TWO, 'diamonds'), createCard(THREE, 'hearts'),
        createCard(FOUR, 'spades'), createCard(NINE, 'diamonds'),
      ] 

      const p1 : PlayerHand = { holeCards: [createCard(FIVE, 'clubs'), createCard(KING, 'diamonds')], board };
      const result = compareAllPlayers([p1]);

      expect(result.winners).toEqual([0]);
      expect(result.hands[0].category).toBe(HandCategory.Straight);
      // Ordering: 5,4,3,2,A
      const ranks = result.hands[0].chosen5.map((card: Card) => card.rank);
      expect(ranks).toEqual([FIVE, FOUR, THREE, TWO, ACE]);
    });
  });

  describe('Example B — Ace-high straight (broadway)', () => {
    it('evaluates broadway correctly', () => {
      const board : Board = [
        createCard(TEN, 'clubs'), createCard(JACK, 'diamonds'), createCard(QUEEN, 'hearts'),
        createCard(KING, 'spades'), createCard(TWO, 'diamonds'),
      ] 

      const p1 : PlayerHand = { holeCards: [createCard(ACE, 'clubs'), createCard(THREE, 'diamonds')], board };
      const result = compareAllPlayers([p1]);

      expect(result.hands[0].category).toBe(HandCategory.Straight);
      const ranks = result.hands[0].chosen5.map((card: Card) => card.rank);
      expect(ranks).toEqual([ACE, KING, QUEEN, JACK, TEN]);
    });
  });

  describe('Example C — Flush with 5+ suited cards', () => {
    it('picks the best 5 hearts', () => {
      const board : Board = [
        createCard(ACE, 'hearts'), createCard(JACK, 'hearts'), createCard(NINE, 'hearts'),
        createCard(FOUR, 'hearts'), createCard(TWO, 'clubs'),
      ] 

      const p1 : PlayerHand = { holeCards: [createCard(SIX, 'hearts'), createCard(KING, 'diamonds')], board };
      const result = compareAllPlayers([p1]);

      expect(result.hands[0].category).toBe(HandCategory.Flush);
      const ranks = result.hands[0].chosen5.map((card: Card) => card.rank).sort((a: number, b: number) => b - a);
      expect(ranks).toEqual([ACE, JACK, NINE, SIX, FOUR]);
    });
  });

});
