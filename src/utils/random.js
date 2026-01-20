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
 * Flips a coin to choose between two options
 * @param {string} option1 - First option (default: 'player1')
 * @param {string} option2 - Second option (default: 'player2')
 * @returns {string} Randomly selected option
 */
export function flipCoin(option1 = 'player1', option2 = 'player2') {
  return Math.random() < 0.5 ? option1 : option2
}
