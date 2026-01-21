<template>
  <div class="components-test-page">
    <h1>Components Test Page</h1>
    <p class="subtitle">Manual smoke testing for all components</p>

    <div class="test-section">
      <h2>PlayerNameBox Component</h2>
      <div class="component-grid">
        <div class="test-item">
          <h3>Player 1 (Red)</h3>
          <PlayerNameBox player-id="player1" color="red" />
        </div>
        <div class="test-item">
          <h3>Player 2 (Blue)</h3>
          <PlayerNameBox player-id="player2" color="blue" />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>LifeCounter Component</h2>
      <div class="component-grid">
        <div class="test-item">
          <h3>Player 1 Life (Red)</h3>
          <LifeCounter player-id="player1" color="red" />
        </div>
        <div class="test-item">
          <h3>Player 2 Life (Blue)</h3>
          <LifeCounter player-id="player2" color="blue" />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>ManaCounter Component</h2>
      <div class="component-grid">
        <div class="test-item">
          <h3>Player 1 Mana (Red)</h3>
          <ManaCounter player-id="player1" color="red" />
        </div>
        <div class="test-item">
          <h3>Player 2 Mana (Blue)</h3>
          <ManaCounter player-id="player2" color="blue" />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>SharedManaPool Component</h2>
      <div class="component-grid">
        <div class="test-item full-width">
          <SharedManaPool />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>Store State Inspector</h2>
      <div class="store-inspector">
        <h3>Game Store State:</h3>
        <pre>{{ storeState }}</pre>
        <button @click="resetStore" class="reset-button">Reset Store</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import PlayerNameBox from './PlayerNameBox.vue'
import LifeCounter from './LifeCounter.vue'
import ManaCounter from './ManaCounter.vue'
import SharedManaPool from './SharedManaPool.vue'

const store = useGameStore()

const storeState = computed(() => ({
  players: {
    player1: {
      name: store.players.player1.name,
      lifePoints: store.players.player1.lifePoints,
      availableMana: store.players.player1.availableMana
    },
    player2: {
      name: store.players.player2.name,
      lifePoints: store.players.player2.lifePoints,
      availableMana: store.players.player2.availableMana
    }
  },
  sharedManaPool: store.sharedManaPool,
  gameStarted: store.gameStarted,
  currentPlayer: store.currentPlayer,
  turnNumber: store.turnNumber
}))

const resetStore = () => {
  store.resetGame()
}
</script>

<style scoped>
.components-test-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.test-section h2 {
  font-size: 1.75rem;
  color: #34495e;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #3498db;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.test-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.test-item.full-width {
  grid-column: 1 / -1;
}

.test-item h3 {
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 1rem;
  text-align: center;
}

.store-inspector {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
}

.store-inspector h3 {
  font-size: 1.2rem;
  color: #495057;
  margin-bottom: 1rem;
}

.store-inspector pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.reset-button {
  padding: 0.75rem 1.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

.reset-button:active {
  transform: translateY(0);
}
</style>
