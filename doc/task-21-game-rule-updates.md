# Task 21: Game Rule Updates & Start Flow

Status: Completed ✓
Completed: January 21, 2026
Estimated Time: 4 hours (Actual: ~3.5 hours)
Dependencies: Tasks 01-20
Week: 6

## Objective
Update core game rules and start flow:
- Disallow direct add/remove to the shared mana pool. Pool changes only via start-of-turn allocation, returning mana from a player, or card effects.
- Introduce per-player dice usage for Attack and Defence phases.
- Move the coin flip to a landing page that controls game start.

## Why
These changes align gameplay with card-effect driven resource management, clarify combat tooling per player, and streamline onboarding before the match begins.

---

## Scope & Requirements

### 1) Mana Pool Restrictions
- Remove UI controls that directly `+/-` the shared mana pool.
- Permit pool changes via:
  - Start-of-turn allocation (existing: +1 to current player from pool, if available)
  - `returnManaToPool(playerId, amount)`
  - Card actions: `giveManaToOpponent(fromPlayerId, amount)`, `returnManaFromPlayer(playerId, amount)`
- Store actions `addManaToPool(amount)` and `removeManaFromPool(amount)` become internal-only (not exposed via UI).
- Validation must ensure pool never goes below 0, and player mana never below 0.

Acceptance Criteria:
- No visible controls to directly mutate pool.
- Transfers only allowed via player-driven actions and start-of-turn.
- All validations and logs reflect new constraints.

### 2) Per-Player Dice Usage
- Each player has access to their own dice tool during Attack and Defence phases.
- UI shows two dice instances (Player 1 / Player 2) with ownership labels or color coding.
- Enable dice interactions only when `currentPhase` is `attack` or `defence` (if we retain 4 phases, Defence maps to `end` or we introduce an explicit `defence` phase — see Design Notes).
- Store records dice rolls in action log including owner and value.

Acceptance Criteria:
- Two dice visible with clear ownership.
- Dice can roll only in Attack/Defence phases.
- Rolls log to action log with player and value.

### 3) Landing Page Start Flow
- Create a simple landing page with:
  - Coin flip component
  - "Start Game" button that initializes the game using the flip result (or manual override).
- The main app renders this landing page until the game is started.
- After start, navigate/render into the main game UI.

Acceptance Criteria:
- Coin flip is not inside the in-game UI.
- "Start Game" uses result (or lets user choose starting player).
- Clean transition from landing → game.

---

## Design Notes

- Phases: current implementation uses `draw`, `play`, `attack`, `end`. Defence actions can be modeled during `attack` responses or we can introduce `defence`. For minimal churn, we will:
  - Keep phases unchanged.
  - Gate player dice usage to `attack` for both players; Defence actions are performed via conventions/logging (optional)
  - Optionally add `defence` later (Task 21.1) if required.

- Store APIs:
  - Keep existing actions but hide pool mutation from UI.
  - Add card-effect helpers as wrappers over existing validated transfers.

---

## Implementation Plan

1. Store Layer
- [x] Add "card effect" helpers:
  - `giveManaToOpponent(fromPlayerId, amount)` → reduces `fromPlayerId.availableMana` and increases opponent `availableMana` (validations; logs)
  - `returnManaFromPlayer(playerId, amount)` → reduces player `availableMana`, increases `sharedManaPool` (validations; logs)
- [x] Ensure start-of-turn allocation is the only automatic pool→player transfer.
- [x] Deprecate external usage of `addManaToPool`/`removeManaFromPool` (keep internal for system events/tests only).

2. UI Components
- [x] Update `SharedManaPool.vue`: remove `+/-` buttons; present read-only total and explanatory tooltip.
- [x] Add `PlayerDice.vue` wrapper around `Dice.vue` with `owner` prop, active only in `attack` phase.
- [x] Render two `PlayerDice` instances (left/right panels).
- [x] Create `LandingPage.vue` with `CoinFlip` and "Start Game" button.
- [x] Update `App.vue` to conditionally render `LandingPage` until `gameStarted`.

3. Routing/Flow (without router)
- [x] Use conditional rendering in `App.vue` (no dependency on Vue Router required).
- [x] Wire the Start Game action to `store.startGame(startingPlayer)` using coin flip result.

4. Logging/Validation
- [x] Ensure every transfer writes concise log entries: source, target, amount, result.
- [x] Validate negative/NaN inputs as per existing guards.

5. Tests
- [x] Unit: `SharedManaPool.vue` no direct mutation controls.
- [x] Unit: `PlayerDice.vue` enabled only in `attack` phase.
- [x] Unit: new store helpers for card effects.
- [x] Integration: landing page flow → coin flip → start game → app renders.

---

## Risk & Impact
- Removal of pool controls may break tests expecting `+/-`. Plan to update/replace those tests.
- Dice phase gating may require minor changes to tests referencing dice in other phases.
- Landing page split affects `App.spec.js` expectations; update tests accordingly.

---

## Acceptance Checklist
- [x] No direct pool mutation controls visible.
- [x] Card-effect transfers work and are validated.
- [x] Two player dice rendered and phase-gated.
- [x] Landing page coin flip & Start Game flow implemented.
- [x] Updated unit/integration tests passing (329/329 tests passing ✓).
- [x] Documentation updated (inline code comments and this doc updated).

---

## Completion Summary

**Core Changes Implemented:**

1. **Store Layer** (`src/stores/gameStore.js`)
   - Added `giveManaToOpponent(fromPlayerId, amount)` action with full validation and logging.
   - Ensures pool constraints: no negative transfers, no invalid players, pool never below 0.

2. **Shared Mana Pool** (`src/components/SharedManaPool.vue`)
   - Removed all direct mutation buttons (`+`/`-`).
   - Changed to read-only display with informational message.

3. **Per-Player Dice** (`src/components/PlayerDice.vue`)
   - New component gated to `attack` phase only.
   - Logs all rolls with player context to action log.

4. **Landing Page** (`src/components/LandingPage.vue`)
   - New pre-game component with coin flip and start button.
   - Manages transition from pre-game to active game.

5. **App Flow** (`src/App.vue`)
   - Conditionally renders landing page until `gameStarted`.
   - Integrated PlayerDice instances for each player.
   - Removed legacy generic Dice tool item.

6. **TurnManager Refactor** (`src/components/TurnManager.vue`)
   - Removed pre-game start buttons.
   - Added pre-game note directing to Landing Page.
   - Reset button limited to active games.

7. **Test Suite**
   - 329/329 tests passing ✓
   - Unit tests updated for new components and constraints.
   - Integration tests now use store-driven game start with proper DOM sync.

**Validation:** All edge cases tested (negative amounts, invalid players, phase gating, state transitions).

---

## Deliverables
- Store updates (helpers, validations, logs)
- Updated `SharedManaPool.vue` (read-only)
- New `PlayerDice.vue`
- New `LandingPage.vue`
- `App.vue` conditional rendering for pre-game vs in-game
- Updated tests (unit & integration)
- Documentation updates
