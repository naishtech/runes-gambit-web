import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import TurnManager from '@/components/TurnManager.vue'
import { useGameStore } from '@/stores/gameStore'

describe('TurnManager Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering - Pre-Game', () => {
    it('does not render start buttons before game starts', () => {
      const wrapper = mount(TurnManager)

      expect(wrapper.find('[data-test="start-player1"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="start-player2"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="pre-game-note"]').exists()).toBe(true)
    })

    it('displays setup phase message', () => {
      const wrapper = mount(TurnManager)

      expect(wrapper.text()).toContain('Setup')
    })

    it('does not show turn controls before game starts', () => {
      const wrapper = mount(TurnManager)

      expect(wrapper.find('[data-test="next-phase"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="end-turn"]').exists()).toBe(false)
    })
  })

  describe('Game Start', () => {
    it('shows active game controls after external start', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="next-phase"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="reset-game"]').exists()).toBe(true)
    })
  })

  describe('Phase Navigation', () => {
    it('advances phase when next phase clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="next-phase"]').trigger('click')

      expect(store.currentPhase).toBe('play')
    })

    it('displays current phase name', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('draw')

      store.nextPhase()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('play')
    })

    it('displays phase instructions', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.phase-instructions').text()).toContain('Draw')
    })

    it('hides next phase button at end phase', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      store.currentPhase = 'end'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="next-phase"]').exists()).toBe(false)
    })

    it('shows end turn button at end phase', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      store.currentPhase = 'end'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="end-turn"]').exists()).toBe(true)
    })
  })

  describe('Turn Cycling', () => {
    it('ends turn when button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      store.currentPhase = 'end'
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="end-turn"]').trigger('click')

      expect(store.currentPlayer).toBe('player2')
      expect(store.turnNumber).toBe(2)
    })

    it('displays current player name', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain(store.players.player1.name)
    })

    it('updates display when turn changes', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain(store.players.player1.name)

      store.endTurn()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain(store.players.player2.name)
    })

    it('displays turn number', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Turn 1')

      store.endTurn()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Turn 2')
    })

    it('applies correct color class to player name', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.player-name').classes()).toContain('player-red')

      store.endTurn()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.player-name').classes()).toContain('player-blue')
    })
  })

  describe('Game Reset', () => {
    it('shows reset button during game', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="reset-game"]').exists()).toBe(true)
    })

    it('calls resetGame when button clicked and confirmed', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      // Mock window.confirm to return true
      global.confirm = vi.fn(() => true)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="reset-game"]').trigger('click')

      expect(store.gameStarted).toBe(false)
    })

    it('does not reset when confirmation cancelled', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      // Mock window.confirm to return false
      global.confirm = vi.fn(() => false)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="reset-game"]').trigger('click')

      expect(store.gameStarted).toBe(true)
    })

    it('returns to pre-game state after reset', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      global.confirm = vi.fn(() => true)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="reset-game"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(store.gameStarted).toBe(false)
      expect(wrapper.find('[data-test="pre-game-note"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="next-phase"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="end-turn"]').exists()).toBe(false)
    })
  })
})
