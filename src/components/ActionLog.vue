<template>
  <div class="action-log-container">
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
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(20, 15, 10, 0.95) 0%, rgba(10, 8, 5, 0.98) 100%);
  box-shadow: inset 0 0 30px rgba(139, 111, 71, 0.1), 0 4px 12px rgba(0, 0, 0, 0.6);
  border: 2px solid #8b6f47;
  overflow: hidden;
  max-height: 16rem;
}

.action-log {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 16rem;
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
  background: rgba(30, 22, 15, 0.8);
  color: #e6d6ad;
  animation: slideIn 0.3s ease;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
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

.log-entry.type-info { border-left-color: #5a8fc7; }
.log-entry.type-success { border-left-color: #6aaa6a; }
.log-entry.type-warning { border-left-color: #d4af37; }
.log-entry.type-error { border-left-color: #d4534f; }

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}


.entry-timestamp {
  color: #b8bfc7;
  font-family: monospace;
}

.entry-player {
  font-weight: bold;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.4);
}

.log-entry.player-red .entry-player {
  color: #d4534f;
  border: 1px solid #d4534f;
}

.log-entry.player-blue .entry-player {
  color: #5a8fc7;
  border: 1px solid #5a8fc7;
}

.entry-message {
  color: #e6d6ad;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Custom scrollbar */
.action-log::-webkit-scrollbar {
  width: 8px;
}

.action-log::-webkit-scrollbar-track {
  background: rgba(20, 15, 10, 0.6);
  border-radius: 4px;
}

.action-log::-webkit-scrollbar-thumb {
  background: #8b6f47;
  border-radius: 4px;
}

.action-log::-webkit-scrollbar-thumb:hover {
  background: #d4af37;
}
</style>
