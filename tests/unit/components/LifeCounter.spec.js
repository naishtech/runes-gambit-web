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

  describe('Life Adjustment', () => {
    it('increments life when + button clicked', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      await wrapper.find('[data-test="increment-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(initialLife + 1)
    })

    it('decrements life when - button clicked', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      await wrapper.find('[data-test="decrement-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(initialLife - 1)
    })

    it('updates display when life changes', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 15
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="life-display"]').text()).toBe('15')
    })

    it('allows life to go negative', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 0

      await wrapper.find('[data-test="decrement-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(-1)
    })

    it('can increment multiple times', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      await wrapper.find('[data-test="increment-life"]').trigger('click')
      await wrapper.find('[data-test="increment-life"]').trigger('click')
      await wrapper.find('[data-test="increment-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(initialLife + 3)
    })
  })

  describe('Warning States', () => {
    it('applies warning class when life is below 5', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 4
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).toContain('life-warning')
    })

    it('applies critical class when life is 0 or below', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 0
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).toContain('life-critical')
    })

    it('does not apply warning class when life is 5 or above', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 5
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).not.toContain('life-warning')
    })

    it('critical takes precedence over warning', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 0
      await wrapper.vm.$nextTick()

      const display = wrapper.find('.life-display')
      expect(display.classes()).toContain('life-critical')
      expect(display.classes()).not.toContain('life-warning')
    })

    it('removes warning when life increases above threshold', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 3
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).toContain('life-warning')

      store.players.player1.lifePoints = 10
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).not.toContain('life-warning')
    })
  })
})
