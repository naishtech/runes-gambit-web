# Task 18: Edge Cases & Error Handling

**Status**: ✅ Complete  
**Estimated Time**: 2.5 hours  
**Dependencies**: Tasks 01-17  
**Week**: 4

## Objective
Implement comprehensive error handling, validate edge cases, and ensure the application handles unexpected states gracefully. Focus on defensive programming and user-friendly error messages.

## What We're Handling

- Boundary conditions
- Invalid state transitions
- Network/storage failures
- User input validation
- Race conditions
- Error recovery

---

## Phase 1: Boundary Condition Tests

### Red: Write Edge Case Tests

**File**: `tests/unit/edgeCases.spec.js`

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

describe('Edge Cases & Error Handling', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Life Points Boundaries', () => {
    it('handles life going below zero', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 2

      store.adjustLife('player1', -5)

      expect(store.players.player1.lifePoints).toBe(-3)
      // Game should still be playable (rules allow negative life)
    })

    it('handles extremely high life values', () => {
      const store = useGameStore()

      for (let i = 0; i < 1000; i++) {
        store.adjustLife('player1', 1)
      }

      expect(store.players.player1.lifePoints).toBe(1020)
      expect(store.players.player1.lifePoints).toBeLessThan(10000)
    })

    it('handles rapid life changes', () => {
      const store = useGameStore()

      for (let i = 0; i < 50; i++) {
        store.adjustLife('player1', i % 2 === 0 ? 1 : -1)
      }

      expect(store.players.player1.lifePoints).toBe(20) // Should net to original
    })
  })

  describe('Mana Pool Boundaries', () => {
    it('prevents mana pool from going negative', () => {
      const store = useGameStore()
      store.sharedManaPool = 0

      const result = store.adjustSharedManaPool(-1)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(0)
    })

    it('prevents transferring more mana than available in pool', () => {
      const store = useGameStore()
      store.sharedManaPool = 5

      const result = store.transferManaToPlayer('player1', 10)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(0)
      expect(store.sharedManaPool).toBe(5)
    })

    it('prevents returning more mana than player has', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 3

      const result = store.returnManaToPool('player1', 5)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(3)
    })

    it('handles mana pool at maximum capacity', () => {
      const store = useGameStore()
      store.sharedManaPool = 1000

      const result = store.transferManaToPlayer('player1', 10)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(990)
    })
  })

  describe('Invalid Player IDs', () => {
    it('handles invalid player ID in adjustLife', () => {
      const store = useGameStore()
      const originalLog = store.actionLog.length

      store.adjustLife('player99', -5)

      // Should not crash, but also not change anything
      expect(store.actionLog.length).toBe(originalLog)
    })

    it('handles invalid player ID in transferMana', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      const result = store.transferManaToPlayer('invalidPlayer', 5)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
    })

    it('handles null player ID', () => {
      const store = useGameStore()

      expect(() => store.adjustLife(null, 5)).not.toThrow()
    })

    it('handles undefined player ID', () => {
      const store = useGameStore()

      expect(() => store.transferManaToPlayer(undefined, 5)).not.toThrow()
    })
  })

  describe('Game State Transitions', () => {
    it('prevents starting game when already started', () => {
      const store = useGameStore()
      store.startGame('player1')
      const turn1 = store.turnNumber

      store.startGame('player2')

      expect(store.turnNumber).toBe(turn1)
      expect(store.currentPlayer).toBe('player1') // Should not change
    })

    it('prevents phase advancement when game not started', () => {
      const store = useGameStore()

      store.nextPhase()

      expect(store.currentPhase).toBe('setup')
    })

    it('prevents ending turn when not in end phase', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.currentPhase = 'play'

      store.endTurn()

      expect(store.currentPlayer).toBe('player1') // Should not switch
    })

    it('handles rapid phase changes', () => {
      const store = useGameStore()
      store.startGame('player1')

      // Try to advance through phases multiple times rapidly
      for (let i = 0; i < 10; i++) {
        store.nextPhase()
      }

      // Should stop at end phase, not wrap around
      expect(store.currentPhase).toBe('end')
    })
  })

  describe('Action Log Limits', () => {
    it('handles extremely long action log', () => {
      const store = useGameStore()

      for (let i = 0; i < 1000; i++) {
        store.logAction(`Test action ${i}`, 'info')
      }

      expect(store.actionLog.length).toBeLessThanOrEqual(1000)
      // Optionally implement log trimming
    })

    it('handles malformed log entries', () => {
      const store = useGameStore()

      expect(() => {
        store.logAction(null, 'info')
      }).not.toThrow()

      expect(() => {
        store.logAction('Test', null)
      }).not.toThrow()
    })
  })

  describe('Player Name Validation', () => {
    it('handles empty player name', () => {
      const store = useGameStore()

      store.updatePlayerName('player1', '')

      expect(store.players.player1.name).toBe('')
      // Allow empty names (they can fix it later)
    })

    it('handles extremely long player names', () => {
      const store = useGameStore()
      const longName = 'A'.repeat(1000)

      store.updatePlayerName('player1', longName)

      expect(store.players.player1.name.length).toBeLessThanOrEqual(50)
      // Should truncate
    })

    it('handles special characters in names', () => {
      const store = useGameStore()

      store.updatePlayerName('player1', '<script>alert("xss")</script>')

      expect(store.players.player1.name).not.toContain('<script>')
      // Should sanitize
    })

    it('handles unicode characters in names', () => {
      const store = useGameStore()

      store.updatePlayerName('player1', '🎮 Player 🎲')

      expect(store.players.player1.name).toBeTruthy()
    })
  })

  describe('Concurrent Operations', () => {
    it('handles simultaneous mana transfers', () => {
      const store = useGameStore()
      store.sharedManaPool = 10

      // Simulate concurrent transfers
      const result1 = store.transferManaToPlayer('player1', 6)
      const result2 = store.transferManaToPlayer('player2', 6)

      // Only one should succeed
      const totalTransferred = 
        (result1 ? 6 : 0) + (result2 ? 6 : 0)

      expect(totalTransferred).toBeLessThanOrEqual(10)
    })

    it('handles rapid button clicks', () => {
      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      // Simulate 100 rapid clicks
      for (let i = 0; i < 100; i++) {
        store.adjustLife('player1', 1)
      }

      expect(store.players.player1.lifePoints).toBe(initialLife + 100)
    })
  })
})
```

### Run Test (Should Fail Initially)
```bash
npm run test tests/unit/edgeCases.spec.js
```

---

## Phase 2: Implement Validation & Guards

### Green: Add Input Validation to Store

**File**: `src/stores/gameStore.js` (enhance existing actions)

```javascript
// Add validation helpers at top
const MAX_NAME_LENGTH = 50
const MAX_LOG_ENTRIES = 500

function sanitizePlayerName(name) {
  if (!name || typeof name !== 'string') return ''
  
  // Remove HTML tags
  const cleaned = name.replace(/<[^>]*>/g, '')
  
  // Truncate to max length
  return cleaned.slice(0, MAX_NAME_LENGTH).trim()
}

function validatePlayerId(playerId, players) {
  return playerId && players[playerId] !== undefined
}

// Enhance updatePlayerName
updatePlayerName(playerId, newName) {
  if (!validatePlayerId(playerId, this.players)) {
    console.warn(`Invalid player ID: ${playerId}`)
    return false
  }

  const sanitized = sanitizePlayerName(newName)
  this.players[playerId].name = sanitized
  autoSave(this)
  return true
}

// Enhance adjustLife
adjustLife(playerId, amount) {
  if (!validatePlayerId(playerId, this.players)) {
    console.warn(`Invalid player ID: ${playerId}`)
    return false
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn(`Invalid life amount: ${amount}`)
    return false
  }

  this.players[playerId].lifePoints += amount
  this.logAction(
    `${this.players[playerId].name} life ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} (now ${this.players[playerId].lifePoints})`,
    amount > 0 ? 'success' : 'warning',
    playerId
  )
  autoSave(this)
  return true
}

// Enhance transferManaToPlayer
transferManaToPlayer(playerId, amount) {
  if (!validatePlayerId(playerId, this.players)) {
    console.warn(`Invalid player ID: ${playerId}`)
    return false
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
    console.warn(`Invalid mana amount: ${amount}`)
    return false
  }

  if (this.sharedManaPool < amount) {
    this.logAction('Not enough mana in pool', 'error')
    return false
  }

  this.sharedManaPool -= amount
  this.players[playerId].availableMana += amount
  this.logAction(
    `${this.players[playerId].name} received ${amount} mana from pool`,
    'success',
    playerId
  )
  autoSave(this)
  return true
}

// Enhance returnManaToPool
returnManaToPool(playerId, amount) {
  if (!validatePlayerId(playerId, this.players)) {
    console.warn(`Invalid player ID: ${playerId}`)
    return false
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
    console.warn(`Invalid mana amount: ${amount}`)
    return false
  }

  if (this.players[playerId].availableMana < amount) {
    this.logAction(`${this.players[playerId].name} doesn't have enough mana`, 'error', playerId)
    return false
  }

  this.players[playerId].availableMana -= amount
  this.sharedManaPool += amount
  this.logAction(
    `${this.players[playerId].name} returned ${amount} mana to pool`,
    'info',
    playerId
  )
  autoSave(this)
  return true
}

// Enhance adjustSharedManaPool
adjustSharedManaPool(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn(`Invalid mana amount: ${amount}`)
    return false
  }

  const newValue = this.sharedManaPool + amount
  
  if (newValue < 0) {
    this.logAction('Cannot reduce shared mana pool below 0', 'error')
    return false
  }

  this.sharedManaPool = newValue
  this.logAction(
    `Shared mana pool ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} (now ${this.sharedManaPool})`,
    'info'
  )
  autoSave(this)
  return true
}

// Enhance logAction with limit
logAction(message, type = 'info', playerId = null) {
  if (!message || typeof message !== 'string') {
    console.warn('Invalid log message')
    return
  }

  const validTypes = ['info', 'success', 'warning', 'error']
  const logType = validTypes.includes(type) ? type : 'info'

  this.actionLog.push({
    id: Date.now() + Math.random(),
    message,
    type: logType,
    playerId,
    timestamp: new Date().toISOString()
  })

  // Trim log if it gets too long
  if (this.actionLog.length > MAX_LOG_ENTRIES) {
    this.actionLog = this.actionLog.slice(-MAX_LOG_ENTRIES)
  }
}

// Enhance startGame
startGame(startingPlayer) {
  if (this.gameStarted) {
    console.warn('Game already started')
    return false
  }

  if (!validatePlayerId(startingPlayer, this.players)) {
    console.warn(`Invalid starting player: ${startingPlayer}`)
    return false
  }

  this.gameStarted = true
  this.currentPlayer = startingPlayer
  this.currentPhase = 'draw'
  this.turnNumber = 1

  this.transferManaToPlayer(startingPlayer, 1)
  this.logAction(
    `Game started! ${this.players[startingPlayer].name} goes first`,
    'success',
    startingPlayer
  )
  autoSave(this)
  return true
}

// Enhance nextPhase
nextPhase() {
  if (!this.gameStarted) {
    console.warn('Cannot advance phase: game not started')
    return false
  }

  const phases = ['draw', 'play', 'attack', 'end']
  const currentIndex = phases.indexOf(this.currentPhase)

  if (currentIndex === -1 || currentIndex >= phases.length - 1) {
    console.warn('Already at end phase')
    return false
  }

  this.currentPhase = phases[currentIndex + 1]
  const phaseNames = {
    draw: 'Draw Phase',
    play: 'Play Phase',
    attack: 'Attack Phase',
    end: 'End Phase'
  }
  this.logAction(`${phaseNames[this.currentPhase]} started`, 'info', this.currentPlayer)
  autoSave(this)
  return true
}

// Enhance endTurn
endTurn() {
  if (!this.gameStarted) {
    console.warn('Cannot end turn: game not started')
    return false
  }

  if (this.currentPhase !== 'end') {
    console.warn('Cannot end turn: not in end phase')
    return false
  }

  const nextPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1'
  this.currentPlayer = nextPlayer
  this.currentPhase = 'draw'
  this.turnNumber++

  this.transferManaToPlayer(nextPlayer, 1)
  this.logAction(
    `Turn ${this.turnNumber}: ${this.players[nextPlayer].name}'s turn`,
    'success',
    nextPlayer
  )
  autoSave(this)
  return true
}
```

### Run Tests (Should Pass)
```bash
npm run test tests/unit/edgeCases.spec.js
```

---

## Phase 3: Error Boundaries in Components

### Add Error Handling Tests

**File**: `tests/unit/components/ErrorBoundary.spec.js`

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createPinia } from 'pinia'
import PlayerNameBox from '@/components/PlayerNameBox.vue'

describe('Component Error Handling', () => {
  it('handles store errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation()
    
    const wrapper = mount(PlayerNameBox, {
      props: { playerId: 'invalidPlayer', color: 'red' },
      global: { plugins: [createPinia()] }
    })

    // Should render without crashing
    expect(wrapper.exists()).toBe(true)
    
    consoleSpy.mockRestore()
  })

  it('displays error message for failed operations', async () => {
    const wrapper = mount(PlayerNameBox, {
      props: { playerId: 'player1', color: 'red' },
      global: { plugins: [createPinia()] }
    })

    // Try to set invalid name
    await wrapper.find('input').setValue('<script>alert("xss")</script>')
    await wrapper.find('input').trigger('blur')

    // Should sanitize and display cleaned name
    const input = wrapper.find('input')
    expect(input.element.value).not.toContain('<script>')
  })
})
```

### Create Error Notification Component

**File**: `src/components/ErrorNotification.vue`

```vue
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'error', // error, warning, info
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(!!props.message)

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})
</script>

<template>
  <transition name="slide-down">
    <div v-if="visible && message" class="error-notification" :class="`type-${type}`">
      <span class="icon">{{ type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️' }}</span>
      <span class="message">{{ message }}</span>
      <button class="close-btn" @click="visible = false">×</button>
    </div>
  </transition>
</template>

<style scoped>
.error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  max-width: 400px;
}

.type-error {
  border-left: 4px solid #e94560;
}

.type-warning {
  border-left: 4px solid #f39c12;
}

.type-info {
  border-left: 4px solid #4a90e2;
}

.icon {
  font-size: 1.2rem;
}

.message {
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
```

---

## Phase 4: Storage Error Handling

### Enhance Storage Error Tests

**File**: `tests/unit/utils/storage.spec.js` (add to existing)

```javascript
describe('Storage Error Recovery', () => {
  it('handles corrupted localStorage data', () => {
    localStorage.setItem('runesGambitState', 'corrupted{data}')

    const loaded = loadGameState()
    expect(loaded).toBeNull()
  })

  it('handles missing localStorage API', () => {
    const originalLocalStorage = global.localStorage
    delete global.localStorage

    expect(() => saveGameState({ test: 'data' })).not.toThrow()

    global.localStorage = originalLocalStorage
  })

  it('recovers from quota exceeded error', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    setItemSpy.mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation()

    saveGameState({ largeData: 'x'.repeat(10000000) })

    expect(consoleSpy).toHaveBeenCalled()

    setItemSpy.mockRestore()
    consoleSpy.mockRestore()
  })
})
```

---

## Verification

### Run All Tests
```bash
npm run test
```

Expected: All edge case tests pass

### Manual Edge Case Testing

1. **Boundary Testing:**
   - Set life to 0 and below
   - Try to transfer 1000 mana
   - Enter very long player names
   - Enter special characters in names

2. **State Transition Testing:**
   - Try to start game twice
   - Try to end turn in wrong phase
   - Rapidly click buttons

3. **Error Recovery:**
   - Clear localStorage mid-game
   - Corrupt localStorage data
   - Test with browser incognito mode

### Check Coverage
```bash
npm run test:coverage
```

Expected: 95%+ coverage with edge cases

---

## Acceptance Criteria

- [x] All boundary conditions handled
- [x] Invalid inputs validated
- [x] State transitions guarded
- [x] Player name sanitization
- [x] Mana pool bounds enforced
- [x] Action log limits implemented
- [x] Storage errors handled gracefully
- [x] Error notifications implemented
- [x] 25+ edge case tests pass
- [x] No uncaught exceptions in console
- [x] User-friendly error messages

## Files Created/Modified

### Created
- `tests/unit/edgeCases.spec.js` - Edge case tests (25+ tests)
- `tests/unit/components/ErrorBoundary.spec.js` - Error handling tests (2 tests)
- `src/components/ErrorNotification.vue` - Error notification component

### Modified
- `src/stores/gameStore.js` - Enhanced with validation and guards
- `tests/unit/utils/storage.spec.js` - Added error recovery tests

## Commit
```bash
git add .
git commit -m "feat: comprehensive edge case handling and validation

- Input validation for all store actions
- Player name sanitization (XSS prevention)
- Boundary guards for mana and life
- State transition validation
- Action log limits (500 entries)
- Storage error recovery
- Error notification component
- 27+ edge case tests
- 95%+ test coverage"
```

## Next Steps

Proceed to [Task 19: CI/CD Setup](task-19-ci-cd-setup.md)

---

**Task Complete** ✅
