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
  animation: poolUpdate 0.4s ease;
}

@keyframes poolUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
    text-shadow: 0 0 20px rgba(33, 150, 243, 0.8);
  }
  100% {
    transform: scale(1);
  }
}

.pool-subtitle {
  font-size: 0.75rem;
  color: #1976D2;
  opacity: 0.7;
  font-style: italic;
}
</style>
