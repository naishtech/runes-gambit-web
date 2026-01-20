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

  describe('Getters', () => {
    it('currentPlayerState returns current player object', () => {
      const store = useGameStore()
      store.currentPlayer = 'player1'
      
      expect(store.currentPlayerState).toEqual(store.players.player1)
    })

    it('currentPlayerState returns null when no current player', () => {
      const store = useGameStore()
      expect(store.currentPlayerState).toBeNull()
    })

    it('opponentPlayer returns the other player', () => {
      const store = useGameStore()
      store.currentPlayer = 'player1'
      
      expect(store.opponentPlayer).toBe('player2')
    })

    it('opponentPlayer returns player1 when player2 is current', () => {
      const store = useGameStore()
      store.currentPlayer = 'player2'
      
      expect(store.opponentPlayer).toBe('player1')
    })

    it('isGameActive returns true when game started', () => {
      const store = useGameStore()
      store.gameStarted = true
      
      expect(store.isGameActive).toBe(true)
    })

    it('isGameActive returns false when game not started', () => {
      const store = useGameStore()
      expect(store.isGameActive).toBe(false)
    })
  })

  describe('Actions - Player Names', () => {
    it('setPlayerName updates player1 name', () => {
      const store = useGameStore()
      store.setPlayerName('player1', 'Alice')
      
      expect(store.players.player1.name).toBe('Alice')
    })

    it('setPlayerName updates player2 name', () => {
      const store = useGameStore()
      store.setPlayerName('player2', 'Bob')
      
      expect(store.players.player2.name).toBe('Bob')
    })

    it('setPlayerName adds to action log', () => {
      const store = useGameStore()
      store.setPlayerName('player1', 'Alice')
      
      expect(store.actionLog.length).toBeGreaterThan(0)
      expect(store.actionLog[0].message).toContain('Alice')
    })
  })
})
