<template>
  <div class="mana-counter" :class="`player-${color}`">
    <div class="mana-controls">
      <button 
        :disabled="isPoolEmpty"
        class="mana-button" 
        data-test="take-mana-button"
        @click="takeMana"
      >
        Take 1 From Pool
      </button>
      <button
        :disabled="!canSpendMana"
        class="mana-button return-button"
        data-test="return-mana-button"
        @click="returnMana"
      >
        Return 1 to Pool
      </button>
      <button
        :disabled="!canSpendMana"
        class="mana-button give-button"
        data-test="give-mana-button"
        @click="giveManaToOpponent"
      >
        Give 1 to Opponent
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
const opponentId = computed(() => (props.playerId === 'player1' ? 'player2' : 'player1'))

const availableMana = computed(() => store.players[props.playerId].availableMana)
const isPoolEmpty = computed(() => store.sharedManaPool <= 0)
const canSpendMana = computed(() => availableMana.value > 0)

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

const returnMana = () => {
  store.returnManaToPool(props.playerId, 1)
}

const giveManaToOpponent = () => {
  store.giveManaToOpponent(props.playerId, 1)
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.mana-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 2px solid currentColor;
  background: rgba(20, 15, 10, 0.9);
  color: #5a8fc7;
  font-size: 0.875rem;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.2s;
}

.mana-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
  background: rgba(30, 22, 15, 0.95);
}

.return-button {
  color: #c49a3a;
}

.return-button:hover:not(:disabled) {
  box-shadow: 0 3px 10px rgba(196, 154, 58, 0.4);
}

.give-button {
  color: #6aaa6a;
}

.give-button:hover:not(:disabled) {
  box-shadow: 0 3px 10px rgba(106, 170, 106, 0.4);
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
  --surface-color: rgba(212, 83, 79, 0.1);
  --text-color: #d4534f;
}

.player-blue {
  --surface-color: rgba(90, 143, 199, 0.1);
  --text-color: #5a8fc7;
}
</style>
