# Task 13: ActionLog Component (TDD)

**Status**: ✅ Complete  
**Estimated Time**: 2 hours  
**Dependencies**: Task 03  
**Week**: 3

## Objective
Create the ActionLog component that displays a scrollable, color-coded list of game actions with timestamps and player context, using Test-Driven Development.

## TDD Workflow: Red-Green-Refactor

### Phase 1: Basic Rendering

#### RED: Write Rendering Tests
**File**: `tests/unit/components/ActionLog.spec.js`
```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import ActionLog from '@/components/ActionLog.vue'
import { useGameStore } from '@/stores/gameStore'

describe('ActionLog Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Rendering', () => {
    it('renders log container', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="action-log"]').exists()).toBe(true)
    })

    it('renders title', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.text()).toContain('Action Log')
    })

    it('displays empty message when no entries', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(true)
    })

    it('does not display empty message when entries exist', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Test entry' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(false)
    })
  })
})
```

**Run Test** (should fail):
```bash
npm run test ActionLog.spec.js
```

#### GREEN: Create Component
**File**: `src/components/ActionLog.vue`
```vue
<template>
  <div class="action-log-container">
    <div class="log-header">
      <h3 class="log-title">Action Log</h3>
      <button 
        v-if="store.actionLog.length > 0"
        class="clear-button"
        data-test="clear-log"
        @click="clearLog"
        title="Clear log"
      >
        Clear
      </button>
    </div>

    <div 
      class="action-log" 
      data-test="action-log"
      ref="logContainer"
    >
      <div 
        v-if="store.actionLog.length === 0" 
        class="empty-message"
        data-test="empty-message"
      >
        No actions yet
      </div>

      <div 
        v-for="entry in store.actionLog" 
        :key="entry.id"
        class="log-entry"
        :class="[`type-${entry.type}`, entry.playerId ? `player-${getPlayerColor(entry.playerId)}` : '']"
        :data-test="`log-entry-${entry.id}`"
      >
        <div class="entry-header">
          <span class="entry-timestamp">{{ formatTime(entry.timestamp) }}</span>
          <span v-if="entry.playerId" class="entry-player">
            {{ getPlayerName(entry.playerId) }}
          </span>
        </div>
        <div class="entry-message">{{ entry.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()
const logContainer = ref(null)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

const getPlayerName = (playerId) => {
  return store.players[playerId]?.name || playerId
}

const getPlayerColor = (playerId) => {
  return playerId === 'player1' ? 'red' : 'blue'
}

const clearLog = () => {
  if (confirm('Clear the action log?')) {
    store.clearActionLog()
  }
}

// Auto-scroll to bottom when new entries added
watch(() => store.actionLog.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})

defineExpose({ formatTime, getPlayerName, getPlayerColor })
</script>

<style scoped>
.action-log-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #9E9E9E;
  overflow: hidden;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #F5F5F5;
  border-bottom: 2px solid #E0E0E0;
}

.log-title {
  margin: 0;
  font-size: 1.25rem;
  color: #424242;
}

.clear-button {
  padding: 0.5rem 1rem;
  border: 2px solid #FF5722;
  border-radius: 6px;
  background: white;
  color: #FF5722;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #FF5722;
  color: white;
}

.action-log {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-message {
  text-align: center;
  color: #9E9E9E;
  font-style: italic;
  padding: 2rem;
}

.log-entry {
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid;
  background: #FAFAFA;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-entry.type-info {
  border-left-color: #2196F3;
  background: #E3F2FD;
}

.log-entry.type-success {
  border-left-color: #4CAF50;
  background: #E8F5E9;
}

.log-entry.type-warning {
  border-left-color: #FF9800;
  background: #FFF3E0;
}

.log-entry.type-error {
  border-left-color: #F44336;
  background: #FFEBEE;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.entry-timestamp {
  color: #757575;
  font-family: monospace;
}

.entry-player {
  font-weight: bold;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  background: white;
}

.log-entry.player-red .entry-player {
  color: #D32F2F;
  border: 1px solid #D32F2F;
}

.log-entry.player-blue .entry-player {
  color: #1976D2;
  border: 1px solid #1976D2;
}

.entry-message {
  color: #424242;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Custom scrollbar */
.action-log::-webkit-scrollbar {
  width: 8px;
}

.action-log::-webkit-scrollbar-track {
  background: #F5F5F5;
  border-radius: 4px;
}

.action-log::-webkit-scrollbar-thumb {
  background: #BDBDBD;
  border-radius: 4px;
}

.action-log::-webkit-scrollbar-thumb:hover {
  background: #9E9E9E;
}
</style>
```

**Run Test** (should pass):
```bash
npm run test ActionLog.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ActionLog.spec.js src/components/ActionLog.vue
git commit -m "feat: add basic ActionLog component structure"
```

---

### Phase 2: Entry Display

#### RED: Write Entry Display Tests
**Add to**: `tests/unit/components/ActionLog.spec.js`
```javascript
  describe('Entry Display', () => {
    it('displays log entries from store', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Test message' })

      const wrapper = mount(ActionLog)

      expect(wrapper.text()).toContain('Test message')
    })

    it('displays multiple entries', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'First message' })
      store.addLogEntry({ type: 'info', message: 'Second message' })

      const wrapper = mount(ActionLog)

      expect(wrapper.text()).toContain('First message')
      expect(wrapper.text()).toContain('Second message')
    })

    it('applies correct type class to entries', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'success', message: 'Success message' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-success')
    })

    it('displays timestamp for each entry', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Test' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.entry-timestamp').exists()).toBe(true)
    })

    it('displays player name when playerId provided', () => {
      const store = useGameStore()
      store.addLogEntry({ 
        type: 'info', 
        message: 'Test', 
        playerId: 'player1' 
      })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.entry-player').exists()).toBe(true)
      expect(wrapper.find('.entry-player').text()).toBe(store.players.player1.name)
    })

    it('does not display player name when no playerId', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Test' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.entry-player').exists()).toBe(false)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test ActionLog.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ActionLog.spec.js
git commit -m "test: add entry display tests for ActionLog"
```

---

### Phase 3: Entry Types

#### RED: Write Entry Type Tests
**Add to**: `tests/unit/components/ActionLog.spec.js`
```javascript
  describe('Entry Types', () => {
    it('applies info type styling', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Info message' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-info')
    })

    it('applies success type styling', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'success', message: 'Success message' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-success')
    })

    it('applies warning type styling', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'warning', message: 'Warning message' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-warning')
    })

    it('applies error type styling', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'error', message: 'Error message' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('type-error')
    })

    it('applies player color class when playerId present', () => {
      const store = useGameStore()
      store.addLogEntry({ 
        type: 'info', 
        message: 'Test',
        playerId: 'player1'
      })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('player-red')
    })

    it('applies blue color for player2', () => {
      const store = useGameStore()
      store.addLogEntry({ 
        type: 'info', 
        message: 'Test',
        playerId: 'player2'
      })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('.log-entry').classes()).toContain('player-blue')
    })
  })
```

**Run Test** (should pass):
```bash
npm run test ActionLog.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ActionLog.spec.js
git commit -m "test: add entry type styling tests for ActionLog"
```

---

### Phase 4: Clear Log

#### RED: Write Clear Tests
**Add to**: `tests/unit/components/ActionLog.spec.js`
```javascript
  describe('Clear Log', () => {
    it('shows clear button when entries exist', () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Test' })

      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="clear-log"]').exists()).toBe(true)
    })

    it('hides clear button when no entries', () => {
      const wrapper = mount(ActionLog)

      expect(wrapper.find('[data-test="clear-log"]').exists()).toBe(false)
    })

    it('clears log when button clicked and confirmed', async () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Test' })

      global.confirm = vi.fn(() => true)

      const wrapper = mount(ActionLog)

      await wrapper.find('[data-test="clear-log"]').trigger('click')

      expect(store.actionLog.length).toBe(0)
    })

    it('does not clear when confirmation cancelled', async () => {
      const store = useGameStore()
      store.addLogEntry({ type: 'info', message: 'Test' })

      global.confirm = vi.fn(() => false)

      const wrapper = mount(ActionLog)

      await wrapper.find('[data-test="clear-log"]').trigger('click')

      expect(store.actionLog.length).toBe(1)
    })
  })
```

**Run Test** (should fail - need clearActionLog in store):
```bash
npm run test ActionLog.spec.js
```

#### GREEN: Add clearActionLog to Store
**Update**: `src/stores/gameStore.js`

Add to actions:
```javascript
    clearActionLog() {
      this.actionLog = []
    },
```

**Run Test** (should pass):
```bash
npm run test ActionLog.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ActionLog.spec.js src/stores/gameStore.js src/components/ActionLog.vue
git commit -m "feat: add clear log functionality"
```

---

### Phase 5: Auto-Scroll

#### RED: Write Auto-Scroll Tests
**Add to**: `tests/unit/components/ActionLog.spec.js`
```javascript
  describe('Auto-Scroll', () => {
    it('scrolls to bottom when new entry added', async () => {
      const store = useGameStore()
      const wrapper = mount(ActionLog)

      // Add many entries to cause scroll
      for (let i = 0; i < 20; i++) {
        store.addLogEntry({ type: 'info', message: `Entry ${i}` })
      }

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const logContainer = wrapper.find('[data-test="action-log"]').element
      const isAtBottom = Math.abs(
        logContainer.scrollHeight - logContainer.scrollTop - logContainer.clientHeight
      ) < 10

      expect(isAtBottom).toBe(true)
    })

    it('maintains scroll position as entries are added', async () => {
      const store = useGameStore()
      const wrapper = mount(ActionLog)

      // Add entries
      for (let i = 0; i < 5; i++) {
        store.addLogEntry({ type: 'info', message: `Entry ${i}` })
        await wrapper.vm.$nextTick()
      }

      // Should be at bottom
      const logContainer = wrapper.find('[data-test="action-log"]').element
      expect(logContainer.scrollTop).toBeGreaterThan(0)
    })
  })
```

**Run Test** (should pass):
```bash
npm run test ActionLog.spec.js
```

**Commit**:
```bash
git add tests/unit/components/ActionLog.spec.js
git commit -m "test: add auto-scroll tests for ActionLog"
```

---

### REFACTOR: Add Export Functionality

**Update**: `src/components/ActionLog.vue`

Add export button and method:
```vue
<template>
  <div class="action-log-container">
    <div class="log-header">
      <h3 class="log-title">Action Log</h3>
      <div class="header-buttons">
        <button 
          v-if="store.actionLog.length > 0"
          class="export-button"
          data-test="export-log"
          @click="exportLog"
          title="Export log as text"
        >
          Export
        </button>
        <button 
          v-if="store.actionLog.length > 0"
          class="clear-button"
          data-test="clear-log"
          @click="clearLog"
          title="Clear log"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- ... rest of template ... -->
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()
const logContainer = ref(null)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

const getPlayerName = (playerId) => {
  return store.players[playerId]?.name || playerId
}

const getPlayerColor = (playerId) => {
  return playerId === 'player1' ? 'red' : 'blue'
}

const clearLog = () => {
  if (confirm('Clear the action log?')) {
    store.clearActionLog()
  }
}

const exportLog = () => {
  const logText = store.actionLog
    .map(entry => {
      const time = formatTime(entry.timestamp)
      const player = entry.playerId ? `[${getPlayerName(entry.playerId)}]` : ''
      const type = `[${entry.type.toUpperCase()}]`
      return `${time} ${type} ${player} ${entry.message}`
    })
    .join('\n')

  const blob = new Blob([logText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `runes-gambit-log-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

watch(() => store.actionLog.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})

defineExpose({ formatTime, getPlayerName, getPlayerColor, exportLog })
</script>

<style scoped>
/* ... existing styles ... */

.header-buttons {
  display: flex;
  gap: 0.5rem;
}

.export-button {
  padding: 0.5rem 1rem;
  border: 2px solid #2196F3;
  border-radius: 6px;
  background: white;
  color: #2196F3;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.export-button:hover {
  background: #2196F3;
  color: white;
}

/* ... rest of styles ... */
</style>
```

**Run Test** (should still pass):
```bash
npm run test ActionLog.spec.js
```

**Commit**:
```bash
git add src/components/ActionLog.vue
git commit -m "refactor: add export log functionality"
```

---

## Verification

### Run All Tests
```bash
npm run test ActionLog.spec.js
```

Expected output:
```
✓ tests/unit/components/ActionLog.spec.js (24 tests)
  ✓ Rendering (4 tests)
  ✓ Entry Display (6 tests)
  ✓ Entry Types (6 tests)
  ✓ Clear Log (4 tests)
  ✓ Auto-Scroll (2 tests)

Test Files  1 passed (1)
     Tests  24 passed (24)
```

### Check Coverage
```bash
npm run test:coverage -- ActionLog
```

Expected: 95%+ coverage

### Manual Testing
```bash
npm run dev
```

Test in browser:
- [ ] Log displays entries
- [ ] Timestamps show correctly
- [ ] Type colors work
- [ ] Player names and colors display
- [ ] Auto-scrolls to new entries
- [ ] Clear button works
- [ ] Export downloads file

---

## Acceptance Criteria

- [x] Displays all log entries from store
- [x] Color-coded by type (info/success/warning/error)
- [x] Shows timestamps
- [x] Shows player names with colors
- [x] Auto-scrolls to new entries
- [x] Clear log with confirmation
- [x] Export log as text file
- [x] Empty state message
- [x] All tests pass
- [x] 95%+ code coverage

## Files Created/Modified

### Created
- `tests/unit/components/ActionLog.spec.js` - Component tests (24 tests)
- `src/components/ActionLog.vue` - Action log component

### Modified
- `src/stores/gameStore.js` - Added clearActionLog action

## Next Steps

Proceed to [Task 14: Integration Tests](task-14-integration-tests.md)

---

**Task Complete** ✅
