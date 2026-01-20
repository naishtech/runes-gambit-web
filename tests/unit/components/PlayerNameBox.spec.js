import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import PlayerNameBox from '@/components/PlayerNameBox.vue'
import { useGameStore } from '@/stores/gameStore'

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

  describe('User Input', () => {
    it('updates store when user types', async () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('Alice')

      const store = useGameStore()
      expect(store.players.player1.name).toBe('Alice')
    })

    it('updates player2 name correctly', async () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('Bob')

      const store = useGameStore()
      expect(store.players.player2.name).toBe('Bob')
    })

    it('trims whitespace from input', async () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('  Alice  ')

      const store = useGameStore()
      expect(store.players.player1.name).toBe('Alice')
    })

    it('does not allow empty name', async () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('')

      const store = useGameStore()
      // Should revert to default
      expect(store.players.player1.name).toBe('Red Player')
    })
  })
})
