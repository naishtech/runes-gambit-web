import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'
import LandingPage from '@/components/LandingPage.vue'
import GameView from '@/views/GameView.vue'

describe('LandingPage Component', () => {
  let router

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'Landing',
          component: LandingPage
        },
        {
          path: '/game',
          name: 'Game',
          component: GameView
        }
      ]
    })
  })

  it('disables Start Game until coin flip result', async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router]
      }
    })
    const button = wrapper.find('[data-test="start-game-from-landing"]')
    expect(button.element.disabled).toBe(true)
  })

  it('enables Start Game after result and starts game', async () => {
    const store = useGameStore()
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router]
      }
    })

    // Simulate coin flip result
    const coin = wrapper.findComponent({ name: 'CoinFlip' })
    if (coin && coin.vm) {
      coin.vm.$emit('result', 'player2')
    }
    await wrapper.vm.$nextTick()

    const button = wrapper.find('[data-test="start-game-from-landing"]')
    expect(button.element.disabled).toBe(false)

    await button.trigger('click')

    expect(store.gameStarted).toBe(true)
    expect(['player1', 'player2']).toContain(store.currentPlayer)
    expect(store.currentPhase).toBe('draw')
  })

  it('resets winner state on coin reset', async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router]
      }
    })

    // Emit result then reset
    const coin = wrapper.findComponent({ name: 'CoinFlip' })
    if (coin && coin.vm) {
      coin.vm.$emit('result', 'player1')
      coin.vm.$emit('reset')
    }
    await wrapper.vm.$nextTick()

    const button = wrapper.find('[data-test="start-game-from-landing"]')
    expect(button.element.disabled).toBe(true)
  })
})
