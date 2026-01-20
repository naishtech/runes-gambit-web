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
