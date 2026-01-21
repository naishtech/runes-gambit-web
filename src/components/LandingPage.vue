<template>
  <div class="landing-page" data-test="landing-page">
    <h2 class="title">Welcome to Runes Gambit</h2>
    <div class="coin-section" data-test="coin-section">
      <h3>Decide Who Starts</h3>
      <CoinFlip
        :player1-name="store.players.player1.name"
        :player2-name="store.players.player2.name"
        @result="onCoinResult"
        @reset="onCoinReset"
      />
    </div>
    <div class="start-section">
      <button
        v-if="hasSavedGame"
        class="start-button continue-button"
        data-test="continue-game"
        @click="continueGame"
      >
        Continue Game
      </button>
      <button
        class="start-button"
        data-test="start-game-from-landing"
        :disabled="!winner"
        @click="startGame"
      >
        Start Game
      </button>
      <div v-if="winner" class="winner-note" data-test="winner-note">
        {{ winnerName }} will start the game.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { loadGameState } from '@/utils/storage'
import CoinFlip from './CoinFlip.vue'

const router = useRouter()
const store = useGameStore()
const winner = ref(null)
const hasSavedGame = ref(false)

const winnerName = computed(() => {
  if (!winner.value) return ''
  return winner.value === 'player1' ? store.players.player1.name : store.players.player2.name
})

const onCoinResult = (result) => {
  winner.value = result
}

const onCoinReset = () => {
  winner.value = null
}

const startGame = async () => {
  if (!winner.value) return
  store.startGame(winner.value)
  await router.push('/game')
}

const continueGame = async () => {
  await router.push('/game')
}

onMounted(() => {
  const saved = loadGameState()
  hasSavedGame.value = !!(saved && saved.gameStarted)
})
</script>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
}

.title {
  color: #d4af37;
  text-align: center;
  font-family: 'Cinzel', serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.coin-section {
  text-align: center;
}

.coin-section h3 {
  text-align: center;
  color: #b8956a;
  font-family: 'Cinzel', serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.start-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.start-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid currentColor;
  border-radius: 8px;
  background: rgba(20, 15, 10, 0.9);
  color: #5a8fc7;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.2s;
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
  background: rgba(30, 22, 15, 0.95);
}

.start-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.continue-button {
  color: #6aaa6a;
}

.continue-button:hover {
  box-shadow: 0 3px 10px rgba(106, 170, 106, 0.4);
}

.winner-note {
  color: #d4af37;
  text-align: center;
  font-style: italic;
}
</style>
