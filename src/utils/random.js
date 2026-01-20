/**
 * Rolls a die with specified number of sides
 * @param {number} sides - Number of sides on the die (default: 6)
 * @returns {number} Random integer between 1 and sides
 */
export function rollDice(sides = 6) {
  if (sides < 1 || !Number.isInteger(sides)) {
    throw new Error('Sides must be a positive integer')
  }
  return Math.floor(Math.random() * sides) + 1
}

/**
 * Flips a coin to determine which player goes first
 * @returns {'player1' | 'player2'} Random player selection
 */
export function flipCoin() {
  return Math.random() < 0.5 ? 'player1' : 'player2'
}
