import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

describe('Game Store - Card Effect Helpers', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('giveManaToOpponent', () => {
    it('transfers mana from player1 to player2', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 3
      store.players.player2.availableMana = 1

      const result = store.giveManaToOpponent('player1', 2)

      expect(result).toBe(true)
      expect(store.players.player1.availableMana).toBe(1)
      expect(store.players.player2.availableMana).toBe(3)
    })

    it('fails when amount exceeds sender mana', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 1

      const result = store.giveManaToOpponent('player1', 2)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(1)
    })

    it('fails for invalid player id', () => {
      const store = useGameStore()
      const result = store.giveManaToOpponent('player3', 1)
      expect(result).toBe(false)
    })

    it('does nothing for 0 amount', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 2
      store.players.player2.availableMana = 2

      const result = store.giveManaToOpponent('player1', 0)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(2)
      expect(store.players.player2.availableMana).toBe(2)
    })
  })
})
