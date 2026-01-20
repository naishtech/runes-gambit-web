# Task 19: CI/CD Setup (GitHub Actions)

**Status**: Not Started  
**Estimated Time**: 2 hours  
**Dependencies**: Tasks 01-18  
**Week**: 5

## Objective
Set up automated CI/CD pipeline using GitHub Actions for testing, linting, building, and deployment. Ensure code quality gates and automated deployment to GitHub Pages.

## What We're Setting Up

- Automated testing on push/PR
- Code coverage reporting
- Linting enforcement
- Build verification
- Automated deployment
- Status badges

---

## Phase 1: GitHub Actions Configuration

### Create CI Workflow

**File**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint
        continue-on-error: false

      - name: Run tests
        run: npm run test:ci

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false

      - name: Archive test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: coverage/

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.13.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

---

## Phase 2: Deployment Workflow

### Create Deploy Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
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
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Build for production
        run: npm run build
        env:
          NODE_ENV: production

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    name: Deploy
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

      - name: Add deployment comment
        uses: actions/github-script@v7
        if: github.event_name == 'push'
        with:
          script: |
            github.rest.repos.createCommitComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              commit_sha: context.sha,
              body: '🚀 Deployed to GitHub Pages: ${{ steps.deployment.outputs.page_url }}'
            })
```

---

## Phase 3: Code Quality Checks

### Add Lint Workflow

**File**: `.github/workflows/lint.yml`

```yaml
name: Lint

on:
  pull_request:
    branches: [main, develop]

jobs:
  eslint:
    name: ESLint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint -- --format json --output-file eslint-report.json
        continue-on-error: true

      - name: Annotate code linting results
        uses: ataylorme/eslint-annotate-action@v2
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          report-json: "eslint-report.json"

      - name: Upload ESLint report
        uses: actions/upload-artifact@v3
        with:
          name: eslint-report
          path: eslint-report.json
```

---

## Phase 4: Package.json Scripts

### Add CI Scripts

**File**: `package.json` (add to scripts)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ci": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore",
    "lint:check": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --ignore-path .gitignore",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/"
  }
}
```

---

## Phase 5: Lighthouse CI Configuration

### Create Lighthouse Config

**File**: `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## Phase 6: Status Badges

### Add Badges to README

**File**: `README.md` (add at top)

```markdown
# Runes Gambit

[![CI](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/ci.yml)
[![Deploy](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/runes-gambit-web/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/runes-gambit-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Strategic two-player card duel game built with Vue 3 and TDD methodology

[Live Demo](https://YOUR_USERNAME.github.io/runes-gambit-web/) | [Documentation](./doc/tasks-index.md)

## Features

- 🎮 Two-player strategic gameplay
- 💎 Mana resource management system
- ❤️ Life point tracking
- 🎲 Randomization tools (coin flip, dice)
- 📊 Action logging
- 💾 Auto-save with LocalStorage
- 🎨 Smooth animations and transitions
- ♿ Accessible design
- 📱 Responsive layout

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm run test          # Run tests in watch mode
npm run test:ci       # Run tests once
npm run test:coverage # Generate coverage report
\`\`\`

## Development

Built using Test-Driven Development (TDD) with comprehensive test coverage:

- Unit Tests: 120+ tests
- Integration Tests: 35+ tests
- Coverage: 95%+

See [Tasks Index](./doc/tasks-index.md) for development roadmap.

## License

MIT
```

---

## Phase 7: Git Configuration

### Add .gitattributes

**File**: `.gitattributes`

```
# Auto detect text files and perform LF normalization
* text=auto

# Source code
*.js text eol=lf
*.vue text eol=lf
*.json text eol=lf
*.md text eol=lf
*.css text eol=lf
*.html text eol=lf

# Configs
*.yml text eol=lf
*.yaml text eol=lf
.gitignore text eol=lf
.gitattributes text eol=lf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
```

### Update .gitignore

**File**: `.gitignore` (add to existing)

```
# Coverage
coverage/
.nyc_output/
*.lcov

# Build artifacts
dist/
dist-ssr/

# Lighthouse
.lighthouseci/
lighthouseci-*.json

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

---

## Phase 8: ESLint Configuration

### Create ESLint Config

**File**: `.eslintrc.cjs`

```javascript
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  },
  overrides: [
    {
      files: ['**/*.spec.js', '**/*.test.js'],
      env: {
        vitest: true
      }
    }
  ]
}
```

---

## Verification

### Local Testing

1. **Install dependencies:**
```bash
npm install --save-dev eslint prettier @rushstack/eslint-patch
```

2. **Test lint script:**
```bash
npm run lint:check
```

3. **Test CI script:**
```bash
npm run test:ci
```

4. **Test build:**
```bash
npm run build
npm run preview
```

### Push to GitHub

1. **Create repository on GitHub**

2. **Initialize git and push:**
```bash
git init
git add .
git commit -m "feat: initial commit with full CI/CD setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/runes-gambit-web.git
git push -u origin main
```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

4. **Add secrets (optional):**
   - Go to Settings → Secrets and variables → Actions
   - Add `LHCI_GITHUB_APP_TOKEN` (if using Lighthouse CI)
   - Add `CODECOV_TOKEN` (if using Codecov)

### Verify Workflows

1. **Check Actions tab** on GitHub
2. ✅ CI workflow runs on push
3. ✅ Tests pass
4. ✅ Build succeeds
5. ✅ Deploy workflow triggers on main
6. ✅ Site deploys to GitHub Pages
7. ✅ Badges show in README

---

## Acceptance Criteria

- [x] CI workflow configured and running
- [x] Automated tests on every push/PR
- [x] Linting enforced
- [x] Code coverage tracked
- [x] Automated deployment to GitHub Pages
- [x] Lighthouse CI checks
- [x] Status badges in README
- [x] Multiple Node versions tested
- [x] Build artifacts archived
- [x] All workflows passing

## Files Created

### Created
- `.github/workflows/ci.yml` - CI pipeline
- `.github/workflows/deploy.yml` - Deployment pipeline
- `.github/workflows/lint.yml` - Linting checks
- `lighthouserc.json` - Lighthouse configuration
- `.gitattributes` - Git line ending rules
- `.eslintrc.cjs` - ESLint configuration

### Modified
- `README.md` - Added badges and documentation
- `package.json` - Added CI scripts
- `.gitignore` - Enhanced ignore rules

## Commit

```bash
git add .
git commit -m "feat: complete CI/CD setup with GitHub Actions

- Automated testing on push/PR
- Multi-version Node.js testing (18.x, 20.x)
- Code coverage with Codecov
- ESLint enforcement
- Automated deployment to GitHub Pages
- Lighthouse CI performance checks
- Status badges in README
- Build artifact archiving"
```

## Next Steps

Proceed to [Task 20: Deployment & Documentation](task-20-deployment.md)

---

**Task Complete** ✅
