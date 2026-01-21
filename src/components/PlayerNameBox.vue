<template>
  <div class="player-name-box" :class="`color-${color}`">
    <label class="player-label">
      {{ color === 'red' ? 'Player 1' : 'Player 2' }}
    </label>
    <input
      :data-test="`${playerId}-name`"
      :value="store.players[playerId].name"
      type="text"
      class="name-input"
      :class="`border-${color}`"
      :placeholder="defaultName"
      @input="handleInput"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const props = defineProps({
  playerId: {
    type: String,
    required: true,
    validator: (value) => ['player1', 'player2'].includes(value)
  },
  color: {
    type: String,
    required: true,
    validator: (value) => ['red', 'blue'].includes(value)
  }
})

const store = useGameStore()

const defaultName = computed(() => {
  return props.color === 'red' ? 'Red Player' : 'Blue Player'
})

function handleInput(event) {
  const value = event.target.value.trim()
  const newName = value || defaultName.value
  store.setPlayerName(props.playerId, newName)
}
</script>

<style scoped>
.player-name-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem;
}

.player-label {
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.name-input {
  padding: 0.75rem;
  font-size: 1.2rem;
  border: 3px solid;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
}

.name-input:focus {
  outline: none;
  transform: scale(1.02);
}

.color-red .player-label {
  color: #D32F2F;
}

.color-blue .player-label {
  color: #1976D2;
}

.border-red {
  border-color: #D32F2F;
  background-color: white;
  color: #2c3e50;
}

.border-blue {
  border-color: #1976D2;
  background-color: white;
  color: #2c3e50;
}

.name-input::placeholder {
  color: #95a5a6;
}
</style>
