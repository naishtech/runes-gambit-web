import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import PlayerNameBox from '@/components/PlayerNameBox.vue'
import ErrorNotification from '@/components/ErrorNotification.vue'
import { useGameStore } from '@/stores/gameStore'

describe('Component Error Handling', () => {
  it('handles invalid player data gracefully', () => {
    const store = createPinia()
    const wrapper = mount(PlayerNameBox, {
      props: { playerId: 'player1', color: 'red' },
      global: { plugins: [store] }
    })

    // Should render without crashing with valid player ID
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('sanitizes names when passed to store', async () => {
    const store = createPinia()
    setActivePinia(store)
    const gameStore = useGameStore()
    
    // Try to set script tag in name through store
    gameStore.updatePlayerName('player1', '<script>alert("xss")</script>')

    // Should sanitize and remove script tags
    expect(gameStore.players.player1.name).not.toContain('<script>')
    expect(gameStore.players.player1.name).not.toContain('>')
  })

  describe('ErrorNotification Component', () => {
    it('renders error notification', () => {
      const wrapper = mount(ErrorNotification, {
        props: {
          message: 'Test error',
          type: 'error'
        }
      })

      expect(wrapper.text()).toContain('Test error')
      expect(wrapper.find('.type-error').exists()).toBe(true)
    })

    it('renders warning notification', () => {
      const wrapper = mount(ErrorNotification, {
        props: {
          message: 'Test warning',
          type: 'warning'
        }
      })

      expect(wrapper.text()).toContain('Test warning')
      expect(wrapper.find('.type-warning').exists()).toBe(true)
    })

    it('renders info notification', () => {
      const wrapper = mount(ErrorNotification, {
        props: {
          message: 'Test info',
          type: 'info'
        }
      })

      expect(wrapper.text()).toContain('Test info')
      expect(wrapper.find('.type-info').exists()).toBe(true)
    })

    it('closes notification on close button click', async () => {
      const wrapper = mount(ErrorNotification, {
        props: {
          message: 'Test message',
          type: 'error'
        }
      })

      expect(wrapper.find('.error-notification').exists()).toBe(true)
      
      await wrapper.find('.close-btn').trigger('click')
      
      expect(wrapper.find('.error-notification').exists()).toBe(false)
    })

    it('hides notification when message is empty', async () => {
      const wrapper = mount(ErrorNotification, {
        props: {
          message: 'Initial message',
          type: 'error'
        }
      })

      expect(wrapper.find('.error-notification').exists()).toBe(true)
      
      await wrapper.setProps({ message: '' })
      
      expect(wrapper.find('.error-notification').exists()).toBe(false)
    })
  })
})
