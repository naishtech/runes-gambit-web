# Runes Gambit Development Tasks Index

## 🤖 AI Agent Instructions

This directory contains **AI-executable task documents** for building the Runes Gambit web application using Test-Driven Development (TDD). Each task is designed to be completed autonomously by an AI coding agent.

### For AI Agents: How to Execute These Tasks

**You are an AI coding agent. Your job is to:**

1. **Read the entire task document** before starting
2. **Follow the TDD cycle strictly**: Red → Green → Refactor
3. **Create ALL files with exact code** provided in the task
4. **Run tests after each step** to verify your work
5. **Commit changes** with the specified commit messages
6. **Verify acceptance criteria** before marking task complete
7. **Report completion status** with test results

### AI Agent Workflow Per Task

```
1. Read task markdown file completely
2. Create test file with failing tests (RED)
3. Run tests - verify they FAIL
4. Create implementation file (GREEN)
5. Run tests - verify they PASS
6. Refactor if specified (REFACTOR)
7. Run tests again - verify still PASS
8. Run coverage check
9. Commit with provided messages
10. Verify all acceptance criteria met
11. Report: "Task [XX] Complete ✅" with stats
```

### What AI Agents Should Do

✅ **DO:**
- Execute tasks sequentially (respect dependencies)
- Copy code exactly as specified in task documents
- Run all verification commands
- Report test results and coverage percentages
- Create files in exact directory structure shown
- Follow TDD Red-Green-Refactor religiously
- Commit after each significant step
- Ask for clarification if task is ambiguous

❌ **DO NOT:**
- Skip tests or write implementation before tests
- Modify code not specified in current task
- Jump ahead to later tasks without completing dependencies
- Skip verification steps
- Ignore failing tests
- Commit without running tests

### AI Agent Success Criteria

Each task is complete when:
- [ ] All tests pass
- [ ] Coverage meets threshold
- [ ] Acceptance criteria checked
- [ ] Code committed with proper messages
- [ ] Verification commands run successfully
- [ ] Ready to proceed to next task

## Task List

### Week 1: Foundation (7 tasks)

| # | Task | Time | Status | Dependencies |
|---|------|------|--------|--------------|
| 01 | [Project Setup & TDD Configuration](task-01-project-setup.md) | 2-3h | ✅ Complete | None |
| 02 | [Random Utilities (TDD)](task-02-random-utils.md) | 1h | ✅ Complete | Task 01 |
| 03 | [Game Store Foundation (TDD)](task-03-game-store-foundation.md) | 2h | ✅ Complete | Task 01 |
| 04 | [PlayerNameBox Component (TDD)](task-04-player-name-box.md) | 1.5h | ✅ Complete | Task 03 |
| 05 | [LifeCounter Component (TDD)](task-05-life-counter.md) | 2h | ✅ Complete | Task 03 |
| 06 | [ManaCounter Component (TDD)](task-06-mana-counter.md) | 1.5h | ✅ Complete | Task 03 |
| 07 | [SharedManaPool Component (TDD)](task-07-shared-mana-pool.md) | 1.5h | ✅ Complete | Task 03 |

**Week 1 Total**: ~11.5 hours

### Week 2: Core Game Mechanics (5 tasks)

| # | Task | Time | Status | Dependencies |
|---|------|------|--------|--------------|
| 08 | [Mana Store Actions (TDD)](task-08-mana-store-actions.md) | 2h | ✅ Complete | Task 03, 07 |
| 09 | [CoinFlip Component (TDD)](task-09-coin-flip.md) | 2h | ✅ Complete | Task 02 |
| 10 | [Dice Component (TDD)](task-10-dice-component.md) | 3h | ✅ Complete | Task 02 |
| 11 | [Turn Management Store (TDD)](task-11-turn-store.md) | 2.5h | ✅ Complete | Task 08 |
| 12 | [TurnManager Component (TDD)](task-12-turn-manager.md) | 2.5h | ✅ Complete | Task 11 |

**Week 2 Total**: ~12 hours

### Week 3: Game Logic & Integration (3 tasks)

| # | Task | Time | Status | Dependencies |
|---|------|------|--------|--------------|
| 13 | [ActionLog Component (TDD)](task-13-action-log.md) | 2h | 📄 Created | Task 03 |
| 14 | [Integration Tests](task-14-integration-tests.md) | 3h | 📄 Created | Tasks 01-13 |
| 15 | [Main App Integration](task-15-main-app.md) | 2h | 📄 Created | Tasks 01-13 |

**Week 3 Total**: ~7 hours

### Week 4: Polish & Persistence (3 tasks)

| # | Task | Time | Status | Dependencies |
|---|------|------|--------|--------------|
| 16 | [LocalStorage & Persistence (TDD)](task-16-local-storage.md) | 2.5h | 📄 Created | Task 03 |
| 17 | [Animations & Polish](task-17-polish-animations.md) | 3h | 📄 Created | Task 10 |
| 18 | [Edge Cases & Error Handling](task-18-edge-cases.md) | 2.5h | 📄 Created | All previous |

**Week 4 Total**: ~8 hours

### Week 5: CI/CD & Deployment (2 tasks)

| # | Task | Time | Status | Dependencies |
|---|------|------|--------|--------------|
| 19 | [CI/CD Setup (GitHub Actions)](task-19-ci-cd-setup.md) | 2h | 📄 Created | Task 01 |
| 20 | [Deployment & Documentation](task-20-deployment.md) | 3h | 📄 Created | All previous |

**Week 5 Total**: ~5 hours

---

## Total Project Time: ~43.5 hours

## Progress Tracking

- [ ] Week 1 Complete (0/7 tasks)
- [ ] Week 2 Complete (0/5 tasks)
- [ ] Week 3 Complete (0/3 tasks)
- [ ] Week 4 Complete (0/3 tasks)
- [ ] Week 5 Complete (0/2 tasks)

## Coverage Goals

- **Week 1**: 100% utilities, 90%+ components
- **Week 2**: 85%+ overall
- **Week 3**: 90%+ overall
- **Week 4**: 90%+ overall
- **Week 5**: 90%+ overall (final)

## Key Principles for AI Agents

1. **Test-First Always**: Never write production code without a failing test first
2. **Commit Frequently**: Commit after each Red-Green-Refactor cycle with provided messages
3. **Verify Everything**: Run tests before moving to next task
4. **Coverage Matters**: Maintain coverage thresholds (fail if below)
5. **Acceptance Driven**: Follow acceptance criteria strictly - all must pass
6. **Report Progress**: Output test results, coverage %, and completion status
7. AI Agent Commands Reference

These commands should be executed by the AI agent at appropriate points in each task:

```bash
# Verify test fails (RED phase)
npm run test <filename>.spec.js
# Expected: Tests FAIL

# Verify test passes (GREEN phase)
npm run test <filename>.spec.js
# Expected: Tests PASS

# Check coverage for specific file
npm run test:coverage -- <filename>
# Expected: Meets threshold (80%+)

# Run all tests (before moving to next task)
npm run test
# Expected: All PASS

# Start dev server (for manual verification)
npmAI Agent Resources

- **Design Document**: [design-document.md](design-document.md) - Full system architecture
- **Game Rules**: [runes-gambit-rules.md](runes-gambit-rules.md) - Game logic reference
- **TDD Workflow**: Section 1.4 in design document - Detailed TDD methodology
- **Coverage Analysis**: [task-coverage-analysis.md](task-coverage-analysis.md) - Verification that all features are covered

## Status Legend

- ⬜ Not Started - AI agent has not begun this task
- 🟨 In Progress - AI agent is actively working on this task
- ✅ Complete - AI agent has verified all acceptance criteria met
- ⛔ Blocked - AI agent cannot proceed (dependency issue or clarification needed)

## AI Agent Troubleshooting

**If tests fail unexpectedly:**
1. Re-read the task document carefully
2. Verify all prerequisite tasks are complete
3. Check that code matches task specification exactly
4. Ensure all imports and dependencies are correct
5. Report the specific error for human review

**If coverage is below threshold:**
1. Review test cases in task document
2. Ensure all test cases are implemented
3. Check for missed edge cases
4. Report specific uncovered lines

**If unclear about task requirements:**
1. Stop execution
2. Report specific ambiguity
3. Request clarification from human supervisor
4. Do not make assumptions or proceed

---

**Last Updated**: Task Index Created  
**Current Task**: [Task 01: Project Setup](task-01-project-setup.md)  
**AI Agent Status**: Ready to begin sequential execution
- tests/unit/path/to/file.spec.js

Test Results:
✅ X tests passing
❌ 0 tests failing

Coverage:
- Lines: XX%
- Functions: XX%
- Branches: XX%

Commits:
- <commit-hash> test: <message>
- <commit-hash> feat: <message>
- <commit-hash> refactor: <message>

Ready for: Task [XX+1]

# Build for production
npm run build
```

## Getting Help

- **Design Document**: [design-document.md](design-document.md)
- **Game Rules**: [runes-gambit-rules.md](runes-gambit-rules.md)
- **TDD Workflow**: See Section 1.4 in design document

## Status Legend

- ⬜ Not Started
- 🟨 In Progress
- ✅ Complete
- ⛔ Blocked

---

**Last Updated**: Task Index Created  
**Current Task**: [Task 01: Project Setup](task-01-project-setup.md)
