<template>
  <div class="player-dice" :class="`player-${playerColor}`">
    <div class="dice-header">
      <span class="player-name">{{ playerName }}'s Dice</span>
      <span class="phase-hint" v-if="!isAttackPhase">Available during Attack phase</span>
    </div>
    <div class="dice-wrapper" :class="{ disabled: !isAttackPhase }">
      <Dice @roll="onRoll" />
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
const isAttackPhase = computed(() => store.currentPhase === 'attack')

const onRoll = (value) => {
  if (!isAttackPhase.value) return
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

.dice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.player-name {
  color: #fff;
}

.phase-hint {
  font-size: 0.8rem;
  opacity: 0.8;
}

.dice-wrapper.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.player-red { border-color: #ef4444; }
.player-blue { border-color: #3b82f6; }
</style>
