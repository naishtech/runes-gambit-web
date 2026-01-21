<template>
  <div class="dice-container" :class="`color-${color}`">
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

const props = defineProps({
  color: {
    type: String,
    default: 'neutral',
    validator: (value) => ['red', 'blue', 'neutral'].includes(value)
  }
})

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
  border-radius: 14px;
  background: radial-gradient(circle at 30% 20%, rgba(255, 220, 160, 0.08), rgba(0, 0, 0, 0.2)),
    linear-gradient(145deg, #1c130d 0%, #251911 60%, #1a120c 100%);
  border: 2px solid #8b6f47;
  box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.45), 0 6px 18px rgba(0, 0, 0, 0.6);
}

.dice-container.color-red {
  border-color: #d4534f;
}

.dice-container.color-blue {
  border-color: #5a8fc7;
}

.dice-face {
  width: 120px;
  height: 120px;
  background: linear-gradient(160deg, #332219 0%, #2a1d14 50%, #24170f 100%);
  border: 4px solid #8b6f47;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.6), 0 6px 14px rgba(0, 0, 0, 0.5);
}

.dice-face:hover:not(.rolling) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.6), 0 10px 18px rgba(0, 0, 0, 0.6);
  background: linear-gradient(160deg, #3a281d 0%, #2f2017 50%, #281910 100%);
}

.dice-face:active:not(.rolling) {
  transform: translateY(-1px) scale(1.01);
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
  font-weight: 800;
  color: #d4af37;
  user-select: none;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.65);
}

.color-red .dice-value {
  color: #d4534f;
}

.color-blue .dice-value {
  color: #5a8fc7;
}

.dice-label {
  font-size: 1rem;
  font-weight: 700;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.color-red .dice-label {
  color: #d4534f;
}

.color-blue .dice-label {
  color: #5a8fc7;
}

.last-roll {
  font-size: 0.875rem;
  color: #d4af37;
  opacity: 0.85;
}

.color-red .last-roll {
  color: #d4534f;
}

.color-blue .last-roll {
  color: #5a8fc7;
}
</style>
