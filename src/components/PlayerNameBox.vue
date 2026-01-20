<template>
  <div class="player-name-box">
    <input
      :data-test="`${playerId}-name`"
      :value="store.players[playerId].name"
      type="text"
      class="name-input"
    />
  </div>
</template>

<script setup>
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
