# Turn Manager Simplification Plan

## Goal
Simplify the Turn Manager so both players always see all per-phase instructions at once and both players’ controls remain enabled. Replace phase-advancement controls with a single End Turn button that moves to the next player’s turn.

## Current vs Desired Behavior
- Current: Phases advance sequentially; controls and instructions change per phase; end turn only available in final phase.
- Desired: Always show the full set of turn instructions; both players can act any time; single End Turn finalizes the current player’s turn and hands off to the other player.

## Scope of Change
- Update Turn Manager UI to a simplified, single-state presentation for active games.
- Remove phase-by-phase controls; expose one End Turn action.
- Ensure both players’ controls remain usable throughout their turn.
- Preserve pre-game messaging and reset/new game behavior.

## UX Outline
- Pre-game: unchanged reminder to use Landing Page to start.
- In-game layout:
  - Current player name and turn number.
  - Static instructions block listing all turn actions/steps.
  - Controls row: End Turn (primary), New Game (secondary).
- No conditional hiding of controls based on phase.

## State & Logic Changes
- Eliminate per-phase gating in the component UI; remove `store.canAdvancePhase` and phase-specific control branches from the template.
- End Turn handler continues to call `store.endTurn()`; ensure store logic can be invoked at any point in the turn without phase checks.
- Confirm store doesn’t require `nextPhase()` for correctness; if so, retire related UI calls and ensure any phase-dependent side effects are triggered within `endTurn()` or elsewhere.

## Data & Instructions
- Replace `store.currentPhaseInstructions` display with a single comprehensive instructions set. Source options:
  1) Static list in the component; or
  2) A store/composable getter that returns the full turn instructions (preferred for reuse/testing).
- Keep current player color/name bindings.

## Testing Plan
- Unit: Component renders pre-game state; renders active state with both buttons always visible; End Turn emits `store.endTurn()` once per click; New Game flow triggers reset + navigation.
- Integration: Start game via Landing Page, then verify Turn Manager shows static instructions and End Turn increments turn/player correctly; ensure controls remain enabled throughout.

## Risks / Mitigations
- Hidden coupling to phase progression in the store: audit `endTurn()` to ensure no reliance on prior `nextPhase()` calls. Mitigate by moving required side effects into `endTurn()` or making them phase-independent.
- UX clarity: ensure the static instructions are concise and ordered; consider numbering steps.

## Rollout Steps
1) Update Turn Manager template/logic to remove phase controls and show static instructions.
2) Provide instructions source (static or getter) and render it.
3) Verify store logic supports direct end-turn without intermediate phases.
4) Update/extend unit and integration tests.
5) Manual smoke: start game, play several turns, confirm controls always enabled and instructions static.
