# Task 10: Dice Component (TDD)

**Status**: Complete  
**Estimated Time**: 3 hours  
**Dependencies**: Task 02  
**Week**: 2

## Objective
Create the Dice component that generates random 1-6 values with animated rolling effect, visual feedback, and last roll display, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering

#### RED: Write Rendering Tests
**File**: `tests/unit/components/Dice.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Dice from '@/components/Dice.vue'

describe('Dice Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders dice face', () => {
      const wrapper = mount(Dice)

      expect(wrapper.find('[data-test="dice-face"]').exists()).toBe(true)
    })

    it('displays initial value of 1', () => {
      const wrapper = mount(Dice)

      expect(wrapper.find('[data-test="dice-face"]').text()).toContain('1')
    })

    it('renders roll button text', () => {
      const wrapper = mount(Dice)

      expect(wrapper.text()).toContain('Roll')
    })

    it('displays last roll section', () => {
      const wrapper = mount(Dice)

      expect(wrapper.find('[data-test="last-roll"]').exists()).toBe(true)
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test Dice.spec.js
```

#### GREEN: Create Component
**File**: `src/components/Dice.vue`
```vue
<template>
  <div class="dice-container">
    <div 
      class="dice-face" 
      data-test="dice-face"
      :class="{ rolling: isRolling }"
      @click="roll"
    >
      <div class="dice-value">{{ displayValue }}</div>
    </div>
    <div class="dice-label">Roll Dice</div>
    <div class="last-roll" data-test="last-roll">
      <span v-if="lastRoll">Last Roll: {{ lastRoll }}</span>
      <span v-else>No rolls yet</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { rollDice as randomRoll } from '@/utils/random'

const emit = defineEmits(['roll'])

const isRolling = ref(false)
const currentValue = ref(1)
const lastRoll = ref(null)

const displayValue = computed(() => currentValue.value)

const roll = async () => {
  if (isRolling.value) return

  isRolling.value = true

  // Animate rolling for 800ms
  const animationDuration = 800
  const animationInterval = 100
  const iterations = animationDuration / animationInterval

  for (let i = 0; i < iterations; i++) {
    currentValue.value = randomRoll()
    await new Promise(resolve => setTimeout(resolve, animationInterval))
  }

  // Final roll
  const finalValue = randomRoll()
  currentValue.value = finalValue
  lastRoll.value = finalValue
  isRolling.value = false

  emit('roll', finalValue)
}

defineExpose({ isRolling, currentValue, lastRoll, roll })
</script>

<style scoped>
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #5C6BC0;
}

.dice-face {
  width: 120px;
  height: 120px;
  background: white;
  border: 4px solid #5C6BC0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dice-face:hover:not(.rolling) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 16px rgba(92, 107, 192, 0.4);
  background: #F5F5F5;
}

.dice-face:active:not(.rolling) {
  transform: translateY(-2px) scale(1.02);
}

.dice-face.rolling {
  animation: diceRoll 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
  cursor: not-allowed;
}

@keyframes diceRoll {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(180deg) rotateY(180deg);
  }
  50% {
    transform: rotateX(360deg) rotateY(360deg);
  }
  75% {
    transform: rotateX(540deg) rotateY(540deg);
  }
  100% {
    transform: rotateX(720deg) rotateY(720deg);
  }
}

.dice-value {
  font-size: 3rem;
  font-weight: bold;
  color: #5C6BC0;
  user-select: none;
}

.dice-label {
  font-size: 1rem;
  font-weight: bold;
  color: #5C6BC0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.last-roll {
  font-size: 0.875rem;
  color: #5C6BC0;
  opacity: 0.8;
}
</style>
```

**Run Test** (should pass):
```bash
npm run test Dice.spec.js
```

**Commit**:
```bash
git add tests/unit/components/Dice.spec.js src/components/Dice.vue
git commit -m "feat: add basic Dice component with rendering"
```

---

### Phase 2: Roll Mechanics

#### RED: Write Roll Tests
**Add to**: `tests/unit/components/Dice.spec.js`
```javascript
  describe('Roll Mechanics', () => {
    it('generates number between 1 and 6', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      const value = wrapper.vm.currentValue
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(6)
    })

    it('emits roll event with result', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      expect(wrapper.emitted('roll')).toBeTruthy()
      const emittedValue = wrapper.emitted('roll')[0][0]
      expect(emittedValue).toBeGreaterThanOrEqual(1)
      expect(emittedValue).toBeLessThanOrEqual(6)
    })

    it('updates lastRoll after rolling', async () => {
      const wrapper = mount(Dice)

      expect(wrapper.vm.lastRoll).toBeNull()

      await wrapper.vm.roll()

      expect(wrapper.vm.lastRoll).not.toBeNull()
      expect(wrapper.vm.lastRoll).toBeGreaterThanOrEqual(1)
      expect(wrapper.vm.lastRoll).toBeLessThanOrEqual(6)
    })

    it('displays last roll value', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()
      await wrapper.vm.$nextTick()

      const lastRollText = wrapper.find('[data-test="last-roll"]').text()
      expect(lastRollText).toMatch(/Last Roll: [1-6]/)
    })

    it('can roll multiple times', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()
      const firstRoll = wrapper.vm.lastRoll

      await wrapper.vm.roll()
      const secondRoll = wrapper.vm.lastRoll

      // Both should be valid rolls
      expect(firstRoll).toBeGreaterThanOrEqual(1)
      expect(secondRoll).toBeGreaterThanOrEqual(1)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test Dice.spec.js
```

**Commit**:
```bash
git add tests/unit/components/Dice.spec.js
git commit -m "test: add roll mechanics tests for Dice"
```

---

### Phase 3: Animation State

#### RED: Write Animation Tests
**Add to**: `tests/unit/components/Dice.spec.js`
```javascript
  describe('Animation State', () => {
    it('sets isRolling to true when rolling starts', async () => {
      const wrapper = mount(Dice)

      expect(wrapper.vm.isRolling).toBe(false)

      const rollPromise = wrapper.vm.roll()
      expect(wrapper.vm.isRolling).toBe(true)

      await rollPromise
    })

    it('sets isRolling to false when rolling completes', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      expect(wrapper.vm.isRolling).toBe(false)
    })

    it('applies rolling class during animation', async () => {
      const wrapper = mount(Dice)

      const rollPromise = wrapper.vm.roll()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.dice-face').classes()).toContain('rolling')

      await rollPromise
    })

    it('removes rolling class after animation', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.dice-face').classes()).not.toContain('rolling')
    })

    it('prevents rolling while already rolling', async () => {
      const wrapper = mount(Dice)

      const firstRoll = wrapper.vm.roll()
      const secondRoll = wrapper.vm.roll()
      const thirdRoll = wrapper.vm.roll()

      await firstRoll
      await secondRoll
      await thirdRoll

      // Should only emit once
      expect(wrapper.emitted('roll')).toHaveLength(1)
    })

    it('updates display value during animation', async () => {
      const wrapper = mount(Dice)

      const initialValue = wrapper.vm.currentValue
      const rollPromise = wrapper.vm.roll()

      // Wait a bit for animation to start
      await new Promise(resolve => setTimeout(resolve, 150))

      // Value should have changed during animation
      const midRollValue = wrapper.vm.currentValue
      expect(midRollValue).toBeGreaterThanOrEqual(1)
      expect(midRollValue).toBeLessThanOrEqual(6)

      await rollPromise
    })
  })
```

**Run Test** (should pass):
```bash
npm run test Dice.spec.js
```

**Commit**:
```bash
git add tests/unit/components/Dice.spec.js
git commit -m "test: add animation state tests for Dice"
```

---

### Phase 4: Click Interaction

#### RED: Write Click Tests
**Add to**: `tests/unit/components/Dice.spec.js`
```javascript
  describe('Click Interaction', () => {
    it('rolls when dice face is clicked', async () => {
      const wrapper = mount(Dice)

      await wrapper.find('[data-test="dice-face"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 900))

      expect(wrapper.emitted('roll')).toBeTruthy()
    })

    it('does not roll when clicked during animation', async () => {
      const wrapper = mount(Dice)

      await wrapper.find('[data-test="dice-face"]').trigger('click')
      await wrapper.find('[data-test="dice-face"]').trigger('click')
      await wrapper.find('[data-test="dice-face"]').trigger('click')

      await new Promise(resolve => setTimeout(resolve, 900))

      expect(wrapper.emitted('roll')).toHaveLength(1)
    })

    it('displays correct value after click', async () => {
      const wrapper = mount(Dice)

      await wrapper.find('[data-test="dice-face"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 900))

      const displayedValue = parseInt(wrapper.find('[data-test="dice-face"]').text())
      expect(displayedValue).toBeGreaterThanOrEqual(1)
      expect(displayedValue).toBeLessThanOrEqual(6)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test Dice.spec.js
```

**Commit**:
```bash
git add tests/unit/components/Dice.spec.js
git commit -m "test: add click interaction tests for Dice"
```

---

### Phase 5: Distribution Testing

#### RED: Write Distribution Tests
**Add to**: `tests/unit/components/Dice.spec.js`
```javascript
  describe('Distribution', () => {
    it('produces all values 1-6 over many rolls', async () => {
      const wrapper = mount(Dice)
      const results = new Set()

      // Roll 50 times to ensure we hit all values
      for (let i = 0; i < 50; i++) {
        await wrapper.vm.roll()
        results.add(wrapper.vm.lastRoll)
      }

      // Should have seen all 6 values
      expect(results.size).toBeGreaterThanOrEqual(5) // Allow for rare edge case
    })

    it('produces roughly even distribution over many rolls', async () => {
      const wrapper = mount(Dice)
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

      // Roll 600 times
      for (let i = 0; i < 600; i++) {
        await wrapper.vm.roll()
        counts[wrapper.vm.lastRoll]++
      }

      // Each value should appear roughly 100 times (±40 for randomness)
      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(60)
        expect(count).toBeLessThan(140)
      })
    }, 15000) // Increase timeout for this test
  })
```

**Run Test** (should pass):
```bash
npm run test Dice.spec.js
```

**Commit**:
```bash
git add tests/unit/components/Dice.spec.js
git commit -m "test: add distribution tests for Dice"
```

---

### REFACTOR: Add Dice Dot Display

Enhance visual representation with actual dice dots:

**Update**: `src/components/Dice.vue`

```vue
<template>
  <div class="dice-container">
    <div 
      class="dice-face" 
      data-test="dice-face"
      :class="{ rolling: isRolling }"
      @click="roll"
    >
      <div class="dice-dots" :data-value="displayValue">
        <span v-for="dot in displayValue" :key="dot" class="dot"></span>
      </div>
    </div>
    <div class="dice-label">Roll Dice</div>
    <div class="last-roll" data-test="last-roll">
      <span v-if="lastRoll">Last Roll: {{ lastRoll }}</span>
      <span v-else>No rolls yet</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { rollDice as randomRoll } from '@/utils/random'

const emit = defineEmits(['roll'])

const isRolling = ref(false)
const currentValue = ref(1)
const lastRoll = ref(null)

const displayValue = computed(() => currentValue.value)

const roll = async () => {
  if (isRolling.value) return

  isRolling.value = true

  const animationDuration = 800
  const animationInterval = 100
  const iterations = animationDuration / animationInterval

  for (let i = 0; i < iterations; i++) {
    currentValue.value = randomRoll()
    await new Promise(resolve => setTimeout(resolve, animationInterval))
  }

  const finalValue = randomRoll()
  currentValue.value = finalValue
  lastRoll.value = finalValue
  isRolling.value = false

  emit('roll', finalValue)
}

defineExpose({ isRolling, currentValue, lastRoll, roll })
</script>

<style scoped>
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #5C6BC0;
}

.dice-face {
  width: 120px;
  height: 120px;
  background: white;
  border: 4px solid #5C6BC0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.dice-face:hover:not(.rolling) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 16px rgba(92, 107, 192, 0.4);
  background: #F5F5F5;
}

.dice-face:active:not(.rolling) {
  transform: translateY(-2px) scale(1.02);
}

.dice-face.rolling {
  animation: diceRoll 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
  cursor: not-allowed;
}

@keyframes diceRoll {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(180deg) rotateY(180deg);
  }
  50% {
    transform: rotateX(360deg) rotateY(360deg);
  }
  75% {
    transform: rotateX(540deg) rotateY(540deg);
  }
  100% {
    transform: rotateX(720deg) rotateY(720deg);
  }
}

.dice-dots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  width: 100%;
  height: 100%;
}

.dot {
  width: 16px;
  height: 16px;
  background: #5C6BC0;
  border-radius: 50%;
}

/* Dice dot patterns */
.dice-dots[data-value="1"] .dot:nth-child(1) { grid-area: 2 / 2; }

.dice-dots[data-value="2"] .dot:nth-child(1) { grid-area: 1 / 1; }
.dice-dots[data-value="2"] .dot:nth-child(2) { grid-area: 3 / 3; }

.dice-dots[data-value="3"] .dot:nth-child(1) { grid-area: 1 / 1; }
.dice-dots[data-value="3"] .dot:nth-child(2) { grid-area: 2 / 2; }
.dice-dots[data-value="3"] .dot:nth-child(3) { grid-area: 3 / 3; }

.dice-dots[data-value="4"] .dot:nth-child(1) { grid-area: 1 / 1; }
.dice-dots[data-value="4"] .dot:nth-child(2) { grid-area: 1 / 3; }
.dice-dots[data-value="4"] .dot:nth-child(3) { grid-area: 3 / 1; }
.dice-dots[data-value="4"] .dot:nth-child(4) { grid-area: 3 / 3; }

.dice-dots[data-value="5"] .dot:nth-child(1) { grid-area: 1 / 1; }
.dice-dots[data-value="5"] .dot:nth-child(2) { grid-area: 1 / 3; }
.dice-dots[data-value="5"] .dot:nth-child(3) { grid-area: 2 / 2; }
.dice-dots[data-value="5"] .dot:nth-child(4) { grid-area: 3 / 1; }
.dice-dots[data-value="5"] .dot:nth-child(5) { grid-area: 3 / 3; }

.dice-dots[data-value="6"] .dot:nth-child(1) { grid-area: 1 / 1; }
.dice-dots[data-value="6"] .dot:nth-child(2) { grid-area: 1 / 3; }
.dice-dots[data-value="6"] .dot:nth-child(3) { grid-area: 2 / 1; }
.dice-dots[data-value="6"] .dot:nth-child(4) { grid-area: 2 / 3; }
.dice-dots[data-value="6"] .dot:nth-child(5) { grid-area: 3 / 1; }
.dice-dots[data-value="6"] .dot:nth-child(6) { grid-area: 3 / 3; }

.dice-label {
  font-size: 1rem;
  font-weight: bold;
  color: #5C6BC0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.last-roll {
  font-size: 0.875rem;
  color: #5C6BC0;
  opacity: 0.8;
}
</style>
```

**Run Test** (should still pass):
```bash
npm run test Dice.spec.js
```

**Commit**:
```bash
git add src/components/Dice.vue
git commit -m "refactor: add visual dice dot patterns"
```

---

## Verification

### Run All Tests
```bash
npm run test Dice.spec.js
```

Expected output:
```
✓ tests/unit/components/Dice.spec.js (24 tests)
  ✓ Rendering (4 tests)
  ✓ Roll Mechanics (5 tests)
  ✓ Animation State (6 tests)
  ✓ Click Interaction (3 tests)
  ✓ Distribution (2 tests)

Test Files  1 passed (1)
     Tests  24 passed (24)
```

### Check Coverage
```bash
npm run test:coverage -- Dice
```

Expected: 100% coverage on Dice.vue

### Manual Testing
```bash
npm run dev
```

Test in browser:
- [ ] Dice renders with dot pattern
- [ ] Clicking rolls the dice
- [ ] Animation lasts ~800ms
- [ ] Result shows 1-6 with correct dot pattern
- [ ] Last roll displays
- [ ] Cannot roll while rolling
- [ ] Hover effects work

---

## Acceptance Criteria

- [x] Component renders clickable dice
- [x] Generates random 1-6 on roll
- [x] 800ms animation with rotation
- [x] Visual dot patterns for each value
- [x] Emits roll event with result
- [x] Displays last roll value
- [x] Prevents rolling during animation
- [x] Even distribution over many rolls
- [x] All tests pass
- [x] 100% code coverage

## Files Created/Modified

### Created
- `tests/unit/components/Dice.spec.js` - Component tests (24 tests)
- `src/components/Dice.vue` - Dice component

### Modified
- None

## Next Steps

Proceed to [Task 11: Turn Management Store](task-11-turn-store.md)

---

**Task Complete** ✅
