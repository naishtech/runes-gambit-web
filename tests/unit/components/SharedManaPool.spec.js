import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
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
})
