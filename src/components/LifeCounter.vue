<template>
  <div class="life-counter" :class="`player-${color}`">
    <div class="life-display-container">
      <button 
        class="life-button decrement" 
        data-test="decrement-life"
        @click="decrementLife"
      >
        -
      </button>
      <div class="life-display" data-test="life-display">
        {{ lifePoints }}
      </div>
      <button 
        class="life-button increment" 
        data-test="increment-life"
        @click="incrementLife"
      >
        +
      </button>
    </div>
    <div class="life-label">Life Points</div>
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

const lifePoints = computed(() => store.players[props.playerId].lifePoints)

const incrementLife = () => {
  store.adjustLife(props.playerId, 1)
}

const decrementLife = () => {
  store.adjustLife(props.playerId, -1)
}
</script>

<style scoped>
.life-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.life-display-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.life-display {
  font-size: 2.5rem;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
}

.life-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.life-button:hover {
  transform: scale(1.1);
  background: var(--hover-color);
}

.life-button:active {
  transform: scale(0.95);
}

.life-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.player-red {
  color: #D32F2F;
  --surface-color: #FFCDD2;
  --hover-color: #FFEBEE;
}

.player-blue {
  color: #1976D2;
  --surface-color: #BBDEFB;
  --hover-color: #E3F2FD;
}
</style>
