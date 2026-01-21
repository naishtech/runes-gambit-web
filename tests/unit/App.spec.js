import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '@/App.vue'

describe('App.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    wrapper = mount(App, {
      global: {
        plugins: [pinia]
      }
    })
  })

  describe('Layout Structure', () => {
    it('renders the main app container', () => {
      expect(wrapper.find('[data-test="app-container"]').exists()).toBe(true)
    })

    it('renders the header section', () => {
      expect(wrapper.find('[data-test="app-header"]').exists()).toBe(true)
    })

    it('renders the game area section', () => {
      expect(wrapper.find('[data-test="game-area"]').exists()).toBe(true)
    })

    it('renders the action log section', () => {
      expect(wrapper.find('[data-test="action-log-section"]').exists()).toBe(true)
    })
  })

  describe('Component Integration', () => {
    it('renders Player 1 name box', () => {
      const nameBox = wrapper.find('[data-test="player1-name"]')
      expect(nameBox.exists()).toBe(true)
    })

    it('renders Player 2 name box', () => {
      const nameBox = wrapper.find('[data-test="player2-name"]')
      expect(nameBox.exists()).toBe(true)
    })

    it('renders Player 1 life counter', () => {
      const lifeCounter = wrapper.find('[data-test="player1-life"]')
      expect(lifeCounter.exists()).toBe(true)
    })

    it('renders Player 2 life counter', () => {
      const lifeCounter = wrapper.find('[data-test="player2-life"]')
      expect(lifeCounter.exists()).toBe(true)
    })

    it('renders Player 1 mana counter', () => {
      const manaCounter = wrapper.find('[data-test="player1-mana"]')
      expect(manaCounter.exists()).toBe(true)
    })

    it('renders Player 2 mana counter', () => {
      const manaCounter = wrapper.find('[data-test="player2-mana"]')
      expect(manaCounter.exists()).toBe(true)
    })

    it('renders shared mana pool', () => {
      const pool = wrapper.find('[data-test="shared-mana-pool"]')
      expect(pool.exists()).toBe(true)
    })

    it('renders coin flip component', () => {
      const coinFlip = wrapper.find('[data-test="coin-flip"]')
      expect(coinFlip.exists()).toBe(true)
    })

    it('renders dice component', () => {
      const dice = wrapper.find('[data-test="dice"]')
      expect(dice.exists()).toBe(true)
    })

    it('renders turn manager', () => {
      const turnManager = wrapper.find('[data-test="turn-manager"]')
      expect(turnManager.exists()).toBe(true)
    })

    it('renders action log', () => {
      const actionLog = wrapper.find('[data-test="action-log"]')
      expect(actionLog.exists()).toBe(true)
    })
  })

  describe('Game State Integration', () => {
    it('displays correct title', () => {
      expect(wrapper.text()).toContain('Runes Gambit')
    })

    it('all components share the same Pinia store', () => {
      const store = wrapper.vm.$pinia._s.get('game')
      expect(store).toBeDefined()
    })
  })
})
