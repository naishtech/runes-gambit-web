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
      const callsAfterStart = saveSpy.mock.calls.length
      
      store.endTurn()
      const callsAfterEnd = saveSpy.mock.calls.length

      // endTurn calls saveGameState at least once (may be more due to other actions)
      expect(callsAfterEnd).toBeGreaterThan(callsAfterStart)
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
