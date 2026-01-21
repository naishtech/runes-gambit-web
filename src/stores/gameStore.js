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

    isGameActive: (state) => state.gameStarted,

    currentPhaseInstructions: (state) => {
      const instructions = {
        setup: 'Setup Phase: Choose which player starts',
        draw: 'Draw Phase: Collect 1 mana and draw 1 card',
        play: 'Play Phase: Play cards and activate abilities',
        attack: 'Attack Phase: Declare attacks and resolve combat',
        end: 'End Phase: Ready to end your turn'
      }
      return instructions[state.currentPhase] || ''
    },

    canAdvancePhase: (state) => {
      return state.gameStarted && state.currentPhase !== 'end'
    }
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

    startGame(startingPlayer) {
      this.gameStarted = true
      this.firstPlayer = startingPlayer
      this.currentPlayer = startingPlayer
      this.currentPhase = 'draw'
      this.turnNumber = 1

      // Grant 1 mana to starting player
      this.transferManaToPlayer(startingPlayer, 1)

      // Log game start
      this.addLogEntry(
        'success',
        `Game started! ${this.players[startingPlayer].name} goes first.`,
        startingPlayer
      )

      this.addLogEntry(
        'info',
        'Draw Phase: Collect 1 mana and draw 1 card',
        startingPlayer
      )
    },

    nextPhase() {
      const phaseOrder = ['draw', 'play', 'attack', 'end']
      const currentIndex = phaseOrder.indexOf(this.currentPhase)

      if (currentIndex < phaseOrder.length - 1) {
        this.currentPhase = phaseOrder[currentIndex + 1]

        // Log phase change with instructions
        const phaseInstructions = {
          play: 'Play Phase: Play cards by spending mana',
          attack: 'Attack Phase: Declare attacks and roll dice',
          end: 'End Phase: Turn complete'
        }

        this.addLogEntry(
          'info',
          phaseInstructions[this.currentPhase],
          this.currentPlayer
        )
      }
    },

    endTurn() {
      // Log turn end
      this.addLogEntry(
        'info',
        `${this.players[this.currentPlayer].name} ended their turn`,
        this.currentPlayer
      )

      // Switch players
      this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1'
      this.turnNumber++

      // Reset to draw phase
      this.currentPhase = 'draw'

      // Grant mana to new current player
      this.transferManaToPlayer(this.currentPlayer, 1)

      // Log turn start
      this.addLogEntry(
        'success',
        `Turn ${this.turnNumber}: ${this.players[this.currentPlayer].name}'s turn begins`,
        this.currentPlayer
      )

      this.addLogEntry(
        'info',
        'Draw Phase: Collect 1 mana and draw 1 card',
        this.currentPlayer
      )
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
