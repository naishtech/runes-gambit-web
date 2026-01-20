import { describe, it, expect } from 'vitest'
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
