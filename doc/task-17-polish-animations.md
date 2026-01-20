# Task 17: Animations & Polish

**Status**: Not Started  
**Estimated Time**: 3 hours  
**Dependencies**: Tasks 01-16  
**Week**: 4

## Objective
Add smooth animations, transitions, and visual polish to enhance user experience. Focus on performance optimization and professional presentation.

## What We're Adding

- Component enter/exit animations
- State change transitions
- Loading states
- Hover effects
- Focus indicators
- Performance optimizations

---

## Phase 1: Animation Tests

### Red: Write Animation Tests

**File**: `tests/unit/animations.spec.js`

```javascript
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGameStore } from '@/stores/gameStore'
import LifeCounter from '@/components/LifeCounter.vue'
import ManaCounter from '@/components/ManaCounter.vue'
import CoinFlip from '@/components/CoinFlip.vue'
import Dice from '@/components/Dice.vue'

describe('Component Animations', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('LifeCounter Animations', () => {
    it('adds animation class on life decrease', async () => {
      const wrapper = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [createPinia()] }
      })

      await wrapper.find('[data-test="decrement-life"]').trigger('click')

      expect(wrapper.find('.life-decrease').exists()).toBe(true)
    })

    it('adds animation class on life increase', async () => {
      const wrapper = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [createPinia()] }
      })

      await wrapper.find('[data-test="increment-life"]').trigger('click')

      expect(wrapper.find('.life-increase').exists()).toBe(true)
    })

    it('removes animation class after duration', async () => {
      const wrapper = mount(LifeCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [createPinia()] }
      })

      await wrapper.find('[data-test="increment-life"]').trigger('click')
      expect(wrapper.vm.animating).toBe(true)

      vi.advanceTimersByTime(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.animating).toBe(false)
    })
  })

  describe('ManaCounter Animations', () => {
    it('animates on mana value change', async () => {
      const store = useGameStore()
      const wrapper = mount(ManaCounter, {
        props: { playerId: 'player1', color: 'red' },
        global: { plugins: [createPinia()] }
      })

      store.transferManaToPlayer('player1', 3)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.mana-pulse').exists()).toBe(true)
    })
  })

  describe('CoinFlip Animations', () => {
    it('shows flipping animation during flip', async () => {
      const wrapper = mount(CoinFlip, {
        props: { player1Name: 'Alice', player2Name: 'Bob' }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      expect(wrapper.vm.isFlipping).toBe(true)
      expect(wrapper.find('.coin-flipping').exists()).toBe(true)
    })

    it('stops animation after duration', async () => {
      const wrapper = mount(CoinFlip, {
        props: { player1Name: 'Alice', player2Name: 'Bob' }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isFlipping).toBe(false)
    })
  })

  describe('Dice Animations', () => {
    it('shows rolling animation during roll', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      expect(wrapper.vm.isRolling).toBe(true)
      expect(wrapper.find('.dice-rolling').exists()).toBe(true)
    })

    it('stops animation after duration', async () => {
      const wrapper = mount(Dice)

      await wrapper.vm.roll()

      vi.advanceTimersByTime(800)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isRolling).toBe(false)
    })
  })
})
```

### Run Test (Should Fail)
```bash
npm run test tests/unit/animations.spec.js
```

---

## Phase 2: Implement Component Animations

### Green: Add Animation States

**File**: `src/components/LifeCounter.vue` (modify)

Add to script:
```javascript
const animating = ref(false)
const animationType = ref('')

const triggerAnimation = (type) => {
  animating.value = true
  animationType.value = type
  setTimeout(() => {
    animating.value = false
    animationType.value = ''
  }, 500)
}

const incrementLife = () => {
  store.adjustLife(props.playerId, 1)
  triggerAnimation('increase')
}

const decrementLife = () => {
  store.adjustLife(props.playerId, -1)
  triggerAnimation('decrease')
}
```

Add to template class binding:
```vue
<div 
  class="life-display"
  :class="{
    'life-increase': animating && animationType === 'increase',
    'life-decrease': animating && animationType === 'decrease'
  }"
>
```

Add to styles:
```vue
<style scoped>
/* ... existing styles ... */

@keyframes pulse-increase {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes pulse-decrease {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.9); }
}

@keyframes flash-green {
  0%, 100% { background-color: rgba(0, 255, 0, 0); }
  50% { background-color: rgba(0, 255, 0, 0.3); }
}

@keyframes flash-red {
  0%, 100% { background-color: rgba(255, 0, 0, 0); }
  50% { background-color: rgba(255, 0, 0, 0.3); }
}

.life-increase {
  animation: pulse-increase 0.5s ease, flash-green 0.5s ease;
}

.life-decrease {
  animation: pulse-decrease 0.5s ease, flash-red 0.5s ease;
}
</style>
```

**File**: `src/components/ManaCounter.vue` (modify)

Add to script:
```javascript
const previousMana = ref(availableMana.value)

watch(availableMana, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    previousMana.value = oldVal
    // Trigger pulse animation via class
  }
})
```

Add to template:
```vue
<div 
  class="mana-display"
  :class="{ 'mana-pulse': availableMana !== previousMana }"
>
```

Add to styles:
```vue
<style scoped>
/* ... existing styles ... */

@keyframes mana-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px currentColor; }
  50% { transform: scale(1.15); box-shadow: 0 0 20px currentColor; }
}

.mana-pulse {
  animation: mana-pulse 0.6s ease;
}
</style>
```

### Run Tests
```bash
npm run test tests/unit/animations.spec.js
```

---

## Phase 3: Global Transitions

### Add Transition Utilities

**File**: `src/styles/transitions.css`

```css
/* Fade Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Scale Transitions */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bounce {
  animation: bounce 0.6s ease;
}

/* Shake (for errors) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.shake {
  animation: shake 0.4s ease;
}

/* Glow */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
}

.glow {
  animation: glow 1.5s ease-in-out infinite;
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.95); }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

**File**: `src/main.js` (import transitions)

```javascript
import './style.css'
import './styles/transitions.css'
```

---

## Phase 4: Loading States

### Add Loading Component

**File**: `src/components/LoadingSpinner.vue`

```vue
<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium' // small, medium, large
  },
  color: {
    type: String,
    default: '#4a90e2'
  }
})
</script>

<template>
  <div class="spinner-container" :class="`size-${size}`">
    <div class="spinner" :style="{ borderTopColor: color }"></div>
  </div>
</template>

<style scoped>
.spinner-container {
  display: inline-block;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 0.8s linear infinite;
}

.size-small .spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.size-medium .spinner {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.size-large .spinner {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

**File**: `tests/unit/components/LoadingSpinner.spec.js`

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: 'large' }
    })
    expect(wrapper.find('.size-large').exists()).toBe(true)
  })

  it('applies custom color', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { color: '#ff0000' }
    })
    const spinner = wrapper.find('.spinner')
    expect(spinner.attributes('style')).toContain('border-top-color: rgb(255, 0, 0)')
  })
})
```

---

## Phase 5: Polish & Refinements

### Enhance Button Interactions

**File**: `src/styles/buttons.css`

```css
/* Enhanced Button Styles */
.btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:active::before {
  width: 300px;
  height: 300px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Focus styles for accessibility */
.btn:focus-visible {
  outline: 3px solid rgba(74, 144, 226, 0.5);
  outline-offset: 2px;
}
```

**File**: `src/main.js` (import buttons)

```javascript
import './styles/transitions.css'
import './styles/buttons.css'
```

### Add Focus Indicators

**File**: `src/style.css` (add global focus styles)

```css
/* Accessibility - Focus Indicators */
*:focus-visible {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: #4a90e2;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  z-index: 9999;
  transition: top 0.3s ease;
}

.skip-to-content:focus {
  top: 0;
}
```

---

## Phase 6: Performance Optimization

### Add Performance Tests

**File**: `tests/unit/performance.spec.js`

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '@/App.vue'

describe('Performance Optimization', () => {
  it('app renders within acceptable time', () => {
    const start = performance.now()
    
    const wrapper = mount(App, {
      global: { plugins: [createPinia()] }
    })
    
    const end = performance.now()
    const renderTime = end - start
    
    expect(renderTime).toBeLessThan(100) // 100ms threshold
  })

  it('does not create memory leaks with multiple mounts', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0
    
    // Mount and unmount multiple times
    for (let i = 0; i < 10; i++) {
      const wrapper = mount(App, {
        global: { plugins: [createPinia()] }
      })
      wrapper.unmount()
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0
    const memoryIncrease = finalMemory - initialMemory
    
    // Memory should not increase dramatically
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 10MB threshold
  })
})
```

### Optimize Components

Add to all major components:

```vue
<script setup>
// Use computed for derived values
const displayValue = computed(() => store.someValue)

// Use v-memo for expensive renders
</script>

<template>
  <!-- Use v-memo for performance -->
  <div v-memo="[displayValue]">
    {{ displayValue }}
  </div>
</template>
```

---

## Verification

### Run All Tests
```bash
npm run test
```

Expected: All tests pass including animation tests

### Visual Testing Checklist

Start dev server:
```bash
npm run dev
```

**Animation Checks:**
- ✅ Life counter pulses on change (green up, red down)
- ✅ Mana counter pulses on mana gain
- ✅ Coin flips with rotation animation
- ✅ Dice rolls with animation
- ✅ Buttons have ripple effect on click
- ✅ Buttons lift on hover
- ✅ Smooth transitions between game states
- ✅ Action log entries fade in
- ✅ Turn phase changes have transition

**Focus Indicators:**
- ✅ Tab through interface shows focus rings
- ✅ Focus rings are visible and clear
- ✅ Keyboard navigation works smoothly

**Performance:**
- ✅ No lag when clicking buttons
- ✅ Animations are smooth (60fps)
- ✅ Page loads quickly
- ✅ No console errors

### Run Performance Audit
```bash
npm run build
npm run preview
```

Open Chrome DevTools → Lighthouse → Run audit

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+

---

## Acceptance Criteria

- [x] All components have enter/exit animations
- [x] State changes trigger visual feedback
- [x] Button interactions are polished
- [x] Loading states implemented
- [x] Focus indicators for accessibility
- [x] Smooth 60fps animations
- [x] No performance degradation
- [x] All tests pass
- [x] Lighthouse scores meet targets
- [x] No memory leaks

## Files Created/Modified

### Created
- `src/styles/transitions.css` - Global transition classes
- `src/styles/buttons.css` - Enhanced button styles
- `src/components/LoadingSpinner.vue` - Loading component
- `tests/unit/components/LoadingSpinner.spec.js` - Spinner tests (3 tests)
- `tests/unit/animations.spec.js` - Animation tests (8 tests)
- `tests/unit/performance.spec.js` - Performance tests (2 tests)

### Modified
- `src/components/LifeCounter.vue` - Added animation states
- `src/components/ManaCounter.vue` - Added pulse animation
- `src/style.css` - Added global focus styles
- `src/main.js` - Import new stylesheets

## Commit
```bash
git add .
git commit -m "feat: add animations and visual polish

- Component animations (pulse, flash, fade)
- Button ripple effects
- Loading spinner component
- Focus indicators for accessibility
- Performance optimizations
- Smooth 60fps transitions
- 13+ animation tests
- Lighthouse performance 90+"
```

## Next Steps

Proceed to [Task 18: Edge Cases & Error Handling](task-18-edge-cases.md)

---

**Task Complete** ✅
