# Task 01: Project Setup & TDD Configuration

**Status**: Not Started  
**Estimated Time**: 2-3 hours  
**Dependencies**: None  
**Week**: 1

## Objective
Initialize the Vue.js 3 project with Vite, configure Vitest testing framework, and establish the TDD workflow foundation.

## Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account ready

## Steps

### 1. Initialize Vue.js Project
```bash
npm create vite@latest runes-gambit-web -- --template vue
cd runes-gambit-web
npm install
```

### 2. Install Testing Dependencies
```bash
npm install -D vitest @vue/test-utils jsdom
npm install -D @vitest/ui @vitest/coverage-c8
npm install -D @testing-library/jest-dom
npm install -D eslint eslint-plugin-vue
npm install -D prettier eslint-config-prettier
```

### 3. Install Pinia for State Management
```bash
npm install pinia
```

### 4. Create Vitest Configuration
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

### 5. Update Vite Configuration for GitHub Pages
**File**: `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/runes-gambit-web/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### 6. Create Test Setup File
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

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
```

### 7. Create Directory Structure
```bash
mkdir -p src/components
mkdir -p src/stores
mkdir -p src/composables
mkdir -p src/utils
mkdir -p src/assets/images/dice-faces
mkdir -p src/assets/sounds
mkdir -p src/styles
mkdir -p tests/unit/components
mkdir -p tests/unit/stores
mkdir -p tests/unit/utils
mkdir -p tests/integration
mkdir -p tests/fixtures
```

### 8. Update package.json Scripts
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
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore"
  }
}
```

### 9. Create ESLint Configuration
**File**: `.eslintrc.js`
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'vue/multi-word-component-names': 'off'
  }
}
```

### 10. Create .gitignore
```
node_modules/
dist/
coverage/
.DS_Store
*.local
.env
.env.local
.env.*.local
```

### 11. Initialize Git Repository
```bash
git init
git add .
git commit -m "chore: initial project setup with TDD configuration"
```

### 12. Create GitHub Repository
- Create new repository: `runes-gambit-web`
- Push local repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/runes-gambit-web.git
git branch -M main
git push -u origin main
```

### 13. Verify Setup
```bash
# Run test suite (should pass with 0 tests)
npm run test

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

## Acceptance Criteria
- [ ] Project initializes without errors
- [ ] `npm run dev` starts development server
- [ ] `npm run test` runs successfully (0 tests)
- [ ] `npm run test:coverage` generates coverage report
- [ ] Directory structure matches specification
- [ ] Git repository initialized and pushed to GitHub
- [ ] All dependencies installed correctly
- [ ] Vite configuration includes GitHub Pages base path
- [ ] Vitest configuration includes coverage thresholds

## Verification Commands
```bash
npm run test          # Should show "No test files found"
npm run lint          # Should pass with no errors
npm run build         # Should build successfully
npm run test:coverage # Should generate coverage/index.html
```

## Next Task
→ [Task 02: Random Utilities (TDD)](task-02-random-utils.md)

## Reference
- [Design Document](design-document.md) - Section 9.1, 11.1
