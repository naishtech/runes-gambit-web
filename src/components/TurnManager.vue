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
  background: linear-gradient(135deg, rgba(20, 15, 10, 0.95) 0%, rgba(10, 8, 5, 0.98) 100%);
  box-shadow: inset 0 0 30px rgba(139, 111, 71, 0.1), 0 4px 12px rgba(0, 0, 0, 0.6);
  border: 2px solid #8b6f47;
}

.turn-header {
  text-align: center;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  padding-bottom: 1rem;
}

.turn-title {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Cinzel', serif;
  color: #d4af37;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.start-button.player-red {
  color: #d4534f;
}

.start-button.player-blue {
  color: #5a8fc7;
}

.pre-game-note {
  color: #b8956a;
  font-style: italic;
}

.current-turn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}

.label {
  font-weight: bold;
  color: #b8956a;
}

.player-name {
  font-weight: bold;
  font-size: 1.5rem;
}

.player-name.player-red {
  color: #d4534f;
}

.player-name.player-blue {
  color: #5a8fc7;
}

.turn-number {
  color: #8b7355;
}

.phase-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(30, 22, 15, 0.8);
  border-radius: 8px;
  font-size: 1.125rem;
  border: 1px solid rgba(139, 111, 71, 0.3);
}

.phase-label {
  font-weight: bold;
  color: #b8956a;
}

.phase-name {
  text-transform: capitalize;
  font-weight: bold;
  color: #d4af37;
}

.phase-instructions {
  padding: 1rem;
  background: rgba(30, 40, 50, 0.5);
  border-left: 4px solid #5a8fc7;
  border-radius: 4px;
  color: #87aed4;
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
  background: rgba(20, 15, 10, 0.9);
  font-family: 'Cinzel', serif;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  background: rgba(30, 22, 15, 0.95);
}

.next-phase {
  color: #5a8fc7;
}

.end-turn {
  color: #6aaa6a;
}

.reset-game {
  color: #d4534f;
}
</style>
