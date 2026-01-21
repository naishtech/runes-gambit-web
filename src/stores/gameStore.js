import { defineStore } from 'pinia'
import { saveGameState, loadGameState, clearGameState } from '@/utils/storage'

// Validation constants
const MAX_NAME_LENGTH = 50
const MAX_LOG_ENTRIES = 500

// Validation helpers
function sanitizePlayerName(name) {
  if (!name || typeof name !== 'string') return ''
  
  // Remove HTML tags
  const cleaned = name.replace(/<[^>]*>/g, '')
  
  // Truncate to max length
  return cleaned.slice(0, MAX_NAME_LENGTH).trim()
}

function validatePlayerId(playerId, players) {
  return playerId && players[playerId] !== undefined
}

export const useGameStore = defineStore('game', {
  state: () => {
    // Load saved state if available
    const savedState = loadGameState()
    
    const defaultState = {
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
    }

    // Merge saved state with defaults
    if (savedState) {
      return { ...defaultState, ...savedState }
    }

    return defaultState
  },

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
    // Auto-save helper function
    autoSave() {
      const state = {
        players: this.players,
        sharedManaPool: this.sharedManaPool,
        gameStarted: this.gameStarted,
        currentPlayer: this.currentPlayer,
        currentPhase: this.currentPhase,
        turnNumber: this.turnNumber,
        actionLog: this.actionLog
      }
      saveGameState(state)
    },

    setPlayerName(playerId, name) {
      this.players[playerId].name = name
      this.addLogEntry('info', `${name} joined as ${playerId}`, playerId)
      this.autoSave()
    },

    updatePlayerName(playerId, name) {
      if (!validatePlayerId(playerId, this.players)) {
        console.warn(`Invalid player ID: ${playerId}`)
        return false
      }

      const sanitized = sanitizePlayerName(name)
      this.players[playerId].name = sanitized
      this.autoSave()
      return true
    },

      giveManaToOpponent(fromPlayerId, amount) {
        // Validate player ID
        if (!validatePlayerId(fromPlayerId, this.players)) {
          console.warn(`Invalid player ID: ${fromPlayerId}`)
          return false
        }

        // Validate amount (allow 0, but don't transfer)
        if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
          console.warn(`Invalid mana amount: ${amount}`)
          return false
        }

        if (amount === 0) {
          return false
        }

        // Determine opponent
        const opponentId = fromPlayerId === 'player1' ? 'player2' : 'player1'

        // Ensure sender has enough mana
        if (this.players[fromPlayerId].availableMana < amount) {
          this.addLogEntry(
            'error',
            `${this.players[fromPlayerId].name} doesn't have enough mana to give`,
            fromPlayerId
          )
          return false
        }

        // Transfer mana between players (no pool change)
        this.players[fromPlayerId].availableMana -= amount
        this.players[opponentId].availableMana += amount

        this.addLogEntry(
          'info',
          `${this.players[fromPlayerId].name} gave ${amount} mana to ${this.players[opponentId].name}`,
          fromPlayerId
        )

        this.autoSave()
        return true
      },

    adjustLife(playerId, amount) {
      if (!validatePlayerId(playerId, this.players)) {
        console.warn(`Invalid player ID: ${playerId}`)
        return false
      }

      if (typeof amount !== 'number' || isNaN(amount)) {
        console.warn(`Invalid life amount: ${amount}`)
        return false
      }
      
      this.players[playerId].lifePoints += amount
      this.addLogEntry(
        amount > 0 ? 'success' : 'warning',
        `${this.players[playerId].name} life ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} (now ${this.players[playerId].lifePoints})`,
        playerId
      )
      this.autoSave()
      return true
    },

    adjustSharedManaPool(amount) {
      if (typeof amount !== 'number' || isNaN(amount)) {
        console.warn(`Invalid mana amount: ${amount}`)
        return false
      }

      const newValue = this.sharedManaPool + amount
      
      if (newValue < 0) {
        this.addLogEntry('error', 'Cannot reduce shared mana pool below 0')
        return false
      }

      this.sharedManaPool = newValue
      this.addLogEntry(
        'info',
        `Shared mana pool ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} (now ${this.sharedManaPool})`
      )
      this.autoSave()
      return true
    },

    transferManaToPlayer(playerId, amount) {
      // Validate player ID
      if (!validatePlayerId(playerId, this.players)) {
        console.warn(`Invalid player ID: ${playerId}`)
        return false
      }

      // Validate amount (allow 0, but don't transfer)
      if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        console.warn(`Invalid mana amount: ${amount}`)
        return false
      }

      // Don't transfer if amount is 0
      if (amount === 0) {
        return false
      }

      // Check if pool has enough mana
      if (this.sharedManaPool < amount) {
        this.addLogEntry('error', 'Not enough mana in pool')
        return false
      }

      // Transfer mana
      this.sharedManaPool -= amount
      this.players[playerId].availableMana += amount

      // Log the transfer
      this.addLogEntry(
        'success',
        `${this.players[playerId].name} received ${amount} mana from pool`,
        playerId
      )

      this.autoSave()
      return true
    },

    returnManaToPool(playerId, amount) {
      // Validate player ID
      if (!validatePlayerId(playerId, this.players)) {
        console.warn(`Invalid player ID: ${playerId}`)
        return false
      }

      // Validate amount (allow 0, but don't transfer)
      if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        console.warn(`Invalid mana amount: ${amount}`)
        return false
      }

      // Don't return if amount is 0
      if (amount === 0) {
        return false
      }

      // Check if player has enough mana
      if (this.players[playerId].availableMana < amount) {
        this.addLogEntry(
          'error',
          `${this.players[playerId].name} doesn't have enough mana`,
          playerId
        )
        return false
      }

      // Return mana to pool
      this.players[playerId].availableMana -= amount
      this.sharedManaPool += amount

      // Log the return
      this.addLogEntry(
        'info',
        `${this.players[playerId].name} returned ${amount} mana to pool`,
        playerId
      )

      this.autoSave()
      return true
    },

    startGame(startingPlayer) {
      if (this.gameStarted) {
        console.warn('Game already started')
        return false
      }

      if (!validatePlayerId(startingPlayer, this.players)) {
        console.warn(`Invalid starting player: ${startingPlayer}`)
        return false
      }

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

      this.autoSave()
      return true
    },

    nextPhase() {
      if (!this.gameStarted) {
        console.warn('Cannot advance phase: game not started')
        return false
      }

      const phaseOrder = ['draw', 'play', 'attack', 'end']
      const currentIndex = phaseOrder.indexOf(this.currentPhase)

      if (currentIndex === -1 || currentIndex >= phaseOrder.length - 1) {
        console.warn('Already at end phase')
        return false
      }

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

      this.autoSave()
      return true
    },

    endTurn() {
      if (!this.gameStarted) {
        console.warn('Cannot end turn: game not started')
        return false
      }

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

      this.autoSave()
      return true
    },

    addLogEntry(type, message, playerId = null) {
      if (!message || typeof message !== 'string') {
        console.warn('Invalid log message')
        return
      }

      const validTypes = ['info', 'success', 'warning', 'error']
      const logType = validTypes.includes(type) ? type : 'info'

      this.actionLog.push({
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        type: logType,
        message,
        playerId
      })

      // Trim log if it gets too long
      if (this.actionLog.length > MAX_LOG_ENTRIES) {
        this.actionLog = this.actionLog.slice(-MAX_LOG_ENTRIES)
      }
    },

    // Alias for addLogEntry (backward compatibility)
    logAction(message, type = 'info', playerId = null) {
      this.addLogEntry(type, message, playerId)
    },

    clearActionLog() {
      this.actionLog = []
      this.autoSave()
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

      clearGameState()
      this.autoSave()
    }
  }
})
