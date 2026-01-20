# Task 04: PlayerNameBox Component (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 1.5 hours  
**Dependencies**: Task 03  
**Week**: 1

## Objective
Create the PlayerNameBox component that allows players to enter their names, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering

#### RED: Write Rendering Tests
**File**: `tests/unit/components/PlayerNameBox.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import PlayerNameBox from '@/components/PlayerNameBox.vue'

describe('PlayerNameBox Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders input field', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('displays default name from store', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('Red Player')
    })

    it('displays player2 default name', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player2',
          color: 'blue'
        }
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('Blue Player')
    })

    it('has data-test attribute for testing', () => {
      const wrapper = mount(PlayerNameBox, {
        props: {
          playerId: 'player1',
          color: 'red'
        }
      })

      expect(wrapper.find('[data-test="player1-name"]').exists()).toBe(true)
    })
  })
})
```

**Run tests**: `npm run test PlayerNameBox.spec.js`  
**Expected**: All tests FAIL (component doesn't exist)

#### GREEN: Create Basic Component
**File**: `src/components/PlayerNameBox.vue`
```vue
<template>
  <div class="player-name-box">
    <input
      :data-test="`${playerId}-name`"
      :value="store.players[playerId].name"
      type="text"
      class="name-input"
    />
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.player-name-box {
  margin: 1rem;
}

.name-input {
  padding: 0.5rem;
  font-size: 1.2rem;
  border: 2px solid #ccc;
  border-radius: 4px;
}
</style>
```

**Run tests**: All tests PASS

**Commit**:
```bash
git add .
git commit -m "test: add PlayerNameBox rendering tests"
git commit -m "feat: create PlayerNameBox component with basic rendering"
```

---

### Phase 2: User Input Handling

#### RED: Write Input Tests
**Add to**: `tests/unit/components/PlayerNameBox.spec.js`
```javascript
describe('User Input', () => {
  it('updates store when user types', async () => {
    const wrapper = mount(PlayerNameBox, {
      props: {
        playerId: 'player1',
        color: 'red'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('Alice')

    const store = useGameStore()
    expect(store.players.player1.name).toBe('Alice')
  })

  it('updates player2 name correctly', async () => {
    const wrapper = mount(PlayerNameBox, {
      props: {
        playerId: 'player2',
        color: 'blue'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('Bob')

    const store = useGameStore()
    expect(store.players.player2.name).toBe('Bob')
  })

  it('trims whitespace from input', async () => {
    const wrapper = mount(PlayerNameBox, {
      props: {
        playerId: 'player1',
        color: 'red'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('  Alice  ')

    const store = useGameStore()
    expect(store.players.player1.name).toBe('Alice')
  })

  it('does not allow empty name', async () => {
    const wrapper = mount(PlayerNameBox, {
      props: {
        playerId: 'player1',
        color: 'red'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('')

    const store = useGameStore()
    // Should revert to default
    expect(store.players.player1.name).toBe('Red Player')
  })
})
```

**Run tests**: Tests FAIL

#### GREEN: Implement Input Handling
**Update**: `src/components/PlayerNameBox.vue`
```vue
<template>
  <div class="player-name-box">
    <input
      :data-test="`${playerId}-name`"
      :value="store.players[playerId].name"
      @input="handleInput"
      type="text"
      class="name-input"
      :placeholder="defaultName"
    />
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

const defaultName = computed(() => {
  return props.color === 'red' ? 'Red Player' : 'Blue Player'
})

function handleInput(event) {
  const value = event.target.value.trim()
  const newName = value || defaultName.value
  store.setPlayerName(props.playerId, newName)
}
</script>
```

**Run tests**: All tests PASS

**Commit**:
```bash
git add .
git commit -m "test: add input handling tests"
git commit -m "feat: implement name input with validation"
```

---

### Phase 3: Styling and Color Coding

#### RED: Write Style Tests
**Add to**: `tests/unit/components/PlayerNameBox.spec.js`
```javascript
describe('Styling', () => {
  it('applies red color class for player1', () => {
    const wrapper = mount(PlayerNameBox, {
      props: {
        playerId: 'player1',
        color: 'red'
      }
    })

    expect(wrapper.classes()).toContain('color-red')
  })

  it('applies blue color class for player2', () => {
    const wrapper = mount(PlayerNameBox, {
      props: {
        playerId: 'player2',
        color: 'blue'
      }
    })

    expect(wrapper.classes()).toContain('color-blue')
  })

  it('has proper border color based on player color', () => {
    const wrapper = mount(PlayerNameBox, {
      props: {
        playerId: 'player1',
        color: 'red'
      }
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-red')
  })
})
```

**Run tests**: Tests FAIL

#### GREEN/REFACTOR: Add Styling
**Update**: `src/components/PlayerNameBox.vue`
```vue
<template>
  <div class="player-name-box" :class="`color-${color}`">
    <label class="player-label">
      {{ color === 'red' ? 'Player 1' : 'Player 2' }}
    </label>
    <input
      :data-test="`${playerId}-name`"
      :value="store.players[playerId].name"
      @input="handleInput"
      type="text"
      class="name-input"
      :class="`border-${color}`"
      :placeholder="defaultName"
    />
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

const defaultName = computed(() => {
  return props.color === 'red' ? 'Red Player' : 'Blue Player'
})

function handleInput(event) {
  const value = event.target.value.trim()
  const newName = value || defaultName.value
  store.setPlayerName(props.playerId, newName)
}
</script>

<style scoped>
.player-name-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem;
}

.player-label {
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.name-input {
  padding: 0.75rem;
  font-size: 1.2rem;
  border: 3px solid;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
}

.name-input:focus {
  outline: none;
  transform: scale(1.02);
}

.color-red .player-label {
  color: #D32F2F;
}

.color-blue .player-label {
  color: #1976D2;
}

.border-red {
  border-color: #D32F2F;
  background-color: #FFEBEE;
}

.border-blue {
  border-color: #1976D2;
  background-color: #E3F2FD;
}
</style>
```

**Run tests**: All tests PASS

**Commit**:
```bash
git add .
git commit -m "test: add styling tests"
git commit -m "feat: add color-coded styling"
```

---

## Acceptance Criteria
- [ ] All tests pass: `npm run test PlayerNameBox.spec.js`
- [ ] Component renders with default name
- [ ] User can type to change name
- [ ] Empty input reverts to default
- [ ] Whitespace is trimmed
- [ ] Red/blue color coding works
- [ ] Input has focus effects
- [ ] Test coverage > 90%

## Verification
```bash
npm run test PlayerNameBox.spec.js
npm run test:coverage -- PlayerNameBox
npm run dev  # Manually test component
```

## Manual Testing
Add to `src/App.vue` temporarily:
```vue
<template>
  <div>
    <PlayerNameBox playerId="player1" color="red" />
    <PlayerNameBox playerId="player2" color="blue" />
  </div>
</template>

<script setup>
import PlayerNameBox from './components/PlayerNameBox.vue'
</script>
```

## Next Task
→ [Task 05: LifeCounter Component (TDD)](task-05-life-counter.md)

## Reference
- [Design Document](design-document.md) - Section 4.1.1, 11.2.2
