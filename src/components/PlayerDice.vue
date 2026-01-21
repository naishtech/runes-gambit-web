<template>
  <div class="player-dice" :class="`player-${playerColor}`">
    <div class="dice-wrapper" :class="{ disabled: !canRoll }">
      <Dice :color="playerColor" @roll="onRoll" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import Dice from './Dice.vue'

const props = defineProps({
  playerId: {
    type: String,
    required: true
  }
})

const store = useGameStore()

const playerName = computed(() => store.players[props.playerId]?.name || '')
const playerColor = computed(() => store.players[props.playerId]?.color || 'neutral')
const canRoll = computed(() => store.gameStarted)

const onRoll = (value) => {
  if (!canRoll.value) return
  store.addLogEntry('info', `${playerName.value} rolled a ${value}`, props.playerId)
}
</script>

<style scoped>
.player-dice {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
}

.dice-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dice-wrapper.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.player-red { 
  border-color: #d4534f;
}

.player-blue { 
  border-color: #5a8fc7;
}
</style>
