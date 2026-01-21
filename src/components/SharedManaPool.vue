<template>
  <div class="shared-mana-pool">
    <div class="pool-label">Shared Mana Pool</div>
    <div class="pool-display-container">
      <div 
        :key="sharedManaPool"
        class="pool-display" 
        data-test="pool-display"
      >
        {{ sharedManaPool }}
      </div>
    </div>
    <div class="pool-subtitle" data-test="pool-readonly-note">Tokens available to both players. Adjustments happen via turn start or card effects.</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

const sharedManaPool = computed(() => store.sharedManaPool)
// Read-only: direct UI adjustments are disabled per game rules
</script>

<style scoped>
.shared-mana-pool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(30, 40, 50, 0.7) 0%, rgba(20, 30, 40, 0.9) 100%);
  box-shadow: inset 0 0 30px rgba(90, 143, 199, 0.1), 0 4px 8px rgba(0, 0, 0, 0.5);
  border: 2px solid #5a8fc7;
  min-width: 200px;
}

.pool-label {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Cinzel', serif;
  color: #87aed4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.pool-display-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.pool-display {
  font-size: 3rem;
  font-weight: bold;
  color: #87aed4;
  min-width: 100px;
  text-align: center;
  text-shadow: 0 0 10px rgba(90, 143, 199, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8);
  animation: poolUpdate 0.4s ease;
}

@keyframes poolUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
    text-shadow: 0 0 20px rgba(90, 143, 199, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8);
  }
  100% {
    transform: scale(1);
  }
}

.pool-subtitle {
  font-size: 0.75rem;
  color: #b8bfc7;
  opacity: 0.8;
  font-style: italic;
}
</style>
