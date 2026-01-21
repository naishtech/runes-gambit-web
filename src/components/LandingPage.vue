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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import CoinFlip from './CoinFlip.vue'

const router = useRouter()
const store = useGameStore()
const winner = ref(null)

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
</script>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
}

.title { color: #d8b4fe; }

.start-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #7c3aed;
  border-radius: 8px;
  background: white;
  color: #7c3aed;
  font-weight: bold;
}

.winner-note { color: #a78bfa; margin-top: 0.5rem; }
</style>
