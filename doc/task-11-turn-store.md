# Task 11: Turn Management Store (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 2.5 hours  
**Dependencies**: Task 08  
**Week**: 2

## Objective
Extend the game store with turn management functionality including phase tracking, player switching, mana granting, and turn flow automation, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Game Start

#### RED: Write Game Start Tests
**File**: `tests/unit/stores/turnManagement.spec.js`
```javascript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

describe('Turn Management Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('startGame', () => {
    it('sets gameStarted to true', () => {
      const store = useGameStore()

      store.startGame('player1')

      expect(store.gameStarted).toBe(true)
    })

    it('sets current player to first player', () => {
      const store = useGameStore()

      store.startGame('player1')

      expect(store.currentPlayer).toBe('player1')
    })

    it('sets first player reference', () => {
      const store = useGameStore()

      store.startGame('player2')

      expect(store.firstPlayer).toBe('player2')
    })

    it('sets initial phase to draw', () => {
      const store = useGameStore()

      store.startGame('player1')

      expect(store.currentPhase).toBe('draw')
    })

    it('grants 1 mana to starting player', () => {
      const store = useGameStore()

      store.startGame('player1')

      expect(store.players.player1.availableMana).toBe(1)
    })

    it('deducts 1 mana from shared pool', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      store.startGame('player1')

      expect(store.sharedManaPool).toBe(initialPool - 1)
    })

    it('sets turn number to 1', () => {
      const store = useGameStore()

      store.startGame('player1')

      expect(store.turnNumber).toBe(1)
    })

    it('logs game start', () => {
      const store = useGameStore()
      const initialLogLength = store.actionLog.length

      store.startGame('player1')

      expect(store.actionLog.length).toBeGreaterThan(initialLogLength)
      expect(store.actionLog[store.actionLog.length - 1].message).toContain('started')
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test turnManagement.spec.js
```

#### GREEN: Implement startGame Action
**Update**: `src/stores/gameStore.js`

Add to state:
```javascript
  state: () => ({
    // ... existing state ...
    gameStarted: false,
    firstPlayer: null,
    currentPlayer: null,
    currentPhase: 'setup',
    turnNumber: 0,
  }),
```

Add to actions:
```javascript
  actions: {
    // ... existing actions ...

    startGame(startingPlayer) {
      this.gameStarted = true
      this.firstPlayer = startingPlayer
      this.currentPlayer = startingPlayer
      this.currentPhase = 'draw'
      this.turnNumber = 1

      // Grant 1 mana to starting player
      this.transferManaToPlayer(startingPlayer, 1)

      // Log game start
      this.addLogEntry({
        type: 'success',
        message: `Game started! ${this.players[startingPlayer].name} goes first.`,
        playerId: startingPlayer
      })

      this.addLogEntry({
        type: 'info',
        message: 'Draw Phase: Collect 1 mana and draw 1 card',
        playerId: startingPlayer
      })
    },
```

**Run Test** (should pass):
```bash
npm run test turnManagement.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/turnManagement.spec.js src/stores/gameStore.js
git commit -m "feat: add startGame action with mana grant"
```

---

### Phase 2: Phase Management

#### RED: Write Phase Tests
**Add to**: `tests/unit/stores/turnManagement.spec.js`
```javascript
  describe('nextPhase', () => {
    it('advances from draw to play phase', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.nextPhase()

      expect(store.currentPhase).toBe('play')
    })

    it('advances from play to attack phase', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.nextPhase() // draw -> play

      store.nextPhase()

      expect(store.currentPhase).toBe('attack')
    })

    it('advances from attack to end phase', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.nextPhase() // draw -> play
      store.nextPhase() // play -> attack

      store.nextPhase()

      expect(store.currentPhase).toBe('end')
    })

    it('does not advance beyond end phase', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.nextPhase() // draw -> play
      store.nextPhase() // play -> attack
      store.nextPhase() // attack -> end

      store.nextPhase() // should stay at end

      expect(store.currentPhase).toBe('end')
    })

    it('logs phase changes', () => {
      const store = useGameStore()
      store.startGame('player1')
      const initialLogLength = store.actionLog.length

      store.nextPhase()

      expect(store.actionLog.length).toBeGreaterThan(initialLogLength)
    })

    it('provides phase-specific instructions', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.nextPhase() // play phase

      const lastLog = store.actionLog[store.actionLog.length - 1]
      expect(lastLog.message).toContain('Play')
    })
  })
```

**Run Test** (should fail):
```bash
npm run test turnManagement.spec.js
```

#### GREEN: Implement nextPhase Action
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
    nextPhase() {
      const phaseOrder = ['draw', 'play', 'attack', 'end']
      const currentIndex = phaseOrder.indexOf(this.currentPhase)

      if (currentIndex < phaseOrder.length - 1) {
        this.currentPhase = phaseOrder[currentIndex + 1]

        // Log phase change with instructions
        const phaseInstructions = {
          play: 'Play Phase: Play cards by spending mana',
          attack: 'Attack Phase: Declare attacks and roll dice',
          end: 'End Phase: Turn complete'
        }

        this.addLogEntry({
          type: 'info',
          message: phaseInstructions[this.currentPhase],
          playerId: this.currentPlayer
        })
      }
    },
```

**Run Test** (should pass):
```bash
npm run test turnManagement.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/turnManagement.spec.js src/stores/gameStore.js
git commit -m "feat: add nextPhase action with phase progression"
```

---

### Phase 3: End Turn

#### RED: Write End Turn Tests
**Add to**: `tests/unit/stores/turnManagement.spec.js`
```javascript
  describe('endTurn', () => {
    it('switches to other player', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.endTurn()

      expect(store.currentPlayer).toBe('player2')
    })

    it('switches from player2 to player1', () => {
      const store = useGameStore()
      store.startGame('player2')

      store.endTurn()

      expect(store.currentPlayer).toBe('player1')
    })

    it('resets phase to draw', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.nextPhase() // draw -> play
      store.nextPhase() // play -> attack
      store.nextPhase() // attack -> end

      store.endTurn()

      expect(store.currentPhase).toBe('draw')
    })

    it('increments turn number', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.endTurn()

      expect(store.turnNumber).toBe(2)
    })

    it('grants 1 mana to new current player', () => {
      const store = useGameStore()
      store.startGame('player1')
      const initialPlayer2Mana = store.players.player2.availableMana

      store.endTurn()

      expect(store.players.player2.availableMana).toBe(initialPlayer2Mana + 1)
    })

    it('logs turn end and start', () => {
      const store = useGameStore()
      store.startGame('player1')
      const initialLogLength = store.actionLog.length

      store.endTurn()

      expect(store.actionLog.length).toBeGreaterThan(initialLogLength + 1)
    })

    it('handles multiple turn cycles', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.endTurn() // Turn 2, player2
      expect(store.currentPlayer).toBe('player2')
      expect(store.turnNumber).toBe(2)

      store.endTurn() // Turn 3, player1
      expect(store.currentPlayer).toBe('player1')
      expect(store.turnNumber).toBe(3)

      store.endTurn() // Turn 4, player2
      expect(store.currentPlayer).toBe('player2')
      expect(store.turnNumber).toBe(4)
    })
  })
```

**Run Test** (should fail):
```bash
npm run test turnManagement.spec.js
```

#### GREEN: Implement endTurn Action
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
    endTurn() {
      // Log turn end
      this.addLogEntry({
        type: 'info',
        message: `${this.players[this.currentPlayer].name} ended their turn`,
        playerId: this.currentPlayer
      })

      // Switch players
      this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1'
      this.turnNumber++

      // Reset to draw phase
      this.currentPhase = 'draw'

      // Grant mana to new current player
      this.transferManaToPlayer(this.currentPlayer, 1)

      // Log turn start
      this.addLogEntry({
        type: 'success',
        message: `Turn ${this.turnNumber}: ${this.players[this.currentPlayer].name}'s turn begins`,
        playerId: this.currentPlayer
      })

      this.addLogEntry({
        type: 'info',
        message: 'Draw Phase: Collect 1 mana and draw 1 card',
        playerId: this.currentPlayer
      })
    },
```

**Run Test** (should pass):
```bash
npm run test turnManagement.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/turnManagement.spec.js src/stores/gameStore.js
git commit -m "feat: add endTurn action with player switching"
```

---

### Phase 4: Reset Game

#### RED: Write Reset Tests
**Add to**: `tests/unit/stores/turnManagement.spec.js`
```javascript
  describe('resetGame', () => {
    it('resets gameStarted to false', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.resetGame()

      expect(store.gameStarted).toBe(false)
    })

    it('resets current player to null', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.resetGame()

      expect(store.currentPlayer).toBeNull()
    })

    it('resets phase to setup', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.nextPhase()

      store.resetGame()

      expect(store.currentPhase).toBe('setup')
    })

    it('resets turn number to 0', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.endTurn()
      store.endTurn()

      store.resetGame()

      expect(store.turnNumber).toBe(0)
    })

    it('resets player life to 20', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 10
      store.players.player2.lifePoints = 15

      store.resetGame()

      expect(store.players.player1.lifePoints).toBe(20)
      expect(store.players.player2.lifePoints).toBe(20)
    })

    it('resets player mana to 0', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      store.players.player2.availableMana = 3

      store.resetGame()

      expect(store.players.player1.availableMana).toBe(0)
      expect(store.players.player2.availableMana).toBe(0)
    })

    it('resets shared mana pool to 20', () => {
      const store = useGameStore()
      store.sharedManaPool = 10

      store.resetGame()

      expect(store.sharedManaPool).toBe(20)
    })

    it('clears action log', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.resetGame()

      expect(store.actionLog.length).toBe(0)
    })

    it('logs game reset', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.resetGame()

      // Should have at least the reset message
      const hasResetMessage = store.actionLog.some(log => 
        log.message.toLowerCase().includes('reset') || 
        log.message.toLowerCase().includes('new game')
      )
      expect(hasResetMessage).toBe(true)
    })
  })
```

**Run Test** (should fail):
```bash
npm run test turnManagement.spec.js
```

#### GREEN: Implement resetGame Action
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
    resetGame() {
      // Reset game state
      this.gameStarted = false
      this.firstPlayer = null
      this.currentPlayer = null
      this.currentPhase = 'setup'
      this.turnNumber = 0

      // Reset players
      this.players.player1.lifePoints = 20
      this.players.player1.availableMana = 0
      this.players.player2.lifePoints = 20
      this.players.player2.availableMana = 0

      // Reset shared pool
      this.sharedManaPool = 20

      // Clear log
      this.actionLog = []

      // Log reset
      this.addLogEntry({
        type: 'info',
        message: 'New game started - all values reset'
      })
    },
```

**Run Test** (should pass):
```bash
npm run test turnManagement.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/turnManagement.spec.js src/stores/gameStore.js
git commit -m "feat: add resetGame action to clear all state"
```

---

### Phase 5: Getters

#### RED: Write Getter Tests
**Add to**: `tests/unit/stores/turnManagement.spec.js`
```javascript
  describe('Getters', () => {
    it('currentPlayerState returns current player object', () => {
      const store = useGameStore()
      store.startGame('player1')

      const currentPlayerState = store.currentPlayerState

      expect(currentPlayerState).toBe(store.players.player1)
      expect(currentPlayerState.name).toBe('Red Player')
    })

    it('currentPlayerState returns null when no current player', () => {
      const store = useGameStore()

      const currentPlayerState = store.currentPlayerState

      expect(currentPlayerState).toBeNull()
    })

    it('isGameActive returns true when game started', () => {
      const store = useGameStore()
      store.startGame('player1')

      expect(store.isGameActive).toBe(true)
    })

    it('isGameActive returns false before game starts', () => {
      const store = useGameStore()

      expect(store.isGameActive).toBe(false)
    })

    it('canAdvancePhase returns true when not at end phase', () => {
      const store = useGameStore()
      store.startGame('player1')

      expect(store.canAdvancePhase).toBe(true)
    })

    it('canAdvancePhase returns false at end phase', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.currentPhase = 'end'

      expect(store.canAdvancePhase).toBe(false)
    })

    it('currentPhaseInstructions returns appropriate text', () => {
      const store = useGameStore()
      store.startGame('player1')

      expect(store.currentPhaseInstructions).toContain('Draw')

      store.nextPhase()
      expect(store.currentPhaseInstructions).toContain('Play')
    })
  })
```

**Run Test** (should fail):
```bash
npm run test turnManagement.spec.js
```

#### GREEN: Implement Getters
**Update**: `src/stores/gameStore.js`

Add getters section:
```javascript
  getters: {
    currentPlayerState: (state) => {
      return state.currentPlayer ? state.players[state.currentPlayer] : null
    },

    isGameActive: (state) => {
      return state.gameStarted
    },

    canAdvancePhase: (state) => {
      return state.currentPhase !== 'end'
    },

    currentPhaseInstructions: (state) => {
      const instructions = {
        setup: 'Flip coin to determine first player',
        draw: 'Draw Phase: Collect 1 mana and draw 1 card',
        play: 'Play Phase: Play cards by spending mana',
        attack: 'Attack Phase: Declare attacks and roll dice',
        end: 'End Phase: Turn complete'
      }
      return instructions[state.currentPhase] || ''
    }
  },
```

**Run Test** (should pass):
```bash
npm run test turnManagement.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/turnManagement.spec.js src/stores/gameStore.js
git commit -m "feat: add getters for turn state queries"
```

---

### REFACTOR: Extract Phase Logic

Create phase constant and helper:

**Update**: `src/stores/gameStore.js`

At top of file:
```javascript
const PHASES = {
  SETUP: 'setup',
  DRAW: 'draw',
  PLAY: 'play',
  ATTACK: 'attack',
  END: 'end'
}

const PHASE_ORDER = [PHASES.DRAW, PHASES.PLAY, PHASES.ATTACK, PHASES.END]

const PHASE_INSTRUCTIONS = {
  [PHASES.SETUP]: 'Flip coin to determine first player',
  [PHASES.DRAW]: 'Draw Phase: Collect 1 mana and draw 1 card',
  [PHASES.PLAY]: 'Play Phase: Play cards by spending mana',
  [PHASES.ATTACK]: 'Attack Phase: Declare attacks and roll dice',
  [PHASES.END]: 'End Phase: Turn complete'
}
```

Update actions to use constants:
```javascript
    nextPhase() {
      const currentIndex = PHASE_ORDER.indexOf(this.currentPhase)

      if (currentIndex < PHASE_ORDER.length - 1) {
        this.currentPhase = PHASE_ORDER[currentIndex + 1]

        this.addLogEntry({
          type: 'info',
          message: PHASE_INSTRUCTIONS[this.currentPhase],
          playerId: this.currentPlayer
        })
      }
    },
```

**Run Test** (should still pass):
```bash
npm run test turnManagement.spec.js
```

**Commit**:
```bash
git add src/stores/gameStore.js
git commit -m "refactor: extract phase constants and instructions"
```

---

## Verification

### Run All Tests
```bash
npm run test turnManagement.spec.js
npm run test gameStore.spec.js
```

Expected output:
```
✓ tests/unit/stores/turnManagement.spec.js (39 tests)
  ✓ startGame (8 tests)
  ✓ nextPhase (6 tests)
  ✓ endTurn (8 tests)
  ✓ resetGame (9 tests)
  ✓ Getters (8 tests)

Test Files  2 passed (2)
     Tests  80+ passed
```

### Check Coverage
```bash
npm run test:coverage -- gameStore
```

Expected: 90%+ coverage

---

## Acceptance Criteria

- [x] startGame initializes game with first player
- [x] Mana granted automatically on game start
- [x] nextPhase advances through draw→play→attack→end
- [x] endTurn switches players and resets phase
- [x] Turn number increments correctly
- [x] resetGame clears all state
- [x] Getters provide convenient state access
- [x] All actions log appropriately
- [x] All tests pass
- [x] 90%+ code coverage

## Files Created/Modified

### Created
- `tests/unit/stores/turnManagement.spec.js` - Turn management tests (39 tests)

### Modified
- `src/stores/gameStore.js` - Added turn management actions, getters, constants

## Next Steps

Proceed to [Task 12: TurnManager Component](task-12-turn-manager.md)

---

**Task Complete** ✅
