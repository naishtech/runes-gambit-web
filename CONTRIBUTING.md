# Contributing to Runes Gambit

Thank you for your interest in contributing! We welcome contributions from the community.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Testing](#testing)
7. [Coding Standards](#coding-standards)
8. [Commit Messages](#commit-messages)
9. [Pull Request Process](#pull-request-process)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing opinions
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Public or private harassment
- Publishing private information
- Conduct unbecoming to a professional community

---

## Getting Started

### First Time Contributor?

1. Look for issues labeled `good-first-issue`
2. Read the [Developer Guide](./docs/DEVELOPER_GUIDE.md)
3. Check existing tests for patterns
4. Ask questions in issues - we're helpful!

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn
- Git
- Basic understanding of Vue 3
- Familiarity with test-driven development

---

## Development Setup

### Fork & Clone

```bash
# Fork repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/runes-gambit-web.git
cd runes-gambit-web

# Add upstream remote
git remote add upstream https://github.com/naishtech/runes-gambit-web.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
# Opens http://localhost:5173
```

### Run Tests

```bash
# Watch mode
npm run test

# Single run
npm run test:ci

# Coverage report
npm run test:coverage
```

### Check Linting

```bash
npm run lint:check  # Report only
npm run lint        # Auto-fix issues
```

---

## Making Changes

### Create a Branch

```bash
# Update main
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/my-feature
```

### Branch Naming Convention

- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/documentation-topic` - Documentation
- `test/test-description` - Tests only
- `refactor/what-changed` - Code refactoring

### Development Workflow (TDD)

1. **Write Tests First**
   ```bash
   # Create test file or add to existing
   npm run test  # Watch for failures
   ```

2. **Write Minimal Code**
   - Implement just enough to pass tests
   - Don't over-engineer
   - Keep it simple

3. **Refactor & Improve**
   - Improve code quality
   - Extract helpers
   - Maintain test passing

4. **Repeat** - One test at a time

### Example: Adding a Feature

```javascript
// tests/unit/components/NewComponent.spec.js
import { mount } from '@vue/test-utils'
import NewComponent from '@/components/NewComponent.vue'

describe('NewComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(NewComponent)
    expect(wrapper.exists()).toBe(true)
  })
})
```

```bash
npm run test  # Test fails - RED
```

```vue
<!-- src/components/NewComponent.vue -->
<template>
  <div class="new-component">
    New Component
  </div>
</template>

<script setup>
// Minimal implementation
</script>
```

```bash
npm run test  # Test passes - GREEN
```

```vue
<!-- Refactor and improve -->
<template>
  <div class="new-component" role="article">
    <header>New Component</header>
  </div>
</template>

<script setup>
// Better implementation
</script>

<style scoped>
.new-component {
  padding: 1rem;
  border-radius: 4px;
}
</style>
```

---

## Testing

### Test Coverage Requirement

- **Minimum**: 95% overall coverage
- All new code must have tests
- All bug fixes must have tests
- Integration tests for complex flows

### Test Organization

```javascript
// Arrange
const store = useGameStore()

// Act
store.adjustLife('player1', -5)

// Assert
expect(store.players.player1.life).toBe(15)
```

### Test Types to Write

- **Unit Tests**: Component rendering, store actions
- **Integration Tests**: Multi-component flows
- **Edge Case Tests**: Invalid inputs, boundaries

### Running Specific Tests

```bash
# Single file
npm run test -- path/to/test.spec.js

# Matching pattern
npm run test -- lifeCounter

# Watch specific
npm run test -- lifeCounter --watch
```

---

## Coding Standards

### Vue Components

```vue
<template>
  <!-- Structure: Template first -->
  <div class="component-name" role="main">
    <header>Content</header>
    <main>Body</main>
  </div>
</template>

<script setup>
// Imports: Vue first, then external, then local
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import MyComponent from './MyComponent.vue'

// Props with defaults
defineProps({
  name: {
    type: String,
    required: false,
    default: 'Default'
  }
})

// Emits
defineEmits(['action'])

// Reactive state
const count = ref(0)

// Computed properties
const doubled = computed(() => count.value * 2)

// Methods
const increment = () => {
  count.value++
}
</script>

<style scoped>
/* Component styles only */
.component-name {
  padding: 1rem;
}
</style>
```

### Store Actions

```javascript
// Validation first
const adjustLife = (playerId, amount) => {
  // Guard clauses
  if (!['player1', 'player2'].includes(playerId)) {
    addLog(`Invalid player ID: ${playerId}`, 'error')
    return false
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    addLog(`Invalid life amount: ${amount}`, 'error')
    return false
  }

  // Implementation
  players[playerId].life += amount

  // Logging
  addLog(`${playerId} life adjusted by ${amount}`, 'info')

  return true
}
```

### Code Style

- **Naming**: camelCase for variables/functions, PascalCase for components
- **Strings**: Prefer single quotes
- **Comments**: JSDoc for public APIs
- **Line Length**: Max 100 characters (soft)
- **Indentation**: 2 spaces

### ESLint Rules

```javascript
// ✅ Good
const count = ref(0)
const name = 'Alice'

// ❌ Bad
const count = ref(0)
var name = 'Alice'  // Use const/let
```

---

## Commit Messages

### Format

```
type(scope): subject line

Optional longer description explaining the changes.
Keep to 72 characters per line.

Closes #123
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (no logic change)
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `ci` - CI/CD changes
- `chore` - Other changes

### Examples

```
feat(store): add mana transfer action

- Implement transferManaToPlayer action
- Add validation for mana amounts
- Add tests for all scenarios

Closes #42

---

fix(dice): prevent simultaneous rolls

Resolve race condition when rolling too quickly.

Closes #89

---

docs: update user guide with keyboard shortcuts

---

test(actionlog): add 5 new test cases

- Test message sanitization
- Test type validation
- Test export functionality
```

---

## Pull Request Process

### Before Submitting

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run full test suite**
   ```bash
   npm run test:ci
   ```

3. **Check linting**
   ```bash
   npm run lint:check
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Check no console.log/debugger**
   ```bash
   git diff --cached | grep 'console\|debugger'
   ```

### Submitting PR

1. **Push branch**
   ```bash
   git push origin feature/my-feature
   ```

2. **Create PR on GitHub**
   - Link related issues
   - Describe changes clearly
   - Reference any breaking changes

3. **PR Template**
   ```markdown
   ## Description
   Brief explanation of what this PR does.

   ## Related Issues
   Closes #123

   ## Testing
   How to test the changes:
   - Step 1
   - Step 2

   ## Checklist
   - [ ] Tests added/updated
   - [ ] Linting passes
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

### Review Process

- At least 1 approval required
- CI must pass
- Coverage must be maintained (95%+)
- No merge conflicts
- All discussions resolved

### After Merge

- Delete feature branch
- Monitor CI for issues
- Help with deployment if needed

---

## Common Scenarios

### Adding a New Component

1. Create `.vue` file in `src/components/`
2. Write tests in `tests/unit/components/`
3. Add to `src/App.vue`
4. Update documentation
5. Submit PR

### Fixing a Bug

1. Write failing test that reproduces bug
2. Fix implementation
3. Verify test passes
4. Submit PR with issue reference

### Updating Documentation

1. Update relevant `.md` file
2. Verify formatting
3. Spell check
4. Submit PR

### Performance Improvement

1. Add benchmark test
2. Implement optimization
3. Verify performance improved
4. Ensure tests still pass
5. Submit PR

---

## Getting Help

- **Questions?** Open a GitHub issue with `[question]` label
- **Stuck?** Ask in PR comments - maintainers are helpful
- **Ideas?** Create issue with `[enhancement]` label
- **Bug?** Create issue with clear reproduction steps

---

## Maintainers

- [@naishtech](https://github.com/naishtech) - Project lead

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes for major contributions
- Project README (for significant contributions)

Thank you for contributing to Runes Gambit! 🎮
