# Runes Gambit

[![CI](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/ci.yml)
[![Deploy](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/runes-gambit-web/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/runes-gambit-web/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/runes-gambit-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Strategic two-player card duel game built with Vue 3, Vite, and comprehensive testing

**[Live Demo](#)** • **[Documentation](./doc/tasks-index.md)** • **[Rules](./doc/runes-gambit-rules.md)**

## Features

- 🎮 Two-player strategic gameplay
- 💎 Mana resource management system  
- ❤️ Life point tracking with visual indicators
- 🎲 Randomization tools (coin flip, dice)
- 📊 Action logging and game history
- 💾 Auto-save with LocalStorage persistence
- 🎨 Smooth animations and transitions
- ♿ Accessible design with keyboard support
- 📱 Responsive layout (mobile, tablet, desktop)
- ✅ 95%+ test coverage with TDD methodology

## Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Testing**: Vitest + @vue/test-utils
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages
- **Code Quality**: ESLint + Prettier

## Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/runes-gambit-web.git
cd runes-gambit-web

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Available Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Testing
npm run test          # Run tests in watch mode
npm run test:ci       # Run tests once (CI mode)
npm run test:coverage # Generate coverage report
npm run test:ui       # Interactive test UI

# Code Quality
npm run lint          # Lint and auto-fix
npm run lint:check    # Check linting without fixing
```

### Project Structure

```
src/
├── components/        # Vue components (LifeCounter, ManaCounter, etc.)
├── stores/           # Pinia stores (gameStore, turnStore, etc.)
├── utils/            # Utility functions (random, storage, etc.)
├── styles/           # Global styles and animations
└── App.vue           # Root component

tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── setup.js          # Test configuration

doc/
├── tasks-index.md    # Development roadmap
├── task-*.md         # Individual task specifications
└── runes-gambit-rules.md # Game rules

.github/workflows/    # CI/CD workflows
```

## Testing

The project uses **Test-Driven Development (TDD)** with comprehensive coverage:

- **Unit Tests**: Component and utility tests
- **Integration Tests**: Full game flow scenarios
- **Coverage**: 95%+ line coverage
- **Total Tests**: 336+ passing tests

View detailed test status: [Tasks Index](./doc/tasks-index.md)

```bash
# Run all tests
npm run test:ci

# Generate coverage report
npm run test:coverage

# View interactive test UI
npm run test:ui
```

## Game Rules

See [Game Rules Documentation](./doc/runes-gambit-rules.md) for detailed gameplay mechanics.

## Development Workflow

This project follows TDD methodology with automated CI/CD:

1. **Red Phase**: Write failing tests
2. **Green Phase**: Implement minimal code to pass
3. **Refactor Phase**: Improve code quality
4. **Commit**: Push changes with test coverage
5. **CI/CD**: Automated testing, linting, and deployment

For detailed task breakdown, see [Development Tasks](./doc/tasks-index.md)

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## CI/CD Pipeline

- ✅ **Tests**: Automated on every push/PR
- ✅ **Linting**: ESLint checks on PRs
- ✅ **Coverage**: Tracked and reported
- ✅ **Build**: Verified on every commit
- ✅ **Deploy**: Auto-deployed to GitHub Pages on main

## Performance

- Lighthouse Score: 90%+
- Bundle Size: Optimized with Vite
- Performance: 95%+ Lighthouse rating

## License

MIT License - See [LICENSE](LICENSE) for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using Test-Driven Development**

