# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-01-21

### Added

#### Project Setup (Task 01)
- Initialized Vite + Vue 3 project structure
- Configured ESLint with Vue 3 support
- Set up Vitest testing framework
- Created repository with GitHub configuration
- Set up `.gitignore` and basic documentation

#### Random Utilities (Task 02)
- Implemented `randomInt(min, max)` for random number generation
- Implemented `shuffleArray()` for Fisher-Yates shuffling
- Comprehensive unit tests for random utilities
- Edge case handling for boundary values

#### Game Store Foundation (Task 03)
- Created Pinia store architecture
- Implemented game state structure
- Added initial game actions and getters
- Pinia store setup and configuration
- Comprehensive unit tests

#### Player Name Box (Task 04)
- Created `PlayerNameBox.vue` component
- Input validation (1-50 characters)
- Two-way binding with store
- Visual feedback for empty names
- Unit tests with input scenarios

#### Life Counter (Task 05)
- Created `LifeCounter.vue` component
- Increment/decrement buttons
- Visual warnings at low life (< 5 life)
- Critical state indicator (≤ 0 life)
- Smooth animations
- Unit tests for all states

#### Mana Counter (Task 06)
- Created `ManaCounter.vue` read-only display
- Real-time store binding
- Player-specific styling (red/blue)
- Mana pool indicator
- Unit tests

#### Shared Mana Pool (Task 07)
- Created `SharedManaPool.vue` component
- Add/remove mana controls
- Prevents pool going below 0
- Maximum pool cap at 100
- Visual feedback
- Unit tests

#### Mana Store Actions (Task 08)
- Implemented `transferManaToPlayer()` action
- Implemented `returnManaToPool()` action
- Implemented `addManaToPool()` and `removeManaFromPool()`
- Input validation and error handling
- Prevents invalid transfers
- Unit tests with edge cases

#### Coin Flip (Task 09)
- Created `CoinFlip.vue` component
- 1-second flip animation
- 50/50 result probability
- Result display with emotes
- Reset button functionality
- Unit tests for randomness

#### Dice Component (Task 10)
- Created `Dice.vue` component
- Roll animation (0.8 seconds)
- Result display (1-6)
- Last roll memory
- Multiple sequential rolls
- Unit tests with animation timing

#### Turn Management Store (Task 11)
- Implemented game phases (draw, play, attack, end)
- Phase advancement logic
- Turn switching mechanics
- Current player tracking
- Turn counter
- Unit tests

#### Turn Manager Component (Task 12)
- Created `TurnManager.vue` component
- Phase display and controls
- Turn number tracking
- Reset game functionality
- Confirmation dialogs
- Unit tests

#### Action Log (Task 13)
- Created `ActionLog.vue` component
- Log entry display with types
- Color-coded message types (info, success, warning, error)
- Clear log functionality
- Export to file capability
- Auto-scroll to latest entry
- Unit tests

#### Integration Tests (Task 14)
- Created `tests/integration/gameFlow.spec.js`
- Multi-component interaction tests
- Full game scenario testing
- State synchronization verification
- Component communication tests
- 26 integration tests

#### Main App Component (Task 15)
- Created `App.vue` root component
- Three-column responsive layout
- Player panels (left/right)
- Center game tools section
- Bottom action log section
- Restore notification for saved games
- Full application integration
- 30 unit tests

#### Local Storage Persistence (Task 16)
- Implemented `storage.js` utilities
- Game state save/load functionality
- Automatic state persistence
- Corrupt data handling
- localStorage error recovery
- Export capability
- 14 unit tests

#### Animations & Polish (Task 17)
- Added smooth CSS transitions
- Life counter animations
- Mana counter animations
- Coin flip animation (1s)
- Dice roll animation (0.8s)
- Phase transition effects
- Component entrance animations
- 8 animation tests
- 96% code coverage achieved
- 302 total tests

#### Edge Cases & Error Handling (Task 18)
- Comprehensive error validation
- Invalid input handling (NaN, negative, wrong type)
- Boundary condition testing
- Malformed data recovery
- Player ID validation
- Game state transition guards
- Action log sanitization
- 26 edge case tests
- 95.35% code coverage
- 336 total tests

#### CI/CD Setup (Task 19)
- GitHub Actions CI workflow
  - Matrix testing (Node 18.x, 20.x)
  - Coverage reporting
  - Test artifacts
- GitHub Actions Deploy workflow
  - Automatic GitHub Pages deployment
  - Production build generation
  - Artifact management
- GitHub Actions Lint workflow
  - ESLint checks on PRs
  - Automated linting
- ESLint flat config
  - Browser globals support
  - Vitest globals configuration
  - Production rules
- Lighthouse CI configuration
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 90+
  - SEO: 90+
- Enhanced README with badges
- Updated `.gitignore` for build artifacts
- `.gitattributes` for line ending consistency
- Package.json script enhancements
- 0 ESLint errors
- 338 tests passing
- 95.35% coverage maintained

#### Deployment & Documentation (Task 20)
- Enhanced `vite.config.js`
  - Production optimizations
  - Code splitting (vendor/utils)
  - Sourcemaps for debugging
  - Terser minification with console drop
  - Asset inlining configuration
- User Guide (`docs/USER_GUIDE.md`)
  - Getting started tutorial
  - Game setup instructions
  - Complete rules documentation
  - Component guides
  - Strategy tips
  - Troubleshooting section
  - Keyboard shortcuts reference
- Developer Guide (`docs/DEVELOPER_GUIDE.md`)
  - Architecture overview
  - Project structure documentation
  - State management guide
  - Testing strategy and patterns
  - Development workflow
  - Contribution guidelines
  - Deployment instructions
- API Documentation (`docs/API.md`)
  - Complete store API reference
  - Utility function documentation
  - Component prop/event definitions
  - Type definitions
  - Code examples
  - Error handling patterns
- CHANGELOG (this file)
- CONTRIBUTING guide
- GitHub Pages deployment verification

### Features

**Game Mechanics**
- Two-player turn-based gameplay
- Life point management (0-20, can go negative)
- Shared mana pool (0-20)
- Individual player mana (0-20)
- Four-phase turn system (draw, play, attack, end)
- Coin flip for first player selection
- Dice rolling (1-6)

**User Interface**
- Responsive three-column layout
  - Mobile: Stacked layout
  - Tablet: Two columns
  - Desktop: Three columns
- Color-coded players (red/blue)
- Real-time state updates
- Smooth animations
- Visual feedback for all actions
- Accessibility features

**Data Persistence**
- Automatic game state saving
- Browser localStorage support
- Restore previous game on page load
- Export game history
- Corrupt data recovery

**Developer Experience**
- TDD methodology with 338+ tests
- 95%+ code coverage
- ESLint with zero errors
- Comprehensive documentation
- GitHub Actions CI/CD
- GitHub Pages deployment
- Hot module replacement (HMR)
- Source maps for debugging

### Performance Optimizations

- Code splitting for vendor/utils
- Asset inlining for images < 4KB
- Terser minification (drop console, debugger)
- Source maps for production debugging
- Lazy component loading
- Optimized re-renders with computed properties
- Efficient state management with Pinia

### Documentation

- User Guide with game rules and strategy
- Developer Guide with architecture and workflows
- API Reference with all store actions and utilities
- CONTRIBUTING guidelines for contributors
- CHANGELOG (this file)
- README with badges and setup instructions
- Inline code comments and JSDoc

### Testing

- 338 tests across unit/integration/edge cases
- 95.35% code coverage
- Component rendering tests
- State management tests
- Integration tests
- Edge case handling
- Accessibility tests
- Animation timing tests

### CI/CD Pipeline

- Automated testing on push/PR
- Multi-version Node.js support (18.x, 20.x)
- Automatic GitHub Pages deployment
- ESLint checks
- Lighthouse performance monitoring
- Build artifacts management
- Coverage reporting

---

## [Unreleased]

### Planned Features

- Card system for full TCG gameplay
- Multiplayer network support
- Game statistics and leaderboards
- Custom game modes
- Sound effects and music
- Dark mode support
- Mobile app version
- Advanced AI opponent
- Replay system
- Tournament mode

---

## Breaking Changes

None for v1.0.0 (initial release)

---

## Known Issues

None currently reported

---

## Deprecated

None

---

## Notes

This project uses semantic versioning:
- **MAJOR**: Breaking API changes (increment when making incompatible changes)
- **MINOR**: New features backward compatible (increment when adding functionality)
- **PATCH**: Bug fixes (increment for patches and hotfixes)

All changes are automatically tested and deployed via GitHub Actions.
