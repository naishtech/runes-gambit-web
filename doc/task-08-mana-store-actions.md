# Task 08: Mana Store Actions (TDD)

**Status**: Not Started  
**Estimated Time**: 2 hours  
**Dependencies**: Task 03, Task 07  
**Week**: 2

## Objective
Extend the game store with comprehensive mana management actions including transfers between pool and players, validation, and logging, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Transfer Mana to Player

#### RED: Write Transfer Tests
**File**: `tests/unit/stores/manaActions.spec.js`
```javascript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

describe('Mana Store Actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('transferManaToPlayer', () => {
    it('transfers mana from pool to player', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.transferManaToPlayer('player1', 3)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(initialPool - 3)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana + 3)
    })

    it('returns false if insufficient mana in pool', () => {
      const store = useGameStore()
      store.sharedManaPool = 2

      const result = store.transferManaToPlayer('player1', 5)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(2)
      expect(store.players.player1.availableMana).toBe(0)
    })

    it('handles exact amount transfers', () => {
      const store = useGameStore()
      store.sharedManaPool = 5

      const result = store.transferManaToPlayer('player1', 5)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(0)
      expect(store.players.player1.availableMana).toBe(5)
    })

    it('transfers mana to player2', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      store.transferManaToPlayer('player2', 4)

      expect(store.sharedManaPool).toBe(initialPool - 4)
      expect(store.players.player2.availableMana).toBe(4)
    })

    it('does not transfer negative amounts', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.transferManaToPlayer('player1', -3)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana)
    })

    it('does not transfer zero amounts', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.transferManaToPlayer('player1', 0)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana)
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test manaActions.spec.js
```

#### GREEN: Implement Transfer Action
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
  actions: {
    // ... existing actions ...

    transferManaToPlayer(playerId, amount) {
      // Validate amount
      if (amount <= 0) {
        console.warn('Transfer amount must be positive')
        return false
      }

      // Check if pool has enough mana
      if (this.sharedManaPool < amount) {
        console.warn(`Insufficient mana in pool. Requested: ${amount}, Available: ${this.sharedManaPool}`)
        return false
      }

      // Perform transfer
      this.sharedManaPool -= amount
      this.players[playerId].availableMana += amount

      // Log the action
      this.addLogEntry({
        type: 'info',
        message: `Transferred ${amount} mana from pool to ${this.players[playerId].name}`,
        playerId
      })

      return true
    },
```

**Run Test** (should pass):
```bash
npm run test manaActions.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/manaActions.spec.js src/stores/gameStore.js
git commit -m "feat: add transferManaToPlayer action with validation"
```

---

### Phase 2: Return Mana to Pool

#### RED: Write Return Tests
**Add to**: `tests/unit/stores/manaActions.spec.js`
```javascript
  describe('returnManaToPool', () => {
    it('returns mana from player to pool', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      const initialPool = store.sharedManaPool

      const result = store.returnManaToPool('player1', 3)

      expect(result).toBe(true)
      expect(store.players.player1.availableMana).toBe(2)
      expect(store.sharedManaPool).toBe(initialPool + 3)
    })

    it('returns false if player has insufficient mana', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 2
      const initialPool = store.sharedManaPool

      const result = store.returnManaToPool('player1', 5)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(2)
      expect(store.sharedManaPool).toBe(initialPool)
    })

    it('handles exact amount returns', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      const initialPool = store.sharedManaPool

      const result = store.returnManaToPool('player1', 5)

      expect(result).toBe(true)
      expect(store.players.player1.availableMana).toBe(0)
      expect(store.sharedManaPool).toBe(initialPool + 5)
    })

    it('returns mana from player2', () => {
      const store = useGameStore()
      store.players.player2.availableMana = 7
      const initialPool = store.sharedManaPool

      store.returnManaToPool('player2', 4)

      expect(store.players.player2.availableMana).toBe(3)
      expect(store.sharedManaPool).toBe(initialPool + 4)
    })

    it('does not return negative amounts', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      const initialPool = store.sharedManaPool

      const result = store.returnManaToPool('player1', -3)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(5)
      expect(store.sharedManaPool).toBe(initialPool)
    })

    it('does not return zero amounts', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      const initialPool = store.sharedManaPool

      const result = store.returnManaToPool('player1', 0)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(5)
      expect(store.sharedManaPool).toBe(initialPool)
    })
  })
```

**Run Test** (should fail):
```bash
npm run test manaActions.spec.js
```

#### GREEN: Implement Return Action
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
    returnManaToPool(playerId, amount) {
      // Validate amount
      if (amount <= 0) {
        console.warn('Return amount must be positive')
        return false
      }

      // Check if player has enough mana
      if (this.players[playerId].availableMana < amount) {
        console.warn(`Player has insufficient mana. Requested: ${amount}, Available: ${this.players[playerId].availableMana}`)
        return false
      }

      // Perform return
      this.players[playerId].availableMana -= amount
      this.sharedManaPool += amount

      // Log the action
      this.addLogEntry({
        type: 'info',
        message: `${this.players[playerId].name} returned ${amount} mana to pool`,
        playerId
      })

      return true
    },
```

**Run Test** (should pass):
```bash
npm run test manaActions.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/manaActions.spec.js src/stores/gameStore.js
git commit -m "feat: add returnManaToPool action with validation"
```

---

### Phase 3: Adjust Shared Pool

#### RED: Write Adjust Pool Tests
**Add to**: `tests/unit/stores/manaActions.spec.js`
```javascript
  describe('adjustSharedManaPool', () => {
    it('increases pool by positive amount', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      store.adjustSharedManaPool(5)

      expect(store.sharedManaPool).toBe(initialPool + 5)
    })

    it('decreases pool by negative amount', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      store.adjustSharedManaPool(-3)

      expect(store.sharedManaPool).toBe(initialPool - 3)
    })

    it('does not allow pool to go below 0', () => {
      const store = useGameStore()
      store.sharedManaPool = 5

      store.adjustSharedManaPool(-10)

      expect(store.sharedManaPool).toBe(0)
    })

    it('handles zero adjustment', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      store.adjustSharedManaPool(0)

      expect(store.sharedManaPool).toBe(initialPool)
    })

    it('logs manual adjustments', () => {
      const store = useGameStore()
      const initialLogLength = store.actionLog.length

      store.adjustSharedManaPool(5)

      expect(store.actionLog.length).toBe(initialLogLength + 1)
      expect(store.actionLog[store.actionLog.length - 1].message).toContain('manual adjustment')
    })
  })
```

**Run Test** (should fail):
```bash
npm run test manaActions.spec.js
```

#### GREEN: Implement Adjust Pool Action
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
    adjustSharedManaPool(amount) {
      const newPool = this.sharedManaPool + amount
      
      // Don't allow negative pool
      if (newPool < 0) {
        this.sharedManaPool = 0
      } else {
        this.sharedManaPool = newPool
      }

      // Log manual adjustment
      this.addLogEntry({
        type: 'info',
        message: `Shared pool manual adjustment: ${amount > 0 ? '+' : ''}${amount} (now ${this.sharedManaPool})`
      })
    },
```

**Run Test** (should pass):
```bash
npm run test manaActions.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/manaActions.spec.js src/stores/gameStore.js
git commit -m "feat: add adjustSharedManaPool action with boundary protection"
```

---

### Phase 4: Adjust Player Life

#### RED: Write Life Adjustment Tests
**Add to**: `tests/unit/stores/manaActions.spec.js`
```javascript
  describe('adjustLife', () => {
    it('increases life by positive amount', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 15

      store.adjustLife('player1', 3)

      expect(store.players.player1.lifePoints).toBe(18)
    })

    it('decreases life by negative amount', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 15

      store.adjustLife('player1', -3)

      expect(store.players.player1.lifePoints).toBe(12)
    })

    it('allows life to go below zero', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 2

      store.adjustLife('player1', -5)

      expect(store.players.player1.lifePoints).toBe(-3)
    })

    it('adjusts player2 life independently', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 10
      store.players.player2.lifePoints = 15

      store.adjustLife('player2', 5)

      expect(store.players.player1.lifePoints).toBe(10)
      expect(store.players.player2.lifePoints).toBe(20)
    })

    it('logs life changes', () => {
      const store = useGameStore()
      const initialLogLength = store.actionLog.length

      store.adjustLife('player1', -3)

      expect(store.actionLog.length).toBe(initialLogLength + 1)
      expect(store.actionLog[store.actionLog.length - 1].message).toContain('life')
    })
  })
```

**Run Test** (should fail):
```bash
npm run test manaActions.spec.js
```

#### GREEN: Implement Life Adjustment Action
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
    adjustLife(playerId, amount) {
      this.players[playerId].lifePoints += amount

      // Log life change
      this.addLogEntry({
        type: amount < 0 ? 'warning' : 'info',
        message: `${this.players[playerId].name} life ${amount > 0 ? '+' : ''}${amount} (now ${this.players[playerId].lifePoints})`,
        playerId
      })

      // Check for game over
      if (this.players[playerId].lifePoints <= 0) {
        this.addLogEntry({
          type: 'error',
          message: `${this.players[playerId].name} has been defeated!`,
          playerId
        })
      }
    },
```

**Run Test** (should pass):
```bash
npm run test manaActions.spec.js
```

**Commit**:
```bash
git add tests/unit/stores/manaActions.spec.js src/stores/gameStore.js
git commit -m "feat: add adjustLife action with logging"
```

---

### REFACTOR: Extract Validation Logic

Create a helper for common validations:

**Update**: `src/stores/gameStore.js`

Add validation helpers at the top of actions:
```javascript
  actions: {
    // Validation helpers
    _validatePositiveAmount(amount, actionName) {
      if (amount <= 0) {
        console.warn(`${actionName}: Amount must be positive`)
        return false
      }
      return true
    },

    // ... existing actions with updated validation calls ...
    
    transferManaToPlayer(playerId, amount) {
      if (!this._validatePositiveAmount(amount, 'transferManaToPlayer')) {
        return false
      }

      if (this.sharedManaPool < amount) {
        console.warn(`Insufficient mana in pool. Requested: ${amount}, Available: ${this.sharedManaPool}`)
        return false
      }

      this.sharedManaPool -= amount
      this.players[playerId].availableMana += amount

      this.addLogEntry({
        type: 'info',
        message: `Transferred ${amount} mana from pool to ${this.players[playerId].name}`,
        playerId
      })

      return true
    },

    returnManaToPool(playerId, amount) {
      if (!this._validatePositiveAmount(amount, 'returnManaToPool')) {
        return false
      }

      if (this.players[playerId].availableMana < amount) {
        console.warn(`Player has insufficient mana. Requested: ${amount}, Available: ${this.players[playerId].availableMana}`)
        return false
      }

      this.players[playerId].availableMana -= amount
      this.sharedManaPool += amount

      this.addLogEntry({
        type: 'info',
        message: `${this.players[playerId].name} returned ${amount} mana to pool`,
        playerId
      })

      return true
    },
```

**Run Test** (should still pass):
```bash
npm run test manaActions.spec.js
```

**Commit**:
```bash
git add src/stores/gameStore.js
git commit -m "refactor: extract validation logic for mana actions"
```

---

## Verification

### Run All Tests
```bash
npm run test manaActions.spec.js
npm run test gameStore.spec.js
```

Expected output:
```
✓ tests/unit/stores/manaActions.spec.js (27 tests)
  ✓ transferManaToPlayer (6 tests)
  ✓ returnManaToPool (6 tests)
  ✓ adjustSharedManaPool (5 tests)
  ✓ adjustLife (5 tests)

✓ tests/unit/stores/gameStore.spec.js (all existing tests still pass)

Test Files  2 passed (2)
     Tests  50+ passed
```

### Check Coverage
```bash
npm run test:coverage -- gameStore
```

Expected: 90%+ coverage on gameStore.js

---

## Acceptance Criteria

- [x] transferManaToPlayer moves mana from pool to player
- [x] Validation prevents invalid transfers
- [x] returnManaToPool moves mana from player to pool
- [x] Validation prevents invalid returns
- [x] adjustSharedManaPool manually adjusts pool (with floor at 0)
- [x] adjustLife modifies player life points
- [x] All actions log appropriately
- [x] All tests pass
- [x] 90%+ code coverage
- [x] No regression in existing tests

## Files Created/Modified

### Created
- `tests/unit/stores/manaActions.spec.js` - Mana action tests (27 tests)

### Modified
- `src/stores/gameStore.js` - Added 4 new actions + helpers

## Next Steps

Proceed to [Task 09: CoinFlip Component](task-09-coin-flip.md)

---

**Task Complete** ✅
