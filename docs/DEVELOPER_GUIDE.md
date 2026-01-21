# Runes Gambit - Developer Guide

## Table of Contents
1. [Architecture](#architecture)
2. [Project Structure](#project-structure)
3. [State Management](#state-management)
4. [Testing Strategy](#testing-strategy)
5. [Development Workflow](#development-workflow)
6. [Deployment](#deployment)
7. [Contributing](#contributing)

---

## Architecture

### Technology Stack
- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Testing**: Vitest + @vue/test-utils
- **Linting**: ESLint with Vue 3 support
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

### Design Principles
- **TDD First**: All features written with tests first
- **Component Composition**: Reusable, testable components
- **Centralized State**: Single source of truth with Pinia
- **Separation of Concerns**: Clear boundaries between UI and logic
- **Type Safety**: JavaScript with JSDoc comments for clarity

---

## Project Structure

```
runes-gambit-web/
├── src/
│   ├── App.vue              # Root component
│   ├── main.js              # Vue app initialization
│   ├── style.css            # Global styles
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   │   └── dice-faces/
│   │   └── sounds/
│   ├── components/          # Vue components
│   │   ├── ActionLog.vue
│   │   ├── CoinFlip.vue
│   │   ├── Dice.vue
│   │   ├── LifeCounter.vue
│   │   ├── ManaCounter.vue
│   │   ├── PlayerNameBox.vue
│   │   ├── SharedManaPool.vue
│   │   ├── TurnManager.vue
│   │   ├── ErrorNotification.vue
│   │   └── ErrorBoundary.vue
│   ├── stores/              # Pinia stores
│   │   └── gameStore.js
│   ├── utils/               # Utility functions
│   │   ├── random.js
│   │   └── storage.js
│   ├── composables/         # Vue composables
│   └── styles/              # Component styles
├── tests/
│   ├── setup.js             # Test environment setup
│   ├── unit/                # Unit tests
│   │   ├── components/
│   │   ├── stores/
│   │   └── utils/
│   └── integration/         # Integration tests
├── .github/
│   └── workflows/           # GitHub Actions
│       ├── ci.yml
│       ├── deploy.yml
│       └── lint.yml
├── docs/                    # Documentation
│   ├── USER_GUIDE.md
│   └── DEVELOPER_GUIDE.md
├── vite.config.js           # Vite configuration
├── vitest.config.js         # Vitest configuration
├── eslint.config.js         # ESLint configuration
└── package.json             # Dependencies
```

---

## State Management

### Pinia Store Structure

The game state is managed in `src/stores/gameStore.js` with the following modules:

#### Game State
```javascript
{
  // Game control
  gameStarted: false,
  currentPlayer: 'player1',
  currentPhase: 'draw',
  turnCount: 0,
  
  // Players
  players: {
    player1: { name: 'Red Player', life: 20, availableMana: 0 },
    player2: { name: 'Blue Player', life: 20, availableMana: 0 }
  },
  
  // Mana
  sharedManaPool: 20,
  
  // Actions
  actionLog: []
}
```

#### Available Actions

**Player Management:**
- `setPlayerName(playerId, name)` - Update player name
- `adjustLife(playerId, amount)` - Add/subtract life
- `setAvailableMana(playerId, amount)` - Set player mana

**Game Control:**
- `startGame(startingPlayer)` - Initialize game
- `endTurn()` - Complete current turn
- `nextPhase()` - Advance to next phase
- `resetGame()` - Clear all state

**Mana Management:**
- `addManaToPool(amount)` - Increase shared pool
- `removeManaFromPool(amount)` - Decrease shared pool
- `transferManaToPlayer(playerId, amount)` - Move pool → player
- `returnManaToPool(playerId, amount)` - Move player → pool

**Action Log:**
- `addLog(message, type)` - Record action
- `clearLog()` - Clear all logs
- `exportLog()` - Download logs as file

#### Getters

- `isPlayer1Turn()` - Check if player 1's turn
- `isGameActive()` - Check if game started
- `otherPlayer(playerId)` - Get opponent

---

## Testing Strategy

### Test Coverage: 95%+

### Test Types

**Unit Tests** (70% of tests)
- Components: Isolated rendering, props, events
- Stores: Actions, getters, state mutations
- Utils: Pure function behaviors

**Integration Tests** (30% of tests)
- Game flow: Multi-component interactions
- State changes: Cascading updates
- User workflows: Complete game scenarios

**Edge Cases** (26 additional tests)
- Invalid inputs (NaN, negative, wrong type)
- Boundary conditions (0, max values)
- Error recovery
- Malformed data

### Running Tests

```bash
# Watch mode (development)
npm run test

# CI mode (single run with coverage)
npm run test:ci

# Coverage report
npm run test:coverage
```

### Test File Organization

```
tests/
├── unit/
│   ├── components/
│   │   ├── ActionLog.spec.js
│   │   ├── CoinFlip.spec.js
│   │   ├── Dice.spec.js
│   │   ├── LifeCounter.spec.js
│   │   └── [other components]
│   ├── stores/
│   │   ├── gameStore.spec.js
│   │   └── [store tests]
│   ├── utils/
│   │   ├── random.spec.js
│   │   └── storage.spec.js
│   └── edgeCases.spec.js
└── integration/
    └── gameFlow.spec.js
```

### Writing Tests

**Pattern: AAA (Arrange, Act, Assert)**

```javascript
it('should increase life by 1', () => {
  // Arrange
  const store = useGameStore()
  store.startGame('player1')
  const initial = store.players.player1.life
  
  // Act
  store.adjustLife('player1', 1)
  
  // Assert
  expect(store.players.player1.life).toBe(initial + 1)
})
```

---

## Development Workflow

### Local Setup

```bash
# Clone repository
git clone https://github.com/naishtech/runes-gambit-web.git
cd runes-gambit-web

# Install dependencies
npm install

# Start dev server (opens in browser)
npm run dev

# Run tests in watch mode
npm run test

# Check linting
npm run lint:check

# Fix linting issues
npm run lint
```

### Development Loop (Red/Green/Refactor)

1. **Red**: Write failing test
   ```bash
   npm run test
   ```

2. **Green**: Write minimal code to pass
   - Implement feature
   - Run tests
   - Ensure all pass

3. **Refactor**: Improve code
   - Clean up implementation
   - Extract helpers
   - Maintain tests passing

### Code Style

- **ESLint**: Automatic linting on save
- **Prettier**: Code formatting (integrated)
- **Commit Hooks**: Pre-commit linting check
- **Import Order**: 
  1. Vue imports
  2. External packages
  3. Local imports

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub (triggers CI)
git push origin feature/new-feature

# Create Pull Request on GitHub
# - CI will run automatically
# - Review and merge
```

---

## Deployment

### Automatic Deployment (GitHub Actions)

**Trigger**: Push to `main` branch

**Process**:
1. CI workflow runs tests and linting
2. Build workflow creates production bundle
3. Deploy workflow pushes to GitHub Pages
4. Site live at: https://naishtech.github.io/runes-gambit-web/

### Build Process

```bash
# Generate production build
npm run build

# Preview production build locally
npm run preview

# Build analysis
npm run build -- --analyze
```

### Production Optimizations

In `vite.config.js`:
- **Minification**: Terser for 30-40% smaller bundle
- **Code Splitting**: Separate vendor and utils chunks
- **Source Maps**: Enables production debugging
- **Console Removal**: Strips console.log in production
- **Asset Inlining**: Images < 4KB inlined

### Performance Targets (Lighthouse CI)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## Contributing

### Adding Features

1. **Plan**: Create GitHub issue with proposal
2. **Test**: Write failing tests first
3. **Implement**: Write minimal code to pass
4. **Review**: Self-review against checklist
5. **Submit**: Create PR with description

### PR Checklist

- [ ] Tests pass: `npm run test:ci`
- [ ] Linting passes: `npm run lint:check`
- [ ] New tests added for new code
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No console.log or debug code

### Commit Message Convention

```
type: description

- Detailed explanation of changes
- Multiple points if needed

Fixes #123
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `ci`

### Branch Naming

- `feature/short-description`
- `fix/issue-description`
- `docs/documentation-update`

---

## Resources

- [Vue 3 Guide](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [ESLint Configuration](https://eslint.org/)

---

## Troubleshooting

### Tests Failing
- Clear `node_modules` and reinstall: `npm ci`
- Check Vitest config: `vitest.config.js`
- Run single test: `npm run test -- path/to/test`

### Build Errors
- Clear dist folder: `rm -rf dist`
- Check Node version: `node --version` (16.0.0+)
- Verify imports are relative or aliased

### Dev Server Not Starting
- Check port 5173 is available
- Try different port: `npm run dev -- --port 3000`
- Check firewall/antivirus blocking

### GitHub Pages Not Updating
- Check workflow status in Actions tab
- Verify `vite.config.js` base path
- Clear browser cache (Ctrl+Shift+Del)

---

## License

MIT - See LICENSE file for details
