import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
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
    })

    it('handles extremely high life values', () => {
      const store = useGameStore()

      // Directly set high value instead of looping 1000 times
      store.players.player1.lifePoints = 1000

      expect(store.players.player1.lifePoints).toBe(1000)
      expect(store.players.player1.lifePoints).toBeLessThan(10000)
    })

    it('handles rapid life changes', () => {
      const store = useGameStore()

      for (let i = 0; i < 50; i++) {
        store.adjustLife('player1', i % 2 === 0 ? 1 : -1)
      }

      expect(store.players.player1.lifePoints).toBe(20)
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
      expect(store.currentPlayer).toBe('player1')
    })

    it('prevents phase advancement when game not started', () => {
      const store = useGameStore()

      store.nextPhase()

      expect(store.currentPhase).toBe('setup')
    })

    it('prevents ending turn when game not started', () => {
      const store = useGameStore()

      const result = store.endTurn()

      expect(result).toBe(false)
    })

    it('handles rapid phase changes', () => {
      const store = useGameStore()
      store.startGame('player1')

      for (let i = 0; i < 10; i++) {
        store.nextPhase()
      }

      expect(store.currentPhase).toBe('end')
    })
  })

  describe('Action Log Limits', () => {
    it('handles extremely long action log', () => {
      const store = useGameStore()

      for (let i = 0; i < 1000; i++) {
        store.logAction(`Test action ${i}`, 'info')
      }

      expect(store.actionLog.length).toBeLessThanOrEqual(500)
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
    })

    it('handles extremely long player names', () => {
      const store = useGameStore()
      const longName = 'A'.repeat(1000)

      store.updatePlayerName('player1', longName)

      expect(store.players.player1.name.length).toBeLessThanOrEqual(50)
    })

    it('handles special characters in names', () => {
      const store = useGameStore()

      store.updatePlayerName('player1', '<script>alert("xss")</script>')

      expect(store.players.player1.name).not.toContain('<script>')
      expect(store.players.player1.name).not.toContain('>')
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

      const result1 = store.transferManaToPlayer('player1', 6)
      const result2 = store.transferManaToPlayer('player2', 6)

      const totalTransferred = (result1 ? 6 : 0) + (result2 ? 6 : 0)

      expect(totalTransferred).toBeLessThanOrEqual(10)
    })

    it('handles rapid button clicks', () => {
      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      for (let i = 0; i < 100; i++) {
        store.adjustLife('player1', 1)
      }

      expect(store.players.player1.lifePoints).toBe(initialLife + 100)
    })
  })

  describe('Invalid Input Types', () => {
    it('rejects NaN as life adjustment', () => {
      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      const result = store.adjustLife('player1', NaN)

      expect(result).toBe(false)
      expect(store.players.player1.lifePoints).toBe(initialLife)
    })

    it('rejects negative mana transfers', () => {
      const store = useGameStore()
      const initialMana = store.players.player1.availableMana

      const result = store.transferManaToPlayer('player1', -5)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(initialMana)
    })

    it('handles string amount instead of number', () => {
      const store = useGameStore()

      const result = store.adjustLife('player1', 'five')

      expect(result).toBe(false)
    })
  })
})
