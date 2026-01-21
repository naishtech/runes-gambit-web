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
  background: linear-gradient(135deg, rgba(50, 40, 20, 0.7) 0%, rgba(30, 22, 10, 0.9) 100%);
  box-shadow: inset 0 0 30px rgba(212, 175, 55, 0.1), 0 4px 8px rgba(0, 0, 0, 0.5);
  border: 2px solid #c49a3a;
}

.flip-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: 3px solid #c49a3a;
  border-radius: 12px;
  background: rgba(20, 15, 10, 0.9);
  font-size: 1.25rem;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  color: #d4af37;
  cursor: pointer;
  transition: all 0.3s;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.flip-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(212, 175, 55, 0.4);
  background: rgba(30, 22, 15, 0.95);
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
  font-family: 'Cinzel', serif;
  color: #d4af37;
  text-align: center;
  animation: fadeInScale 0.5s ease;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8);
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
  border: 2px solid #6aaa6a;
  border-radius: 8px;
  background: rgba(20, 15, 10, 0.9);
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  color: #6aaa6a;
  cursor: pointer;
  transition: all 0.3s;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.reset-button:hover {
  background: rgba(106, 170, 106, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(106, 170, 106, 0.3);
}

.reset-button:active {
  transform: translateY(0);
}
</style>
