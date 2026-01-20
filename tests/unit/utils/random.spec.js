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
  })

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

    it('accepts custom options', () => {
      const result = flipCoin('heads', 'tails')
      expect(['heads', 'tails']).toContain(result)
    })
  })
})
