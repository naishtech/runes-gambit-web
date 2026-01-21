<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import PlayerNameBox from './components/PlayerNameBox.vue'
import LifeCounter from './components/LifeCounter.vue'
import ManaCounter from './components/ManaCounter.vue'
import SharedManaPool from './components/SharedManaPool.vue'
import CoinFlip from './components/CoinFlip.vue'
import Dice from './components/Dice.vue'
import TurnManager from './components/TurnManager.vue'
import ActionLog from './components/ActionLog.vue'

const store = useGameStore()

const player1Name = computed(() => store.players.player1.name)
const player2Name = computed(() => store.players.player2.name)

const handleCoinFlipResult = (winner) => {
  // Coin flip result will be handled by TurnManager component
}
</script>

<template>
  <div class="app-container" data-test="app-container">
    <!-- Header -->
    <header class="app-header" data-test="app-header">
      <h1>Runes Gambit</h1>
    </header>

    <!-- Main game area -->
    <div class="game-area" data-test="game-area">
      <!-- Left Panel: Player 1 -->
      <div class="player-panel player-panel-1" data-test="player-panel-1">
        <div class="panel-header">Player 1</div>
        <PlayerNameBox player-id="player1" data-test="player1-name-box" />
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
          <TurnManager data-test="turn-manager" @coin-flip-result="handleCoinFlipResult" />
        </div>

        <div class="center-section tools-section" data-test="tools-section">
          <div class="tools-grid">
            <div class="tool-item shared-pool-item" data-test="shared-pool-item">
              <h3>Shared Mana Pool</h3>
              <SharedManaPool data-test="shared-mana-pool" />
            </div>
            <div class="tool-item coin-flip-item" data-test="coin-flip-item">
              <h3>Coin Flip</h3>
              <CoinFlip data-test="coin-flip" @result="handleCoinFlipResult" />
            </div>
            <div class="tool-item dice-item" data-test="dice-item">
              <h3>Dice Roll</h3>
              <Dice data-test="dice" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Player 2 -->
      <div class="player-panel player-panel-2" data-test="player-panel-2">
        <div class="panel-header">Player 2</div>
        <PlayerNameBox player-id="player2" data-test="player2-name-box" />
        <div data-test="player2-life">
          <LifeCounter player-id="player2" data-test="player2-life-counter" />
        </div>
        <div data-test="player2-mana">
          <ManaCounter player-id="player2" data-test="player2-mana-counter" />
        </div>
      </div>
    </div>

    <!-- Bottom Panel: Action Log -->
    <div class="action-log-section" data-test="action-log-section">
      <ActionLog data-test="action-log" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0033 0%, #2d0052 50%, #1a0033 100%);
  color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.app-header {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  text-align: center;
  border-bottom: 2px solid #7c3aed;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #a78bfa;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.game-area {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.player-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.player-panel-1 {
  border-color: #ef4444;
}

.player-panel-2 {
  border-color: #3b82f6;
}

.panel-header {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #7c3aed;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.center-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.turn-manager-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 15px;
}

.tools-section h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #a78bfa;
}

.tools-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.tool-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 6px;
  padding: 10px;
}

.tool-item h3 {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #d8b4fe;
}

.action-log-section {
  background: rgba(0, 0, 0, 0.3);
  border-top: 2px solid #7c3aed;
  border-bottom: 2px solid #7c3aed;
  padding: 15px 20px;
  min-height: 150px;
  max-height: 250px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Responsive design for tablet/small desktop */
@media (max-width: 1024px) {
  .game-area {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .center-panel {
    grid-column: 1 / 3;
  }
}

/* Responsive design for mobile */
@media (max-width: 640px) {
  .app-header h1 {
    font-size: 1.75rem;
  }

  .game-area {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .player-panel,
  .center-panel {
    padding: 12px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .action-log-section {
    max-height: 200px;
    padding: 12px 15px;
  }
}</style>
