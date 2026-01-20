import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import ManaCounter from '@/components/ManaCounter.vue'
import { useGameStore } from '@/stores/gameStore'

describe('ManaCounter Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders mana display', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').exists()).toBe(true)
    })

    it('displays initial mana count from store', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')
    })

    it('displays current mana when player has mana', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5

      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('5')
    })

    it('renders label', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.text()).toContain('Available Mana')
    })

    it('applies player color class', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.classes()).toContain('player-red')
    })

    it('applies blue color class for player2', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      expect(wrapper.classes()).toContain('player-blue')
    })
  })

  describe('Reactivity', () => {
    it('updates display when store mana changes', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')

      store.players.player1.availableMana = 3
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('3')
    })

    it('reflects multiple mana changes', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      store.players.player1.availableMana = 5
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('5')

      store.players.player1.availableMana = 2
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('2')

      store.players.player1.availableMana = 0
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')
    })

    it('only responds to its own player mana changes', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      store.players.player2.availableMana = 10
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')
    })

    it('handles large mana values', async () => {
      const store = useGameStore()
      store.players.player1.availableMana = 99

      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('99')
    })
  })
})
