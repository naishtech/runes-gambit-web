# Task 03: Game Store Foundation (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 2 hours  
**Dependencies**: Task 01  
**Week**: 1

## Objective
Create the Pinia game store with initial state, getters, and basic actions using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Store Setup

#### RED: Write Initial State Tests
**File**: `tests/unit/stores/gameStore.spec.js`
```javascript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const store = useGameStore()
      expect(store.gameStarted).toBe(false)
      expect(store.currentPlayer).toBeNull()
      expect(store.currentPhase).toBe('setup')
      expect(store.turnNumber).toBe(0)
    })

    it('should initialize with 20 mana in shared pool', () => {
      const store = useGameStore()
      expect(store.sharedManaPool).toBe(20)
    })

    it('should initialize player1 with correct defaults', () => {
      const store = useGameStore()
      expect(store.players.player1).toEqual({
        name: 'Red Player',
        color: 'red',
        lifePoints: 20,
        availableMana: 0
      })
    })

    it('should initialize player2 with correct defaults', () => {
      const store = useGameStore()
      expect(store.players.player2).toEqual({
        name: 'Blue Player',
        color: 'blue',
        lifePoints: 20,
        availableMana: 0
      })
    })

    it('should initialize with null firstPlayer', () => {
      const store = useGameStore()
      expect(store.firstPlayer).toBeNull()
    })

    it('should initialize with empty action log', () => {
      const store = useGameStore()
      expect(store.actionLog).toEqual([])
    })

    it('should initialize with null lastDiceRoll', () => {
      const store = useGameStore()
      expect(store.lastDiceRoll).toBeNull()
    })
  })
})
```

**Run tests**: `npm run test gameStore.spec.js`  
**Expected**: All tests FAIL (store doesn't exist)

#### GREEN: Create Store with Initial State
**File**: `src/stores/gameStore.js`
```javascript
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Game metadata
    gameStarted: false,
    
    // Players
    players: {
      player1: {
        name: 'Red Player',
        color: 'red',
        lifePoints: 20,
        availableMana: 0
      },
      player2: {
        name: 'Blue Player',
        color: 'blue',
        lifePoints: 20,
        availableMana: 0
      }
    },
    
    // Shared resources
    sharedManaPool: 20,
    
    // Turn management
    firstPlayer: null,
    currentPlayer: null,
    currentPhase: 'setup',
    turnNumber: 0,
    
    // Dice
    lastDiceRoll: null,
    
    // Logging
    actionLog: []
  })
})
```

**Setup Pinia in App**: `src/main.js`
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

**Run tests**: All tests PASS

**Commit**:
```bash
git add .
git commit -m "test: add game store initial state tests"
git commit -m "feat: create game store with initial state"
```

---

### Phase 2: Store Getters

#### RED: Write Getter Tests
**Add to**: `tests/unit/stores/gameStore.spec.js`
```javascript
describe('Getters', () => {
  it('currentPlayerState returns current player object', () => {
    const store = useGameStore()
    store.currentPlayer = 'player1'
    
    expect(store.currentPlayerState).toEqual(store.players.player1)
  })

  it('currentPlayerState returns null when no current player', () => {
    const store = useGameStore()
    expect(store.currentPlayerState).toBeNull()
  })

  it('opponentPlayer returns the other player', () => {
    const store = useGameStore()
    store.currentPlayer = 'player1'
    
    expect(store.opponentPlayer).toBe('player2')
  })

  it('opponentPlayer returns player1 when player2 is current', () => {
    const store = useGameStore()
    store.currentPlayer = 'player2'
    
    expect(store.opponentPlayer).toBe('player1')
  })

  it('isGameActive returns true when game started', () => {
    const store = useGameStore()
    store.gameStarted = true
    
    expect(store.isGameActive).toBe(true)
  })

  it('isGameActive returns false when game not started', () => {
    const store = useGameStore()
    expect(store.isGameActive).toBe(false)
  })
})
```

**Run tests**: Tests FAIL (getters don't exist)

#### GREEN: Implement Getters
**Update**: `src/stores/gameStore.js`
```javascript
export const useGameStore = defineStore('game', {
  state: () => ({
    // ... existing state
  }),

  getters: {
    currentPlayerState: (state) => {
      return state.currentPlayer ? state.players[state.currentPlayer] : null
    },

    opponentPlayer: (state) => {
      if (state.currentPlayer === 'player1') return 'player2'
      if (state.currentPlayer === 'player2') return 'player1'
      return null
    },

    isGameActive: (state) => state.gameStarted
  }
})
```

**Run tests**: All tests PASS

**Commit**:
```bash
git add .
git commit -m "test: add store getter tests"
git commit -m "feat: implement store getters"
```

---

### Phase 3: Player Name Actions

#### RED: Write Action Tests
**Add to**: `tests/unit/stores/gameStore.spec.js`
```javascript
describe('Actions - Player Names', () => {
  it('setPlayerName updates player1 name', () => {
    const store = useGameStore()
    store.setPlayerName('player1', 'Alice')
    
    expect(store.players.player1.name).toBe('Alice')
  })

  it('setPlayerName updates player2 name', () => {
    const store = useGameStore()
    store.setPlayerName('player2', 'Bob')
    
    expect(store.players.player2.name).toBe('Bob')
  })

  it('setPlayerName adds to action log', () => {
    const store = useGameStore()
    store.setPlayerName('player1', 'Alice')
    
    expect(store.actionLog.length).toBeGreaterThan(0)
    expect(store.actionLog[0].message).toContain('Alice')
  })
})
```

**Run tests**: Tests FAIL

#### GREEN: Implement Actions
**Update**: `src/stores/gameStore.js`
```javascript
export const useGameStore = defineStore('game', {
  state: () => ({
    // ... existing state
  }),

  getters: {
    // ... existing getters
  },

  actions: {
    setPlayerName(playerId, name) {
      this.players[playerId].name = name
      this.addLogEntry('info', `${name} joined as ${playerId}`, playerId)
    },

    addLogEntry(type, message, playerId = null) {
      this.actionLog.push({
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        type,
        message,
        playerId
      })
    }
  }
})
```

**Run tests**: All tests PASS

**Commit**:
```bash
git add .
git commit -m "test: add player name action tests"
git commit -m "feat: implement setPlayerName action"
```

---

### Phase 4: Reset Action

#### RED: Write Reset Tests
**Add to**: `tests/unit/stores/gameStore.spec.js`
```javascript
describe('Actions - Reset', () => {
  it('resetGame clears all state to defaults', () => {
    const store = useGameStore()
    
    // Modify state
    store.gameStarted = true
    store.currentPlayer = 'player1'
    store.players.player1.lifePoints = 10
    store.sharedManaPool = 5
    
    // Reset
    store.resetGame()
    
    // Check defaults restored
    expect(store.gameStarted).toBe(false)
    expect(store.currentPlayer).toBeNull()
    expect(store.players.player1.lifePoints).toBe(20)
    expect(store.sharedManaPool).toBe(20)
  })

  it('resetGame clears action log', () => {
    const store = useGameStore()
    store.addLogEntry('info', 'Test')
    
    store.resetGame()
    
    expect(store.actionLog).toEqual([])
  })

  it('resetGame preserves player names', () => {
    const store = useGameStore()
    store.setPlayerName('player1', 'Alice')
    store.setPlayerName('player2', 'Bob')
    
    store.resetGame()
    
    expect(store.players.player1.name).toBe('Alice')
    expect(store.players.player2.name).toBe('Bob')
  })
})
```

**Run tests**: Tests FAIL

#### GREEN: Implement Reset
**Update**: `src/stores/gameStore.js`
```javascript
actions: {
  // ... existing actions

  resetGame() {
    // Preserve names
    const player1Name = this.players.player1.name
    const player2Name = this.players.player2.name
    
    // Reset to initial state
    this.gameStarted = false
    this.currentPlayer = null
    this.firstPlayer = null
    this.currentPhase = 'setup'
    this.turnNumber = 0
    this.lastDiceRoll = null
    this.sharedManaPool = 20
    this.actionLog = []
    
    // Reset players but keep names
    this.players.player1 = {
      name: player1Name,
      color: 'red',
      lifePoints: 20,
      availableMana: 0
    }
    
    this.players.player2 = {
      name: player2Name,
      color: 'blue',
      lifePoints: 20,
      availableMana: 0
    }
    
    this.addLogEntry('info', 'Game reset')
  }
}
```

**Run tests**: All tests PASS

**Commit**:
```bash
git add .
git commit -m "test: add reset game tests"
git commit -m "feat: implement resetGame action"
```

---

## Acceptance Criteria
- [ ] All tests pass: `npm run test gameStore.spec.js`
- [ ] Test coverage > 90% on gameStore.js
- [ ] Store initializes with correct defaults
- [ ] All getters work correctly
- [ ] Player names can be set
- [ ] Action log tracks changes
- [ ] Reset preserves player names
- [ ] Code follows TDD: Red-Green-Refactor

## Verification
```bash
npm run test gameStore.spec.js
npm run test:coverage -- gameStore.spec.js
```

## Next Task
→ [Task 04: PlayerNameBox Component (TDD)](task-04-player-name-box.md)

## Reference
- [Design Document](design-document.md) - Section 4.1.1, 5.1, 11.2.1
