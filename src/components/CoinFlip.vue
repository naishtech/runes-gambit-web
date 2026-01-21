<template>
  <div class="coin-flip">
    <button 
      class="flip-button"
      data-test="flip-button"
      @click="flipCoin"
      :disabled="isFlipping || hasResult"
    >
      <div class="coin" :class="{ flipping: isFlipping }">
        🪙
      </div>
      <span>Flip Coin</span>
    </button>
    
    <div 
      v-if="result" 
      class="result-message"
      data-test="result-message"
    >
      {{ resultMessage }}
    </div>

    <button
      v-if="hasResult"
      class="reset-button"
      data-test="reset-button"
      @click="reset"
    >
      Flip Again
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { flipCoin as randomFlip } from '../utils/random'

const props = defineProps({
  player1Name: {
    type: String,
    default: 'Player 1'
  },
  player2Name: {
    type: String,
    default: 'Player 2'
  }
})

const emit = defineEmits(['result', 'reset'])

const isFlipping = ref(false)
const result = ref(null)

const hasResult = computed(() => result.value !== null)

const resultMessage = computed(() => {
  if (!result.value) return ''
  const winnerName = result.value === 'player1' ? props.player1Name : props.player2Name
  return `${winnerName} goes first!`
})

const flipCoin = async () => {
  if (isFlipping.value || hasResult.value) return

  isFlipping.value = true

  // Simulate flip animation duration
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Determine winner
  const winner = randomFlip()
  result.value = winner
  isFlipping.value = false

  emit('result', winner)
}

const reset = () => {
  result.value = null
  emit('reset')
}

// Expose for testing
defineExpose({ isFlipping, result, reset })
</script>

<style scoped>
.coin-flip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #FFA726;
}

.flip-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: 3px solid #FFA726;
  border-radius: 12px;
  background: white;
  font-size: 1.25rem;
  font-weight: bold;
  color: #F57C00;
  cursor: pointer;
  transition: all 0.3s;
}

.flip-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 167, 38, 0.3);
  background: #FFF8E1;
}

.flip-button:active:not(:disabled) {
  transform: translateY(0);
}

.flip-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.coin {
  font-size: 3rem;
  transition: transform 0.3s;
}

.coin.flipping {
  animation: coinFlip 1s cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes coinFlip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(1800deg);
  }
}

.result-message {
  font-size: 1.5rem;
  font-weight: bold;
  color: #F57C00;
  text-align: center;
  animation: fadeInScale 0.5s ease;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.reset-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  font-weight: bold;
  color: #4CAF50;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-button:hover {
  background: #4CAF50;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.reset-button:active {
  transform: translateY(0);
}
</style>
