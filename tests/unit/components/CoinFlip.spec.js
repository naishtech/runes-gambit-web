import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CoinFlip from '@/components/CoinFlip.vue'

describe('CoinFlip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders flip button', () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      expect(wrapper.find('[data-test="flip-button"]').exists()).toBe(true)
    })

    it('displays button text', () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      expect(wrapper.find('[data-test="flip-button"]').text()).toContain('Flip Coin')
    })

    it('does not show result initially', () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      expect(wrapper.find('[data-test="result-message"]').exists()).toBe(false)
    })
  })

  describe('Flip Mechanics', () => {
    it('starts flipping when button clicked', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      expect(wrapper.vm.isFlipping).toBe(true)
    })

    it('generates either player1 or player2 result', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(['player1', 'player2']).toContain(wrapper.vm.result)
    })

    it('displays result message after flip', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      const resultMessage = wrapper.find('[data-test="result-message"]')
      expect(resultMessage.exists()).toBe(true)
      expect(resultMessage.text()).toMatch(/Alice|Bob goes first!/)
    })

    it('emits result event with winner', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.emitted('result')).toBeTruthy()
      expect(['player1', 'player2']).toContain(wrapper.emitted('result')[0][0])
    })

    it('disables button after result', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.find('[data-test="flip-button"]').element.disabled).toBe(true)
    })
  })

  describe('Result Display', () => {
    it('shows player1 name in result', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      // Mock result to be player1
      wrapper.vm.result = 'player1'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="result-message"]').text()).toBe('Alice goes first!')
    })

    it('shows player2 name in result', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      // Mock result to be player2
      wrapper.vm.result = 'player2'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="result-message"]').text()).toBe('Bob goes first!')
    })

    it('uses default player names', async () => {
      const wrapper = mount(CoinFlip)

      wrapper.vm.result = 'player1'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="result-message"]').text()).toBe('Player 1 goes first!')
    })
  })

  describe('Animation', () => {
    it('applies flipping class during animation', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      const coin = wrapper.find('.coin')
      expect(coin.classes()).toContain('flipping')
    })

    it('removes flipping class after animation', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      const coin = wrapper.find('.coin')
      expect(coin.classes()).not.toContain('flipping')
    })

    it('prevents multiple flips during animation', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await wrapper.find('[data-test="flip-button"]').trigger('click')

      await new Promise(resolve => setTimeout(resolve, 1100))

      // Should only emit once
      expect(wrapper.emitted('result')).toHaveLength(1)
    })
  })

  describe('Reset Functionality', () => {
    it('shows reset button after result', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      expect(wrapper.find('[data-test="reset-button"]').exists()).toBe(false)

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.find('[data-test="reset-button"]').exists()).toBe(true)
    })

    it('resets result when reset button clicked', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.vm.result).not.toBeNull()

      await wrapper.find('[data-test="reset-button"]').trigger('click')

      expect(wrapper.vm.result).toBeNull()
    })

    it('emits reset event', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      await wrapper.find('[data-test="reset-button"]').trigger('click')

      expect(wrapper.emitted('reset')).toBeTruthy()
    })

    it('hides result message after reset', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.find('[data-test="result-message"]').exists()).toBe(true)

      await wrapper.find('[data-test="reset-button"]').trigger('click')

      expect(wrapper.find('[data-test="result-message"]').exists()).toBe(false)
    })

    it('re-enables flip button after reset', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.find('[data-test="flip-button"]').element.disabled).toBe(true)

      await wrapper.find('[data-test="reset-button"]').trigger('click')

      expect(wrapper.find('[data-test="flip-button"]').element.disabled).toBe(false)
    })
  })
})
