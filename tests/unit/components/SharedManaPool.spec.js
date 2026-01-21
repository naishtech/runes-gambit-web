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

    it('renders label', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.text()).toContain('Shared Mana Pool')
    })

    it('shows read-only note', () => {
      const wrapper = mount(SharedManaPool)
      expect(wrapper.find('[data-test="pool-readonly-note"]').exists()).toBe(true)
    })
  })

  describe('Reactivity', () => {
    it('reacts to external pool changes from store', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      store.sharedManaPool = 10
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('10')
    })

    it('reflects multiple rapid changes', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      store.sharedManaPool = 5
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('5')

      store.sharedManaPool = 15
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('15')

      store.sharedManaPool = 3
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('3')
    })
  })
})
