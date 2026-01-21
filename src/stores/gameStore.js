import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Game metadata
    gameStarted: false,
    
    // Players
    players: {
      player1: {
        name: 'Red Player',
        color: 'red',
        lifePoints: 20,
        availableMana: 0
      },
      player2: {
        name: 'Blue Player',
        color: 'blue',
        lifePoints: 20,
        availableMana: 0
      }
    },
    
    // Shared resources
    sharedManaPool: 20,
    
    // Turn management
    firstPlayer: null,
    currentPlayer: null,
    currentPhase: 'setup',
    turnNumber: 0,
    
    // Dice
    lastDiceRoll: null,
    
    // Logging
    actionLog: []
  }),

  getters: {
    currentPlayerState: (state) => {
      return state.currentPlayer ? state.players[state.currentPlayer] : null
    },

    opponentPlayer: (state) => {
      if (state.currentPlayer === 'player1') return 'player2'
      if (state.currentPlayer === 'player2') return 'player1'
      return null
    },

    isGameActive: (state) => state.gameStarted
  },

  actions: {
    setPlayerName(playerId, name) {
      this.players[playerId].name = name
      this.addLogEntry('info', `${name} joined as ${playerId}`, playerId)
    },

    adjustLife(playerId, amount) {
      if (!this.players[playerId]) {
        console.warn(`Invalid player ID: ${playerId}`)
        return false
      }
      
      this.players[playerId].lifePoints += amount
      return true
    },

    adjustSharedManaPool(amount) {
      this.sharedManaPool += amount
      // Prevent negative pool
      if (this.sharedManaPool < 0) {
        this.sharedManaPool = 0
      }
      return true
    },

    transferManaToPlayer(playerId, amount) {
      // Validate amount
      if (amount <= 0) {
        return false
      }

      // Check if player exists
      if (!this.players[playerId]) {
        console.warn(`Invalid player ID: ${playerId}`)
        return false
      }

      // Check if pool has enough mana
      if (this.sharedManaPool < amount) {
        return false
      }

      // Transfer mana
      this.sharedManaPool -= amount
      this.players[playerId].availableMana += amount

      // Log the transfer
      this.addLogEntry(
        'info',
        `${this.players[playerId].name} took ${amount} mana from the pool`,
        playerId
      )

      return true
    },

    returnManaToPool(playerId, amount) {
      // Validate amount
      if (amount <= 0) {
        return false
      }

      // Check if player exists
      if (!this.players[playerId]) {
        console.warn(`Invalid player ID: ${playerId}`)
        return false
      }

      // Check if player has enough mana
      if (this.players[playerId].availableMana < amount) {
        return false
      }

      // Return mana to pool
      this.players[playerId].availableMana -= amount
      this.sharedManaPool += amount

      // Log the return
      this.addLogEntry(
        'info',
        `${this.players[playerId].name} returned ${amount} mana to the pool`,
        playerId
      )

      return true
    },

    addLogEntry(type, message, playerId = null) {
      this.actionLog.push({
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        type,
        message,
        playerId
      })
    },

    resetGame() {
      // Preserve names
      const player1Name = this.players.player1.name
      const player2Name = this.players.player2.name
      
      // Reset to initial state
      this.gameStarted = false
      this.currentPlayer = null
      this.firstPlayer = null
      this.currentPhase = 'setup'
      this.turnNumber = 0
      this.lastDiceRoll = null
      this.sharedManaPool = 20
      this.actionLog = []
      
      // Reset players but keep names
      this.players.player1 = {
        name: player1Name,
        color: 'red',
        lifePoints: 20,
        availableMana: 0
      }
      
      this.players.player2 = {
        name: player2Name,
        color: 'blue',
        lifePoints: 20,
        availableMana: 0
      }
    }
  }
})
