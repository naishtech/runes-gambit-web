import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ActionLog from '@/components/ActionLog.vue'
import { useGameStore } from '@/stores/gameStore'

describe('ActionLog Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders log container', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="action-log"]').exists()).toBe(true)
    })

    it('renders title', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.text()).toContain('Action Log')
    })

    it('displays empty message when no entries', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(true)
    })

    it('does not display empty message when entries exist', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test entry')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(false)
    })
  })

  describe('Entry Display', () => {
    it('displays log entries from store', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test message')

      const wrapper = mount(ActionLog)

      expect(wrapper.text()).toContain('Test message')
    })

    it('displays multiple entries', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'First message')
      store.addLogEntry('info', 'Second message')

      const wrapper = mount(ActionLog)

      expect(wrapper.text()).toContain('First message')
      expect(wrapper.text()).toContain('Second message')
    })

    it('applies correct type class to entries', () => {
      const store = useGameStore()
      store.addLogEntry('success', 'Success message')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-success')
    })

    it('displays timestamp for each entry', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.entry-timestamp').exists()).toBe(true)
    })

    it('displays player name when playerId provided', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test', 'player1')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.entry-player').exists()).toBe(true)
      expect(wrapper.find('.entry-player').text()).toBe(store.players.player1.name)
    })

    it('does not display player name when no playerId', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.entry-player').exists()).toBe(false)
    })
  })

  describe('Entry Types', () => {
    it('applies info type styling', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Info message')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-info')
    })

    it('applies success type styling', () => {
      const store = useGameStore()
      store.addLogEntry('success', 'Success message')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-success')
    })

    it('applies warning type styling', () => {
      const store = useGameStore()
      store.addLogEntry('warning', 'Warning message')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-warning')
    })

    it('applies error type styling', () => {
      const store = useGameStore()
      store.addLogEntry('error', 'Error message')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-error')
    })

    it('applies player color class when playerId present', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test', 'player1')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('player-red')
    })

    it('applies blue color for player2', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test', 'player2')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('player-blue')
    })
  })

  describe('Clear Log', () => {
    it('shows clear button when entries exist', () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test')

      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="clear-log"]').exists()).toBe(true)
    })

    it('hides clear button when no entries', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="clear-log"]').exists()).toBe(false)
    })

    it('clears log when button clicked and confirmed', async () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test')

      global.confirm = vi.fn(() => true)

      const wrapper = mount(ActionLog)

      await wrapper.find('[data-test="clear-log"]').trigger('click')

      expect(store.actionLog.length).toBe(0)
    })

    it('does not clear when confirmation cancelled', async () => {
      const store = useGameStore()
      store.addLogEntry('info', 'Test')

      global.confirm = vi.fn(() => false)

      const wrapper = mount(ActionLog)

      await wrapper.find('[data-test="clear-log"]').trigger('click')

      expect(store.actionLog.length).toBe(1)
    })
  })

  describe('Formatting', () => {
    it('formats timestamp correctly', () => {
      const wrapper = mount(ActionLog)
      const timestamp = new Date('2024-01-01T12:30:45')
      
      const formatted = wrapper.vm.formatTime(timestamp)
      
      expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/)
    })

    it('gets player name from store', () => {
      const store = useGameStore()
      const wrapper = mount(ActionLog)
      
      const name = wrapper.vm.getPlayerName('player1')
      
      expect(name).toBe(store.players.player1.name)
    })

    it('returns playerId when player not found', () => {
      const wrapper = mount(ActionLog)
      
      const name = wrapper.vm.getPlayerName('invalid')
      
      expect(name).toBe('invalid')
    })

    it('returns correct color for player1', () => {
      const wrapper = mount(ActionLog)
      
      const color = wrapper.vm.getPlayerColor('player1')
      
      expect(color).toBe('red')
    })

    it('returns correct color for player2', () => {
      const wrapper = mount(ActionLog)
      
      const color = wrapper.vm.getPlayerColor('player2')
      
      expect(color).toBe('blue')
    })
  })
})
