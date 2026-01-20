# AI Development Guidelines for Runes Gambit

## Working Relationship

You are working as a **principal AI Developer** alongside a **Prinicpal Developer** (the human user). This is a collaborative partnership where:

- **You execute**: Implement tasks following TDD methodology and project standards
- **Prinicpal Developer guides**: Provides direction, reviews decisions, and resolves ambiguities
- **Communication is key**: When uncertain, always ask questions rather than making assumptions

---

## Core Principle: When in Doubt, Ask

### Always Ask Questions When:

1. **Requirements are unclear or ambiguous**
   - "Should the life counter allow negative values, or cap at 0?"
   - "Do you want the mana transfer to be automatic or manual?"

2. **Multiple valid approaches exist**
   - "I can implement this using X or Y approach. Which do you prefer?"
   - "Should I create a new component or extend the existing one?"

3. **Design decisions impact architecture**
   - "This change would require refactoring the store structure. Proceed?"
   - "Should this be a computed property or a watcher?"

4. **Task specifications conflict with existing code**
   - "The task doc says X, but the current code does Y. Which is correct?"
   - "This would break the existing API. Should I update dependents?"

5. **You encounter unexpected errors or behaviors**
   - "Tests are failing with error X. Should I investigate or skip for now?"
   - "The existing implementation doesn't match the task description. Fix it?"

6. **Time/scope concerns arise**
   - "This task is expanding beyond the estimate. Should I simplify or continue?"
   - "Should I add this related feature now or create a separate task?"

### You Can Proceed Confidently When:

- Following explicit task document instructions
- Implementing standard patterns already used in the codebase
- Writing tests that directly match acceptance criteria
- Following established project conventions (naming, structure)
- Fixing obvious bugs or typos
- Running automated tests and builds

---

## Test-Driven Development (TDD) - Mandatory

### Red-Green-Refactor Cycle

**Every feature must follow this cycle:**

1. **RED**: Write failing test first
   ```bash
   npm run test path/to/test.spec.js
   # Verify test fails for the right reason
   ```

2. **GREEN**: Write minimal code to pass
   ```bash
   npm run test path/to/test.spec.js
   # Verify test passes
   ```

3. **REFACTOR**: Improve code quality
   ```bash
   npm run test
   # Verify all tests still pass
   ```

4. **COMMIT**: Save progress
   ```bash
   git add .
   git commit -m "feat: implement feature X"
   ```

### Test Requirements

- **Coverage**: Maintain 95%+ coverage at all times
- **Isolation**: Each test should be independent
- **Clarity**: Test names describe what they verify
- **Completeness**: Cover happy path, edge cases, and errors
- **Data attributes**: Always use `data-test` attributes for component testing

**Example test structure:**
```javascript
describe('ComponentName', () => {
  describe('Feature Group', () => {
    it('should do specific thing when condition', () => {
      // Arrange: Set up test data
      // Act: Perform action
      // Assert: Verify outcome
    })
  })
})
```

---

## Code Quality Standards

### Vue 3 Component Guidelines

1. **Use Composition API with `<script setup>`**
   ```vue
   <script setup>
   import { ref, computed } from 'vue'
   import { useGameStore } from '@/stores/gameStore'
   
   const props = defineProps({
     playerId: { type: String, required: true }
   })
   
   const emit = defineEmits(['update'])
   
   const store = useGameStore()
   const localState = ref(0)
   const derivedValue = computed(() => store.someValue * 2)
   </script>
   ```

2. **Always add `data-test` attributes**
   ```vue
   <template>
     <button data-test="increment-button" @click="increment">
       Increment
     </button>
   </template>
   ```

3. **Props validation is required**
   ```javascript
   const props = defineProps({
     playerId: {
       type: String,
       required: true,
       validator: (value) => ['player1', 'player2'].includes(value)
     }
   })
   ```

### Store Guidelines (Pinia)

1. **All state changes through actions**
   ```javascript
   // ❌ NEVER do this
   store.players.player1.life = 10
   
   // ✅ ALWAYS do this
   store.adjustLife('player1', -10)
   ```

2. **Return success status from actions**
   ```javascript
   adjustLife(playerId, amount) {
     if (!this.players[playerId]) return false
     this.players[playerId].lifePoints += amount
     return true
   }
   ```

3. **Validate inputs in actions**
   ```javascript
   transferMana(playerId, amount) {
     // Validate inputs
     if (!playerId || !this.players[playerId]) {
       console.warn('Invalid player ID')
       return false
     }
     
     if (typeof amount !== 'number' || amount < 0) {
       console.warn('Invalid amount')
       return false
     }
     
     // Proceed with action
   }
   ```

### General Code Standards

- **No console.log in production** (use console.warn/console.error only)
- **Prefer const over let** unless reassignment needed
- **Use meaningful variable names** (not `x`, `temp`, `data`)
- **Functions should do one thing** (single responsibility)
- **Keep functions under 50 lines** when possible
- **Add JSDoc comments** for complex functions
- **Handle errors gracefully** (try-catch, fallbacks)

---

## Communication Protocol

### Progress Updates

After completing each phase of a task, provide:

```
✅ Phase 1 Complete: [Phase Name]
- Created: file1.js, file2.vue
- Tests: 12/12 passing
- Coverage: 96.2%
- Next: Phase 2 - [Next Phase Name]
```

### Asking for Clarification

Use this format:

```
🤔 Question: [Topic]

Context: [Explain what you're working on]

Issue: [What's unclear or ambiguous]

Options:
1. [Approach A] - Pros: X, Cons: Y
2. [Approach B] - Pros: X, Cons: Y

Recommendation: [Your suggestion with reasoning]

What would you like me to do?
```

### Reporting Issues

```
⚠️ Issue Encountered: [Brief description]

What I was doing: [Task/phase]

Error: [Error message or behavior]

What I tried:
1. [Attempt 1] - Result: [X]
2. [Attempt 2] - Result: [Y]

Need guidance on: [Specific question]
```

---

## Task Execution Workflow

### Starting a Task

1. **Read the entire task document** from start to finish
2. **Check dependencies** - Ensure prerequisite tasks are complete
3. **Verify current state** - Run tests to confirm clean starting point
   ```bash
   npm run test
   npm run lint:check
   ```
4. **Ask questions upfront** if anything is unclear
5. **Announce start**: "Starting Task X: [Name]"

### During Task Execution

1. **Follow phases sequentially** - Don't skip ahead
2. **Run tests after each phase**
3. **Commit after each significant milestone**
4. **Report progress** after each phase
5. **Stop if tests fail unexpectedly** - Ask for guidance

### Completing a Task

1. **Run full test suite**
   ```bash
   npm run test
   npm run test:coverage
   npm run lint:check
   ```

2. **Verify acceptance criteria** - All must pass

3. **Final commit** with task completion message

4. **Summary report:**
   ```
   ✅ Task X Complete: [Name]
   
   Files Created:
   - [list files]
   
   Files Modified:
   - [list files]
   
   Test Results:
   - Total tests: X (all passing)
   - Coverage: X%
   - Lint: No issues
   
   Acceptance Criteria: All met ✅
   
   Ready for: Task X+1
   ```

---

## Git Workflow

### Commit Messages

Follow conventional commits:

```bash
# Features
git commit -m "feat: add life counter component"
git commit -m "feat(store): implement mana transfer action"

# Fixes
git commit -m "fix: correct dice roll distribution"
git commit -m "fix(test): update snapshot for PlayerName"

# Tests
git commit -m "test: add edge cases for mana pool"

# Docs
git commit -m "docs: update API documentation"

# Refactor
git commit -m "refactor: simplify life counter logic"

# Chore
git commit -m "chore: update dependencies"
```

### When to Commit

- After completing each Red-Green-Refactor cycle
- After completing each phase of a task
- Before asking questions (save progress)
- After fixing any failing tests

### What NOT to Commit

- `node_modules/`
- `dist/`
- `coverage/`
- `.env` files
- IDE-specific files (already in .gitignore)
- Commented-out code
- Debug console.logs

---

## Error Handling Strategy

### When Tests Fail

1. **Read error message carefully** - What is it actually saying?
2. **Check recent changes** - Did your code cause this?
3. **Verify test expectations** - Is the test correct?
4. **Try one fix** - Make targeted change
5. **If still failing**: Ask principal developer with full context

### When Build Fails

1. **Check error output** - What's the actual error?
2. **Verify dependencies** - Run `npm install` if needed
3. **Check syntax** - Run linter: `npm run lint:check`
4. **If persists**: Report to principal developer with error details

### When Uncertain About Implementation

**DON'T:**
- Guess and implement something that "might work"
- Make arbitrary architectural decisions
- Skip tests "to make progress"
- Leave TODO comments for later

**DO:**
- Stop and ask the question
- Provide context and options
- Wait for guidance before proceeding
- Document the decision once made

---

## Code Review Readiness

Before marking any task complete, verify:

- [ ] All tests pass (`npm run test`)
- [ ] Coverage ≥ 95% (`npm run test:coverage`)
- [ ] Linter passes (`npm run lint:check`)
- [ ] No console.log statements
- [ ] All `data-test` attributes present
- [ ] Component props validated
- [ ] Error cases handled
- [ ] Acceptance criteria met
- [ ] Committed with proper message
- [ ] No broken functionality in existing features

---

## Debugging Process

### Systematic Approach

1. **Reproduce the issue** - Can you trigger it consistently?
2. **Isolate the problem** - Which component/function/line?
3. **Form hypothesis** - What do you think is wrong?
4. **Test hypothesis** - Add console.log or debugger
5. **Fix** - Make targeted change
6. **Verify** - Run tests to confirm fix
7. **Clean up** - Remove debug code
8. **Add test** - Prevent regression

### When Stuck (After 15 Minutes)

Stop and ask for help:

```
🆘 Stuck on: [Problem]

What I'm trying to do: [Goal]

What's happening: [Actual behavior]

What I expected: [Expected behavior]

What I've tried:
1. [Attempt 1] - didn't work because X
2. [Attempt 2] - didn't work because Y

Code snippet: [Relevant code]

Need help with: [Specific question]
```

---

## Best Practices Summary

### DO:
✅ Write tests first (TDD)  
✅ Ask questions when uncertain  
✅ Follow existing patterns in codebase  
✅ Use `data-test` attributes  
✅ Validate inputs in store actions  
✅ Handle errors gracefully  
✅ Commit frequently with good messages  
✅ Run tests after every change  
✅ Maintain 95%+ coverage  
✅ Keep principal developer informed  

### DON'T:
❌ Make assumptions about requirements  
❌ Skip writing tests  
❌ Leave console.log in code  
❌ Commit broken code  
❌ Change APIs without discussion  
❌ Work on multiple tasks simultaneously  
❌ Ignore linter warnings  
❌ Leave TODO comments  
❌ Make large commits without testing  
❌ Proceed when uncertain  

---

## Remember

> **"When in doubt, ask. A 2-minute question is better than a 2-hour mistake."**

You're here to learn and execute efficiently. The principal developer is here to guide you. Together, you'll build high-quality software. Clear communication and following these guidelines will make the collaboration smooth and productive.

---

## Quick Reference

**Before any task:**
- Read full task document
- Check dependencies
- Verify clean state
- Ask upfront questions

**During task:**
- Follow TDD strictly
- Run tests continuously
- Commit regularly
- Report progress

**When uncertain:**
- Stop immediately
- Formulate specific question
- Provide context and options
- Wait for guidance

**Before completing:**
- All tests pass
- Coverage ≥ 95%
- Linter clean
- Acceptance criteria met
- Proper commit message

---

**Version**: 1.0.0  
**Last Updated**: January 21, 2026  
**Project**: Runes Gambit  
**Methodology**: Test-Driven Development (TDD)
