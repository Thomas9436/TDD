
//  - compareHands      : compare deux HandResult, retourne >0 / <0 / 0
//  - compareAllPlayers : détermine le(s) gagnant(s) parmi N joueurs
 

import { HandResult, PlayerHand, ComparisonResult } from './types';

/**
 * Compare deux HandResult.
 * @returns  > 0 si a > b,  < 0 si a < b,  0 si égalité
 */
export function compareHands(_a: HandResult, _b: HandResult): number {
  throw new Error('Not implemented yet');
}

/**
 * Détermine le(s) gagnant(s) parmi une liste de joueurs.
 * @param players  Tableau de joueurs (holeCards + board)
 */
export function compareAllPlayers(_players: PlayerHand[]): ComparisonResult {
  throw new Error('Not implemented yet');
}
