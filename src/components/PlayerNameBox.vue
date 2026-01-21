<template>
  <div class="player-name-box" :class="`color-${color}`">
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
  background: rgba(20, 15, 10, 0.85);
  font-family: 'Cinzel', serif;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.name-input:focus {
  outline: none;
  transform: scale(1.02);
  background: rgba(30, 22, 15, 0.9);
  box-shadow: 0 0 12px rgba(139, 111, 71, 0.4);
}

.color-red .player-label {
  color: #d4534f;
}

.color-blue .player-label {
  color: #5a8fc7;
}

.border-red {
  border-color: #d4534f;
  color: #d4534f;
}

.border-blue {
  border-color: #5a8fc7;
  color: #5a8fc7;
}

.name-input::placeholder {
  color: #8b6f47;
  opacity: 0.7;
}
</style>
