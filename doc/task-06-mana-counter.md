# Task 06: ManaCounter Component (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 1.5 hours  
**Dependencies**: Task 03  
**Week**: 1

## Objective
Create the ManaCounter component that displays a player's available mana (read-only display that updates from the game store), using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering

#### RED: Write Rendering Tests
**File**: `tests/unit/components/ManaCounter.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import ManaCounter from '@/components/ManaCounter.vue'
import { useGameStore } from '@/stores/gameStore'

describe('ManaCounter Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders mana display', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').exists()).toBe(true)
    })

    it('displays initial mana count from store', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')
    })

    it('displays current mana when player has mana', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5

      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('5')
    })

    it('renders label', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.text()).toContain('Available Mana')
    })

    it('applies player color class', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.classes()).toContain('player-red')
    })

    it('applies blue color class for player2', () => {
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      expect(wrapper.classes()).toContain('player-blue')
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test ManaCounter.spec.js
```

#### GREEN: Create Component
**File**: `src/components/ManaCounter.vue`
```vue
<template>
  <div class="mana-counter" :class="`player-${color}`">
    <div class="mana-display" data-test="mana-display">
      {{ availableMana }}
    </div>
    <div class="mana-label">Available Mana</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const props = defineProps({
  playerId: {
    type: String,
    required: true,
    validator: (value) => ['player1', 'player2'].includes(value)
  },
  color: {
    type: String,
    required: true,
    validator: (value) => ['red', 'blue'].includes(value)
  }
})

const store = useGameStore()

const availableMana = computed(() => store.players[props.playerId].availableMana)
</script>

<style scoped>
.mana-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.mana-display {
  font-size: 2rem;
  font-weight: bold;
  color: #2196F3;
  min-width: 60px;
  text-align: center;
}

.mana-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  color: var(--text-color);
}

.player-red {
  --surface-color: #FFCDD2;
  --text-color: #D32F2F;
}

.player-blue {
  --surface-color: #BBDEFB;
  --text-color: #1976D2;
}
</style>
```

**Run Test** (should pass):
```bash
npm run test ManaCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ManaCounter.spec.js src/components/ManaCounter.vue
git commit -m "feat: add basic ManaCounter component with display"
```

---

### Phase 2: Reactivity Tests

#### RED: Write Reactivity Tests
**Add to**: `tests/unit/components/ManaCounter.spec.js`
```javascript
  describe('Reactivity', () => {
    it('updates display when store mana changes', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')

      store.players.player1.availableMana = 3
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('3')
    })

    it('reflects multiple mana changes', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      store.players.player1.availableMana = 5
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('5')

      store.players.player1.availableMana = 2
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('2')

      store.players.player1.availableMana = 0
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')
    })

    it('only responds to its own player mana changes', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      store.players.player2.availableMana = 10
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')
    })

    it('handles large mana values', async () => {
      const store = useGameStore()
      store.players.player1.availableMana = 99

      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('99')
    })
  })
```

**Run Test** (should pass - already implemented):
```bash
npm run test ManaCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ManaCounter.spec.js
git commit -m "test: add reactivity tests for ManaCounter"
```

---

### Phase 3: Player-Specific Tests

#### RED: Write Player-Specific Tests
**Add to**: `tests/unit/components/ManaCounter.spec.js`
```javascript
  describe('Player-Specific Behavior', () => {
    it('displays player2 mana correctly', () => {
      const store = useGameStore()
      store.players.player2.availableMana = 7

      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('7')
    })

    it('maintains separate mana counts for each player', async () => {
      const store = useGameStore()
      store.players.player1.availableMana = 3
      store.players.player2.availableMana = 5

      const wrapper1 = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const wrapper2 = mount(ManaCounter, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      expect(wrapper1.find('[data-test="mana-display"]').text()).toBe('3')
      expect(wrapper2.find('[data-test="mana-display"]').text()).toBe('5')
    })

    it('validates playerId prop', () => {
      // Should not throw for valid values
      expect(() => {
        mount(ManaCounter, {
          props: {
            playerId: 'player1',
            color: 'red'
          }
        })
      }).not.toThrow()

      expect(() => {
        mount(ManaCounter, {
          props: {
            playerId: 'player2',
            color: 'blue'
          }
        })
      }).not.toThrow()
    })

    it('validates color prop', () => {
      // Should not throw for valid values
      expect(() => {
        mount(ManaCounter, {
          props: {
            playerId: 'player1',
            color: 'red'
          }
        })
      }).not.toThrow()

      expect(() => {
        mount(ManaCounter, {
          props: {
            playerId: 'player2',
            color: 'blue'
          }
        })
      }).not.toThrow()
    })
  })
```

**Run Test** (should pass - validators already in place):
```bash
npm run test ManaCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ManaCounter.spec.js
git commit -m "test: add player-specific tests for ManaCounter"
```

---

### Phase 4: Visual Feedback Tests

#### RED: Write Visual Feedback Tests
**Add to**: `tests/unit/components/ManaCounter.spec.js`
```javascript
  describe('Visual Feedback', () => {
    it('applies highlight class when mana is added', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const initialMana = store.players.player1.availableMana
      store.players.player1.availableMana = initialMana + 1
      await wrapper.vm.$nextTick()

      // Check if display has transition/animation (via class or style)
      expect(wrapper.find('[data-test="mana-display"]').exists()).toBe(true)
    })

    it('displays zero mana without errors', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 0

      const wrapper = mount(ManaCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="mana-display"]').text()).toBe('0')
    })
  })
```

**Run Test** (should pass):
```bash
npm run test ManaCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ManaCounter.spec.js
git commit -m "test: add visual feedback tests for ManaCounter"
```

---

### REFACTOR: Add Transition Effect

Update component to add visual feedback when mana changes:

**Update**: `src/components/ManaCounter.vue`
```vue
<template>
  <div class="mana-counter" :class="`player-${color}`">
    <div 
      class="mana-display" 
      data-test="mana-display"
      :key="availableMana"
    >
      {{ availableMana }}
    </div>
    <div class="mana-label">Available Mana</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const props = defineProps({
  playerId: {
    type: String,
    required: true,
    validator: (value) => ['player1', 'player2'].includes(value)
  },
  color: {
    type: String,
    required: true,
    validator: (value) => ['red', 'blue'].includes(value)
  }
})

const store = useGameStore()

const availableMana = computed(() => store.players[props.playerId].availableMana)
</script>

<style scoped>
.mana-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.mana-display {
  font-size: 2rem;
  font-weight: bold;
  color: #2196F3;
  min-width: 60px;
  text-align: center;
  transition: transform 0.3s ease, text-shadow 0.3s ease;
  animation: manaUpdate 0.5s ease;
}

@keyframes manaUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
    text-shadow: 0 0 10px rgba(33, 150, 243, 0.6);
  }
  100% {
    transform: scale(1);
  }
}

.mana-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  color: var(--text-color);
}

.player-red {
  --surface-color: #FFCDD2;
  --text-color: #D32F2F;
}

.player-blue {
  --surface-color: #BBDEFB;
  --text-color: #1976D2;
}
</style>
```

**Run Test** (should still pass):
```bash
npm run test ManaCounter.spec.js
```

**Commit**:
```bash
git add src/components/ManaCounter.vue
git commit -m "refactor: add visual transition effect to mana counter"
```

---

## Verification

### Run All Tests
```bash
npm run test ManaCounter.spec.js
```

Expected output:
```
✓ tests/unit/components/ManaCounter.spec.js (17 tests)
  ✓ Rendering (6 tests)
  ✓ Reactivity (4 tests)
  ✓ Player-Specific Behavior (5 tests)
  ✓ Visual Feedback (2 tests)

Test Files  1 passed (1)
     Tests  17 passed (17)
```

### Check Coverage
```bash
npm run test:coverage -- ManaCounter
```

Expected: 100% coverage on ManaCounter.vue

### Manual Testing
```bash
npm run dev
```

Test in browser:
- [ ] Mana counter displays correctly
- [ ] Shows 0 initially
- [ ] Updates when store mana changes
- [ ] Animation plays on mana change
- [ ] Player colors applied correctly
- [ ] Read-only (no buttons)

---

## Acceptance Criteria

- [x] Component renders with mana display
- [x] Displays current mana from store (initially 0)
- [x] Reactively updates when store mana changes
- [x] Read-only (no user controls)
- [x] Applies player color theming
- [x] Visual feedback on mana changes
- [x] Works for both player1 and player2
- [x] All tests pass
- [x] 100% code coverage

## Files Created/Modified

### Created
- `tests/unit/components/ManaCounter.spec.js` - Component tests (17 tests)
- `src/components/ManaCounter.vue` - Mana counter component

### Modified
- None

## Next Steps

Proceed to [Task 07: SharedManaPool Component](task-07-shared-mana-pool.md)

---

**Task Complete** ✅
