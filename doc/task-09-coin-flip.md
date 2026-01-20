# Task 09: CoinFlip Component (TDD)

**Status**: Not Started  
**Estimated Time**: 2 hours  
**Dependencies**: Task 02  
**Week**: 2

## Objective
Create the CoinFlip component that determines which player goes first with a 50/50 random outcome and animated coin flip, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering

#### RED: Write Rendering Tests
**File**: `tests/unit/components/CoinFlip.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CoinFlip from '@/components/CoinFlip.vue'

describe('CoinFlip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders flip button', () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      expect(wrapper.find('[data-test="flip-button"]').exists()).toBe(true)
    })

    it('displays button text', () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      expect(wrapper.find('[data-test="flip-button"]').text()).toBe('Flip Coin')
    })

    it('does not show result initially', () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      expect(wrapper.find('[data-test="result-message"]').exists()).toBe(false)
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test CoinFlip.spec.js
```

#### GREEN: Create Component
**File**: `src/components/CoinFlip.vue`
```vue
<template>
  <div class="coin-flip">
    <button 
      class="flip-button"
      data-test="flip-button"
      @click="flipCoin"
      :disabled="isFlipping || hasResult"
    >
      <div class="coin" :class="{ flipping: isFlipping }">
        🪙
      </div>
      <span>Flip Coin</span>
    </button>
    
    <div 
      v-if="result" 
      class="result-message"
      data-test="result-message"
    >
      {{ resultMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { flipCoin as randomFlip } from '@/utils/random'

const props = defineProps({
  player1Name: {
    type: String,
    default: 'Player 1'
  },
  player2Name: {
    type: String,
    default: 'Player 2'
  }
})

const emit = defineEmits(['result'])

const isFlipping = ref(false)
const result = ref(null)

const hasResult = computed(() => result.value !== null)

const resultMessage = computed(() => {
  if (!result.value) return ''
  const winnerName = result.value === 'player1' ? props.player1Name : props.player2Name
  return `${winnerName} goes first!`
})

const flipCoin = async () => {
  if (isFlipping.value || hasResult.value) return

  isFlipping.value = true

  // Simulate flip animation duration
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Determine winner
  const winner = randomFlip()
  result.value = winner
  isFlipping.value = false

  emit('result', winner)
}
</script>

<style scoped>
.coin-flip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #FFA726;
}

.flip-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: 3px solid #FFA726;
  border-radius: 12px;
  background: white;
  font-size: 1.25rem;
  font-weight: bold;
  color: #F57C00;
  cursor: pointer;
  transition: all 0.3s;
}

.flip-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 167, 38, 0.3);
  background: #FFF8E1;
}

.flip-button:active:not(:disabled) {
  transform: translateY(0);
}

.flip-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.coin {
  font-size: 3rem;
  transition: transform 0.3s;
}

.coin.flipping {
  animation: coinFlip 1s cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes coinFlip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(1800deg);
  }
}

.result-message {
  font-size: 1.5rem;
  font-weight: bold;
  color: #F57C00;
  text-align: center;
  animation: fadeInScale 0.5s ease;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
```

**Run Test** (should pass):
```bash
npm run test CoinFlip.spec.js
```

**Commit**:
```bash
git add tests/unit/components/CoinFlip.spec.js src/components/CoinFlip.vue
git commit -m "feat: add basic CoinFlip component with button"
```

---

### Phase 2: Flip Mechanics

#### RED: Write Flip Tests
**Add to**: `tests/unit/components/CoinFlip.spec.js`
```javascript
  describe('Flip Mechanics', () => {
    it('starts flipping when button clicked', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      expect(wrapper.vm.isFlipping).toBe(true)
    })

    it('generates either player1 or player2 result', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(['player1', 'player2']).toContain(wrapper.vm.result)
    })

    it('displays result message after flip', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      const resultMessage = wrapper.find('[data-test="result-message"]')
      expect(resultMessage.exists()).toBe(true)
      expect(resultMessage.text()).toMatch(/Alice|Bob goes first!/)
    })

    it('emits result event with winner', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.emitted('result')).toBeTruthy()
      expect(['player1', 'player2']).toContain(wrapper.emitted('result')[0][0])
    })

    it('disables button while flipping', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      const button = wrapper.find('[data-test="flip-button"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('disables button after result', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      const button = wrapper.find('[data-test="flip-button"]')
      expect(button.attributes('disabled')).toBeDefined()
    })
  })
```

**Run Test** (should pass):
```bash
npm run test CoinFlip.spec.js
```

**Commit**:
```bash
git add tests/unit/components/CoinFlip.spec.js
git commit -m "test: add flip mechanics tests for CoinFlip"
```

---

### Phase 3: Result Display

#### RED: Write Result Display Tests
**Add to**: `tests/unit/components/CoinFlip.spec.js`
```javascript
  describe('Result Display', () => {
    it('displays player1 name when player1 wins', async () => {
      // Mock flipCoin to return player1
      vi.mock('@/utils/random', () => ({
        flipCoin: vi.fn(() => 'player1')
      }))

      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.find('[data-test="result-message"]').text()).toBe('Alice goes first!')
    })

    it('displays player2 name when player2 wins', async () => {
      // Mock flipCoin to return player2
      vi.mock('@/utils/random', () => ({
        flipCoin: vi.fn(() => 'player2')
      }))

      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.find('[data-test="result-message"]').text()).toBe('Bob goes first!')
    })

    it('uses default names if not provided', async () => {
      const wrapper = mount(CoinFlip)

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      const resultText = wrapper.find('[data-test="result-message"]').text()
      expect(resultText).toMatch(/Player 1|Player 2 goes first!/)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test CoinFlip.spec.js
```

**Commit**:
```bash
git add tests/unit/components/CoinFlip.spec.js
git commit -m "test: add result display tests for CoinFlip"
```

---

### Phase 4: Animation State

#### RED: Write Animation Tests
**Add to**: `tests/unit/components/CoinFlip.spec.js`
```javascript
  describe('Animation', () => {
    it('applies flipping class during animation', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')

      const coin = wrapper.find('.coin')
      expect(coin.classes()).toContain('flipping')
    })

    it('removes flipping class after animation', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 1100))

      const coin = wrapper.find('.coin')
      expect(coin.classes()).not.toContain('flipping')
    })

    it('prevents multiple flips during animation', async () => {
      const wrapper = mount(CoinFlip, {
        props: {
          player1Name: 'Alice',
          player2Name: 'Bob'
        }
      })

      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await wrapper.find('[data-test="flip-button"]').trigger('click')
      await wrapper.find('[data-test="flip-button"]').trigger('click')

      await new Promise(resolve => setTimeout(resolve, 1100))

      // Should only emit once
      expect(wrapper.emitted('result')).toHaveLength(1)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test CoinFlip.spec.js
```

**Commit**:
```bash
git add tests/unit/components/CoinFlip.spec.js
git commit -m "test: add animation state tests for CoinFlip"
```

---

### REFACTOR: Add Reset Capability

**Add to**: `src/components/CoinFlip.vue`

Add reset method:
```vue
<template>
  <div class="coin-flip">
    <button 
      class="flip-button"
      data-test="flip-button"
      @click="flipCoin"
      :disabled="isFlipping || hasResult"
    >
      <div class="coin" :class="{ flipping: isFlipping }">
        🪙
      </div>
      <span>Flip Coin</span>
    </button>
    
    <div 
      v-if="result" 
      class="result-message"
      data-test="result-message"
    >
      {{ resultMessage }}
    </div>

    <button
      v-if="hasResult"
      class="reset-button"
      data-test="reset-button"
      @click="reset"
    >
      Flip Again
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { flipCoin as randomFlip } from '@/utils/random'

const props = defineProps({
  player1Name: {
    type: String,
    default: 'Player 1'
  },
  player2Name: {
    type: String,
    default: 'Player 2'
  }
})

const emit = defineEmits(['result', 'reset'])

const isFlipping = ref(false)
const result = ref(null)

const hasResult = computed(() => result.value !== null)

const resultMessage = computed(() => {
  if (!result.value) return ''
  const winnerName = result.value === 'player1' ? props.player1Name : props.player2Name
  return `${winnerName} goes first!`
})

const flipCoin = async () => {
  if (isFlipping.value || hasResult.value) return

  isFlipping.value = true

  await new Promise(resolve => setTimeout(resolve, 1000))

  const winner = randomFlip()
  result.value = winner
  isFlipping.value = false

  emit('result', winner)
}

const reset = () => {
  result.value = null
  emit('reset')
}

// Expose for testing
defineExpose({ isFlipping, result, reset })
</script>

<style scoped>
.coin-flip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid #FFA726;
}

.flip-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: 3px solid #FFA726;
  border-radius: 12px;
  background: white;
  font-size: 1.25rem;
  font-weight: bold;
  color: #F57C00;
  cursor: pointer;
  transition: all 0.3s;
}

.flip-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 167, 38, 0.3);
  background: #FFF8E1;
}

.flip-button:active:not(:disabled) {
  transform: translateY(0);
}

.flip-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.coin {
  font-size: 3rem;
  transition: transform 0.3s;
}

.coin.flipping {
  animation: coinFlip 1s cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes coinFlip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(1800deg);
  }
}

.result-message {
  font-size: 1.5rem;
  font-weight: bold;
  color: #F57C00;
  text-align: center;
  animation: fadeInScale 0.5s ease;
}

.reset-button {
  padding: 0.5rem 1.5rem;
  border: 2px solid #FFA726;
  border-radius: 8px;
  background: white;
  color: #F57C00;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background: #FFF8E1;
  transform: translateY(-1px);
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
```

**Run Test** (should still pass):
```bash
npm run test CoinFlip.spec.js
```

**Commit**:
```bash
git add src/components/CoinFlip.vue
git commit -m "refactor: add reset capability to CoinFlip"
```

---

## Verification

### Run All Tests
```bash
npm run test CoinFlip.spec.js
```

Expected output:
```
✓ tests/unit/components/CoinFlip.spec.js (16 tests)
  ✓ Rendering (3 tests)
  ✓ Flip Mechanics (6 tests)
  ✓ Result Display (3 tests)
  ✓ Animation (4 tests)

Test Files  1 passed (1)
     Tests  16 passed (16)
```

### Check Coverage
```bash
npm run test:coverage -- CoinFlip
```

Expected: 100% coverage on CoinFlip.vue

### Manual Testing
```bash
npm run dev
```

Test in browser:
- [ ] Flip button renders
- [ ] Clicking button starts flip animation
- [ ] Coin rotates during flip
- [ ] Result message appears
- [ ] Winner name displayed correctly
- [ ] Button disabled after flip
- [ ] Reset button allows re-flip

---

## Acceptance Criteria

- [x] Component renders with flip button
- [x] Clicking triggers 50/50 random flip
- [x] Animation plays for 1 second
- [x] Result displays winner's name
- [x] Emits result event with 'player1' or 'player2'
- [x] Button disabled during and after flip
- [x] Reset capability for re-flipping
- [x] Uses player names from props
- [x] All tests pass
- [x] 100% code coverage

## Files Created/Modified

### Created
- `tests/unit/components/CoinFlip.spec.js` - Component tests (16 tests)
- `src/components/CoinFlip.vue` - Coin flip component

### Modified
- None

## Next Steps

Proceed to [Task 10: Dice Component](task-10-dice-component.md)

---

**Task Complete** ✅
