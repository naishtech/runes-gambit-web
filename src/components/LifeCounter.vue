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
      <div 
        class="life-display" 
        data-test="life-display"
        :class="lifeStatusClass"
      >
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
import { computed, ref } from 'vue'
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
const animating = ref(false)
const animationType = ref('')

const lifePoints = computed(() => store.players[props.playerId].lifePoints)

const lifeStatusClass = computed(() => {
  const life = lifePoints.value
  let classes = ''
  
  // Critical takes precedence over warning
  if (life <= 0) {
    classes += 'life-critical '
  } else if (life < 5) {
    classes += 'life-warning '
  }
  
  if (animating.value) {
    if (animationType.value === 'increase') classes += 'life-increase '
    if (animationType.value === 'decrease') classes += 'life-decrease '
  }
  
  return classes.trim()
})

const triggerAnimation = (type) => {
  animating.value = true
  animationType.value = type
  setTimeout(() => {
    animating.value = false
    animationType.value = ''
  }, 500)
}

const incrementLife = () => {
  store.adjustLife(props.playerId, 1)
  triggerAnimation('increase')
}

const decrementLife = () => {
  store.adjustLife(props.playerId, -1)
  triggerAnimation('decrease')
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
  transition: all 0.3s ease;
}

.life-display.life-warning {
  color: #FF9800;
  animation: pulseWarning 2s ease-in-out infinite;
}

.life-display.life-critical {
  color: #F44336;
  animation: pulseCritical 1s ease-in-out infinite;
}

.life-display.life-increase {
  animation: pulse-increase 0.5s ease, flash-green 0.5s ease;
}

.life-display.life-decrease {
  animation: pulse-decrease 0.5s ease, flash-red 0.5s ease;
}

@keyframes pulse-increase {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes pulse-decrease {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.9); }
}

@keyframes flash-green {
  0%, 100% { background-color: rgba(0, 255, 0, 0); }
  50% { background-color: rgba(0, 255, 0, 0.3); }
}

@keyframes flash-red {
  0%, 100% { background-color: rgba(255, 0, 0, 0); }
  50% { background-color: rgba(255, 0, 0, 0.3); }
}

@keyframes pulseWarning {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes pulseCritical {
  0%, 100% {
    transform: scale(1);
    text-shadow: 0 0 5px rgba(244, 67, 54, 0.5);
  }
  50% {
    transform: scale(1.1);
    text-shadow: 0 0 15px rgba(244, 67, 54, 0.8);
  }
}

.life-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: white;
  color: inherit;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
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
