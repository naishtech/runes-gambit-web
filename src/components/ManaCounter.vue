<template>
  <div class="mana-counter" :class="`player-${color}`">
    <div 
      :key="availableMana"
      class="mana-display" 
      data-test="mana-display"
    >
      {{ availableMana }}
    </div>
    <div class="mana-label">Available Mana</div>
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

const availableMana = computed(() => store.players[props.playerId].availableMana)
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

.mana-display {
  font-size: 2rem;
  font-weight: bold;
  color: #2196F3;
  min-width: 60px;
  text-align: center;
  transition: transform 0.3s ease, text-shadow 0.3s ease;
  animation: manaUpdate 0.5s ease;
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
  --surface-color: #FFCDD2;
  --text-color: #D32F2F;
}

.player-blue {
  --surface-color: #BBDEFB;
  --text-color: #1976D2;
}
</style>
