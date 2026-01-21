import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

describe('Mana Store Actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('transferManaToPlayer', () => {
    it('transfers mana from pool to player', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.transferManaToPlayer('player1', 3)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(initialPool - 3)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana + 3)
    })

    it('returns false if insufficient mana in pool', () => {
      const store = useGameStore()
      store.sharedManaPool = 2

      const result = store.transferManaToPlayer('player1', 5)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(2)
      expect(store.players.player1.availableMana).toBe(0)
    })

    it('handles exact amount transfers', () => {
      const store = useGameStore()
      store.sharedManaPool = 5

      const result = store.transferManaToPlayer('player1', 5)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(0)
      expect(store.players.player1.availableMana).toBe(5)
    })

    it('transfers mana to player2', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      store.transferManaToPlayer('player2', 4)

      expect(store.sharedManaPool).toBe(initialPool - 4)
      expect(store.players.player2.availableMana).toBe(4)
    })

    it('does not transfer negative amounts', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.transferManaToPlayer('player1', -3)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana)
    })

    it('does not transfer zero amounts', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.transferManaToPlayer('player1', 0)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana)
    })
  })

  describe('returnManaToPool', () => {
    it('returns mana from player to pool', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 10
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.returnManaToPool('player1', 3)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(initialPool + 3)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana - 3)
    })

    it('returns false if player has insufficient mana', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 2
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.returnManaToPool('player1', 5)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana)
    })

    it('handles exact amount returns', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      const initialPool = store.sharedManaPool

      const result = store.returnManaToPool('player1', 5)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(initialPool + 5)
      expect(store.players.player1.availableMana).toBe(0)
    })

    it('returns mana from player2', () => {
      const store = useGameStore()
      store.players.player2.availableMana = 8
      const initialPool = store.sharedManaPool

      store.returnManaToPool('player2', 4)

      expect(store.sharedManaPool).toBe(initialPool + 4)
      expect(store.players.player2.availableMana).toBe(4)
    })

    it('does not return negative amounts', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 10
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.returnManaToPool('player1', -3)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana)
    })

    it('does not return zero amounts', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 10
      const initialPool = store.sharedManaPool
      const initialPlayerMana = store.players.player1.availableMana

      const result = store.returnManaToPool('player1', 0)

      expect(result).toBe(false)
      expect(store.sharedManaPool).toBe(initialPool)
      expect(store.players.player1.availableMana).toBe(initialPlayerMana)
    })
  })
})
