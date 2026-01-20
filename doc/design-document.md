# Runes Gambit Web Application - Design Document

## 1. Project Overview

### 1.1 Purpose
A client-side web application for the Runes Gambit card game that tracks game state, player actions, and manages turn flow without requiring a backend server.

### 1.2 Scope
This application provides digital tracking and automation for the physical card game, including:
- Player identification and turn management
- Dice rolling with animations
- Life point and mana tracking
- Turn phase guidance
- Game state persistence (optional, using localStorage)

### 1.3 Technology Stack
- **Frontend Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: CSS3 with Scoped Styles
- **State Management**: Pinia (Vue Store)
- **Testing Framework**: Vitest (Unit Tests)
- **Component Testing**: Vue Test Utils
- **E2E Testing**: Playwright (optional)
- **Coverage Tool**: c8 (built into Vitest)
- **Storage**: LocalStorage for game state persistence
- **No Backend Required**: All logic runs client-side

### 1.4 Development Methodology: Test-Driven Development (TDD)

This project will be built using **Test-Driven Development (TDD)** as the primary development methodology.

#### Why TDD?
- **Higher Code Quality**: Tests written first ensure all code has a clear purpose
- **Living Documentation**: Tests serve as executable specifications
- **Regression Prevention**: Immediate feedback when changes break existing functionality
- **Better Design**: Writing tests first leads to more modular, testable code
- **Confidence**: Refactor fearlessly with comprehensive test coverage

#### TDD Workflow: Red-Green-Refactor

```
1. RED: Write a failing test
   ├─ Define expected behavior
   ├─ Write minimal test code
   └─ Verify test fails (proves test works)

2. GREEN: Write minimal code to pass
   ├─ Implement simplest solution
   ├─ Make test pass
   └─ Avoid over-engineering

3. REFACTOR: Improve code quality
   ├─ Clean up implementation
   ├─ Remove duplication
   ├─ Improve readability
   └─ Ensure tests still pass

4. REPEAT: Move to next requirement
```

#### TDD Application to Components

**Example: Building LifeCounter Component**

**Step 1 - RED**: Write failing test
```javascript
// tests/unit/components/LifeCounter.spec.js
it('renders with initial life points', () => {
  const wrapper = mount(LifeCounter, {
    props: { initialLife: 20 }
  })
  expect(wrapper.text()).toContain('20')
})
// Test FAILS - component doesn't exist yet
```

**Step 2 - GREEN**: Create minimal component
```vue
<!-- src/components/LifeCounter.vue -->
<template>
  <div>{{ life }}</div>
</template>
<script setup>
const props = defineProps({ initialLife: Number })
const life = ref(props.initialLife)
</script>
// Test PASSES
```

**Step 3 - REFACTOR**: Improve as needed
```vue
<template>
  <div class="life-counter">
    <span class="life-value">{{ life }}</span>
  </div>
</template>
// Test still PASSES
```

**Step 4 - REPEAT**: Add next feature (increment button)
```javascript
it('increments life when + button clicked', async () => {
  const wrapper = mount(LifeCounter, {
    props: { initialLife: 20 }
  })
  await wrapper.find('[data-test="increment"]').trigger('click')
  expect(wrapper.text()).toContain('21')
})
// Test FAILS - button doesn't exist
```

#### TDD for Different Layers

**1. Utilities (Easiest - Pure Functions)**
```javascript
// RED: Write test
it('rolls dice between 1 and 6', () => {
  const result = rollDice()
  expect(result).toBeGreaterThanOrEqual(1)
  expect(result).toBeLessThanOrEqual(6)
})

// GREEN: Implement
export function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}

// REFACTOR: Extract magic numbers
export function rollDice(sides = 6) {
  return Math.floor(Math.random() * sides) + 1
}
```

**2. Store (Business Logic)**
```javascript
// RED: Write test
it('grants 1 mana to player on turn start', () => {
  const store = useGameStore()
  store.startTurn('player1')
  expect(store.players.player1.availableMana).toBe(1)
})

// GREEN: Implement action
actions: {
  startTurn(playerId) {
    this.players[playerId].availableMana += 1
  }
}

// REFACTOR: Extract mana logic
actions: {
  startTurn(playerId) {
    this.grantMana(playerId, 1)
  },
  grantMana(playerId, amount) {
    this.transferManaToPlayer(playerId, amount)
  }
}
```

**3. Components (UI + Interaction)**
```javascript
// RED: Write test
it('emits roll event when dice clicked', async () => {
  const wrapper = mount(Dice)
  await wrapper.trigger('click')
  expect(wrapper.emitted('roll')).toBeTruthy()
})

// GREEN: Add click handler
<template>
  <div @click="handleRoll">🎲</div>
</template>
<script setup>
const emit = defineEmits(['roll'])
const handleRoll = () => emit('roll', rollDice())
</script>

// REFACTOR: Add animation state
const isRolling = ref(false)
const handleRoll = async () => {
  if (isRolling.value) return
  isRolling.value = true
  await animateRoll()
  const result = rollDice()
  emit('roll', result)
  isRolling.value = false
}
```

#### TDD Best Practices for This Project

1. **Write Tests First, Always**
   - No production code without a failing test
   - Exception: Boilerplate/scaffolding only

2. **Keep Tests Simple and Focused**
   - One assertion per test (when possible)
   - Clear test names describing behavior
   - Arrange-Act-Assert pattern

3. **Test Behavior, Not Implementation**
   - Test what component does, not how
   - Avoid testing internal state directly
   - Focus on user-visible behavior

4. **Maintain Fast Test Suite**
   - Unit tests should run in milliseconds
   - Mock external dependencies
   - Use `vi.useFakeTimers()` for time-based tests

5. **Achieve High Coverage Naturally**
   - TDD naturally achieves 80%+ coverage
   - Coverage gaps indicate untested edge cases
   - Don't write tests just for coverage

6. **Commit After Each Red-Green-Refactor Cycle**
   ```bash
   git commit -m "test: add life counter increment test"
   # Write passing code
   git commit -m "feat: implement life counter increment"
   # Refactor
   git commit -m "refactor: extract life update logic"
   ```

#### TDD Development Checklist

For each feature:
- [ ] Write failing test (RED)
- [ ] Verify test actually fails
- [ ] Write minimal code to pass (GREEN)
- [ ] Verify test passes
- [ ] Refactor if needed (REFACTOR)
- [ ] Ensure all tests still pass
- [ ] Commit changes
- [ ] Move to next test

#### Measuring TDD Success

**Metrics to Track:**
- Test coverage: Target 80%+ (should be natural with TDD)
- Test-to-code ratio: ~1:1 or higher
- Test execution time: < 5 seconds for full suite
- Defect rate: Should decrease over time
- Refactoring confidence: Can change code without fear

**Anti-Patterns to Avoid:**
- Writing tests after code is complete
- Testing implementation details
- Skipping the refactor step
- Writing tests that depend on each other
- Over-mocking (mock only external dependencies)

---

## 2. Game Rules Summary

### 2.1 Setup
- Each player starts with 20 life points
- First player determined by highest die roll (6-sided)
- Starting player takes 1 mana and draws 5 cards
- Shared mana pool (blue tokens)
- Players use red or blue decks

### 2.2 Turn Structure
1. **Draw Phase**: Collect 1 mana, draw 1 card
2. **Card Play Phase**: Play cards by spending mana
3. **Attack Phase**: Declare attacks with die rolls
4. **End Turn**: Pass to opponent

### 2.3 Key Mechanics
- Mana cost per card (1 mana minimum)
- Cards require mana on them for 1 turn before attacking (unless Instant Attack)
- Maximum 7 cards in hand and battlefield
- Die rolls (6-sided) determine combat outcomes
- Shared mana pool accessible to both players

---

## 3. User Interface Design

### 3.1 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    RUNES GAMBIT                         │
├─────────────────────────────────────────────────────────┤
│  [Player 1 Name Input]              [Player 2 Name Input]│
│  Life: [20] [-] [+]                 Life: [20] [-] [+]  │
│  Mana Count: [0]                    Mana Count: [0]     │
│                                                          │
│              ┌─────────────────────┐                    │
│              │  Shared Mana Pool   │                    │
│              │        [0]          │                    │
│              │    [-]  [+]         │                    │
│              └─────────────────────┘                    │
│                                                          │
│              ┌─────────────────────┐                    │
│              │   [Flip Coin]       │                    │
│              │   [First Player: ?] │                    │
│              └─────────────────────┘                    │
│                                                          │
│              ┌─────────────────────┐                    │
│              │   6-Sided Die       │                    │
│              │      [⚅]            │                    │
│              │   [Tap to Roll]     │                    │
│              │   Last Roll: 0      │                    │
│              └─────────────────────┘                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Current Turn: [Not Started]              │  │
│  │         Phase: [Setup]                           │  │
│  │  [Start Red Player Turn] [Start Blue Player Turn]│  │
│  │         [Next Phase] [End Turn]                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Turn Log / Actions                              │  │
│  │  - Game started                                  │  │
│  │  - ...                                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Color Scheme
- **Red Player**: #D32F2F (primary), #FFCDD2 (light)
- **Blue Player**: #1976D2 (primary), #BBDEFB (light)
- **Shared Elements**: #757575 (neutral gray)
- **Mana Pool**: #2196F3 (blue)
- **Background**: #FAFAFA
- **Accent**: #FFC107 (gold for highlights)

### 3.3 Responsive Design
- Desktop-first approach (min-width: 1024px)
- Tablet support (768px - 1023px): stacked layout
- Mobile support (< 768px): vertical scroll

---

## 4. Component Architecture

### 4.1 Core Components

#### 4.1.1 PlayerNameBox
**Props**: 
- `playerId`: "player1" | "player2"
- `color`: "red" | "blue"
- `onNameChange`: (name: string) => void

**State**:
- `playerName`: string

**Behavior**:
- Editable text input
- Persist name in game state
- Display player color indicator

#### 4.1.2 LifeCounter
**Props**:
- `playerId`: "player1" | "player2"
- `initialLife`: number (20)
- `color`: "red" | "blue"

**State**:
- `currentLife`: number

**Methods**:
- `incrementLife()`: +1 life
- `decrementLife()`: -1 life
- `setLife(value)`: Direct set
- `onLifeChange(newLife)`: Callback

**Behavior**:
- Displays current life total
- Buttons to increment/decrement
- Visual warning when life < 5 (orange)
- Visual critical when life <= 0 (red, flash animation)
- Emit events on life change

#### 4.1.3 ManaCounter
**Props**:
- `playerId`: "player1" | "player2"
- `color`: "red" | "blue"

**State**:
- `availableMana`: number

**Methods**:
- `addMana(amount)`: Add mana to player count
- `spendMana(amount)`: Deduct from player count
- `resetMana()`: Set to 0

**Behavior**:
- Display only (no direct user controls)
- Updated via turn manager
- Shows mana available to spend

#### 4.1.4 SharedManaPool
**Props**:
- None (singleton)

**State**:
- `totalMana`: number

**Methods**:
- `addMana(amount)`: Add tokens to pool
- `removeMana(amount)`: Remove tokens from pool
- `transferToPlayer(playerId, amount)`: Move from pool to player

**Behavior**:
- Central shared resource
- Cannot go below 0
- Visual indication of pool size
- Buttons to add/remove mana (for manual adjustment)

#### 4.1.5 CoinFlip
**Props**:
- `onResult`: (result: "player1" | "player2") => void

**State**:
- `isFlipping`: boolean
- `result`: string | null

**Methods**:
- `flipCoin()`: Generate random result

**Behavior**:
- Button triggers coin flip
- Animate flip (CSS animation)
- 50/50 random outcome
- Display result: "Player 1 goes first!" or "Player 2 goes first!"
- Disable after first flip (unless reset)

#### 4.1.6 Dice6Sided
**Props**:
- `onRoll`: (result: number) => void
- `animationDuration`: number (ms)

**State**:
- `isRolling`: boolean
- `currentValue`: number (1-6)
- `lastRoll`: number

**Methods**:
- `roll()`: Generate random 1-6
- `animateRoll()`: Visual animation

**Behavior**:
- Clickable die face
- Animate through random values (0.5-1s)
- Show final result with enlargement effect
- Display last roll value
- Log rolls to action log

**Animation**:
- Rotation: 3D CSS transform
- Face cycling: rapid number changes
- Sound effect (optional): click/roll sound

#### 4.1.7 TurnManager
**Props**:
- `player1Name`: string
- `player2Name`: string
- `firstPlayer`: "player1" | "player2"

**State**:
- `currentPlayer`: "player1" | "player2" | null
- `turnPhase`: "setup" | "draw" | "play" | "attack" | "end"
- `turnNumber`: number
- `gameStarted`: boolean

**Methods**:
- `startGame(startingPlayer)`: Initialize game
- `startTurn(player)`: Begin player turn
- `nextPhase()`: Advance to next phase
- `endTurn()`: Complete turn, switch players
- `resetGame()`: Clear all state

**Behavior**:
- Tracks current player and phase
- Displays phase-specific instructions
- Automated mana grant at draw phase
- Phase validation and flow control
- Action logging

**Phase Instructions**:
- **Setup**: "Flip coin to determine first player"
- **Draw**: "Collect 1 mana and draw 1 card"
- **Play**: "Play cards by spending mana (1 mana minimum per card)"
- **Attack**: "Declare attacks and roll dice for combat"
- **End**: "Turn complete. Pass to opponent."

#### 4.1.8 ActionLog
**Props**:
- `maxEntries`: number (50)

**State**:
- `entries`: LogEntry[]

**Types**:
```typescript
interface LogEntry {
  id: string;
  timestamp: Date;
  type: "info" | "success" | "warning" | "error";
  message: string;
  playerId?: string;
}
```

**Methods**:
- `addEntry(type, message, playerId?)`: Add log entry
- `clearLog()`: Clear all entries
- `exportLog()`: Download as text file

**Behavior**:
- Auto-scroll to latest entry
- Color-coded by type
- Timestamps
- Player-specific styling

---

## 5. Game State Management

### 5.1 State Structure

```typescript
interface GameState {
  // Game metadata
  gameId: string;
  createdAt: Date;
  gameStarted: boolean;
  
  // Player data
  players: {
    player1: PlayerState;
    player2: PlayerState;
  };
  
  // Shared resources
  sharedManaPool: number;
  
  // Turn management
  firstPlayer: "player1" | "player2" | null;
  currentPlayer: "player1" | "player2" | null;
  currentPhase: TurnPhase;
  turnNumber: number;
  
  // Dice state
  lastDiceRoll: number | null;
  
  // Action history
  actionLog: LogEntry[];
}

interface PlayerState {
  name: string;
  color: "red" | "blue";
  lifePoints: number;
  availableMana: number;
  isActive: boolean;
}

type TurnPhase = "setup" | "draw" | "play" | "attack" | "end";
```

### 5.2 State Persistence
- Use `localStorage` to save game state
- Auto-save on every state change (debounced)
- "Load Game" and "New Game" options
- Export/Import game state as JSON

### 5.3 State Management Pattern
- **Chosen Framework**: Vue.js 3 with Pinia Store
  - Reactive state management
  - Centralized game state in Pinia store
  - Composable actions and getters
  - Easy to test with store mocking
  - DevTools integration for debugging

**Store Structure**:
```typescript
// stores/gameStore.js
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameId: null,
    gameStarted: false,
    players: { /* ... */ },
    sharedManaPool: 20,
    currentPlayer: null,
    currentPhase: 'setup',
    // ...
  }),
  
  getters: {
    currentPlayerState: (state) => state.players[state.currentPlayer],
    isGameActive: (state) => state.gameStarted,
    // ...
  },
  
  actions: {
    startGame(firstPlayer) { /* ... */ },
    nextPhase() { /* ... */ },
    transferMana(from, to, amount) { /* ... */ },
    // ...
  }
})
```

---

## 6. Game Logic & Rules Implementation

### 6.1 Turn Flow Automation

#### Starting the Game
1. Players enter names
2. Coin flip determines first player
3. "Start [Color] Player Turn" button becomes active
4. On start:
   - Set `currentPlayer`
   - Set `turnPhase = "draw"`
   - Grant 1 mana from pool to player
   - Log action: "[Player] starts their turn"

#### Draw Phase
**Actions**:
- Auto-add 1 mana from shared pool to player's available mana
- Display reminder: "Draw 1 card from your deck"
- "Next Phase" button → advance to Play Phase

**Validation**:
- Shared pool must have >= 1 mana
- If pool empty, log warning but allow turn continuation

#### Play Phase
**Actions**:
- Display: "Play cards by spending mana. Cards need mana tokens to attack next turn."
- No automation (physical cards)
- "Next Phase" button → advance to Attack Phase

#### Attack Phase
**Actions**:
- Display: "Declare attacks. Roll dice for combat resolution."
- Dice available for rolling
- "Next Phase" button → advance to End Phase

**Combat Guidance** (informational only):
- Remind: "Attacker rolls + rune value vs Defender rolls + rune value"
- Show last dice roll
- No automated combat resolution (physical cards)

#### End Phase
**Actions**:
- "End Turn" button → switch to other player
- Reset current player's state if needed
- Increment turn counter
- Return to Draw Phase for new player

### 6.2 Mana Management Rules

#### Shared Pool
- Starts with initial tokens (configurable, suggest 20)
- Players draw from this pool during Draw Phase
- Mana spent on cards returns to shared pool

#### Player Mana
- Tracks mana available to spend
- Each card costs 1 mana minimum
- When card purchased, mana goes back to shared pool

#### Manual Adjustments
- Pool and player counters have +/- buttons
- For correcting mistakes or manual adjustments
- Log all manual changes

### 6.3 Health Tracking

#### Life Point Changes
- Manual increment/decrement buttons
- Direct input option
- Validation: cannot exceed starting life (20)
- Alert when player reaches 0 or below

#### Combat Damage
- Calculate: `attackValue - defenseValue = damage`
- User manually adjusts life based on combat
- Log damage dealt

#### Win Condition
- Alert when player life <= 0
- "Game Over" overlay with winner
- Option to start new game

### 6.4 Dice Rolling

#### Visual Feedback
- 3D rotation animation (720deg)
- Number cycling effect
- Sound effect on roll completion
- Enlarged result display (2s)

#### Roll Results
- Random integer 1-6 (Math.floor(Math.random() * 6) + 1)
- Display result prominently
- Log roll with player context
- Store "last roll" for combat reference

#### Usage Context
- Setup: Determine first player
- Combat: Add to rune values
- General: Any player can roll anytime

---

## 7. User Interactions & Workflows

### 7.1 Game Setup Workflow

```
1. Load page
2. Enter Player 1 name (defaults to "Red Player")
3. Enter Player 2 name (defaults to "Blue Player")
4. Click "Flip Coin" button
   → Animation plays
   → Result displayed: "[Player Name] goes first!"
5. Click "Start [Color] Player Turn"
   → Game begins
   → Turn manager initializes
   → First player receives 1 mana
   → Phase set to "Draw"
```

### 7.2 Turn Cycle Workflow

```
DRAW PHASE:
- Auto: 1 mana added to player from pool
- Manual: Player draws 1 card (physical)
- Click "Next Phase" → Play Phase

PLAY PHASE:
- Manual: Player plays cards
- Manual: Adjust player mana as spent
- Manual: Adjust pool as mana returns
- Click "Next Phase" → Attack Phase

ATTACK PHASE:
- Manual: Declare attacks (physical cards)
- Click die to roll
- Manual: Apply damage to life counters
- Click "Next Phase" → End Phase

END PHASE:
- Review turn summary
- Click "End Turn"
- → Switch to other player
- → Return to Draw Phase
```

### 7.3 Mana Management Workflow

```
DURING DRAW PHASE:
- System: Transfer 1 from Shared Pool → Player Mana

WHEN BUYING CARD:
- Player clicks their Mana Counter [-] button
- Player clicks Shared Pool [+] button
- (Or use dedicated "Buy Card" button that does both)

MANUAL ADJUSTMENTS:
- Use +/- buttons on all mana displays
- Changes logged to action log
```

### 7.4 Combat Workflow

```
1. Current player declares attack (physical cards)
2. Click "Roll Dice" for attacker
   → Note roll result + rune value
3. Opponent clicks "Roll Dice" for defense
   → Note roll result + rune value
4. Compare totals
5. Adjust Life Counters accordingly
6. Proceed to next attack or next phase
```

---

## 8. Visual Design Specifications

### 8.1 Typography
- **Headings**: "Press Start 2P" or "Montserrat Bold"
- **Body**: "Roboto" or "Open Sans"
- **Dice/Numbers**: "Orbitron" or monospace

### 8.2 Component Styles

#### Buttons
- Primary (Start Turn): Large, player-colored, rounded
- Secondary (Next Phase): Medium, gray, rounded
- Icon buttons (+/-): Small, circular, minimal

#### Input Fields
- Player names: Large, centered, player-colored border
- Bordered with bottom emphasis
- Focus state: glow effect

#### Counters
- Large numerical display (36px+)
- +/- buttons flanking value
- Color-coded backgrounds
- Subtle shadow/depth

#### Dice
- Square/rounded square (150px x 150px)
- White background, black dots
- Hover: slight scale up
- Active/Rolling: rapid rotation
- Result: enlarge + glow effect

#### Coin Flip
- Circular button with coin graphic
- Flip animation: Y-axis rotation
- Result text: large, animated entrance

### 8.3 Animations

#### Dice Roll
```css
@keyframes rollDice {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(720deg) rotateY(720deg); }
}

.dice-rolling {
  animation: rollDice 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

#### Coin Flip
```css
@keyframes flipCoin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(1800deg); }
}

.coin-flipping {
  animation: flipCoin 1s ease-in-out;
}
```

#### Life Warning (< 5)
```css
@keyframes pulseWarning {
  0%, 100% { background-color: #FFF3E0; }
  50% { background-color: #FFB74D; }
}
```

#### Life Critical (<= 0)
```css
@keyframes pulseCritical {
  0%, 100% { background-color: #FFEBEE; }
  50% { background-color: #EF5350; }
}
```

### 8.4 Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- High contrast mode support
- Screen reader announcements for:
  - Turn changes
  - Dice rolls
  - Life changes
  - Phase transitions
- Focus indicators (visible outline)
- Minimum touch target size: 44x44px

---

## 9. Technical Implementation Details

### 9.1 Project Structure

```
runes-gambit-web/
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
├── .eslintrc.js
├── .gitignore
├── README.md
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── components/
│   │   ├── PlayerNameBox.vue
│   │   ├── LifeCounter.vue
│   │   ├── ManaCounter.vue
│   │   ├── SharedManaPool.vue
│   │   ├── CoinFlip.vue
│   │   ├── Dice.vue
│   │   ├── TurnManager.vue
│   │   └── ActionLog.vue
│   ├── stores/
│   │   └── gameStore.js
│   ├── composables/
│   │   ├── useGameLogic.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── random.js
│   │   ├── storage.js
│   │   └── constants.js
│   ├── assets/
│   │   ├── images/
│   │   │   ├── dice-faces/
│   │   │   ├── coin.svg
│   │   │   └── logo.png
│   │   └── sounds/
│   │       ├── dice-roll.mp3
│   │       └── coin-flip.mp3
│   └── styles/
│       ├── main.css
│       ├── variables.css
│       └── animations.css
├── tests/
│   ├── setup.js
│   ├── unit/
│   │   ├── components/
│   │   │   ├── PlayerNameBox.spec.js
│   │   │   ├── LifeCounter.spec.js
│   │   │   ├── ManaCounter.spec.js
│   │   │   ├── SharedManaPool.spec.js
│   │   │   ├── CoinFlip.spec.js
│   │   │   ├── Dice.spec.js
│   │   │   ├── TurnManager.spec.js
│   │   │   └── ActionLog.spec.js
│   │   ├── stores/
│   │   │   └── gameStore.spec.js
│   │   └── utils/
│   │       ├── random.spec.js
│   │       └── storage.spec.js
│   ├── integration/
│   │   ├── gameFlow.spec.js
│   │   └── manaManagement.spec.js
│   └── fixtures/
│       └── gameStates.js
├── .github/
│   └── workflows/
│       └── test.yml
├── coverage/
│   └── (generated by tests)
├── dist/
│   └── (generated by build)
└── doc/
    ├── runes-gambit-rules.md
    └── design-document.md
```

### 9.2 Dependencies

#### Production Dependencies
```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0"
  }
}
```

#### Development Dependencies
```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/test-utils": "^2.4.0",
    "@vitest/ui": "^1.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "eslint": "^8.56.0",
    "eslint-plugin-vue": "^9.19.0",
    "jsdom": "^23.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-c8": "^0.33.0"
  }
}
```

### 9.3 Key Algorithms

#### Random Number Generation (1-6)
```javascript
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}
```

#### Coin Flip (50/50)
```javascript
function flipCoin() {
  return Math.random() < 0.5 ? 'player1' : 'player2';
}
```

#### Mana Transfer
```javascript
function transferMana(from, to, amount) {
  if (from.mana >= amount) {
    from.mana -= amount;
    to.mana += amount;
    return true;
  }
  return false;
}
```

### 9.3 LocalStorage Schema

```javascript
// Key: "runesGambit_gameState"
{
  "version": "1.0",
  "savedAt": "2026-01-20T10:30:00Z",
  "gameState": { /* full GameState object */ }
}

// Key: "runesGambit_settings"
{
  "soundEnabled": true,
  "animationsEnabled": true,
  "initialManaPool": 20
}
```

### 9.4 Event System

```javascript
// GameState emits events
gameState.on('turnStart', (player) => { /* ... */ });
gameState.on('phaseChange', (phase) => { /* ... */ });
gameState.on('lifeChange', (player, newLife) => { /* ... */ });
gameState.on('manaChange', (source, amount) => { /* ... */ });
gameState.on('diceRoll', (result) => { /* ... */ });
```

---

## 10. Features & Enhancements

### 10.1 Phase 1 - MVP (Minimum Viable Product)
✅ Must Have:
- Player name inputs
- Life counters
- Mana counters (player + shared pool)
- Coin flip
- 6-sided dice with animation
- Turn manager with phase tracking
- Basic action log
- Start/Next/End turn buttons

### 10.2 Phase 2 - Enhanced UX
🎯 Nice to Have:
- Persistent game state (localStorage)
- Sound effects
- Improved animations
- Win condition detection
- Game reset/new game
- Settings panel (toggle sounds, animations)
- Responsive mobile layout
- Dark mode toggle

### 10.3 Phase 3 - Advanced Features
🚀 Future Enhancements:
- Timer per turn
- Card counter (track cards in hand/battlefield)
- Combo tracker with visual indicators
- Statistics (damage dealt, mana spent, turns elapsed)
- Multiple game profiles
- Export game log as PDF
- Tutorial/help overlay
- Keyboard shortcuts
- Multi-language support

### 10.4 Optional Advanced Features
💡 Considerations:
- **Card Database**: JSON file with all cards
- **Virtual Deck**: Drag-drop card interface
- **Combat Calculator**: Automatic damage calculation
- **Combo Detector**: Scan "cards in play" and suggest combos
- **AI Opponent**: Simple AI for solo play

**Note**: These would significantly increase scope beyond the original request.

---

## 11. Testing Strategy

### 11.1 Testing Framework Setup

#### Vitest Configuration
**File**: `vitest.config.js`
```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        'dist/'
      ],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### Test Setup File
**File**: `tests/setup.js`
```javascript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@vue/test-utils'
import matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
  localStorage.clear()
})

// Mock localStorage if needed
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
```

### 11.2 Unit Testing Strategy

#### 11.2.1 Store Tests
**File**: `tests/unit/stores/gameStore.spec.js`

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const store = useGameStore()
      expect(store.gameStarted).toBe(false)
      expect(store.sharedManaPool).toBe(20)
      expect(store.currentPlayer).toBeNull()
      expect(store.currentPhase).toBe('setup')
      expect(store.turnNumber).toBe(0)
    })

    it('should initialize players with 20 life points', () => {
      const store = useGameStore()
      expect(store.players.player1.lifePoints).toBe(20)
      expect(store.players.player2.lifePoints).toBe(20)
    })
  })

  describe('Game Start', () => {
    it('should start game with first player', () => {
      const store = useGameStore()
      store.startGame('player1')
      
      expect(store.gameStarted).toBe(true)
      expect(store.currentPlayer).toBe('player1')
      expect(store.currentPhase).toBe('draw')
    })

    it('should grant 1 mana to first player on game start', () => {
      const store = useGameStore()
      store.startGame('player1')
      
      expect(store.players.player1.availableMana).toBe(1)
      expect(store.sharedManaPool).toBe(19)
    })
  })

  describe('Phase Management', () => {
    it('should advance through phases correctly', () => {
      const store = useGameStore()
      store.startGame('player1')
      
      expect(store.currentPhase).toBe('draw')
      store.nextPhase()
      expect(store.currentPhase).toBe('play')
      store.nextPhase()
      expect(store.currentPhase).toBe('attack')
      store.nextPhase()
      expect(store.currentPhase).toBe('end')
    })

    it('should grant mana during draw phase', () => {
      const store = useGameStore()
      store.startGame('player1')
      store.endTurn() // Switch to player 2
      
      const initialMana = store.players.player2.availableMana
      expect(store.players.player2.availableMana).toBe(initialMana + 1)
    })
  })

  describe('Mana Management', () => {
    it('should transfer mana from pool to player', () => {
      const store = useGameStore()
      const initialPool = store.sharedManaPool
      
      store.transferManaToPlayer('player1', 3)
      
      expect(store.players.player1.availableMana).toBe(3)
      expect(store.sharedManaPool).toBe(initialPool - 3)
    })

    it('should not transfer mana if pool is empty', () => {
      const store = useGameStore()
      store.sharedManaPool = 0
      
      const result = store.transferManaToPlayer('player1', 1)
      
      expect(result).toBe(false)
      expect(store.players.player1.availableMana).toBe(0)
    })

    it('should return mana from player to pool', () => {
      const store = useGameStore()
      store.players.player1.availableMana = 5
      const initialPool = store.sharedManaPool
      
      store.returnManaToPool('player1', 2)
      
      expect(store.players.player1.availableMana).toBe(3)
      expect(store.sharedManaPool).toBe(initialPool + 2)
    })
  })

  describe('Turn Management', () => {
    it('should switch players on end turn', () => {
      const store = useGameStore()
      store.startGame('player1')
      
      store.endTurn()
      
      expect(store.currentPlayer).toBe('player2')
      expect(store.currentPhase).toBe('draw')
      expect(store.turnNumber).toBe(2)
    })
  })
})
```

#### 11.2.2 Component Tests
**File**: `tests/unit/components/LifeCounter.spec.js`

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LifeCounter from '@/components/LifeCounter.vue'

describe('LifeCounter Component', () => {
  it('renders with initial life points', () => {
    const wrapper = mount(LifeCounter, {
      props: {
        playerId: 'player1',
        initialLife: 20,
        color: 'red'
      }
    })

    expect(wrapper.text()).toContain('20')
  })

  it('increments life when + button clicked', async () => {
    const wrapper = mount(LifeCounter, {
      props: {
        playerId: 'player1',
        initialLife: 20,
        color: 'red'
      }
    })

    await wrapper.find('[data-test="increment-life"]').trigger('click')
    expect(wrapper.text()).toContain('21')
  })

  it('decrements life when - button clicked', async () => {
    const wrapper = mount(LifeCounter, {
      props: {
        playerId: 'player1',
        initialLife: 20,
        color: 'red'
      }
    })

    await wrapper.find('[data-test="decrement-life"]').trigger('click')
    expect(wrapper.text()).toContain('19')
  })

  it('emits life-change event when life changes', async () => {
    const wrapper = mount(LifeCounter, {
      props: {
        playerId: 'player1',
        initialLife: 20,
        color: 'red'
      }
    })

    await wrapper.find('[data-test="increment-life"]').trigger('click')
    expect(wrapper.emitted('life-change')).toBeTruthy()
    expect(wrapper.emitted('life-change')[0]).toEqual([21])
  })

  it('applies warning class when life is below 5', () => {
    const wrapper = mount(LifeCounter, {
      props: {
        playerId: 'player1',
        initialLife: 4,
        color: 'red'
      }
    })

    expect(wrapper.find('.life-warning').exists()).toBe(true)
  })

  it('applies critical class when life is 0 or below', () => {
    const wrapper = mount(LifeCounter, {
      props: {
        playerId: 'player1',
        initialLife: 0,
        color: 'red'
      }
    })

    expect(wrapper.find('.life-critical').exists()).toBe(true)
  })
})
```

**File**: `tests/unit/components/Dice.spec.js`

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dice from '@/components/Dice.vue'

describe('Dice Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dice with initial state', () => {
    const wrapper = mount(Dice)
    expect(wrapper.find('[data-test="dice-face"]').exists()).toBe(true)
  })

  it('rolls dice when clicked', async () => {
    const wrapper = mount(Dice)
    await wrapper.find('[data-test="dice-face"]').trigger('click')
    
    // Should start rolling animation
    expect(wrapper.vm.isRolling).toBe(true)
  })

  it('generates random number between 1 and 6', async () => {
    const wrapper = mount(Dice)
    
    // Mock Math.random to test specific values
    const mockRandom = vi.spyOn(Math, 'random')
    mockRandom.mockReturnValue(0.5) // Should give 4
    
    await wrapper.vm.roll()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.currentValue).toBeGreaterThanOrEqual(1)
    expect(wrapper.vm.currentValue).toBeLessThanOrEqual(6)
    
    mockRandom.mockRestore()
  })

  it('emits roll event with result', async () => {
    const wrapper = mount(Dice)
    
    await wrapper.vm.roll()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for animation
    
    expect(wrapper.emitted('roll')).toBeTruthy()
    const rollValue = wrapper.emitted('roll')[0][0]
    expect(rollValue).toBeGreaterThanOrEqual(1)
    expect(rollValue).toBeLessThanOrEqual(6)
  })

  it('disables clicking while rolling', async () => {
    const wrapper = mount(Dice)
    
    await wrapper.find('[data-test="dice-face"]').trigger('click')
    expect(wrapper.vm.isRolling).toBe(true)
    
    // Try to click again
    await wrapper.find('[data-test="dice-face"]').trigger('click')
    
    // Should still be the same roll
    expect(wrapper.emitted('roll')).toHaveLength(1)
  })

  it('displays last roll value', async () => {
    const wrapper = mount(Dice)
    
    wrapper.vm.currentValue = 6
    wrapper.vm.lastRoll = 6
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('6')
  })
})
```

**File**: `tests/unit/components/CoinFlip.spec.js`

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import CoinFlip from '@/components/CoinFlip.vue'

describe('CoinFlip Component', () => {
  it('renders flip button', () => {
    const wrapper = mount(CoinFlip)
    expect(wrapper.find('[data-test="flip-button"]').exists()).toBe(true)
  })

  it('flips coin when button clicked', async () => {
    const wrapper = mount(CoinFlip)
    
    await wrapper.find('[data-test="flip-button"]').trigger('click')
    expect(wrapper.vm.isFlipping).toBe(true)
  })

  it('generates either player1 or player2 result', async () => {
    const wrapper = mount(CoinFlip)
    
    await wrapper.vm.flip()
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    expect(['player1', 'player2']).toContain(wrapper.vm.result)
  })

  it('emits result event after flip', async () => {
    const wrapper = mount(CoinFlip)
    
    await wrapper.vm.flip()
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    expect(wrapper.emitted('result')).toBeTruthy()
    expect(['player1', 'player2']).toContain(wrapper.emitted('result')[0][0])
  })

  it('disables button after first flip', async () => {
    const wrapper = mount(CoinFlip)
    
    await wrapper.vm.flip()
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    expect(wrapper.find('[data-test="flip-button"]').attributes('disabled')).toBeDefined()
  })

  it('displays result message', async () => {
    const wrapper = mount(CoinFlip, {
      props: {
        player1Name: 'Alice',
        player2Name: 'Bob'
      }
    })
    
    wrapper.vm.result = 'player1'
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Alice goes first!')
  })
})
```

#### 11.2.3 Utility Function Tests
**File**: `tests/unit/utils/random.spec.js`

```javascript
import { describe, it, expect, vi } from 'vitest'
import { rollDice, flipCoin } from '@/utils/random'

describe('Random Utilities', () => {
  describe('rollDice', () => {
    it('returns number between 1 and 6', () => {
      const results = new Set()
      for (let i = 0; i < 100; i++) {
        const roll = rollDice()
        expect(roll).toBeGreaterThanOrEqual(1)
        expect(roll).toBeLessThanOrEqual(6)
        results.add(roll)
      }
      // Should hit multiple different values
      expect(results.size).toBeGreaterThan(1)
    })

    it('produces roughly even distribution over many rolls', () => {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      const numRolls = 6000
      
      for (let i = 0; i < numRolls; i++) {
        const roll = rollDice()
        counts[roll]++
      }
      
      // Each should appear roughly 1000 times (±200 for randomness)
      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(800)
        expect(count).toBeLessThan(1200)
      })
    })
  })

  describe('flipCoin', () => {
    it('returns either player1 or player2', () => {
      const result = flipCoin()
      expect(['player1', 'player2']).toContain(result)
    })

    it('produces roughly 50/50 distribution', () => {
      const results = { player1: 0, player2: 0 }
      const numFlips = 1000
      
      for (let i = 0; i < numFlips; i++) {
        const flip = flipCoin()
        results[flip]++
      }
      
      // Each should appear roughly 500 times (±100 for randomness)
      expect(results.player1).toBeGreaterThan(400)
      expect(results.player1).toBeLessThan(600)
      expect(results.player2).toBeGreaterThan(400)
      expect(results.player2).toBeLessThan(600)
    })
  })
})
```

### 11.3 Integration Testing
**File**: `tests/integration/gameFlow.spec.js`

```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '@/App.vue'
import { useGameStore } from '@/stores/gameStore'

describe('Full Game Flow Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('completes a full turn cycle', async () => {
    const wrapper = mount(App)
    const store = useGameStore()
    
    // Setup
    await wrapper.find('[data-test="player1-name"]').setValue('Alice')
    await wrapper.find('[data-test="player2-name"]').setValue('Bob')
    
    // Coin flip
    await wrapper.find('[data-test="flip-coin"]').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    // Start game
    await wrapper.find('[data-test="start-turn"]').trigger('click')
    
    expect(store.gameStarted).toBe(true)
    expect(store.currentPhase).toBe('draw')
    
    // Progress through phases
    await wrapper.find('[data-test="next-phase"]').trigger('click')
    expect(store.currentPhase).toBe('play')
    
    await wrapper.find('[data-test="next-phase"]').trigger('click')
    expect(store.currentPhase).toBe('attack')
    
    await wrapper.find('[data-test="next-phase"]').trigger('click')
    expect(store.currentPhase).toBe('end')
    
    // End turn
    const firstPlayer = store.currentPlayer
    await wrapper.find('[data-test="end-turn"]').trigger('click')
    
    expect(store.currentPlayer).not.toBe(firstPlayer)
    expect(store.currentPhase).toBe('draw')
    expect(store.turnNumber).toBe(2)
  })

  it('handles mana economy correctly through turn', async () => {
    const wrapper = mount(App)
    const store = useGameStore()
    
    store.startGame('player1')
    
    const initialPool = store.sharedManaPool
    const initialPlayerMana = store.players.player1.availableMana
    
    // Should have received 1 mana on start
    expect(initialPlayerMana).toBe(1)
    expect(store.sharedManaPool).toBe(initialPool - 1)
    
    // Spend mana
    store.returnManaToPool('player1', 1)
    expect(store.players.player1.availableMana).toBe(0)
    expect(store.sharedManaPool).toBe(initialPool)
  })
})
```

### 11.4 Coverage Requirements

#### Minimum Coverage Thresholds
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%
- **Statements**: 80%

#### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for specific file
npm run test -- Dice.spec.js

# Run tests with UI
npm run test:ui
```

#### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### 11.5 Continuous Integration

#### GitHub Actions Workflow
**File**: `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
    
    - name: Archive coverage report
      uses: actions/upload-artifact@v3
      with:
        name: coverage-report
        path: coverage/
```

### 11.6 Cross-Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 11.7 Performance Testing
- Animation frame rate > 30fps
- Component render time < 16ms
- State update time < 50ms
- LocalStorage operations < 100ms

---

## 12. Development Roadmap (Test-Driven Development)

> **TDD Mandate**: All code written using Red-Green-Refactor cycle. No production code without failing test first.

### Week 1: Foundation & TDD Setup
**Focus**: Establish TDD workflow and build foundation

- [ ] Initialize Vue.js 3 project with Vite
- [ ] Configure Vitest with full test utilities
- [ ] Set up test coverage reporting (c8)
- [ ] Configure ESLint + Prettier with test best practices
- [ ] Create project structure and test folders
- [ ] Write TDD workflow documentation for team

**TDD Component Development**:
- [ ] **Random Utilities (TDD)**
  - Write tests for `rollDice()` (distribution, range)
  - Write tests for `flipCoin()` (50/50 distribution)
  - Implement utilities to pass tests
  - Achieve 100% coverage on utilities

- [ ] **Game Store Foundation (TDD)**
  - Write tests for initial state
  - Write tests for player initialization
  - Implement store structure
  - Write tests for state getters

- [ ] **PlayerNameBox Component (TDD)**
  - Write test: renders with default name
  - Write test: updates on input change
  - Write test: emits name change event
  - Implement component with minimal code
  - Refactor: add styling and validation

- [ ] **LifeCounter Component (TDD)**
  - Write test: renders initial life (20)
  - Write test: increment button adds 1
  - Write test: decrement button removes 1
  - Write test: emits life-change event
  - Write test: warning style when < 5
  - Write test: critical style when <= 0
  - Implement component to pass all tests
  - Refactor: extract logic into composable

**End of Week Goal**: 4 components, 100% test coverage, TDD workflow established

---

### Week 2: Core Game Mechanics (TDD)
**Focus**: Mana system and dice/coin mechanics

- [ ] **ManaCounter Component (TDD)**
  - Write test: displays current mana count
  - Write test: updates when store changes
  - Write test: shows player color correctly
  - Implement with Pinia integration
  - Refactor: optimize reactivity

- [ ] **SharedManaPool Component (TDD)**
  - Write test: renders pool total
  - Write test: increment button works
  - Write test: decrement button works
  - Write test: cannot go below 0
  - Write test: logs manual adjustments
  - Implement component
  - Refactor: add visual feedback

- [ ] **Mana Store Actions (TDD)**
  - Write test: transferManaToPlayer() moves from pool
  - Write test: returnManaToPool() moves to pool
  - Write test: fails if insufficient mana in pool
  - Write test: logs all mana transfers
  - Implement store actions
  - Refactor: extract validation logic

- [ ] **CoinFlip Component (TDD)**
  - Write test: renders flip button
  - Write test: generates player1 or player2
  - Write test: distribution is ~50/50 (1000 flips)
  - Write test: emits result event
  - Write test: disables after first flip
  - Write test: displays result message
  - Implement component with animation
  - Refactor: extract animation to composable

- [ ] **Dice Component (TDD)**
  - Write test: renders dice face
  - Write test: generates 1-6 on roll
  - Write test: distribution is even (6000 rolls)
  - Write test: emits roll event with value
  - Write test: shows last roll value
  - Write test: disables during animation
  - Write test: animation completes in < 1s
  - Implement component
  - Refactor: optimize animation performance

**End of Week Goal**: 6 more components, mana system complete, 80%+ coverage

---

### Week 3: Game Logic & Turn Management (TDD)
**Focus**: Turn phases and game flow

- [ ] **Turn Management Store (TDD)**
  - Write test: startGame() initializes correctly
  - Write test: first player gets 1 mana
  - Write test: nextPhase() advances correctly
  - Write test: phase cycle: draw→play→attack→end
  - Write test: endTurn() switches players
  - Write test: turn counter increments
  - Write test: draw phase grants mana automatically
  - Implement all turn logic
  - Refactor: extract phase machine logic

- [ ] **TurnManager Component (TDD)**
  - Write test: displays current player
  - Write test: displays current phase
  - Write test: shows phase instructions
  - Write test: next phase button works
  - Write test: end turn button switches players
  - Write test: start buttons only active at start
  - Write test: buttons disabled during transitions
  - Implement component
  - Refactor: add transition animations

- [ ] **ActionLog Component (TDD)**
  - Write test: renders empty log
  - Write test: adds new entries
  - Write test: displays timestamp
  - Write test: color codes by type
  - Write test: limits to max entries (50)
  - Write test: auto-scrolls to latest
  - Write test: can clear log
  - Implement component
  - Refactor: add export functionality

- [ ] **Integration Tests (TDD)**
  - Write test: complete turn cycle flow
  - Write test: mana granted at turn start
  - Write test: mana tracking through buy/return
  - Write test: game state persists correctly
  - Write test: win condition detection
  - Implement any missing integrations
  - Refactor: optimize state updates

**End of Week Goal**: Full game logic, integration tests pass, 85%+ coverage

---

### Week 4: Polish, Persistence & Visual Testing (TDD)
**Focus**: Storage, animations, and edge cases

- [ ] **LocalStorage Utility (TDD)**
  - Write test: saves game state
  - Write test: loads game state
  - Write test: handles corrupted data
  - Write test: handles missing data
  - Write test: handles full storage
  - Implement storage wrapper
  - Refactor: add encryption (optional)

- [ ] **Auto-save Functionality (TDD)**
  - Write test: saves on state change (debounced)
  - Write test: loads on app mount
  - Write test: prompts for unsaved changes
  - Implement auto-save system
  - Refactor: optimize save frequency

- [ ] **Edge Case Tests**
  - Write test: mana pool reaches 0
  - Write test: player life reaches 0
  - Write test: rapid button clicking
  - Write test: browser refresh during game
  - Write test: invalid state recovery
  - Fix any issues discovered

- [ ] **Animation Performance Tests**
  - Write test: dice animation < 1000ms
  - Write test: coin flip animation < 1100ms
  - Write test: no animation frame drops
  - Optimize if needed

- [ ] **CSS & Responsive (Visual Testing)**
  - Add CSS animations and transitions
  - Test responsive breakpoints manually
  - Test touch targets (min 44x44px)
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Mobile device testing (iOS, Android)

- [ ] **Sound Effects (Optional Testing)**
  - Add sound toggle functionality (TDD)
  - Test mute/unmute works
  - Test sounds play correctly

**End of Week Goal**: 90%+ coverage, all edge cases handled, production-ready

---

### Week 5: CI/CD, Documentation & Launch
**Focus**: Automation and deployment

- [ ] **GitHub Actions CI/CD**
  - Set up test workflow (runs on every push)
  - Set up deployment workflow (on main push)
  - Configure coverage reporting (Codecov)
  - Add status badges to README
  - Test CI/CD pipeline with dummy PR

- [ ] **Code Quality Gates**
  - Enforce 80% coverage requirement
  - Add lint checks to CI
  - Add type checking (if TypeScript)
  - Block merge if tests fail

- [ ] **Documentation**
  - Write user guide with screenshots
  - Create video walkthrough (5-10 min)
  - Document TDD approach taken
  - Add CONTRIBUTING.md for contributors
  - Add CODE_OF_CONDUCT.md

- [ ] **Final QA**
  - Run full test suite locally
  - Manual testing of all features
  - Performance profiling
  - Accessibility audit (Lighthouse)
  - Security review (no vulnerabilities)

- [ ] **Deploy to GitHub Pages**
  - Configure Vite for GitHub Pages
  - Deploy via GitHub Actions
  - Verify production deployment
  - Test all features on live site

- [ ] **Post-Launch**
  - Monitor error logs (if added)
  - Gather user feedback
  - Create issue templates
  - Plan next iteration features

**End of Week Goal**: Live production site, full documentation, monitoring in place

---

### TDD Development Metrics (Track Weekly)

| Week | Components | Tests Written | Tests Passing | Coverage | Defects Found |
|------|------------|---------------|---------------|----------|---------------|
| 1    | 4          | ~30           | 100%          | 100%     | 0             |
| 2    | +6         | ~60           | 100%          | 85%+     | 0             |
| 3    | +3         | ~40           | 100%          | 90%+     | 0             |
| 4    | 0 (polish) | ~20           | 100%          | 90%+     | 0             |
| 5    | 0 (deploy) | 0             | 100%          | 90%+     | 0             |

**Expected Final Stats**:
- Total Components: ~13
- Total Tests: ~150+
- Final Coverage: 90%+
- Defects in Production: 0 (caught by tests)
- Test Execution Time: < 5 seconds

---

## 13. Deployment

### 13.1 GitHub Pages Hosting

#### Repository Setup
1. Create GitHub repository: `runes-gambit-web`
2. Push code to `main` branch
3. Enable GitHub Pages in repository settings

#### Build Configuration
**File**: `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/runes-gambit-web/', // Replace with your repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  }
})
```

#### GitHub Actions Workflow
**File**: `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 13.2 Deployment Steps

#### Initial Setup
1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save changes

2. **Configure Base Path**:
   - Update `vite.config.js` with correct `base` path
   - Format: `/repository-name/`

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Automatic Deployment**:
   - GitHub Actions will automatically build and deploy
   - Check Actions tab for deployment status
   - Site will be available at: `https://username.github.io/runes-gambit-web/`

#### Manual Deployment (Alternative)
Install `gh-pages` package:
```bash
npm install --save-dev gh-pages
```

Deploy manually:
```bash
npm run deploy
```

### 13.3 Post-Deployment

#### Verify Deployment
- [ ] Visit deployed URL
- [ ] Test all interactive elements
- [ ] Verify localStorage works (HTTPS required)
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify all assets load correctly

#### URL Structure
- **Production**: `https://username.github.io/runes-gambit-web/`
- **Development**: `http://localhost:5173/`

#### Custom Domain (Optional)
1. Add `CNAME` file to `public/` folder with domain name
2. Configure DNS records at domain registrar
3. Enable HTTPS in GitHub Pages settings

### 13.4 Environment Configuration

#### .env Files
**File**: `.env.production`
```
VITE_APP_TITLE=Runes Gambit
VITE_APP_VERSION=1.0.0
VITE_BASE_URL=/runes-gambit-web/
```

**File**: `.env.development`
```
VITE_APP_TITLE=Runes Gambit (Dev)
VITE_APP_VERSION=1.0.0-dev
VITE_BASE_URL=/
```

### 13.5 Monitoring & Updates

#### Update Process
1. Make changes to code
2. Commit and push to `main` branch
3. GitHub Actions automatically rebuilds and deploys
4. Verify changes at production URL

#### Rollback Strategy
- Use GitHub releases for version tagging
- Revert to previous commit if needed
- Redeploy from specific commit/tag

#### Performance Monitoring
- Use Lighthouse CI for performance checks
- Monitor Core Web Vitals
- Track deployment success rate in Actions

---

## 14. Maintenance & Support

### 14.1 Bug Tracking
- Use GitHub Issues
- Label priority: Critical, High, Medium, Low
- Tag by component

### 14.2 Feature Requests
- Community feedback via GitHub Discussions
- Prioritize based on user votes

### 14.3 Updates
- Version numbering: MAJOR.MINOR.PATCH
- Changelog maintained in CHANGELOG.md
- Backward compatibility for saved games

---

## 15. Success Metrics

### 15.1 User Engagement
- Average session duration
- Games completed per session
- Return user rate

### 15.2 Technical Performance
- Page load time < 2s
- Animation frame rate > 30fps
- Zero console errors
- LocalStorage save/load < 100ms

### 15.3 User Satisfaction
- User survey: Ease of use (1-5 scale)
- Error rate: < 1% of interactions
- Mobile usability score: > 90

---

## 16. Conclusion

This design document outlines a complete client-side web application for Runes Gambit that digitizes game tracking while maintaining the physical card gameplay. The MVP focuses on essential tracking features (life, mana, turns, dice) with room for enhancement in future phases.

**Key Design Principles**:
1. **Simplicity**: Clean, intuitive interface
2. **Clarity**: Clear visual feedback for all actions
3. **Accessibility**: Usable by all players
4. **Performance**: Smooth animations and responsive interactions
5. **Flexibility**: Manual adjustments allowed for error correction

**Next Steps**:
1. Review and approve design document
2. Set up development environment
3. Begin Phase 1 implementation
4. Iterate based on playtesting feedback

---

## Appendix A: Wireframe References

[Detailed wireframes would be inserted here with actual mockups/sketches]

## Appendix B: Color Palette

```
Red Player:
- Primary: #D32F2F
- Light: #FFCDD2
- Dark: #B71C1C

Blue Player:
- Primary: #1976D2
- Light: #BBDEFB
- Dark: #0D47A1

Neutral:
- Background: #FAFAFA
- Surface: #FFFFFF
- Border: #E0E0E0
- Text: #212121
- Text Secondary: #757575

Accents:
- Success: #4CAF50
- Warning: #FF9800
- Error: #F44336
- Mana: #2196F3
- Gold: #FFC107
```

## Appendix C: References

- [Runes Gambit Official Rules](./runes-gambit-rules.md)
- [Web Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Principles](https://material.io/design)

---

**Document Version**: 1.0  
**Last Updated**: January 20, 2026  
**Author**: GitHub Copilot  
**Status**: Draft - Awaiting Review
