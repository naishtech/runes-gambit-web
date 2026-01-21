import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Dice from '@/components/Dice.vue'

describe('Dice Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders dice face', () => {
      const wrapper = mount(Dice)

      expect(wrapper.find('[data-test="dice-face"]').exists()).toBe(true)
    })

    it('displays initial value of 1', () => {
      const wrapper = mount(Dice)

      expect(wrapper.find('[data-test="dice-face"]').text()).toContain('1')
    })

    it('renders roll button text', () => {
      const wrapper = mount(Dice)

      expect(wrapper.text()).toContain('Roll')
    })

    it('displays last roll section', () => {
      const wrapper = mount(Dice)

      expect(wrapper.find('[data-test="last-roll"]').exists()).toBe(true)
    })
  })

  describe('Roll Mechanics', () => {
    it('generates number between 1 and 6', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      const value = wrapper.vm.currentValue
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(6)
    })

    it('emits roll event with result', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      expect(wrapper.emitted('roll')).toBeTruthy()
      const emittedValue = wrapper.emitted('roll')[0][0]
      expect(emittedValue).toBeGreaterThanOrEqual(1)
      expect(emittedValue).toBeLessThanOrEqual(6)
    })

    it('updates lastRoll after rolling', async () => {
      const wrapper = mount(Dice)

      expect(wrapper.vm.lastRoll).toBeNull()

      await wrapper.vm.roll()

      expect(wrapper.vm.lastRoll).not.toBeNull()
      expect(wrapper.vm.lastRoll).toBeGreaterThanOrEqual(1)
      expect(wrapper.vm.lastRoll).toBeLessThanOrEqual(6)
    })

    it('displays last roll value', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()
      await wrapper.vm.$nextTick()

      const lastRollText = wrapper.find('[data-test="last-roll"]').text()
      expect(lastRollText).toMatch(/Last Roll: [1-6]/)
    })

    it('can roll multiple times', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()
      const firstRoll = wrapper.vm.lastRoll

      await wrapper.vm.roll()
      const secondRoll = wrapper.vm.lastRoll

      // Both should be valid rolls
      expect(firstRoll).toBeGreaterThanOrEqual(1)
      expect(secondRoll).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Animation State', () => {
    it('sets isRolling to true when rolling starts', async () => {
      const wrapper = mount(Dice)

      expect(wrapper.vm.isRolling).toBe(false)

      const rollPromise = wrapper.vm.roll()
      
      // Should be rolling immediately
      expect(wrapper.vm.isRolling).toBe(true)

      await rollPromise
    })

    it('sets isRolling to false when rolling completes', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      expect(wrapper.vm.isRolling).toBe(false)
    })

    it('applies rolling class during animation', async () => {
      const wrapper = mount(Dice)

      const rollPromise = wrapper.vm.roll()
      await wrapper.vm.$nextTick()

      const diceFace = wrapper.find('[data-test="dice-face"]')
      expect(diceFace.classes()).toContain('rolling')

      await rollPromise
    })

    it('removes rolling class after animation', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()
      await wrapper.vm.$nextTick()

      const diceFace = wrapper.find('[data-test="dice-face"]')
      expect(diceFace.classes()).not.toContain('rolling')
    })

    it('prevents multiple simultaneous rolls', async () => {
      const wrapper = mount(Dice)

      const roll1 = wrapper.vm.roll()
      const roll2 = wrapper.vm.roll()
      const roll3 = wrapper.vm.roll()

      await Promise.all([roll1, roll2, roll3])

      // Should only emit once
      expect(wrapper.emitted('roll')).toHaveLength(1)
    })
  })

  describe('Click Interaction', () => {
    it('triggers roll when dice face is clicked', async () => {
      const wrapper = mount(Dice)

      await wrapper.find('[data-test="dice-face"]').trigger('click')
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 900))

      expect(wrapper.emitted('roll')).toBeTruthy()
    })

    it('updates display value after click', async () => {
      const wrapper = mount(Dice)

      await wrapper.find('[data-test="dice-face"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 900))

      // Value should have changed (might be same by chance, but lastRoll should be set)
      expect(wrapper.vm.lastRoll).not.toBeNull()
    })

    it('shows "No rolls yet" initially', () => {
      const wrapper = mount(Dice)

      const lastRollText = wrapper.find('[data-test="last-roll"]').text()
      expect(lastRollText).toContain('No rolls yet')
    })
  })
})
