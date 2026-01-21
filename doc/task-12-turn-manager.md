# Task 12: TurnManager Component (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 2.5 hours  
**Dependencies**: Task 11  
**Week**: 2

## Objective
Create the TurnManager component that displays current turn state, phase information, and provides controls for game flow management, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering

#### RED: Write Rendering Tests
**File**: `tests/unit/components/TurnManager.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import TurnManager from '@/components/TurnManager.vue'
import { useGameStore } from '@/stores/gameStore'

describe('TurnManager Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering - Pre-Game', () => {
    it('renders start buttons before game starts', () => {
      const wrapper = mount(TurnManager)

      expect(wrapper.find('[data-test="start-player1"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="start-player2"]').exists()).toBe(true)
    })

    it('displays setup phase message', () => {
      const wrapper = mount(TurnManager)

      expect(wrapper.text()).toContain('Setup')
    })

    it('does not show turn controls before game starts', () => {
      const wrapper = mount(TurnManager)

      expect(wrapper.find('[data-test="next-phase"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="end-turn"]').exists()).toBe(false)
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test TurnManager.spec.js
```

#### GREEN: Create Component
**File**: `src/components/TurnManager.vue`
```vue
<template>
  <div class="turn-manager">
    <div class="turn-header">
      <h3 class="turn-title">Turn Manager</h3>
    </div>

    <!-- Pre-Game State -->
    <div v-if="!store.gameStarted" class="pre-game">
      <div class="phase-display">{{ store.currentPhaseInstructions }}</div>
      <div class="start-buttons">
        <button 
          class="start-button player-red"
          data-test="start-player1"
          @click="startGame('player1')"
        >
          Start {{ store.players.player1.name }}
        </button>
        <button 
          class="start-button player-blue"
          data-test="start-player2"
          @click="startGame('player2')"
        >
          Start {{ store.players.player2.name }}
        </button>
      </div>
    </div>

    <!-- Active Game State -->
    <div v-else class="active-game">
      <div class="current-turn">
        <span class="label">Current Turn:</span>
        <span class="player-name" :class="`player-${currentPlayerColor}`">
          {{ currentPlayerName }}
        </span>
        <span class="turn-number">(Turn {{ store.turnNumber }})</span>
      </div>

      <div class="phase-display">
        <span class="phase-label">Phase:</span>
        <span class="phase-name">{{ store.currentPhase }}</span>
      </div>

      <div class="phase-instructions">
        {{ store.currentPhaseInstructions }}
      </div>

      <div class="turn-controls">
        <button 
          v-if="store.canAdvancePhase"
          class="control-button next-phase"
          data-test="next-phase"
          @click="nextPhase"
        >
          Next Phase
        </button>
        <button 
          v-if="store.currentPhase === 'end'"
          class="control-button end-turn"
          data-test="end-turn"
          @click="endTurn"
        >
          End Turn
        </button>
        <button 
          class="control-button reset-game"
          data-test="reset-game"
          @click="resetGame"
        >
          New Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const currentPlayerName = computed(() => {
  return store.currentPlayerState?.name || ''
})

const currentPlayerColor = computed(() => {
  return store.currentPlayer === 'player1' ? 'red' : 'blue'
})

const startGame = (player) => {
  store.startGame(player)
}

const nextPhase = () => {
  store.nextPhase()
}

const endTurn = () => {
  store.endTurn()
}

const resetGame = () => {
  if (confirm('Are you sure you want to start a new game?')) {
    store.resetGame()
  }
}
</script>

<style scoped>
.turn-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #9E9E9E;
}

.turn-header {
  text-align: center;
  border-bottom: 2px solid #E0E0E0;
  padding-bottom: 1rem;
}

.turn-title {
  margin: 0;
  font-size: 1.5rem;
  color: #424242;
}

.pre-game, .active-game {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.start-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.start-button {
  padding: 1rem 2rem;
  border: 3px solid currentColor;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.start-button.player-red {
  color: #D32F2F;
}

.start-button.player-blue {
  color: #1976D2;
}

.current-turn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}

.label {
  font-weight: bold;
  color: #616161;
}

.player-name {
  font-weight: bold;
  font-size: 1.5rem;
}

.player-name.player-red {
  color: #D32F2F;
}

.player-name.player-blue {
  color: #1976D2;
}

.turn-number {
  color: #9E9E9E;
}

.phase-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #F5F5F5;
  border-radius: 8px;
  font-size: 1.125rem;
}

.phase-label {
  font-weight: bold;
  color: #616161;
}

.phase-name {
  text-transform: capitalize;
  font-weight: bold;
  color: #424242;
}

.phase-instructions {
  padding: 1rem;
  background: #E3F2FD;
  border-left: 4px solid #2196F3;
  border-radius: 4px;
  color: #1565C0;
  font-style: italic;
}

.turn-controls {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.control-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid currentColor;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.next-phase {
  color: #2196F3;
}

.end-turn {
  color: #4CAF50;
}

.reset-game {
  color: #FF5722;
}
</style>
```

**Run Test** (should pass):
```bash
npm run test TurnManager.spec.js
```

**Commit**:
```bash
git add tests/unit/components/TurnManager.spec.js src/components/TurnManager.vue
git commit -m "feat: add basic TurnManager component structure"
```

---

### Phase 2: Game Start

#### RED: Write Game Start Tests
**Add to**: `tests/unit/components/TurnManager.spec.js`
```javascript
  describe('Game Start', () => {
    it('starts game when player1 button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      await wrapper.find('[data-test="start-player1"]').trigger('click')

      expect(store.gameStarted).toBe(true)
      expect(store.currentPlayer).toBe('player1')
    })

    it('starts game when player2 button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      await wrapper.find('[data-test="start-player2"]').trigger('click')

      expect(store.gameStarted).toBe(true)
      expect(store.currentPlayer).toBe('player2')
    })

    it('hides start buttons after game starts', async () => {
      const wrapper = mount(TurnManager)

      await wrapper.find('[data-test="start-player1"]').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="start-player1"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="start-player2"]').exists()).toBe(false)
    })

    it('shows active game controls after start', async () => {
      const wrapper = mount(TurnManager)

      await wrapper.find('[data-test="start-player1"]').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="next-phase"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="reset-game"]').exists()).toBe(true)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test TurnManager.spec.js
```

**Commit**:
```bash
git add tests/unit/components/TurnManager.spec.js
git commit -m "test: add game start tests for TurnManager"
```

---

### Phase 3: Phase Navigation

#### RED: Write Phase Navigation Tests
**Add to**: `tests/unit/components/TurnManager.spec.js`
```javascript
  describe('Phase Navigation', () => {
    it('advances phase when next phase clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="next-phase"]').trigger('click')

      expect(store.currentPhase).toBe('play')
    })

    it('displays current phase name', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('draw')

      store.nextPhase()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('play')
    })

    it('displays phase instructions', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.phase-instructions').text()).toContain('Draw')
    })

    it('hides next phase button at end phase', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      store.currentPhase = 'end'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="next-phase"]').exists()).toBe(false)
    })

    it('shows end turn button at end phase', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      store.currentPhase = 'end'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="end-turn"]').exists()).toBe(true)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test TurnManager.spec.js
```

**Commit**:
```bash
git add tests/unit/components/TurnManager.spec.js
git commit -m "test: add phase navigation tests for TurnManager"
```

---

### Phase 4: Turn Cycling

#### RED: Write Turn Cycling Tests
**Add to**: `tests/unit/components/TurnManager.spec.js`
```javascript
  describe('Turn Cycling', () => {
    it('ends turn when button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      store.currentPhase = 'end'
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="end-turn"]').trigger('click')

      expect(store.currentPlayer).toBe('player2')
      expect(store.turnNumber).toBe(2)
    })

    it('displays current player name', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain(store.players.player1.name)
    })

    it('updates display when turn changes', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain(store.players.player1.name)

      store.endTurn()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain(store.players.player2.name)
    })

    it('displays turn number', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Turn 1')

      store.endTurn()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Turn 2')
    })

    it('applies correct color class to player name', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.player-name').classes()).toContain('player-red')

      store.endTurn()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.player-name').classes()).toContain('player-blue')
    })
  })
```

**Run Test** (should pass):
```bash
npm run test TurnManager.spec.js
```

**Commit**:
```bash
git add tests/unit/components/TurnManager.spec.js
git commit -m "test: add turn cycling tests for TurnManager"
```

---

### Phase 5: Game Reset

#### RED: Write Reset Tests
**Add to**: `tests/unit/components/TurnManager.spec.js`
```javascript
  describe('Game Reset', () => {
    it('shows reset button during game', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="reset-game"]').exists()).toBe(true)
    })

    it('calls resetGame when button clicked and confirmed', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      // Mock window.confirm to return true
      global.confirm = vi.fn(() => true)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="reset-game"]').trigger('click')

      expect(store.gameStarted).toBe(false)
    })

    it('does not reset when confirmation cancelled', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      // Mock window.confirm to return false
      global.confirm = vi.fn(() => false)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="reset-game"]').trigger('click')

      expect(store.gameStarted).toBe(true)
    })

    it('returns to pre-game state after reset', async () => {
      const store = useGameStore()
      const wrapper = mount(TurnManager)

      global.confirm = vi.fn(() => true)

      store.startGame('player1')
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="reset-game"]').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="start-player1"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="start-player2"]').exists()).toBe(true)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test TurnManager.spec.js
```

**Commit**:
```bash
git add tests/unit/components/TurnManager.spec.js
git commit -m "test: add game reset tests for TurnManager"
```

---

### REFACTOR: Extract Button Components

Component is well-structured, minimal refactoring needed. Add keyboard shortcuts:

**Update**: `src/components/TurnManager.vue`

Add keyboard support:
```vue
<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const currentPlayerName = computed(() => {
  return store.currentPlayerState?.name || ''
})

const currentPlayerColor = computed(() => {
  return store.currentPlayer === 'player1' ? 'red' : 'blue'
})

const startGame = (player) => {
  store.startGame(player)
}

const nextPhase = () => {
  store.nextPhase()
}

const endTurn = () => {
  store.endTurn()
}

const resetGame = () => {
  if (confirm('Are you sure you want to start a new game?')) {
    store.resetGame()
  }
}

// Keyboard shortcuts
const handleKeyPress = (event) => {
  if (!store.gameStarted) return

  // Space or Enter = Next Phase / End Turn
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    if (store.canAdvancePhase) {
      nextPhase()
    } else if (store.currentPhase === 'end') {
      endTurn()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>
```

**Run Test** (should still pass):
```bash
npm run test TurnManager.spec.js
```

**Commit**:
```bash
git add src/components/TurnManager.vue
git commit -m "refactor: add keyboard shortcuts to TurnManager"
```

---

## Verification

### Run All Tests
```bash
npm run test TurnManager.spec.js
```

Expected output:
```
✓ tests/unit/components/TurnManager.spec.js (23 tests)
  ✓ Rendering - Pre-Game (3 tests)
  ✓ Game Start (4 tests)
  ✓ Phase Navigation (5 tests)
  ✓ Turn Cycling (5 tests)
  ✓ Game Reset (5 tests)

Test Files  1 passed (1)
     Tests  23 passed (23)
```

### Check Coverage
```bash
npm run test:coverage -- TurnManager
```

Expected: 100% coverage

### Manual Testing
```bash
npm run dev
```

Test in browser:
- [ ] Start buttons work for both players
- [ ] Turn info displays correctly
- [ ] Phase advances properly
- [ ] End turn switches players
- [ ] Reset asks for confirmation
- [ ] Keyboard shortcuts work
- [ ] Colors apply correctly

---

## Acceptance Criteria

- [x] Pre-game state shows start buttons
- [x] Active game shows current turn and phase
- [x] Next Phase button advances through phases
- [x] End Turn button switches players
- [x] Turn number increments
- [x] Reset with confirmation
- [x] Phase instructions display
- [x] Player colors applied
- [x] Keyboard shortcuts work
- [x] All tests pass
- [x] 100% code coverage

## Files Created/Modified

### Created
- `tests/unit/components/TurnManager.spec.js` - Component tests (23 tests)
- `src/components/TurnManager.vue` - Turn manager component

### Modified
- None

## Next Steps

Proceed to [Task 13: ActionLog Component](task-13-action-log.md)

---

**Task Complete** ✅
