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
  color: #d8b4fe;
  text-align: center;
}

.coin-section {
  text-align: center;
}

.coin-section h3 {
  text-align: center;
}

.start-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.start-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #7c3aed;
  border-radius: 8px;
  background: white;
  color: #7c3aed;
  font-weight: bold;
}

.continue-button {
  border-color: #6aaa6a;
  color: #6aaa6a;
}

.continue-button:hover {
  background: #6aaa6a;
  color: #0f0c08;
}

.winner-note {
  color: #a78bfa;
  text-align: center;
}
</style>
