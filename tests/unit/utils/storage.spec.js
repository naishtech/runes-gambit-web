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

  describe('Storage Error Recovery', () => {
    it('handles corrupted localStorage data', () => {
      localStorage.setItem('runesGambitState', 'corrupted{data}')

      const loaded = loadGameState()
      expect(loaded).toBeNull()
    })

    it('handles quota exceeded error on save', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation()
      
      setItemSpy.mockImplementation(() => {
        throw new DOMException('QuotaExceededError')
      })

      const gameState = { players: {}, largeData: 'x'.repeat(10000000) }
      
      // Should not throw
      expect(() => saveGameState(gameState)).not.toThrow()

      setItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })

    it('handles missing localStorage API gracefully', () => {
      const originalLocalStorage = global.localStorage
      delete global.localStorage

      const gameState = { players: {} }
      
      // Should not throw even if localStorage is unavailable
      expect(() => saveGameState(gameState)).not.toThrow()

      global.localStorage = originalLocalStorage
    })
  })
})
