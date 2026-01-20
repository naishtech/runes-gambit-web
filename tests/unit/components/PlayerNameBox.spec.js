import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import PlayerNameBox from '@/components/PlayerNameBox.vue'

describe('PlayerNameBox Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders input field', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('displays default name from store', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('Red Player')
    })

    it('displays player2 default name', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('Blue Player')
    })

    it('has data-test attribute for testing', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="player1-name"]').exists()).toBe(true)
    })
  })
})
