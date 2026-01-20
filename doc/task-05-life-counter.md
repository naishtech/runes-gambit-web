# Task 05: LifeCounter Component (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 2 hours  
**Dependencies**: Task 03  
**Week**: 1

## Objective
Create the LifeCounter component that displays and manages player life points with increment/decrement controls and visual warnings, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering and Display

#### RED: Write Rendering Tests
**File**: `tests/unit/components/LifeCounter.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import LifeCounter from '@/components/LifeCounter.vue'
import { useGameStore } from '@/stores/gameStore'

describe('LifeCounter Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders with initial life points', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="life-display"]').text()).toBe('20')
    })

    it('displays life from store', () => {
      const store = useGameStore()
      store.players.player1.lifePoints = 15

      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="life-display"]').text()).toBe('15')
    })

    it('renders increment button', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="increment-life"]').exists()).toBe(true)
    })

    it('renders decrement button', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="decrement-life"]').exists()).toBe(true)
    })

    it('applies player color class', () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.classes()).toContain('player-red')
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test LifeCounter.spec.js
```

#### GREEN: Create Component
**File**: `src/components/LifeCounter.vue`
```vue
<template>
  <div class="life-counter" :class="`player-${color}`">
    <div class="life-display-container">
      <button 
        class="life-button decrement" 
        data-test="decrement-life"
        @click="decrementLife"
      >
        -
      </button>
      <div class="life-display" data-test="life-display">
        {{ lifePoints }}
      </div>
      <button 
        class="life-button increment" 
        data-test="increment-life"
        @click="incrementLife"
      >
        +
      </button>
    </div>
    <div class="life-label">Life Points</div>
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

const lifePoints = computed(() => store.players[props.playerId].lifePoints)

const incrementLife = () => {
  store.adjustLife(props.playerId, 1)
}

const decrementLife = () => {
  store.adjustLife(props.playerId, -1)
}
</script>

<style scoped>
.life-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.life-display-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.life-display {
  font-size: 2.5rem;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
}

.life-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.life-button:hover {
  transform: scale(1.1);
  background: var(--hover-color);
}

.life-button:active {
  transform: scale(0.95);
}

.life-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.player-red {
  color: #D32F2F;
  --surface-color: #FFCDD2;
  --hover-color: #FFEBEE;
}

.player-blue {
  color: #1976D2;
  --surface-color: #BBDEFB;
  --hover-color: #E3F2FD;
}
</style>
```

**Run Test** (should pass):
```bash
npm run test LifeCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/LifeCounter.spec.js src/components/LifeCounter.vue
git commit -m "feat: add basic LifeCounter component with increment/decrement"
```

---

### Phase 2: Life Adjustment Tests

#### RED: Write Life Adjustment Tests
**Add to**: `tests/unit/components/LifeCounter.spec.js`
```javascript
  describe('Life Adjustment', () => {
    it('increments life when + button clicked', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      await wrapper.find('[data-test="increment-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(initialLife + 1)
    })

    it('decrements life when - button clicked', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      await wrapper.find('[data-test="decrement-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(initialLife - 1)
    })

    it('updates display when life changes', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 15
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="life-display"]').text()).toBe('15')
    })

    it('allows life to go negative', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 0

      await wrapper.find('[data-test="decrement-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(-1)
    })

    it('can increment multiple times', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      const initialLife = store.players.player1.lifePoints

      await wrapper.find('[data-test="increment-life"]').trigger('click')
      await wrapper.find('[data-test="increment-life"]').trigger('click')
      await wrapper.find('[data-test="increment-life"]').trigger('click')
      
      expect(store.players.player1.lifePoints).toBe(initialLife + 3)
    })
  })
```

**Run Test** (should pass - already implemented):
```bash
npm run test LifeCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/LifeCounter.spec.js
git commit -m "test: add life adjustment tests for LifeCounter"
```

---

### Phase 3: Warning States

#### RED: Write Warning State Tests
**Add to**: `tests/unit/components/LifeCounter.spec.js`
```javascript
  describe('Warning States', () => {
    it('applies warning class when life is below 5', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 4
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).toContain('life-warning')
    })

    it('applies critical class when life is 0 or below', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 0
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).toContain('life-critical')
    })

    it('does not apply warning class when life is 5 or above', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 5
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).not.toContain('life-warning')
    })

    it('critical takes precedence over warning', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 0
      await wrapper.vm.$nextTick()

      const display = wrapper.find('.life-display')
      expect(display.classes()).toContain('life-critical')
      expect(display.classes()).not.toContain('life-warning')
    })

    it('removes warning when life increases above threshold', async () => {
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const store = useGameStore()
      store.players.player1.lifePoints = 3
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).toContain('life-warning')

      store.players.player1.lifePoints = 10
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.life-display').classes()).not.toContain('life-warning')
    })
  })
```

**Run Test** (should fail):
```bash
npm run test LifeCounter.spec.js
```

#### GREEN: Implement Warning States
**Update**: `src/components/LifeCounter.vue`

Update template:
```vue
<template>
  <div class="life-counter" :class="`player-${color}`">
    <div class="life-display-container">
      <button 
        class="life-button decrement" 
        data-test="decrement-life"
        @click="decrementLife"
      >
        -
      </button>
      <div 
        class="life-display" 
        data-test="life-display"
        :class="lifeStatusClass"
      >
        {{ lifePoints }}
      </div>
      <button 
        class="life-button increment" 
        data-test="increment-life"
        @click="incrementLife"
      >
        +
      </button>
    </div>
    <div class="life-label">Life Points</div>
  </div>
</template>
```

Update script:
```vue
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

const lifePoints = computed(() => store.players[props.playerId].lifePoints)

const lifeStatusClass = computed(() => {
  const life = lifePoints.value
  if (life <= 0) return 'life-critical'
  if (life < 5) return 'life-warning'
  return ''
})

const incrementLife = () => {
  store.adjustLife(props.playerId, 1)
}

const decrementLife = () => {
  store.adjustLife(props.playerId, -1)
}
</script>
```

Update styles:
```vue
<style scoped>
.life-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.life-display-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.life-display {
  font-size: 2.5rem;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
  transition: all 0.3s ease;
}

.life-display.life-warning {
  color: #FF9800;
  animation: pulseWarning 2s ease-in-out infinite;
}

.life-display.life-critical {
  color: #F44336;
  animation: pulseCritical 1s ease-in-out infinite;
}

@keyframes pulseWarning {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes pulseCritical {
  0%, 100% {
    transform: scale(1);
    text-shadow: 0 0 5px rgba(244, 67, 54, 0.5);
  }
  50% {
    transform: scale(1.1);
    text-shadow: 0 0 15px rgba(244, 67, 54, 0.8);
  }
}

.life-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.life-button:hover {
  transform: scale(1.1);
  background: var(--hover-color);
}

.life-button:active {
  transform: scale(0.95);
}

.life-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.player-red {
  color: #D32F2F;
  --surface-color: #FFCDD2;
  --hover-color: #FFEBEE;
}

.player-blue {
  color: #1976D2;
  --surface-color: #BBDEFB;
  --hover-color: #E3F2FD;
}
</style>
```

**Run Test** (should pass):
```bash
npm run test LifeCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/LifeCounter.spec.js src/components/LifeCounter.vue
git commit -m "feat: add warning and critical states for life counter"
```

---

### Phase 4: Store Integration Test

#### RED: Write Store Integration Test
**Add to**: `tests/unit/components/LifeCounter.spec.js`
```javascript
  describe('Store Integration', () => {
    it('calls store.adjustLife with correct arguments on increment', async () => {
      const store = useGameStore()
      const adjustLifeSpy = vi.spyOn(store, 'adjustLife')

      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      await wrapper.find('[data-test="increment-life"]').trigger('click')

      expect(adjustLifeSpy).toHaveBeenCalledWith('player1', 1)
    })

    it('calls store.adjustLife with correct arguments on decrement', async () => {
      const store = useGameStore()
      const adjustLifeSpy = vi.spyOn(store, 'adjustLife')

      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      await wrapper.find('[data-test="decrement-life"]').trigger('click')

      expect(adjustLifeSpy).toHaveBeenCalledWith('player2', -1)
    })

    it('reacts to external life changes from store', async () => {
      const store = useGameStore()
      const wrapper = mount(LifeCounter, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      // External change
      store.players.player1.lifePoints = 7
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="life-display"]').text()).toBe('7')
    })
  })
```

**Run Test** (should pass):
```bash
npm run test LifeCounter.spec.js
```

**Commit**:
```bash
git add tests/unit/components/LifeCounter.spec.js
git commit -m "test: add store integration tests for LifeCounter"
```

---

### REFACTOR: Cleanup and Optimization

No significant refactoring needed - component is already well-structured.

---

## Verification

### Run All Tests
```bash
npm run test LifeCounter.spec.js
```

Expected output:
```
✓ tests/unit/components/LifeCounter.spec.js (18 tests)
  ✓ Rendering (5 tests)
  ✓ Life Adjustment (5 tests)
  ✓ Warning States (5 tests)
  ✓ Store Integration (3 tests)

Test Files  1 passed (1)
     Tests  18 passed (18)
```

### Check Coverage
```bash
npm run test:coverage -- LifeCounter
```

Expected: 100% coverage on LifeCounter.vue

### Manual Testing
```bash
npm run dev
```

Test in browser:
- [ ] Life counter displays correctly
- [ ] Increment button increases life
- [ ] Decrement button decreases life
- [ ] Display updates reactively
- [ ] Warning state (orange) appears below 5 life
- [ ] Critical state (red, pulsing) appears at 0 or below
- [ ] Colors match player colors (red/blue)

---

## Acceptance Criteria

- [x] Component renders with initial life (20)
- [x] Displays current life from store
- [x] Increment button adds 1 life
- [x] Decrement button removes 1 life
- [x] Life can go negative
- [x] Warning visual state when life < 5
- [x] Critical visual state when life <= 0
- [x] Player color applied correctly
- [x] All tests pass
- [x] 100% code coverage
- [x] Store integration working

## Files Created/Modified

### Created
- `tests/unit/components/LifeCounter.spec.js` - Component tests (18 tests)
- `src/components/LifeCounter.vue` - Life counter component

### Modified
- None

## Next Steps

Proceed to [Task 06: ManaCounter Component](task-06-mana-counter.md)

---

**Task Complete** ✅
