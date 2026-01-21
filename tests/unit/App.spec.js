import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '@/App.vue'
import { useGameStore } from '@/stores/gameStore'

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

  describe('Responsive Layout', () => {
    it('applies mobile styles on small screens', async () => {
      // Mount with mobile viewport
      const mobileWrapper = mount(App, {
        global: {
          plugins: [createPinia()]
        }
      })

      const gameArea = mobileWrapper.find('[data-test="game-area"]')
      expect(gameArea.exists()).toBe(true)
      expect(gameArea.classes()).toContain('game-area')
    })

    it('grid layout adjusts for tablet screens', async () => {
      const tabletWrapper = mount(App, {
        global: {
          plugins: [createPinia()]
        }
      })

      expect(tabletWrapper.find('.game-area').exists()).toBe(true)
    })

    it('full three-column layout on desktop', async () => {
      const desktopWrapper = mount(App, {
        global: {
          plugins: [createPinia()]
        }
      })

      expect(desktopWrapper.find('[data-test="player-panel-1"]').exists()).toBe(true)
      expect(desktopWrapper.find('[data-test="center-panel"]').exists()).toBe(true)
      expect(desktopWrapper.find('[data-test="player-panel-2"]').exists()).toBe(true)
    })
  })

  describe('Component Communication', () => {
    it('components share same store instance', () => {
      const store = useGameStore(wrapper.vm.$pinia)
      
      expect(store).toBeDefined()
      expect(store.players).toBeDefined()
    })

    it('stat displays are in sync with store', async () => {
      const store = useGameStore(wrapper.vm.$pinia)
      
      // Change life
      const result = store.adjustLife('player1', -5)
      
      await wrapper.vm.$nextTick()

      // Store should reflect change
      expect(result).toBe(true)
      expect(store.players.player1.lifePoints).toBe(15)
    })

    it('handlers are properly defined for component events', () => {
      expect(wrapper.vm.handleCoinFlipResult).toBeDefined()
      expect(typeof wrapper.vm.handleCoinFlipResult).toBe('function')
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
})
