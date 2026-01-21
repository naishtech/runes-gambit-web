<template>
  <div class="action-log-container">
    <div class="log-header">
      <h3 class="log-title">Action Log</h3>
      <button 
        v-if="store.actionLog.length > 0"
        class="clear-button"
        data-test="clear-log"
        @click="clearLog"
        title="Clear log"
      >
        Clear
      </button>
    </div>

    <div 
      class="action-log" 
      data-test="action-log"
      ref="logContainer"
    >
      <div 
        v-if="store.actionLog.length === 0" 
        class="empty-message"
        data-test="empty-message"
      >
        No actions yet
      </div>

      <div 
        v-for="entry in store.actionLog" 
        :key="entry.id"
        class="log-entry"
        :class="[`type-${entry.type}`, entry.playerId ? `player-${getPlayerColor(entry.playerId)}` : '']"
        :data-test="`log-entry-${entry.id}`"
      >
        <div class="entry-header">
          <span class="entry-timestamp">{{ formatTime(entry.timestamp) }}</span>
          <span v-if="entry.playerId" class="entry-player">
            {{ getPlayerName(entry.playerId) }}
          </span>
        </div>
        <div class="entry-message">{{ entry.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()
const logContainer = ref(null)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

const getPlayerName = (playerId) => {
  return store.players[playerId]?.name || playerId
}

const getPlayerColor = (playerId) => {
  return playerId === 'player1' ? 'red' : 'blue'
}

const clearLog = () => {
  if (confirm('Clear the action log?')) {
    store.clearActionLog()
  }
}

// Auto-scroll to bottom when new entries added
watch(() => store.actionLog.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})

defineExpose({ formatTime, getPlayerName, getPlayerColor })
</script>

<style scoped>
.action-log-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #9E9E9E;
  overflow: hidden;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #F5F5F5;
  border-bottom: 2px solid #E0E0E0;
}

.log-title {
  margin: 0;
  font-size: 1.25rem;
  color: #424242;
}

.clear-button {
  padding: 0.5rem 1rem;
  border: 2px solid #FF5722;
  border-radius: 6px;
  background: white;
  color: #FF5722;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #FF5722;
  color: white;
}

.action-log {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-message {
  text-align: center;
  color: #9E9E9E;
  font-style: italic;
  padding: 2rem;
}

.log-entry {
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid;
  background: #FAFAFA;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-entry.type-info {
  border-left-color: #2196F3;
  background: #E3F2FD;
}

.log-entry.type-success {
  border-left-color: #4CAF50;
  background: #E8F5E9;
}

.log-entry.type-warning {
  border-left-color: #FF9800;
  background: #FFF3E0;
}

.log-entry.type-error {
  border-left-color: #F44336;
  background: #FFEBEE;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.entry-timestamp {
  color: #757575;
  font-family: monospace;
}

.entry-player {
  font-weight: bold;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  background: white;
}

.log-entry.player-red .entry-player {
  color: #D32F2F;
  border: 1px solid #D32F2F;
}

.log-entry.player-blue .entry-player {
  color: #1976D2;
  border: 1px solid #1976D2;
}

.entry-message {
  color: #424242;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Custom scrollbar */
.action-log::-webkit-scrollbar {
  width: 8px;
}

.action-log::-webkit-scrollbar-track {
  background: #F5F5F5;
  border-radius: 4px;
}

.action-log::-webkit-scrollbar-thumb {
  background: #BDBDBD;
  border-radius: 4px;
}

.action-log::-webkit-scrollbar-thumb:hover {
  background: #9E9E9E;
}
</style>
