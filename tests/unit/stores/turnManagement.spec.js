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
      // Check that "started" appears in one of the new log entries
      const newLogs = store.actionLog.slice(initialLogLength)
      const hasStartedLog = newLogs.some(log => log.message.includes('started'))
      expect(hasStartedLog).toBe(true)
    })
  })

  describe('nextPhase', () => {
    it('progresses from draw to play', () => {
      const store = useGameStore()
      store.startGame('player1')

      expect(store.currentPhase).toBe('draw')

      store.nextPhase()

      expect(store.currentPhase).toBe('play')
    })

    it('progresses from play to attack', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.nextPhase() // draw -> play

      store.nextPhase()

      expect(store.currentPhase).toBe('attack')
    })

    it('progresses from attack to end', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.nextPhase() // draw -> play
      store.nextPhase() // play -> attack

      store.nextPhase()

      expect(store.currentPhase).toBe('end')
    })

    it('stays at end phase when called again', () => {
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
})
