# Task 02: Random Utilities (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 1 hour  
**Dependencies**: Task 01  
**Week**: 1

## Objective
Create utility functions for dice rolling and coin flipping using Test-Driven Development. These pure functions will be used by Dice and CoinFlip components.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Dice Roll Function

#### RED: Write Failing Tests
**File**: `tests/unit/utils/random.spec.js`
```javascript
import { describe, it, expect, vi } from 'vitest'
import { rollDice, flipCoin } from '@/utils/random'

describe('Random Utilities', () => {
  describe('rollDice', () => {
    it('returns a number', () => {
      const result = rollDice()
      expect(typeof result).toBe('number')
    })

    it('returns number between 1 and 6', () => {
      const result = rollDice()
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
    })

    it('returns integer, not float', () => {
      const result = rollDice()
      expect(Number.isInteger(result)).toBe(true)
    })

    it('produces all values 1-6 over many rolls', () => {
      const results = new Set()
      for (let i = 0; i < 100; i++) {
        results.add(rollDice())
      }
      // Should hit multiple values (at least 4 different)
      expect(results.size).toBeGreaterThan(3)
    })

    it('produces roughly even distribution over 6000 rolls', () => {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      const numRolls = 6000
      
      for (let i = 0; i < numRolls; i++) {
        const roll = rollDice()
        counts[roll]++
      }
      
      // Each should appear ~1000 times (±200 for randomness)
      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(800)
        expect(count).toBeLessThan(1200)
      })
    })
  })
})
```

**Run tests**: `npm run test random.spec.js`  
**Expected**: All tests FAIL (function doesn't exist)

#### GREEN: Implement Minimal Solution
**File**: `src/utils/random.js`
```javascript
/**
 * Rolls a 6-sided die
 * @returns {number} Random integer between 1 and 6
 */
export function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}
```

**Run tests**: `npm run test random.spec.js`  
**Expected**: All tests PASS

#### REFACTOR: Improve Code
**File**: `src/utils/random.js`
```javascript
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
```

**Add refactor tests**:
```javascript
it('accepts custom number of sides', () => {
  const result = rollDice(20)
  expect(result).toBeGreaterThanOrEqual(1)
  expect(result).toBeLessThanOrEqual(20)
})

it('throws error for invalid sides', () => {
  expect(() => rollDice(0)).toThrow()
  expect(() => rollDice(-1)).toThrow()
  expect(() => rollDice(3.5)).toThrow()
})
```

**Run tests**: All should still PASS

**Commit**:
```bash
git add .
git commit -m "test: add rollDice tests"
git commit -m "feat: implement rollDice function"
git commit -m "refactor: support custom die sides with validation"
```

---

### Phase 2: Coin Flip Function

#### RED: Write Failing Tests
**Add to**: `tests/unit/utils/random.spec.js`
```javascript
describe('flipCoin', () => {
  it('returns a string', () => {
    const result = flipCoin()
    expect(typeof result).toBe('string')
  })

  it('returns either "player1" or "player2"', () => {
    const result = flipCoin()
    expect(['player1', 'player2']).toContain(result)
  })

  it('produces both outcomes over many flips', () => {
    const results = new Set()
    for (let i = 0; i < 100; i++) {
      results.add(flipCoin())
    }
    expect(results.size).toBe(2)
    expect(results.has('player1')).toBe(true)
    expect(results.has('player2')).toBe(true)
  })

  it('produces roughly 50/50 distribution over 1000 flips', () => {
    const results = { player1: 0, player2: 0 }
    const numFlips = 1000
    
    for (let i = 0; i < numFlips; i++) {
      const flip = flipCoin()
      results[flip]++
    }
    
    // Each should appear ~500 times (±100 for randomness)
    expect(results.player1).toBeGreaterThan(400)
    expect(results.player1).toBeLessThan(600)
    expect(results.player2).toBeGreaterThan(400)
    expect(results.player2).toBeLessThan(600)
  })
})
```

**Run tests**: Tests FAIL (function doesn't exist)

#### GREEN: Implement Minimal Solution
**Add to**: `src/utils/random.js`
```javascript
/**
 * Flips a coin to determine which player goes first
 * @returns {'player1' | 'player2'} Random player selection
 */
export function flipCoin() {
  return Math.random() < 0.5 ? 'player1' : 'player2'
}
```

**Run tests**: All tests PASS

#### REFACTOR: Improve Code
**Update**: `src/utils/random.js`
```javascript
/**
 * Flips a coin to choose between two options
 * @param {string} option1 - First option (default: 'player1')
 * @param {string} option2 - Second option (default: 'player2')
 * @returns {string} Randomly selected option
 */
export function flipCoin(option1 = 'player1', option2 = 'player2') {
  return Math.random() < 0.5 ? option1 : option2
}
```

**Add refactor test**:
```javascript
it('accepts custom options', () => {
  const result = flipCoin('heads', 'tails')
  expect(['heads', 'tails']).toContain(result)
})
```

**Run tests**: All PASS

**Commit**:
```bash
git add .
git commit -m "test: add flipCoin tests"
git commit -m "feat: implement flipCoin function"
git commit -m "refactor: support custom options in flipCoin"
```

---

## Final File Structure

**File**: `src/utils/random.js`
```javascript
/**
 * Random utility functions for game mechanics
 */

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
```

## Acceptance Criteria
- [ ] All tests pass: `npm run test random.spec.js`
- [ ] Test coverage: 100% on random.js
- [ ] `rollDice()` returns 1-6 consistently
- [ ] `rollDice(20)` returns 1-20 for 20-sided die
- [ ] Distribution tests pass for both functions
- [ ] `flipCoin()` returns player1 or player2
- [ ] Code follows TDD: Red-Green-Refactor pattern
- [ ] All changes committed with clear messages

## Verification
```bash
# Run tests
npm run test random.spec.js

# Check coverage
npm run test:coverage -- random.spec.js

# Should show 100% coverage for src/utils/random.js
```

## Next Task
→ [Task 03: Game Store Foundation (TDD)](task-03-game-store-foundation.md)

## Reference
- [Design Document](design-document.md) - Section 1.4, 9.2, 11.2.3
