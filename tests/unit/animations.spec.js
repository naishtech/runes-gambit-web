import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useGameStore } from '@/stores/gameStore'
import LifeCounter from '@/components/LifeCounter.vue'
import ManaCounter from '@/components/ManaCounter.vue'
import CoinFlip from '@/components/CoinFlip.vue'
import Dice from '@/components/Dice.vue'

describe('Component Animations', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('LifeCounter Animations', () => {
    it('adds animation class on life decrease', async () => {
      const wrapper = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [createPinia()] }
      })

      await wrapper.find('[data-test="decrement-life"]').trigger('click')

      expect(wrapper.find('.life-decrease').exists()).toBe(true)
    })

    it('adds animation class on life increase', async () => {
      const wrapper = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [createPinia()] }
      })

      await wrapper.find('[data-test="increment-life"]').trigger('click')

      expect(wrapper.find('.life-increase').exists()).toBe(true)
    })

    it('removes animation class after duration', async () => {
      const wrapper = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [createPinia()] }
      })

      await wrapper.find('[data-test="increment-life"]').trigger('click')
      expect(wrapper.vm.animating).toBe(true)

      vi.advanceTimersByTime(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.animating).toBe(false)
    })
  })

  describe('ManaCounter Animations', () => {
    it('animates on mana value change', async () => {
      const pinia = createPinia()
      const store = useGameStore(pinia)
      const wrapper = mount(ManaCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [pinia] }
      })

      store.transferManaToPlayer('player1', 3)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.mana-pulse').exists()).toBe(true)
    })
  })

  describe('CoinFlip Animations', () => {
    it('shows flipping animation during flip', async () => {
      const wrapper = mount(CoinFlip, {
        props: { player1Name: 'Alice', player2Name: 'Bob' }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      expect(wrapper.vm.isFlipping).toBe(true)
      expect(wrapper.find('.coin.flipping').exists()).toBe(true)
    })

    it('stops animation after duration', async () => {
      const wrapper = mount(CoinFlip, {
        props: { player1Name: 'Alice', player2Name: 'Bob' }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isFlipping).toBe(false)
    })
  })

  describe('Dice Animations', () => {
    it('shows rolling animation during roll', async () => {
      vi.useRealTimers() // Dice uses real timers internally
      const wrapper = mount(Dice)

      wrapper.vm.roll() // Don't await - start the roll
      await wrapper.vm.$nextTick() // Let Vue update

      expect(wrapper.vm.isRolling).toBe(true)
      expect(wrapper.find('.dice-face.rolling').exists()).toBe(true)
      
      vi.useFakeTimers()
    })

    it('stops animation after duration', async () => {
      vi.useRealTimers() // Dice uses real timers internally
      const wrapper = mount(Dice)

      wrapper.vm.roll() // Don't await
      await wrapper.vm.$nextTick()
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 1000))

      expect(wrapper.vm.isRolling).toBe(false)
      
      vi.useFakeTimers()
    })
  })
})
