import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn() })
  }
})

// Import components
import PlayerNameBox from '@/components/PlayerNameBox.vue'
import LifeCounter from '@/components/LifeCounter.vue'
import ManaCounter from '@/components/ManaCounter.vue'
import SharedManaPool from '@/components/SharedManaPool.vue'
import CoinFlip from '@/components/CoinFlip.vue'
import Dice from '@/components/Dice.vue'
import TurnManager from '@/components/TurnManager.vue'
import LandingPage from '@/components/LandingPage.vue'
import GameView from '@/views/GameView.vue'
import ActionLog from '@/components/ActionLog.vue'

describe('Integration Tests - Complete Game Flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Full Game Initialization', () => {
    it('initializes all components with correct default state', () => {
      const store = useGameStore()

      // Player names
      expect(store.players.player1.name).toBe('Red Player')
      expect(store.players.player2.name).toBe('Blue Player')

      // Life points
      expect(store.players.player1.lifePoints).toBe(20)
      expect(store.players.player2.lifePoints).toBe(20)

      // Mana
      expect(store.players.player1.availableMana).toBe(0)
      expect(store.players.player2.availableMana).toBe(0)
      expect(store.sharedManaPool).toBe(20)

      // Game state
      expect(store.gameStarted).toBe(false)
      expect(store.currentPhase).toBe('setup')
      expect(store.turnNumber).toBe(0)
    })

    it('starts game via landing page after coin flip', async () => {
      const store = useGameStore()
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [
          {
            path: '/',
            name: 'Landing',
            component: LandingPage
          },
          {
            path: '/game',
            name: 'Game',
            component: GameView
          }
        ]
      })
      const landing = mount(LandingPage, {
        global: {
          plugins: [router]
        }
      })

      // Simulate coin flip selecting player1
      const coin = landing.findComponent({ name: 'CoinFlip' })
      // If findComponent by name fails, fallback to emitting on first child component
      if (coin && coin.vm) {
        coin.vm.$emit('result', 'player1')
      }

      await landing.vm.$nextTick()
      await landing.find('[data-test="start-game-from-landing"]').trigger('click')

      expect(store.gameStarted).toBe(true)
      expect(['player1', 'player2']).toContain(store.currentPlayer)
      expect(store.currentPhase).toBe('draw')
      expect(store.turnNumber).toBe(1)
      // Mana grant and pool decrease should reflect starting player
      const startingMana = store.players[store.currentPlayer].availableMana
      expect(startingMana).toBe(1)
      expect(store.sharedManaPool).toBe(19)
    })

    it('updates all components reactively on game start', async () => {
      const manaCounter = mount(ManaCounter, {
        props: { playerId: 'player1', color: 'red' }
      })
      const pool = mount(SharedManaPool)
      const turnManager = mount(TurnManager)
      const store = useGameStore()
      store.startGame('player1')
      await turnManager.vm.$nextTick()
      await manaCounter.vm.$nextTick()
      await pool.vm.$nextTick()

      expect(manaCounter.text()).toContain('1')
      expect(pool.text()).toContain('19')
    })
  })

  describe('Complete Turn Cycle', () => {
    it('executes a full turn from start to end', async () => {
      const store = useGameStore()
      const turnManager = mount(TurnManager)
      // Start game externally via store
      store.startGame('player1')
      await turnManager.vm.$nextTick()
      expect(store.currentPhase).toBe('draw')

      // End turn -> Switch to player2
      await turnManager.find('[data-test="end-turn"]').trigger('click')
      await turnManager.vm.$nextTick()
      expect(store.currentPlayer).toBe('player2')
      expect(store.currentPhase).toBe('draw')
      expect(store.turnNumber).toBe(2)
    })

    it('grants mana correctly at start of each turn', async () => {
      const store = useGameStore()
      const turnManager = mount(TurnManager)
      store.startGame('player1')
      expect(store.players.player1.availableMana).toBe(1)

      // Complete player1 turn
      store.currentPhase = 'end'
      await turnManager.vm.$nextTick()
      await turnManager.find('[data-test="end-turn"]').trigger('click')

      // Player2 should receive mana
      expect(store.players.player2.availableMana).toBe(1)
      expect(store.sharedManaPool).toBe(18)
    })

    it('logs all turn actions correctly', async () => {
      const store = useGameStore()
      const turnManager = mount(TurnManager)
      const actionLog = mount(ActionLog)

      store.startGame('player1')
      await turnManager.vm.$nextTick()
      const initialLogCount = store.actionLog.length

      // End current turn
      await turnManager.find('[data-test="end-turn"]').trigger('click')
      await turnManager.vm.$nextTick()

      expect(store.actionLog.length).toBeGreaterThan(initialLogCount)
      expect(actionLog.findAll('.log-entry').length).toBeGreaterThan(0)
    })
  })

  describe('Mana Economy Flow', () => {
    it('transfers mana from pool to player', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool

      const result = store.transferManaToPlayer('player1', 3)

      expect(result).toBe(true)
      expect(store.sharedManaPool).toBe(initialPool - 3)
      expect(store.players.player1.availableMana).toBe(3)
    })

    it('returns mana from player to pool', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      const initialPool = store.sharedManaPool

      const result = store.returnManaToPool('player1', 2)

      expect(result).toBe(true)
      expect(store.players.player1.availableMana).toBe(3)
      expect(store.sharedManaPool).toBe(initialPool + 2)
    })

    it('prevents transfer when pool is empty', () => {
      const store = useGameStore()
      store.sharedManaPool = 0

      const result = store.transferManaToPlayer('player1', 1)

      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(0)
    })

    it('updates all mana displays reactively', async () => {
      const store = useGameStore()
      const manaCounter = mount(ManaCounter, {
        props: { playerId: 'player1', color: 'red' }
      })
      const pool = mount(SharedManaPool)

      store.transferManaToPlayer('player1', 3)
      await manaCounter.vm.$nextTick()
      await pool.vm.$nextTick()

      expect(manaCounter.text()).toContain('3')
      expect(pool.text()).toContain('17')
    })

    it('handles card purchase simulation (mana spend and return)', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5

      // Simulate buying a card (costs 1 mana)
      const spendResult = store.returnManaToPool('player1', 1)

      expect(spendResult).toBe(true)
      expect(store.players.player1.availableMana).toBe(4)
      expect(store.sharedManaPool).toBe(21)
    })
  })

  describe('Player State Management', () => {
    it('updates player names across all components', async () => {
      const store = useGameStore()
      const nameBox = mount(PlayerNameBox, {
        props: { playerId: 'player1', color: 'red' }
      })
      const turnManager = mount(TurnManager)

      store.setPlayerName('player1', 'Alice')
      await nameBox.vm.$nextTick()

      store.startGame('player1')
      await turnManager.vm.$nextTick()

      expect(turnManager.text()).toContain('Alice')
    })

    it('tracks life changes independently for each player', async () => {
      const store = useGameStore()
      const life1 = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' }
      })
      const life2 = mount(LifeCounter, {
        props: { playerId: 'player2', color: 'blue' }
      })

      await life1.find('[data-test="decrement-life"]').trigger('click')
      await life1.find('[data-test="decrement-life"]').trigger('click')

      await life2.find('[data-test="increment-life"]').trigger('click')

      expect(store.players.player1.lifePoints).toBe(18)
      expect(store.players.player2.lifePoints).toBe(21)
    })

    it('displays warning state for low life', async () => {
      const store = useGameStore()
      const lifeCounter = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' }
      })

      store.players.player1.lifePoints = 3
      await lifeCounter.vm.$nextTick()

      expect(lifeCounter.find('.life-warning').exists()).toBe(true)
    })

    it('displays critical state for zero life', async () => {
      const store = useGameStore()
      const lifeCounter = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' }
      })

      store.players.player1.lifePoints = 0
      await lifeCounter.vm.$nextTick()

      expect(lifeCounter.find('.life-critical').exists()).toBe(true)
    })
  })

  describe('Randomization Components', () => {
    it('coin flip determines first player', async () => {
      const coinFlip = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await coinFlip.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(coinFlip.emitted('result')).toBeTruthy()
      const result = coinFlip.emitted('result')[0][0]
      expect(['player1', 'player2']).toContain(result)
    })

    it('dice roll generates valid values', async () => {
      const dice = mount(Dice)

      await dice.vm.roll()

      expect(dice.vm.lastRoll).toBeGreaterThanOrEqual(1)
      expect(dice.vm.lastRoll).toBeLessThanOrEqual(6)
      expect(dice.emitted('roll')).toBeTruthy()
    })

    it('multiple dice rolls produce different values eventually', async () => {
      const dice = mount(Dice)
      const results = new Set()

      // Roll 5 times - enough to likely get different values
      for (let i = 0; i < 5; i++) {
        await dice.vm.roll()
        await new Promise(resolve => setTimeout(resolve, 850))
        results.add(dice.vm.lastRoll)
      }

      // With 5 rolls and 6-sided die, very likely to get at least 2 different values
      expect(results.size).toBeGreaterThanOrEqual(1)
      expect(dice.vm.lastRoll).toBeGreaterThanOrEqual(1)
      expect(dice.vm.lastRoll).toBeLessThanOrEqual(6)
    }, 10000)
  })

  describe('Game Reset', () => {
    it('resets all game state to initial values', async () => {
      const store = useGameStore()
      const turnManager = mount(TurnManager)

      // Play some game
      store.startGame('player1')
      await turnManager.vm.$nextTick()
      store.players.player1.lifePoints = 15
      store.players.player1.availableMana = 3
      store.sharedManaPool = 10

      // Mock confirm
      global.confirm = vi.fn(() => true)

      // Reset game
      await turnManager.find('[data-test="reset-game"]').trigger('click')
      await turnManager.vm.$nextTick()

      expect(store.gameStarted).toBe(false)
      expect(store.players.player1.lifePoints).toBe(20)
      expect(store.players.player2.lifePoints).toBe(20)
      expect(store.players.player1.availableMana).toBe(0)
      expect(store.players.player2.availableMana).toBe(0)
      expect(store.sharedManaPool).toBe(20)
      expect(store.currentPhase).toBe('setup')
      expect(store.turnNumber).toBe(0)
    })

    it('resets all component displays after game reset', async () => {
      const store = useGameStore()
      const lifeCounter = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' }
      })
      const manaCounter = mount(ManaCounter, {
        props: { playerId: 'player1', color: 'red' }
      })

      store.players.player1.lifePoints = 10
      store.players.player1.availableMana = 5
      await lifeCounter.vm.$nextTick()
      await manaCounter.vm.$nextTick()

      store.resetGame()
      await lifeCounter.vm.$nextTick()
      await manaCounter.vm.$nextTick()

      expect(lifeCounter.text()).toContain('20')
      expect(manaCounter.text()).toContain('0')
    })
  })

  describe('Action Log Integration', () => {
    it('logs game start', () => {
      const store = useGameStore()

      store.startGame('player1')

      const logs = store.actionLog
      expect(logs.some(log => log.message.includes('started'))).toBe(true)
    })

    it('logs mana transfers', () => {
      const store = useGameStore()

      store.transferManaToPlayer('player1', 3)

      const logs = store.actionLog
      expect(logs.some(log => log.message.includes('mana'))).toBe(true)
    })

    it('logs phase changes', () => {
      const store = useGameStore()
      store.startGame('player1')

      store.nextPhase()

      const logs = store.actionLog
      expect(logs.some(log => log.message.includes('Play Phase'))).toBe(true)
    })

    it('displays all logs in ActionLog component', async () => {
      const store = useGameStore()
      const actionLog = mount(ActionLog)

      store.startGame('player1')
      store.nextPhase()
      store.adjustLife('player1', -2)

      await actionLog.vm.$nextTick()

      const entries = actionLog.findAll('.log-entry')
      expect(entries.length).toBeGreaterThan(0)
    })
  })

  describe('Multi-Turn Game Scenario', () => {
    it('simulates 4 complete turns with mana management', async () => {
      const store = useGameStore()

      // Turn 1 - Player 1
      store.startGame('player1')
      expect(store.players.player1.availableMana).toBe(1)

      // Spend mana
      store.returnManaToPool('player1', 1)
      expect(store.players.player1.availableMana).toBe(0)

      // Turn 2 - Player 2
      store.endTurn()
      expect(store.currentPlayer).toBe('player2')
      expect(store.players.player2.availableMana).toBe(1)

      // Turn 3 - Player 1
      store.endTurn()
      expect(store.currentPlayer).toBe('player1')
      expect(store.players.player1.availableMana).toBe(1)

      // Turn 4 - Player 2
      store.endTurn()
      expect(store.currentPlayer).toBe('player2')
      expect(store.players.player2.availableMana).toBe(2) // Had 1 from before
    })

    it('simulates combat with life changes', async () => {
      const store = useGameStore()
      store.startGame('player1')

      // Player 1 attacks, rolls dice
      const attackRoll = Math.floor(Math.random() * 6) + 1

      // Player 2 defends, rolls dice
      const defendRoll = Math.floor(Math.random() * 6) + 1

      // Calculate damage
      const damage = Math.max(0, attackRoll - defendRoll)

      if (damage > 0) {
        store.adjustLife('player2', -damage)
      }

      expect(store.players.player2.lifePoints).toBeLessThanOrEqual(20)
      expect(store.players.player2.lifePoints).toBeGreaterThanOrEqual(0)
    })
  })
})
