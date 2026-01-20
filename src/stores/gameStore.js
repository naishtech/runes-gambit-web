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

    addLogEntry(type, message, playerId = null) {
      this.actionLog.push({
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        type,
        message,
        playerId
      })
    }
  }
})
