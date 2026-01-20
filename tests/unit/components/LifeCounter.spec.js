import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import LifeCounter from '@/components/LifeCounter.vue'
import { useGameStore } from '@/stores/gameStore'

describe('LifeCounter Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders with initial life points', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="life-display"]').text()).toBe('20')
    })

    it('displays life from store', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 15

      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="life-display"]').text()).toBe('15')
    })

    it('renders increment button', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="increment-life"]').exists()).toBe(true)
    })

    it('renders decrement button', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="decrement-life"]').exists()).toBe(true)
    })

    it('applies player color class', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.classes()).toContain('player-red')
    })
  })
})
