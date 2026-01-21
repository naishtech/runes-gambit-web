<template>
  <div class="turn-manager">
    <div class="turn-header">
      <h3 class="turn-title">Turn Manager</h3>
    </div>

    <!-- Pre-Game State -->
    <div v-if="!store.gameStarted" class="pre-game">
      <div class="phase-display">{{ store.currentPhaseInstructions }}</div>
      <div class="pre-game-note" data-test="pre-game-note">
        Use the Landing Page to flip a coin and start the game.
      </div>
    </div>

    <!-- Active Game State -->
    <div v-else class="active-game">
      <div class="current-turn">
        <span class="label">Current Turn:</span>
        <span class="player-name" :class="`player-${currentPlayerColor}`">
          {{ currentPlayerName }}
        </span>
        <span class="turn-number">(Turn {{ store.turnNumber }})</span>
      </div>

      <div class="phase-display">
        <span class="phase-label">Phase:</span>
        <span class="phase-name">{{ store.currentPhase }}</span>
      </div>

      <div class="phase-instructions">
        {{ store.currentPhaseInstructions }}
      </div>

      <div class="turn-controls">
        <button 
          v-if="store.canAdvancePhase"
          class="control-button next-phase"
          data-test="next-phase"
          @click="nextPhase"
        >
          Next Phase
        </button>
        <button 
          v-if="store.currentPhase === 'end'"
          class="control-button end-turn"
          data-test="end-turn"
          @click="endTurn"
        >
          End Turn
        </button>
        <button 
          v-if="store.gameStarted"
          class="control-button reset-game"
          data-test="reset-game"
          @click="resetGame"
        >
          New Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const currentPlayerName = computed(() => {
  return store.currentPlayerState?.name || ''
})

const currentPlayerColor = computed(() => {
  return store.currentPlayer === 'player1' ? 'red' : 'blue'
})

const nextPhase = () => {
  store.nextPhase()
}

const endTurn = () => {
  store.endTurn()
}

const resetGame = () => {
  if (confirm('Are you sure you want to start a new game?')) {
    store.resetGame()
  }
}
</script>

<style scoped>
.turn-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #9E9E9E;
}

.turn-header {
  text-align: center;
  border-bottom: 2px solid #E0E0E0;
  padding-bottom: 1rem;
}

.turn-title {
  margin: 0;
  font-size: 1.5rem;
  color: #424242;
}

.pre-game, .active-game {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.start-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.start-button {
  padding: 1rem 2rem;
  border: 3px solid currentColor;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.start-button.player-red {
  color: #D32F2F;
}

.start-button.player-blue {
  color: #1976D2;
}

.current-turn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}

.label {
  font-weight: bold;
  color: #616161;
}

.player-name {
  font-weight: bold;
  font-size: 1.5rem;
}

.player-name.player-red {
  color: #D32F2F;
}

.player-name.player-blue {
  color: #1976D2;
}

.turn-number {
  color: #9E9E9E;
}

.phase-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #F5F5F5;
  border-radius: 8px;
  font-size: 1.125rem;
}

.phase-label {
  font-weight: bold;
  color: #616161;
}

.phase-name {
  text-transform: capitalize;
  font-weight: bold;
  color: #424242;
}

.phase-instructions {
  padding: 1rem;
  background: #E3F2FD;
  border-left: 4px solid #2196F3;
  border-radius: 4px;
  color: #1565C0;
  font-style: italic;
}

.turn-controls {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.control-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid currentColor;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.next-phase {
  color: #2196F3;
}

.end-turn {
  color: #4CAF50;
}

.reset-game {
  color: #FF5722;
}
</style>
