<template>
  <div class="turn-manager">
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

      <div class="instruction-panel">
        <div class="instructions-title">Turn Actions</div>
        <ul class="instruction-list">
          <li
            v-for="step in turnInstructions"
            :key="step.label"
            class="instruction-item"
            data-test="instruction-item"
          >
            <span class="instruction-label">{{ step.label }}:</span>
            <span class="instruction-text">{{ step.text }}</span>
          </li>
        </ul>
      </div>

      <div class="turn-controls">
        <button
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
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { clearGameState } from '@/utils/storage'

const router = useRouter()
const store = useGameStore()

const currentPlayerName = computed(() => {
  return store.currentPlayerState?.name || ''
})

const currentPlayerColor = computed(() => {
  return store.currentPlayer === 'player1' ? 'red' : 'blue'
})

const turnInstructions = [
  {
    label: 'Draw',
    text: 'Collect 1 mana and draw 1 card.'
  },
  {
    label: 'Play',
    text: 'Cast spells or activate abilities by spending mana as you choose.'
  },
  {
    label: 'Attack',
    text: 'Declare attacks and resolve combat using dice if needed.'
  },
  {
    label: 'End',
    text: 'Finalize effects, cleanup, and end the turn when ready.'
  }
]

const endTurn = () => {
  store.endTurn()
}

const resetGame = () => {
  if (confirm('Are you sure you want to start a new game?')) {
    store.resetGame()
    clearGameState()
    router.push('/')
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

.pre-game, .active-game {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.end-turn {
  color: #6aaa6a;
}

.reset-game {
  color: #d4534f;
}

.instruction-panel {
  background: rgba(30, 22, 15, 0.8);
  border: 1px solid rgba(139, 111, 71, 0.3);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.instructions-title {
  font-weight: bold;
  color: #b8956a;
  letter-spacing: 0.05em;
}

.instruction-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.instruction-item {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  color: #d4d7dc;
}

.instruction-label {
  color: #d4af37;
  font-weight: bold;
  text-transform: capitalize;
}

.instruction-text {
  color: #87aed4;
}
</style>
