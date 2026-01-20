import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SharedManaPool from '@/components/SharedManaPool.vue'
import { useGameStore } from '@/stores/gameStore'

describe('SharedManaPool Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders pool display', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="pool-display"]').exists()).toBe(true)
    })

    it('displays initial pool value from store', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('20')
    })

    it('renders increment button', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="increment-pool"]').exists()).toBe(true)
    })

    it('renders decrement button', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="decrement-pool"]').exists()).toBe(true)
    })

    it('renders label', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.text()).toContain('Shared Mana Pool')
    })
  })

  describe('Pool Adjustment', () => {
    it('increments pool when + button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      const initialPool = store.sharedManaPool

      await wrapper.find('[data-test="increment-pool"]').trigger('click')

      expect(store.sharedManaPool).toBe(initialPool + 1)
    })

    it('decrements pool when - button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      const initialPool = store.sharedManaPool

      await wrapper.find('[data-test="decrement-pool"]').trigger('click')

      expect(store.sharedManaPool).toBe(initialPool - 1)
    })

    it('updates display when pool changes', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      store.sharedManaPool = 15
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('15')
    })

    it('can increment multiple times', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      const initialPool = store.sharedManaPool

      await wrapper.find('[data-test="increment-pool"]').trigger('click')
      await wrapper.find('[data-test="increment-pool"]').trigger('click')
      await wrapper.find('[data-test="increment-pool"]').trigger('click')

      expect(store.sharedManaPool).toBe(initialPool + 3)
    })

    it('calls store.adjustSharedManaPool on increment', async () => {
      const store = useGameStore()
      const adjustSpy = vi.spyOn(store, 'adjustSharedManaPool')

      const wrapper = mount(SharedManaPool)

      await wrapper.find('[data-test="increment-pool"]').trigger('click')

      expect(adjustSpy).toHaveBeenCalledWith(1)
    })

    it('calls store.adjustSharedManaPool on decrement', async () => {
      const store = useGameStore()
      const adjustSpy = vi.spyOn(store, 'adjustSharedManaPool')

      const wrapper = mount(SharedManaPool)

      await wrapper.find('[data-test="decrement-pool"]').trigger('click')

      expect(adjustSpy).toHaveBeenCalledWith(-1)
    })
  })
})
