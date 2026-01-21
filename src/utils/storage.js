const STORAGE_KEY = 'runesGambitState'

/**
 * Validate game state structure
 * @param {Object} state - State object to validate
 * @returns {boolean} True if valid game state
 */
function isValidGameState(state) {
  return (
    state &&
    typeof state === 'object' &&
    state.players &&
    typeof state.players === 'object'
  )
}

/**
 * Save game state to localStorage
 * @param {Object} gameState - Complete game state object
 */
export function saveGameState(gameState) {
  try {
    const stateToSave = {
      ...gameState,
      _timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
  } catch (error) {
    console.warn('Failed to save game state:', error)
    // Fail silently to not interrupt gameplay
  }
}

/**
 * Load game state from localStorage
 * @returns {Object|null} Loaded game state or null if none exists
 */
export function loadGameState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    
    if (!saved) {
      return null
    }

    const parsed = JSON.parse(saved)

    // Validate state structure
    if (!isValidGameState(parsed)) {
      return null
    }

    // Remove timestamp before returning
    const { _timestamp, ...stateWithoutTimestamp } = parsed
    // _timestamp is intentionally destructured to extract and remove it from state

    return stateWithoutTimestamp
  } catch (error) {
    console.warn('Failed to load game state:', error)
    return null
  }
}

/**
 * Clear saved game state from localStorage
 */
export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear game state:', error)
  }
}
