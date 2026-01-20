<template>
  <div class="shared-mana-pool">
    <div class="pool-label">Shared Mana Pool</div>
    <div class="pool-display-container">
      <button 
        class="pool-button decrement" 
        data-test="decrement-pool"
        @click="decrementPool"
      >
        -
      </button>
      <div class="pool-display" data-test="pool-display">
        {{ sharedManaPool }}
      </div>
      <button 
        class="pool-button increment" 
        data-test="increment-pool"
        @click="incrementPool"
      >
        +
      </button>
    </div>
    <div class="pool-subtitle">Tokens available to both players</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const sharedManaPool = computed(() => store.sharedManaPool)

const incrementPool = () => {
  store.adjustSharedManaPool(1)
}

const decrementPool = () => {
  store.adjustSharedManaPool(-1)
}
</script>

<style scoped>
.shared-mana-pool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #2196F3;
  min-width: 200px;
}

.pool-label {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1976D2;
}

.pool-display-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.pool-display {
  font-size: 3rem;
  font-weight: bold;
  color: #2196F3;
  min-width: 100px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
}

.pool-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #2196F3;
  background: white;
  font-size: 1.75rem;
  font-weight: bold;
  color: #2196F3;
  cursor: pointer;
  transition: all 0.2s;
}

.pool-button:hover {
  transform: scale(1.1);
  background: #E3F2FD;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

.pool-button:active {
  transform: scale(0.95);
}

.pool-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: scale(1);
}

.pool-subtitle {
  font-size: 0.75rem;
  color: #1976D2;
  opacity: 0.7;
  font-style: italic;
}
</style>
