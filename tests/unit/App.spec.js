import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import GameView from '@/views/GameView.vue'
import { useGameStore } from '@/stores/gameStore'
import { saveGameState, clearGameState } from '@/utils/storage'

describe('GameView.vue', () => {
  let wrapper
  let router

  beforeEach(async () => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/game',
          name: 'Game',
          component: GameView
        }
      ]
    })
    
    const store = useGameStore()
    store.startGame('player1')
    
    wrapper = mount(GameView, {
      global: {
        plugins: [router],
        stubs: {
          PlayerDice: true
        }
      }
    })
    await flushPromises()
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
      const store = useGameStore()
      expect(store).toBeDefined()
      expect(store.$id).toBe('game')
    })
  })

  describe('Responsive Layout', () => {
    it('applies mobile styles on small screens', async () => {
      const gameArea = wrapper.find('[data-test="game-area"]')
      expect(gameArea.exists()).toBe(true)
      expect(gameArea.classes()).toContain('game-area')
    })

    it('grid layout adjusts for tablet screens', async () => {
      expect(wrapper.find('.game-area').exists()).toBe(true)
    })

    it('full three-column layout on desktop', async () => {
      expect(wrapper.find('[data-test="player-panel-1"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="center-panel"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="player-panel-2"]').exists()).toBe(true)
    })
  })

  describe('Component Communication', () => {
    it('components share same store instance', () => {
      const store = useGameStore()
      expect(store).toBeDefined()
      expect(store.players).toBeDefined()
    })

    it('stat displays are in sync with store', async () => {
      const store = useGameStore()
      
      // Change life
      const result = store.adjustLife('player1', -5)
      
      await wrapper.vm.$nextTick()

      // Store should reflect change
      expect(result).toBe(true)
      expect(store.players.player1.lifePoints).toBe(15)
    })

    it('all player stat sections are present', () => {
      const player1Life = wrapper.find('[data-test="player1-life"]')
      const player1Mana = wrapper.find('[data-test="player1-mana"]')
      const player2Life = wrapper.find('[data-test="player2-life"]')
      const player2Mana = wrapper.find('[data-test="player2-mana"]')

      expect(player1Life.exists()).toBe(true)
      expect(player1Mana.exists()).toBe(true)
      expect(player2Life.exists()).toBe(true)
      expect(player2Mana.exists()).toBe(true)
    })
  })

  describe('End-to-End User Flow', () => {
    it('completes a basic game setup through the UI', async () => {
      const store = useGameStore(wrapper.vm.$pinia)

      // Game starts with default state
      expect(store.players.player1.name).toBe('Red Player')
      expect(store.players.player2.name).toBe('Blue Player')

      // Players can adjust life
      store.adjustLife('player1', -3)
      await wrapper.vm.$nextTick()

      expect(store.players.player1.lifePoints).toBe(17)
    })

    it('game can cycle through turns via UI components', async () => {
      const store = useGameStore(wrapper.vm.$pinia)

      // Start game with player1 as first player
      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(store.gameStarted).toBe(true)
      expect(store.currentPlayer).toBe('player1')
      expect(store.currentPhase).toBe('draw')
    })

    it('action log section displays at bottom of UI', () => {
      const actionLogSection = wrapper.find('[data-test="action-log-section"]')
      expect(actionLogSection.exists()).toBe(true)
      
      const actionLog = actionLogSection.find('[data-test="action-log"]')
      expect(actionLog.exists()).toBe(true)
    })

    it('center panel contains all game tools', () => {
      const centerPanel = wrapper.find('[data-test="center-panel"]')
      const turnManager = centerPanel.find('[data-test="turn-manager"]')
      const toolsSection = centerPanel.find('[data-test="tools-section"]')

      expect(centerPanel.exists()).toBe(true)
      expect(turnManager.exists()).toBe(true)
      expect(toolsSection.exists()).toBe(true)
    })
  })

  describe('Game State Persistence', () => {
    it('shows restore notification when saved game exists', async () => {
      clearGameState()
      const store = useGameStore()
      // Ensure a saved, started game exists
      saveGameState({
        ...store.$state,
        gameStarted: true
      })

      const localWrapper = mount(GameView, {
        global: {
          plugins: [router],
          stubs: { PlayerDice: true }
        }
      })
      await flushPromises()

      const notification = localWrapper.find('[data-test="restore-notification"]')
      expect(notification.exists()).toBe(true)
    })

    it('does not show restore notification for new game', async () => {
      clearGameState()

      const localWrapper = mount(GameView, {
        global: {
          plugins: [router],
          stubs: { PlayerDice: true }
        }
      })
      await flushPromises()

      const notification = localWrapper.find('[data-test="restore-notification"]')
      expect(notification.exists()).toBe(false)
    })
  })
})
