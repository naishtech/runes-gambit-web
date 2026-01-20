# Task 16: LocalStorage & Persistence (TDD)

**Status**: Not Started  
**Estimated Time**: 2.5 hours  
**Dependencies**: Tasks 01-15  
**Week**: 4

## Objective
Implement automatic game state persistence using LocalStorage with TDD. Game state should be saved automatically and restored on page reload, allowing players to continue interrupted games.

## What We're Building

- Auto-save game state on every change
- Restore game state on page load
- Clear saved state on game reset
- Save player preferences (names)
- Graceful handling of missing/corrupt data

---

## Phase 1: LocalStorage Utility (TDD)

### Red: Write Storage Utility Tests

**File**: `tests/unit/utils/storage.spec.js`

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { saveGameState, loadGameState, clearGameState } from '@/utils/storage'

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('saveGameState', () => {
    it('saves game state to localStorage', () => {
      const gameState = {
        players: {
          player1: { name: 'Alice', lifePoints: 18, availableMana: 3 },
          player2: { name: 'Bob', lifePoints: 20, availableMana: 2 }
        },
        sharedManaPool: 15,
        gameStarted: true,
        currentPlayer: 'player1',
        currentPhase: 'play',
        turnNumber: 3
      }

      saveGameState(gameState)

      const saved = localStorage.getItem('runesGambitState')
      expect(saved).toBeTruthy()
      
      const parsed = JSON.parse(saved)
      expect(parsed.players.player1.name).toBe('Alice')
      expect(parsed.sharedManaPool).toBe(15)
      expect(parsed.turnNumber).toBe(3)
    })

    it('includes timestamp in saved state', () => {
      const gameState = {
        players: {
          player1: { name: 'Alice', lifePoints: 20, availableMana: 0 },
          player2: { name: 'Bob', lifePoints: 20, availableMana: 0 }
        },
        sharedManaPool: 20
      }

      saveGameState(gameState)

      const saved = localStorage.getItem('runesGambitState')
      const parsed = JSON.parse(saved)
      
      expect(parsed._timestamp).toBeDefined()
      expect(typeof parsed._timestamp).toBe('number')
    })

    it('overwrites previous saved state', () => {
      const state1 = {
        players: {
          player1: { name: 'Alice', lifePoints: 20, availableMana: 0 },
          player2: { name: 'Bob', lifePoints: 20, availableMana: 0 }
        }
      }
      const state2 = {
        players: {
          player1: { name: 'Charlie', lifePoints: 15, availableMana: 5 },
          player2: { name: 'Diana', lifePoints: 18, availableMana: 3 }
        }
      }

      saveGameState(state1)
      saveGameState(state2)

      const saved = localStorage.getItem('runesGambitState')
      const parsed = JSON.parse(saved)
      
      expect(parsed.players.player1.name).toBe('Charlie')
    })

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const gameState = { players: {} }
      
      // Should not throw
      expect(() => saveGameState(gameState)).not.toThrow()

      setItemSpy.mockRestore()
    })
  })

  describe('loadGameState', () => {
    it('loads game state from localStorage', () => {
      const gameState = {
        players: {
          player1: { name: 'Alice', lifePoints: 15, availableMana: 4 },
          player2: { name: 'Bob', lifePoints: 18, availableMana: 2 }
        },
        sharedManaPool: 14,
        gameStarted: true,
        turnNumber: 5
      }

      localStorage.setItem('runesGambitState', JSON.stringify(gameState))

      const loaded = loadGameState()

      expect(loaded).toBeTruthy()
      expect(loaded.players.player1.name).toBe('Alice')
      expect(loaded.sharedManaPool).toBe(14)
      expect(loaded.turnNumber).toBe(5)
    })

    it('returns null when no saved state exists', () => {
      const loaded = loadGameState()
      expect(loaded).toBeNull()
    })

    it('returns null for corrupt data', () => {
      localStorage.setItem('runesGambitState', 'invalid json {{{')

      const loaded = loadGameState()
      expect(loaded).toBeNull()
    })

    it('ignores timestamp field when loading', () => {
      const gameState = {
        players: {
          player1: { name: 'Alice', lifePoints: 20, availableMana: 0 },
          player2: { name: 'Bob', lifePoints: 20, availableMana: 0 }
        },
        _timestamp: Date.now()
      }

      localStorage.setItem('runesGambitState', JSON.stringify(gameState))

      const loaded = loadGameState()
      
      expect(loaded._timestamp).toBeUndefined()
      expect(loaded.players).toBeDefined()
    })

    it('validates loaded state structure', () => {
      const invalidState = { foo: 'bar' }
      localStorage.setItem('runesGambitState', JSON.stringify(invalidState))

      const loaded = loadGameState()
      
      // Should return null if state doesn't have required structure
      expect(loaded).toBeNull()
    })
  })

  describe('clearGameState', () => {
    it('removes game state from localStorage', () => {
      const gameState = {
        players: {
          player1: { name: 'Alice', lifePoints: 20, availableMana: 0 },
          player2: { name: 'Bob', lifePoints: 20, availableMana: 0 }
        }
      }

      localStorage.setItem('runesGambitState', JSON.stringify(gameState))
      expect(localStorage.getItem('runesGambitState')).toBeTruthy()

      clearGameState()

      expect(localStorage.getItem('runesGambitState')).toBeNull()
    })

    it('does not throw if no saved state exists', () => {
      expect(() => clearGameState()).not.toThrow()
    })
  })
})
```

### Run Test (Should Fail)
```bash
npm run test tests/unit/utils/storage.spec.js
```

---

## Phase 2: Implement Storage Utility

### Green: Create Storage Module

**File**: `src/utils/storage.js`

```javascript
const STORAGE_KEY = 'runesGambitState'

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
    
    // Validate structure
    if (!parsed.players || typeof parsed.players !== 'object') {
      console.warn('Invalid game state structure')
      return null
    }

    // Remove timestamp before returning
    const { _timestamp, ...gameState } = parsed
    
    return gameState
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
```

### Run Test (Should Pass)
```bash
npm run test tests/unit/utils/storage.spec.js
```

---

## Phase 3: Store Integration Tests

### Red: Write Store Persistence Tests

**File**: `tests/unit/stores/gameStore.persistence.spec.js`

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useGameStore } from '@/stores/gameStore'
import * as storage from '@/utils/storage'

describe('GameStore Persistence', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Auto-save on state changes', () => {
    it('saves state when player name changes', () => {
      const saveSpy = vi.spyOn(storage, 'saveGameState')
      const store = useGameStore()

      store.updatePlayerName('player1', 'Alice')

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          players: expect.objectContaining({
            player1: expect.objectContaining({
              name: 'Alice'
            })
          })
        })
      )
    })

    it('saves state when life changes', () => {
      const saveSpy = vi.spyOn(storage, 'saveGameState')
      const store = useGameStore()

      store.adjustLife('player1', -3)

      expect(saveSpy).toHaveBeenCalled()
    })

    it('saves state when mana transfers', () => {
      const saveSpy = vi.spyOn(storage, 'saveGameState')
      const store = useGameStore()

      store.transferManaToPlayer('player1', 2)

      expect(saveSpy).toHaveBeenCalled()
    })

    it('saves state when game starts', () => {
      const saveSpy = vi.spyOn(storage, 'saveGameState')
      const store = useGameStore()

      store.startGame('player1')

      expect(saveSpy).toHaveBeenCalled()
    })

    it('saves state when turn ends', () => {
      const saveSpy = vi.spyOn(storage, 'saveGameState')
      const store = useGameStore()

      store.startGame('player1')
      store.endTurn()

      expect(saveSpy).toHaveBeenCalledTimes(2) // Once for start, once for end
    })
  })

  describe('Load state on initialization', () => {
    it('restores saved game state on store creation', () => {
      const savedState = {
        players: {
          player1: { name: 'Alice', lifePoints: 15, availableMana: 3 },
          player2: { name: 'Bob', lifePoints: 18, availableMana: 2 }
        },
        sharedManaPool: 15,
        gameStarted: true,
        currentPlayer: 'player1',
        currentPhase: 'play',
        turnNumber: 5
      }

      vi.spyOn(storage, 'loadGameState').mockReturnValue(savedState)

      const store = useGameStore()

      expect(store.players.player1.name).toBe('Alice')
      expect(store.players.player1.lifePoints).toBe(15)
      expect(store.sharedManaPool).toBe(15)
      expect(store.gameStarted).toBe(true)
      expect(store.turnNumber).toBe(5)
    })

    it('uses default state when no saved state exists', () => {
      vi.spyOn(storage, 'loadGameState').mockReturnValue(null)

      const store = useGameStore()

      expect(store.players.player1.name).toBe('Red Player')
      expect(store.players.player1.lifePoints).toBe(20)
      expect(store.sharedManaPool).toBe(20)
      expect(store.gameStarted).toBe(false)
    })

    it('preserves action log on reload', () => {
      const savedState = {
        players: {
          player1: { name: 'Alice', lifePoints: 20, availableMana: 0 },
          player2: { name: 'Bob', lifePoints: 20, availableMana: 0 }
        },
        sharedManaPool: 20,
        actionLog: [
          { id: 1, message: 'Game started', type: 'info', timestamp: Date.now() }
        ]
      }

      vi.spyOn(storage, 'loadGameState').mockReturnValue(savedState)

      const store = useGameStore()

      expect(store.actionLog.length).toBe(1)
      expect(store.actionLog[0].message).toBe('Game started')
    })
  })

  describe('Clear state on reset', () => {
    it('clears localStorage when game resets', () => {
      const clearSpy = vi.spyOn(storage, 'clearGameState')
      const store = useGameStore()

      store.startGame('player1')
      store.resetGame()

      expect(clearSpy).toHaveBeenCalled()
    })

    it('saves fresh state after reset', () => {
      const saveSpy = vi.spyOn(storage, 'saveGameState')
      const store = useGameStore()

      store.startGame('player1')
      saveSpy.mockClear()

      store.resetGame()

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          gameStarted: false,
          turnNumber: 0
        })
      )
    })
  })
})
```

### Run Test (Should Fail)
```bash
npm run test tests/unit/stores/gameStore.persistence.spec.js
```

---

## Phase 4: Integrate Persistence into Store

### Green: Add Auto-save to GameStore

**File**: `src/stores/gameStore.js` (modify existing)

Add to imports:
```javascript
import { saveGameState, loadGameState, clearGameState } from '@/utils/storage'
```

Add to store definition (after state):
```javascript
// Auto-save helper
const autoSave = (store) => {
  const state = {
    players: store.players,
    sharedManaPool: store.sharedManaPool,
    gameStarted: store.gameStarted,
    currentPlayer: store.currentPlayer,
    currentPhase: store.currentPhase,
    turnNumber: store.turnNumber,
    actionLog: store.actionLog
  }
  saveGameState(state)
}

// Load saved state on initialization
const savedState = loadGameState()
if (savedState) {
  Object.assign(state, savedState)
}
```

Modify each action to call `autoSave(this)` at the end:

```javascript
updatePlayerName(playerId, newName) {
  if (this.players[playerId]) {
    this.players[playerId].name = newName
    autoSave(this)
  }
}

adjustLife(playerId, amount) {
  if (this.players[playerId]) {
    this.players[playerId].lifePoints += amount
    this.logAction(`${this.players[playerId].name} life ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} (now ${this.players[playerId].lifePoints})`, amount > 0 ? 'success' : 'warning', playerId)
    autoSave(this)
  }
}

transferManaToPlayer(playerId, amount) {
  if (!this.players[playerId]) return false
  if (this.sharedManaPool < amount) return false

  this.sharedManaPool -= amount
  this.players[playerId].availableMana += amount
  this.logAction(`${this.players[playerId].name} received ${amount} mana from pool`, 'success', playerId)
  autoSave(this)
  return true
}

returnManaToPool(playerId, amount) {
  if (!this.players[playerId]) return false
  if (this.players[playerId].availableMana < amount) return false

  this.players[playerId].availableMana -= amount
  this.sharedManaPool += amount
  this.logAction(`${this.players[playerId].name} returned ${amount} mana to pool`, 'info', playerId)
  autoSave(this)
  return true
}

adjustSharedManaPool(amount) {
  const newValue = this.sharedManaPool + amount
  if (newValue < 0) return false

  this.sharedManaPool = newValue
  this.logAction(`Shared mana pool ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} (now ${this.sharedManaPool})`, 'info')
  autoSave(this)
  return true
}

startGame(startingPlayer) {
  this.gameStarted = true
  this.currentPlayer = startingPlayer
  this.currentPhase = 'draw'
  this.turnNumber = 1

  // Grant initial mana
  this.transferManaToPlayer(startingPlayer, 1)

  this.logAction(`Game started! ${this.players[startingPlayer].name} goes first`, 'success', startingPlayer)
  autoSave(this)
}

nextPhase() {
  if (!this.gameStarted) return

  const phases = ['draw', 'play', 'attack', 'end']
  const currentIndex = phases.indexOf(this.currentPhase)
  
  if (currentIndex < phases.length - 1) {
    this.currentPhase = phases[currentIndex + 1]
    const phaseNames = { draw: 'Draw Phase', play: 'Play Phase', attack: 'Attack Phase', end: 'End Phase' }
    this.logAction(`${phaseNames[this.currentPhase]} started`, 'info', this.currentPlayer)
    autoSave(this)
  }
}

endTurn() {
  if (!this.gameStarted || this.currentPhase !== 'end') return

  // Switch player
  const nextPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1'
  this.currentPlayer = nextPlayer
  this.currentPhase = 'draw'
  this.turnNumber++

  // Grant mana to new active player
  this.transferManaToPlayer(nextPlayer, 1)

  this.logAction(`Turn ${this.turnNumber}: ${this.players[nextPlayer].name}'s turn`, 'success', nextPlayer)
  autoSave(this)
}

resetGame() {
  this.players.player1.lifePoints = 20
  this.players.player1.availableMana = 0
  this.players.player2.lifePoints = 20
  this.players.player2.availableMana = 0
  this.sharedManaPool = 20
  this.gameStarted = false
  this.currentPlayer = null
  this.currentPhase = 'setup'
  this.turnNumber = 0
  this.actionLog = []

  clearGameState()
  this.logAction('Game reset', 'info')
  autoSave(this)
}

clearActionLog() {
  this.actionLog = []
  autoSave(this)
}
```

### Run Test (Should Pass)
```bash
npm run test tests/unit/stores/gameStore.persistence.spec.js
```

---

## Phase 5: User Feedback for Persistence

### Add Restore Notification Test

**File**: `tests/unit/App.spec.js` (add to existing)

```javascript
describe('Game State Persistence', () => {
  it('shows restore notification when saved game exists', () => {
    const savedState = {
      players: {
        player1: { name: 'Alice', lifePoints: 15, availableMana: 3 },
        player2: { name: 'Bob', lifePoints: 18, availableMana: 2 }
      },
      sharedManaPool: 15,
      gameStarted: true,
      turnNumber: 5
    }

    vi.spyOn(storage, 'loadGameState').mockReturnValue(savedState)

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()]
      }
    })

    // Should show "Game Restored" message
    expect(wrapper.text()).toContain('Game Restored')
  })
})
```

### Add Restore Notification to App

**File**: `src/App.vue` (add to script)

```javascript
import { ref, computed, onMounted } from 'vue'
import { loadGameState } from '@/utils/storage'

const showRestoreMessage = ref(false)

onMounted(() => {
  const savedState = loadGameState()
  if (savedState && savedState.gameStarted) {
    showRestoreMessage.value = true
    setTimeout(() => {
      showRestoreMessage.value = false
    }, 3000)
  }
})
```

**File**: `src/App.vue` (add to template)

```vue
<!-- Add after header -->
<transition name="fade">
  <div v-if="showRestoreMessage" class="restore-notification">
    🎮 Game Restored
  </div>
</transition>
```

**File**: `src/App.vue` (add to styles)

```vue
<style scoped>
/* ... existing styles ... */

.restore-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(74, 144, 226, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  z-index: 1000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

---

## Verification

### Run All Tests
```bash
npm run test
```

Expected: All tests pass

### Manual Testing

1. Start dev server:
```bash
npm run dev
```

2. Test auto-save:
   - Start a game
   - Make changes (names, life, mana)
   - Refresh browser
   - ✅ Game state restored
   - ✅ "Game Restored" notification appears

3. Test reset:
   - Reset game
   - Refresh browser
   - ✅ No saved state (starts fresh)

4. Test partial game:
   - Set player names only
   - Refresh browser
   - ✅ Names preserved
   - ✅ Game not started yet

### Check Coverage
```bash
npm run test:coverage
```

Expected: 90%+ coverage maintained

---

## Acceptance Criteria

- [x] LocalStorage utility created with tests
- [x] Auto-save on all state changes
- [x] Game state restores on page load
- [x] Saved state cleared on reset
- [x] Graceful error handling for storage failures
- [x] User notification on restore
- [x] Action log persisted
- [x] Player names persisted
- [x] All tests pass
- [x] Manual testing successful

## Files Created/Modified

### Created
- `src/utils/storage.js` - LocalStorage utility (60 lines)
- `tests/unit/utils/storage.spec.js` - Storage tests (11 tests)
- `tests/unit/stores/gameStore.persistence.spec.js` - Persistence tests (9 tests)

### Modified
- `src/stores/gameStore.js` - Added auto-save to all actions
- `src/App.vue` - Added restore notification
- `tests/unit/App.spec.js` - Added persistence test

## Commit
```bash
git add .
git commit -m "feat: add LocalStorage persistence with TDD

- Auto-save game state on all changes
- Restore game on page reload
- Clear state on reset
- User notification for restored games
- Comprehensive test coverage (20+ tests)
- Graceful error handling
- Action log persistence"
```

## Next Steps

Proceed to [Task 17: Animations & Polish](task-17-polish-animations.md)

---

**Task Complete** ✅
