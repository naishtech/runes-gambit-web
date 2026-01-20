# Task 07: SharedManaPool Component (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 1.5 hours  
**Dependencies**: Task 03  
**Week**: 1

## Objective
Create the SharedManaPool component that displays and manages the shared mana pool accessible to both players, with manual adjustment controls, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering

#### RED: Write Rendering Tests
**File**: `tests/unit/components/SharedManaPool.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import SharedManaPool from '@/components/SharedManaPool.vue'
import { useGameStore } from '@/stores/gameStore'

describe('SharedManaPool Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders pool display', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="pool-display"]').exists()).toBe(true)
    })

    it('displays initial pool value from store', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('20')
    })

    it('renders increment button', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="increment-pool"]').exists()).toBe(true)
    })

    it('renders decrement button', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.find('[data-test="decrement-pool"]').exists()).toBe(true)
    })

    it('renders label', () => {
      const wrapper = mount(SharedManaPool)

      expect(wrapper.text()).toContain('Shared Mana Pool')
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test SharedManaPool.spec.js
```

#### GREEN: Create Component
**File**: `src/components/SharedManaPool.vue`
```vue
<template>
  <div class="shared-mana-pool">
    <div class="pool-label">Shared Mana Pool</div>
    <div class="pool-display-container">
      <button 
        class="pool-button decrement" 
        data-test="decrement-pool"
        @click="decrementPool"
      >
        -
      </button>
      <div class="pool-display" data-test="pool-display">
        {{ sharedManaPool }}
      </div>
      <button 
        class="pool-button increment" 
        data-test="increment-pool"
        @click="incrementPool"
      >
        +
      </button>
    </div>
    <div class="pool-subtitle">Tokens available to both players</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const sharedManaPool = computed(() => store.sharedManaPool)

const incrementPool = () => {
  store.adjustSharedManaPool(1)
}

const decrementPool = () => {
  store.adjustSharedManaPool(-1)
}
</script>

<style scoped>
.shared-mana-pool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #2196F3;
  min-width: 200px;
}

.pool-label {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1976D2;
}

.pool-display-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.pool-display {
  font-size: 3rem;
  font-weight: bold;
  color: #2196F3;
  min-width: 100px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
}

.pool-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #2196F3;
  background: white;
  font-size: 1.75rem;
  font-weight: bold;
  color: #2196F3;
  cursor: pointer;
  transition: all 0.2s;
}

.pool-button:hover {
  transform: scale(1.1);
  background: #E3F2FD;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

.pool-button:active {
  transform: scale(0.95);
}

.pool-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: scale(1);
}

.pool-subtitle {
  font-size: 0.75rem;
  color: #1976D2;
  opacity: 0.7;
  font-style: italic;
}
</style>
```

**Run Test** (should pass):
```bash
npm run test SharedManaPool.spec.js
```

**Commit**:
```bash
git add tests/unit/components/SharedManaPool.spec.js src/components/SharedManaPool.vue
git commit -m "feat: add basic SharedManaPool component with controls"
```

---

### Phase 2: Adjustment Tests

#### RED: Write Adjustment Tests
**Add to**: `tests/unit/components/SharedManaPool.spec.js`
```javascript
  describe('Pool Adjustment', () => {
    it('increments pool when + button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      const initialPool = store.sharedManaPool

      await wrapper.find('[data-test="increment-pool"]').trigger('click')

      expect(store.sharedManaPool).toBe(initialPool + 1)
    })

    it('decrements pool when - button clicked', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      const initialPool = store.sharedManaPool

      await wrapper.find('[data-test="decrement-pool"]').trigger('click')

      expect(store.sharedManaPool).toBe(initialPool - 1)
    })

    it('updates display when pool changes', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      store.sharedManaPool = 15
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('15')
    })

    it('can increment multiple times', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      const initialPool = store.sharedManaPool

      await wrapper.find('[data-test="increment-pool"]').trigger('click')
      await wrapper.find('[data-test="increment-pool"]').trigger('click')
      await wrapper.find('[data-test="increment-pool"]').trigger('click')

      expect(store.sharedManaPool).toBe(initialPool + 3)
    })

    it('calls store.adjustSharedManaPool on increment', async () => {
      const store = useGameStore()
      const adjustSpy = vi.spyOn(store, 'adjustSharedManaPool')

      const wrapper = mount(SharedManaPool)

      await wrapper.find('[data-test="increment-pool"]').trigger('click')

      expect(adjustSpy).toHaveBeenCalledWith(1)
    })

    it('calls store.adjustSharedManaPool on decrement', async () => {
      const store = useGameStore()
      const adjustSpy = vi.spyOn(store, 'adjustSharedManaPool')

      const wrapper = mount(SharedManaPool)

      await wrapper.find('[data-test="decrement-pool"]').trigger('click')

      expect(adjustSpy).toHaveBeenCalledWith(-1)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test SharedManaPool.spec.js
```

**Commit**:
```bash
git add tests/unit/components/SharedManaPool.spec.js
git commit -m "test: add pool adjustment tests for SharedManaPool"
```

---

### Phase 3: Boundary Tests

#### RED: Write Boundary Tests
**Add to**: `tests/unit/components/SharedManaPool.spec.js`
```javascript
  describe('Boundary Conditions', () => {
    it('disables decrement button when pool is 0', async () => {
      const store = useGameStore()
      store.sharedManaPool = 0

      const wrapper = mount(SharedManaPool)
      await wrapper.vm.$nextTick()

      const decrementButton = wrapper.find('[data-test="decrement-pool"]')
      expect(decrementButton.attributes('disabled')).toBeDefined()
    })

    it('enables decrement button when pool is above 0', async () => {
      const store = useGameStore()
      store.sharedManaPool = 5

      const wrapper = mount(SharedManaPool)
      await wrapper.vm.$nextTick()

      const decrementButton = wrapper.find('[data-test="decrement-pool"]')
      expect(decrementButton.attributes('disabled')).toBeUndefined()
    })

    it('does not decrement below 0', async () => {
      const store = useGameStore()
      store.sharedManaPool = 0

      const wrapper = mount(SharedManaPool)
      await wrapper.vm.$nextTick()

      await wrapper.find('[data-test="decrement-pool"]').trigger('click')

      expect(store.sharedManaPool).toBe(0)
    })

    it('handles large pool values', async () => {
      const store = useGameStore()
      store.sharedManaPool = 999

      const wrapper = mount(SharedManaPool)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('999')
    })
  })
```

**Run Test** (should fail - button not yet disabled):
```bash
npm run test SharedManaPool.spec.js
```

#### GREEN: Implement Boundary Logic
**Update**: `src/components/SharedManaPool.vue`

Update template:
```vue
<template>
  <div class="shared-mana-pool">
    <div class="pool-label">Shared Mana Pool</div>
    <div class="pool-display-container">
      <button 
        class="pool-button decrement" 
        data-test="decrement-pool"
        @click="decrementPool"
        :disabled="isPoolEmpty"
      >
        -
      </button>
      <div class="pool-display" data-test="pool-display">
        {{ sharedManaPool }}
      </div>
      <button 
        class="pool-button increment" 
        data-test="increment-pool"
        @click="incrementPool"
      >
        +
      </button>
    </div>
    <div class="pool-subtitle">Tokens available to both players</div>
  </div>
</template>
```

Update script:
```vue
<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const sharedManaPool = computed(() => store.sharedManaPool)
const isPoolEmpty = computed(() => store.sharedManaPool <= 0)

const incrementPool = () => {
  store.adjustSharedManaPool(1)
}

const decrementPool = () => {
  if (!isPoolEmpty.value) {
    store.adjustSharedManaPool(-1)
  }
}
</script>
```

**Run Test** (should pass):
```bash
npm run test SharedManaPool.spec.js
```

**Commit**:
```bash
git add tests/unit/components/SharedManaPool.spec.js src/components/SharedManaPool.vue
git commit -m "feat: add boundary protection to prevent negative pool"
```

---

### Phase 4: Reactivity Tests

#### RED: Write Reactivity Tests
**Add to**: `tests/unit/components/SharedManaPool.spec.js`
```javascript
  describe('Reactivity', () => {
    it('reacts to external pool changes from store', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      store.sharedManaPool = 10
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('10')
    })

    it('updates button state when pool becomes empty externally', async () => {
      const store = useGameStore()
      store.sharedManaPool = 5

      const wrapper = mount(SharedManaPool)
      await wrapper.vm.$nextTick()

      let decrementButton = wrapper.find('[data-test="decrement-pool"]')
      expect(decrementButton.attributes('disabled')).toBeUndefined()

      store.sharedManaPool = 0
      await wrapper.vm.$nextTick()

      decrementButton = wrapper.find('[data-test="decrement-pool"]')
      expect(decrementButton.attributes('disabled')).toBeDefined()
    })

    it('reflects multiple rapid changes', async () => {
      const store = useGameStore()
      const wrapper = mount(SharedManaPool)

      store.sharedManaPool = 5
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('5')

      store.sharedManaPool = 15
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('15')

      store.sharedManaPool = 3
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="pool-display"]').text()).toBe('3')
    })
  })
```

**Run Test** (should pass):
```bash
npm run test SharedManaPool.spec.js
```

**Commit**:
```bash
git add tests/unit/components/SharedManaPool.spec.js
git commit -m "test: add reactivity tests for SharedManaPool"
```

---

### REFACTOR: Add Visual Enhancement

**Update**: `src/components/SharedManaPool.vue`

Add transition for pool updates:
```vue
<template>
  <div class="shared-mana-pool">
    <div class="pool-label">Shared Mana Pool</div>
    <div class="pool-display-container">
      <button 
        class="pool-button decrement" 
        data-test="decrement-pool"
        @click="decrementPool"
        :disabled="isPoolEmpty"
      >
        -
      </button>
      <div 
        class="pool-display" 
        data-test="pool-display"
        :key="sharedManaPool"
      >
        {{ sharedManaPool }}
      </div>
      <button 
        class="pool-button increment" 
        data-test="increment-pool"
        @click="incrementPool"
      >
        +
      </button>
    </div>
    <div class="pool-subtitle">Tokens available to both players</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const sharedManaPool = computed(() => store.sharedManaPool)
const isPoolEmpty = computed(() => store.sharedManaPool <= 0)

const incrementPool = () => {
  store.adjustSharedManaPool(1)
}

const decrementPool = () => {
  if (!isPoolEmpty.value) {
    store.adjustSharedManaPool(-1)
  }
}
</script>

<style scoped>
.shared-mana-pool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #2196F3;
  min-width: 200px;
}

.pool-label {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1976D2;
}

.pool-display-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.pool-display {
  font-size: 3rem;
  font-weight: bold;
  color: #2196F3;
  min-width: 100px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
  animation: poolUpdate 0.4s ease;
}

@keyframes poolUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
    text-shadow: 0 0 20px rgba(33, 150, 243, 0.8);
  }
  100% {
    transform: scale(1);
  }
}

.pool-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #2196F3;
  background: white;
  font-size: 1.75rem;
  font-weight: bold;
  color: #2196F3;
  cursor: pointer;
  transition: all 0.2s;
}

.pool-button:hover:not(:disabled) {
  transform: scale(1.1);
  background: #E3F2FD;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

.pool-button:active:not(:disabled) {
  transform: scale(0.95);
}

.pool-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: scale(1);
}

.pool-subtitle {
  font-size: 0.75rem;
  color: #1976D2;
  opacity: 0.7;
  font-style: italic;
}
</style>
```

**Run Test** (should still pass):
```bash
npm run test SharedManaPool.spec.js
```

**Commit**:
```bash
git add src/components/SharedManaPool.vue
git commit -m "refactor: add visual animation to shared pool updates"
```

---

## Verification

### Run All Tests
```bash
npm run test SharedManaPool.spec.js
```

Expected output:
```
✓ tests/unit/components/SharedManaPool.spec.js (18 tests)
  ✓ Rendering (5 tests)
  ✓ Pool Adjustment (6 tests)
  ✓ Boundary Conditions (4 tests)
  ✓ Reactivity (3 tests)

Test Files  1 passed (1)
     Tests  18 passed (18)
```

### Check Coverage
```bash
npm run test:coverage -- SharedManaPool
```

Expected: 100% coverage on SharedManaPool.vue

### Manual Testing
```bash
npm run dev
```

Test in browser:
- [ ] Pool displays initial value (20)
- [ ] Increment button increases pool
- [ ] Decrement button decreases pool
- [ ] Decrement disabled at 0
- [ ] Animation plays on value change
- [ ] Cannot go below 0

---

## Acceptance Criteria

- [x] Component renders with pool display
- [x] Displays shared mana pool from store (initially 20)
- [x] Increment button adds 1 to pool
- [x] Decrement button removes 1 from pool
- [x] Decrement disabled when pool is 0
- [x] Cannot go below 0
- [x] Reactively updates when store changes
- [x] Visual feedback on changes
- [x] All tests pass
- [x] 100% code coverage

## Files Created/Modified

### Created
- `tests/unit/components/SharedManaPool.spec.js` - Component tests (18 tests)
- `src/components/SharedManaPool.vue` - Shared mana pool component

### Modified
- None

## Next Steps

Proceed to [Task 08: Mana Store Actions](task-08-mana-store-actions.md)

---

**Task Complete** ✅
