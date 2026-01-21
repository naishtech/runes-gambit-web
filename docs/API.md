# Runes Gambit - API Documentation

## Table of Contents
1. [Store API](#store-api)
2. [Utility Functions](#utility-functions)
3. [Components](#components)
4. [Type Definitions](#type-definitions)

---

## Store API

### Game Store (`src/stores/gameStore.js`)

The central Pinia store for all game state and logic.

#### State

```javascript
{
  gameStarted: Boolean,      // Is game in progress
  currentPlayer: String,     // 'player1' or 'player2'
  currentPhase: String,      // 'draw', 'play', 'attack', 'end'
  turnCount: Number,         // Current turn number
  players: {
    player1: PlayerState,    // Red player
    player2: PlayerState     // Blue player
  },
  sharedManaPool: Number,    // Total shared mana (0-100)
  actionLog: Array<LogEntry> // Game action history
}

PlayerState = {
  name: String,              // Player name (1-50 chars)
  life: Number,              // Current life points (-infinity to infinity)
  availableMana: Number      // Mana for this player (0-100)
}

LogEntry = {
  message: String,           // Action description
  type: 'info'|'success'|'warning'|'error', // Log level
  timestamp: Number          // When action occurred
}
```

#### Actions

##### Player Management

**`setPlayerName(playerId, name)`**
- Sets player's display name
- `playerId`: 'player1' or 'player2'
- `name`: String, 1-50 characters
- Validates input before updating
- Saves to localStorage

```javascript
const store = useGameStore()
store.setPlayerName('player1', 'Alice')
```

**`adjustLife(playerId, amount)`**
- Adds/subtracts life points
- `playerId`: 'player1' or 'player2'
- `amount`: Number (positive or negative)
- Returns: Boolean (success/failure)
- Validates player ID

```javascript
const store = useGameStore()
store.adjustLife('player1', -5)  // Damage 5 life
store.adjustLife('player2', 3)   // Heal 3 life
```

**`setAvailableMana(playerId, amount)`**
- Sets available mana for player
- `playerId`: 'player1' or 'player2'
- `amount`: Number (0-100)
- Validates range and player ID
- Returns: Boolean

```javascript
const store = useGameStore()
store.setAvailableMana('player1', 5)
```

##### Game Control

**`startGame(startingPlayer)`**
- Initialize game with given starting player
- `startingPlayer`: 'player1' or 'player2'
- Resets all state to initial values
- Adds log entry
- Returns: Boolean

```javascript
const store = useGameStore()
store.startGame('player1')  // Player 1 goes first
```

**`nextPhase()`**
- Advance to next phase (draw → play → attack → end)
- Auto-wraps to draw if called in end phase
- Only works if game started
- Adds log entry
- Returns: Boolean

```javascript
const store = useGameStore()
store.nextPhase()  // Advance phase
```

**`endTurn()`**
- Complete current turn and switch player
- Must be in 'end' phase
- Increments turn count
- Resets to next player's draw phase
- Adds log entry
- Returns: Boolean

```javascript
const store = useGameStore()
store.endTurn()  // Pass to opponent
```

**`resetGame()`**
- Clear all game state
- Clears action log
- Resets players to defaults
- Returns: Boolean

```javascript
const store = useGameStore()
if (confirm('Reset game?')) {
  store.resetGame()
}
```

##### Mana Management

**`addManaToPool(amount)`**
- Add mana to shared pool
- `amount`: Number (1-100, default 1)
- Validates non-negative
- Capped at 100
- Adds log entry
- Returns: Boolean

```javascript
const store = useGameStore()
store.addManaToPool(5)  // Add 5 mana to pool
```

**`removeManaFromPool(amount)`**
- Remove mana from shared pool
- `amount`: Number (1-100, default 1)
- Validates: amount <= current pool
- Cannot go below 0
- Adds log entry
- Returns: Boolean

```javascript
const store = useGameStore()
store.removeManaFromPool(2)  // Remove 2 mana
```

**`transferManaToPlayer(playerId, amount)`**
- Move mana from pool to player
- `playerId`: 'player1' or 'player2'
- `amount`: Number (1-100, default 1)
- Validates: amount available in pool
- Validates: player can receive
- Adds log entry
- Returns: Boolean

```javascript
const store = useGameStore()
store.transferManaToPlayer('player1', 3)
// Pool: -3, Player 1: +3
```

**`returnManaToPool(playerId, amount)`**
- Move mana from player to pool
- `playerId`: 'player1' or 'player2'
- `amount`: Number (1-100, default 1)
- Validates: player has mana
- Pool capped at 100
- Adds log entry
- Returns: Boolean

```javascript
const store = useGameStore()
store.returnManaToPool('player1', 1)
// Pool: +1, Player 1: -1
```

##### Action Log

**`addLog(message, type)`**
- Add entry to action log
- `message`: String (max 200 chars)
- `type`: 'info' | 'success' | 'warning' | 'error'
- Auto-sanitizes input
- Returns: Boolean

```javascript
const store = useGameStore()
store.addLog('Damage taken!', 'warning')
```

**`clearLog()`**
- Remove all log entries
- Requires confirmation
- Returns: Boolean

```javascript
const store = useGameStore()
store.clearLog()  // Clears action log
```

**`exportLog()`**
- Download action log as .txt file
- Generates timestamp-based filename
- Formats with type indicators
- Returns: void

```javascript
const store = useGameStore()
store.exportLog()  // Downloads: actionlog-TIMESTAMP.txt
```

#### Getters

**`isPlayer1Turn`**
- Check if player 1's turn
- Returns: Boolean

```javascript
const store = useGameStore()
if (store.isPlayer1Turn) {
  console.log("Player 1's turn")
}
```

**`isGameActive`**
- Check if game is started
- Returns: Boolean

```javascript
const store = useGameStore()
if (store.isGameActive) {
  // Show game controls
}
```

**`otherPlayer(playerId)`**
- Get opponent's player ID
- `playerId`: 'player1' or 'player2'
- Returns: String ('player1' or 'player2')

```javascript
const store = useGameStore()
const opponent = store.otherPlayer('player1')
console.log(opponent)  // 'player2'
```

---

## Utility Functions

### Random Utilities (`src/utils/random.js`)

**`randomInt(min, max)`**
- Generate random integer in range
- `min`: Number (inclusive)
- `max`: Number (inclusive)
- Returns: Number

```javascript
import { randomInt } from '@/utils/random'
const roll = randomInt(1, 6)  // 1-6
const flip = randomInt(0, 1)  // 0 or 1
```

**`shuffleArray(array)`**
- Fisher-Yates shuffle algorithm
- `array`: Array<any>
- Returns: Array<any> (shuffled copy)

```javascript
import { shuffleArray } from '@/utils/random'
const cards = [1, 2, 3, 4, 5]
const shuffled = shuffleArray(cards)
```

### Storage Utilities (`src/utils/storage.js`)

**`saveGameState(state)`**
- Persist game state to localStorage
- `state`: Game state object
- Includes timestamp
- Auto-cleanup old saves
- Returns: Boolean

```javascript
import { saveGameState } from '@/utils/storage'
const store = useGameStore()
saveGameState(store.$state)
```

**`loadGameState()`**
- Retrieve saved game from localStorage
- Auto-validates JSON
- Handles corrupt data gracefully
- Returns: Object | null

```javascript
import { loadGameState } from '@/utils/storage'
const saved = loadGameState()
if (saved) {
  // Restore game
}
```

**`clearGameState()`**
- Remove saved game from localStorage
- Returns: Boolean

```javascript
import { clearGameState } from '@/utils/storage'
clearGameState()  // Game cleared
```

---

## Components

### Component API

Each component accepts specific props and emits events.

#### LifeCounter

**Props:**
```javascript
{
  playerId: String,  // 'player1' or 'player2'
  color: String      // 'red' or 'blue'
}
```

**Events:**
```javascript
@adjust(amount)  // User clicked + or -
```

**Example:**
```vue
<LifeCounter 
  player-id="player1" 
  color="red"
  @adjust="handleAdjust"
/>
```

#### ManaCounter

**Props:**
```javascript
{
  playerId: String,   // 'player1' or 'player2'
  color: String       // 'red' or 'blue'
}
```

**Events:**
```javascript
// None - read-only display
```

**Example:**
```vue
<ManaCounter player-id="player1" color="red"/>
```

#### CoinFlip

**Props:**
```javascript
{
  // None
}
```

**Events:**
```javascript
@result(winner)  // 'player1' or 'player2'
```

**Example:**
```vue
<CoinFlip @result="handleFlip"/>
```

#### Dice

**Props:**
```javascript
{
  // None
}
```

**Events:**
```javascript
@roll(value)  // 1-6
```

**Example:**
```vue
<Dice @roll="handleRoll"/>
```

#### TurnManager

**Props:**
```javascript
{
  // None - reads from store
}
```

**Events:**
```javascript
// None - updates store directly
```

**Example:**
```vue
<TurnManager/>
```

#### ActionLog

**Props:**
```javascript
{
  // None - reads from store
}
```

**Events:**
```javascript
// None - updates store directly
```

**Example:**
```vue
<ActionLog/>
```

---

## Type Definitions

### Game Types

```javascript
// Player ID type
type PlayerId = 'player1' | 'player2'

// Game phases
type GamePhase = 'draw' | 'play' | 'attack' | 'end'

// Log entry types
type LogType = 'info' | 'success' | 'warning' | 'error'

// Player state
interface PlayerState {
  name: string
  life: number
  availableMana: number
}

// Action log entry
interface LogEntry {
  message: string
  type: LogType
  timestamp: number
}

// Game state
interface GameState {
  gameStarted: boolean
  currentPlayer: PlayerId
  currentPhase: GamePhase
  turnCount: number
  players: {
    player1: PlayerState
    player2: PlayerState
  }
  sharedManaPool: number
  actionLog: LogEntry[]
}
```

---

## Common Patterns

### Using the Store in Components

```javascript
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'

export default {
  setup() {
    const store = useGameStore()
    
    const currentLife = computed(() => 
      store.players.player1.life
    )
    
    const handleAdjustLife = (amount) => {
      store.adjustLife('player1', amount)
    }
    
    return {
      currentLife,
      handleAdjustLife
    }
  }
}
```

### Testing Store Actions

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

it('should adjust life correctly', () => {
  const store = useGameStore()
  store.startGame('player1')
  store.adjustLife('player1', -5)
  expect(store.players.player1.life).toBe(15)
})
```

### Persistence Pattern

```javascript
import { useGameStore } from '@/stores/gameStore'
import { saveGameState, loadGameState } from '@/utils/storage'

export default {
  setup() {
    const store = useGameStore()
    
    // Load saved game on mount
    onMounted(() => {
      const saved = loadGameState()
      if (saved) {
        Object.assign(store.$state, saved)
      }
    })
    
    // Save on every state change
    watch(() => store.$state, (newState) => {
      saveGameState(newState)
    }, { deep: true })
  }
}
```

---

## Error Handling

All store actions validate inputs and return Boolean:
- `true` = Success
- `false` = Validation failed

Actions also:
- Log errors to action log
- Validate player IDs
- Validate game state
- Check permissions (e.g., must be active to adjust life)
- Handle edge cases (e.g., negative amounts, invalid ranges)

```javascript
const store = useGameStore()

// Validates player ID
if (!store.adjustLife('invalid', 5)) {
  console.log('Failed - invalid player')
}

// Validates amount type
if (!store.transferManaToPlayer('player1', 'five')) {
  console.log('Failed - invalid amount')
}
```

---

## Performance Considerations

- Computed getters are memoized
- Deep watchers only where needed
- State updates batch properly
- localStorage calls are debounced in application code
- Component re-renders optimized with template keys

---

## Support

For API questions or bugs:
- [GitHub Issues](https://github.com/naishtech/runes-gambit-web/issues)
- [Developer Guide](./DEVELOPER_GUIDE.md)
