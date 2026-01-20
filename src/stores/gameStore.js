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
  })
})
