/**
 * Rolls a 6-sided die
 * @returns {number} Random integer between 1 and 6
 */
export function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}
