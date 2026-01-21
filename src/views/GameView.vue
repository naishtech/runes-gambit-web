<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadGameState } from '@/utils/storage'
import { useGameStore } from '@/stores/gameStore'
import PlayerNameBox from '@/components/PlayerNameBox.vue'
import LifeCounter from '@/components/LifeCounter.vue'
import ManaCounter from '@/components/ManaCounter.vue'
import SharedManaPool from '@/components/SharedManaPool.vue'
import CoinFlip from '@/components/CoinFlip.vue'
import PlayerDice from '@/components/PlayerDice.vue'
import TurnManager from '@/components/TurnManager.vue'
import ActionLog from '@/components/ActionLog.vue'

const router = useRouter()
const store = useGameStore()
const showRestoreMessage = ref(false)

onMounted(() => {
  // If game hasn't been started, redirect back to landing page
  if (!store.gameStarted) {
    router.push('/')
    return
  }

  const savedState = loadGameState()
  if (savedState && savedState.gameStarted) {
    showRestoreMessage.value = true
    setTimeout(() => {
      showRestoreMessage.value = false
    }, 3000)
  }
})
</script>

<template>
  <div class="app-container" data-test="app-container">
    <!-- Header -->
    <header class="app-header" data-test="app-header">
      <h1>Runes Gambit</h1>
    </header>

    <!-- Restore Notification -->
    <transition name="fade">
      <div v-if="showRestoreMessage" class="restore-notification" data-test="restore-notification">
        🎮 Game Restored
      </div>
    </transition>

    <!-- Main game area -->
    <div class="game-area" data-test="game-area">
      <!-- Left Panel: Player 1 -->
      <div class="player-panel player-panel-1" data-test="player-panel-1">
        <div class="panel-header">Player 1</div>
        <PlayerNameBox player-id="player1" data-test="player1-name-box" />
        <div data-test="player1-dice">
          <PlayerDice player-id="player1" />
        </div>
        <div data-test="player1-life">
          <LifeCounter player-id="player1" data-test="player1-life-counter" />
        </div>
        <div data-test="player1-mana">
          <ManaCounter player-id="player1" data-test="player1-mana-counter" />
        </div>
      </div>

      <!-- Center Panel: Game Controls -->
      <div class="center-panel" data-test="center-panel">
        <div class="center-section turn-manager-section" data-test="turn-manager-section">
          <TurnManager data-test="turn-manager" />
        </div>

        <div class="center-section tools-section" data-test="tools-section">
          <div class="tools-grid">
            <div class="tool-item shared-pool-item" data-test="shared-pool-item">
              <h3>Shared Mana Pool</h3>
              <SharedManaPool data-test="shared-mana-pool" />
            </div>
            <div class="tool-item coin-flip-item" data-test="coin-flip-item">
              <h3>Coin Flip</h3>
              <CoinFlip data-test="coin-flip" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Player 2 -->
      <div class="player-panel player-panel-2" data-test="player-panel-2">
        <div class="panel-header">Player 2</div>
        <PlayerNameBox player-id="player2" data-test="player2-name-box" />
        <div data-test="player2-dice">
          <PlayerDice player-id="player2" />
        </div>
        <div data-test="player2-life">
          <LifeCounter player-id="player2" data-test="player2-life-counter" />
        </div>
        <div data-test="player2-mana">
          <ManaCounter player-id="player2" data-test="player2-mana-counter" />
        </div>
      </div>
    </div>

    <!-- Action Log Footer -->
    <div class="action-log-section" data-test="action-log-section">
      <ActionLog data-test="action-log" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
}

.app-header {
  text-align: center;
  color: #fff;
  padding: 1rem 0;
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.restore-notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  font-weight: bold;
}

.game-area {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  flex: 1;
}

.player-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.player-panel-1 {
  border-color: rgba(220, 53, 69, 0.3);
}

.player-panel-2 {
  border-color: rgba(23, 162, 184, 0.3);
}

.panel-header {
  font-weight: bold;
  color: #fff;
  font-size: 1.25rem;
  text-align: center;
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.center-section {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.tool-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
}

.tool-item h3 {
  margin: 0 0 1rem 0;
  color: #fff;
  font-size: 1rem;
}

.action-log-section {
  background: rgba(255, 255, 255, 0.05);
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.75rem;
  max-height: 20rem;
  overflow-y: auto;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  .game-area {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .app-container {
    padding: 0.5rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 640px) {
  .app-header h1 {
    font-size: 1.75rem;
  }

  .player-panel {
    padding: 1rem;
    gap: 1rem;
  }

  .center-section {
    padding: 1rem;
  }

  .panel-header {
    font-size: 1rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
