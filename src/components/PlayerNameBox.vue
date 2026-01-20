<template>
  <div class="player-name-box">
    <input
      :data-test="`${playerId}-name`"
      :value="store.players[playerId].name"
      @input="handleInput"
      type="text"
      class="name-input"
      :placeholder="defaultName"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

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
  margin: 1rem;
}

.name-input {
  padding: 0.5rem;
  font-size: 1.2rem;
  border: 2px solid #ccc;
  border-radius: 4px;
}
</style>
