<template>
  <div class="dice-container">
    <div 
      class="dice-face" 
      data-test="dice-face"
      :class="{ rolling: isRolling }"
      @click="roll"
    >
      <div class="dice-value">{{ displayValue }}</div>
    </div>
    <div class="dice-label">Roll Dice</div>
    <div class="last-roll" data-test="last-roll">
      <span v-if="lastRoll">Last Roll: {{ lastRoll }}</span>
      <span v-else>No rolls yet</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { rollDice as randomRoll } from '../utils/random'

const emit = defineEmits(['roll'])

const isRolling = ref(false)
const currentValue = ref(1)
const lastRoll = ref(null)

const displayValue = computed(() => currentValue.value)

const roll = async () => {
  if (isRolling.value) return

  isRolling.value = true

  // Animate rolling for 800ms
  const animationDuration = 800
  const animationInterval = 100
  const iterations = animationDuration / animationInterval

  for (let i = 0; i < iterations; i++) {
    currentValue.value = randomRoll()
    await new Promise(resolve => setTimeout(resolve, animationInterval))
  }

  // Final roll
  const finalValue = randomRoll()
  currentValue.value = finalValue
  lastRoll.value = finalValue
  isRolling.value = false

  emit('roll', finalValue)
}

defineExpose({ isRolling, currentValue, lastRoll, roll })
</script>

<style scoped>
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #5C6BC0;
}

.dice-face {
  width: 120px;
  height: 120px;
  background: white;
  border: 4px solid #5C6BC0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dice-face:hover:not(.rolling) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 16px rgba(92, 107, 192, 0.4);
  background: #F5F5F5;
}

.dice-face:active:not(.rolling) {
  transform: translateY(-2px) scale(1.02);
}

.dice-face.rolling {
  animation: diceRoll 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
  cursor: not-allowed;
}

@keyframes diceRoll {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(180deg) rotateY(180deg);
  }
  50% {
    transform: rotateX(360deg) rotateY(360deg);
  }
  75% {
    transform: rotateX(540deg) rotateY(540deg);
  }
  100% {
    transform: rotateX(720deg) rotateY(720deg);
  }
}

.dice-value {
  font-size: 3rem;
  font-weight: bold;
  color: #5C6BC0;
  user-select: none;
}

.dice-label {
  font-size: 1rem;
  font-weight: bold;
  color: #5C6BC0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.last-roll {
  font-size: 0.875rem;
  color: #5C6BC0;
  opacity: 0.8;
}
</style>
