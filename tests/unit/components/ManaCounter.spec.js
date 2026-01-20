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
})
