<template>
  <div class="mana-counter" :class="`player-${color}`">
    <div class="mana-controls">
      <button 
        :disabled="isPoolEmpty"
        class="mana-button" 
        data-test="take-mana-button"
        @click="takeMana"
      >
        Take from Pool
      </button>
    </div>
    <div 
      :key="availableMana"
      class="mana-display" 
      data-test="mana-display"
      :class="manaDisplayClass"
    >
      {{ availableMana }}
    </div>
    <div class="mana-label">Available Mana</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
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
const previousMana = ref(0)
const manaPulsing = ref(false)

const availableMana = computed(() => store.players[props.playerId].availableMana)
const isPoolEmpty = computed(() => store.sharedManaPool <= 0)

const manaDisplayClass = computed(() => {
  return manaPulsing.value ? 'mana-pulse' : ''
})

watch(availableMana, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    previousMana.value = oldVal
    manaPulsing.value = true
    setTimeout(() => {
      manaPulsing.value = false
    }, 600)
  }
})

const takeMana = () => {
  store.transferManaToPlayer(props.playerId, 1)
}
</script>

<style scoped>
.mana-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.mana-controls {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.mana-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 2px solid #2196F3;
  background: white;
  color: #2196F3;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.mana-button:hover:not(:disabled) {
  background: #2196F3;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

.mana-button:active:not(:disabled) {
  transform: translateY(0);
}

.mana-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mana-display {
  font-size: 2rem;
  font-weight: bold;
  color: #2196F3;
  min-width: 60px;
  text-align: center;
  transition: transform 0.3s ease, text-shadow 0.3s ease;
  animation: manaUpdate 0.5s ease;
}

.mana-display.mana-pulse {
  animation: mana-pulse 0.6s ease;
}

@keyframes mana-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px currentColor; }
  50% { transform: scale(1.15); box-shadow: 0 0 20px currentColor; }
}

@keyframes manaUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
    text-shadow: 0 0 10px rgba(33, 150, 243, 0.6);
  }
  100% {
    transform: scale(1);
  }
}

.mana-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  color: var(--text-color);
}

.player-red {
  --surface-color: #FFCDD2;
  --text-color: #D32F2F;
}

.player-blue {
  --surface-color: #BBDEFB;
  --text-color: #1976D2;
}
</style>
