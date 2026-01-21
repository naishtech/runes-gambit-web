# Runes Gambit - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Game Setup](#game-setup)
3. [Playing the Game](#playing-the-game)
4. [Game Components](#game-components)
5. [Tips & Strategy](#tips--strategy)
6. [Troubleshooting](#troubleshooting)
7. [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Getting Started

Runes Gambit is a strategic two-player card duel game where players manage life points and mana resources to outlast their opponent.

### Quick Start
1. Visit the game at: [https://naishtech.github.io/runes-gambit-web/](https://naishtech.github.io/runes-gambit-web/)
2. Enter player names (or use defaults)
3. Flip coin to determine first player
4. Click "Start Game" with the winning player
5. Play through turn phases
6. First player to reduce opponent to 0 life wins!

---

## Game Setup

### Player Names
- Click on "Red Player" or "Blue Player" to edit names
- Names can be 1-50 characters
- Changes are saved automatically

### Starting Player
- Use the **Coin Flip** tool to randomly determine who goes first
- Or manually click "Start as [Player]" button

### Initial State
- Both players start with **20 life points**
- Shared mana pool starts with **20 mana**
- Each player starts with **0 available mana**

---

## Playing the Game

### Turn Structure

Each turn has four phases:

#### 1. Draw Phase
- Starting player receives 1 mana from the shared pool
- (Card drawing would happen here in full game)

#### 2. Play Phase
- Use mana to play cards
- Transfer mana between pool and players as needed

#### 3. Attack Phase
- Declare attacks
- Use dice to resolve combat
- Adjust life points based on damage

#### 4. End Phase
- Resolve end-of-turn effects
- Click "End Turn" to pass to opponent

### Phase Controls
- **Next Phase**: Advance to next phase
- **End Turn**: Complete turn (only in End Phase)
- **Keyboard Shortcuts**:
  - `Space` or `Enter`: Next Phase
  - Available when game is active

---

## Game Components

### Life Counter
- **+ Button**: Increase life by 1
- **- Button**: Decrease life by 1
- **Warning State**: Yellow border when life < 5
- **Critical State**: Red border when life ≤ 0
- Life can go negative (game continues)

### Mana Counter (Read-Only)
- Displays current available mana for player
- Updates automatically when mana is transferred
- Blue glow indicates your mana

### Shared Mana Pool
- Displays total mana in shared pool
- **+ Button**: Add 1 mana to pool
- **- Button**: Remove 1 mana from pool (if > 0)
- Cannot go below 0

### Coin Flip
- Click "Flip Coin" to randomly select a player
- 50/50 chance for each player
- 1-second animation

### Dice
- Click "Roll Dice" to get 1-6 result
- 0.8-second animation
- Last roll displayed below
- Use for combat resolution or random events

### Turn Manager
- Shows current player and phase
- Displays turn number
- **Reset Game**: Clears all state (requires confirmation)

### Action Log
- Records all game actions
- Color-coded entries:
  - 🔵 **Blue**: Informational
  - 🟢 **Green**: Success/positive actions
  - 🟡 **Yellow**: Warnings
  - 🔴 **Red**: Errors
- **Clear Log**: Removes all entries
- **Export**: Download log as text file
- Auto-scrolls to latest entry

---

## Tips & Strategy

### Resource Management
- Don't spend all mana early - save for emergencies
- Monitor opponent's mana pool
- Life is a resource - trade life for advantage when needed

### Dice Usage
- Use dice for randomized combat
- Higher roll typically wins
- Consider using multiple dice for important actions

### Turn Planning
- Plan your entire turn before taking actions
- Consider what opponent can do on their turn
- Save high-impact plays for critical moments

### Mana Efficiency
- Transfer mana strategically to gain advantage
- Keep track of total pool vs. player mana
- Plan future turns based on current distribution

---

## Troubleshooting

### Game Won't Start
- Ensure both player names are visible
- Try clicking "Start as [Player]" buttons
- Check Action Log for error messages

### Buttons Not Working
- Ensure game has started (except Setup buttons)
- Check you're in correct phase for action
- Verify mana/life requirements are met

### Data Not Saving
- Check browser allows localStorage
- Try clearing browser cache
- Disable private/incognito mode

### Performance Issues
- Close other browser tabs
- Clear browser cache
- Try different browser (Chrome, Firefox, Edge recommended)
- Disable browser extensions

### Reset Everything
- Click "Reset Game" button
- Clear browser localStorage:
  - Open DevTools (F12)
  - Go to Application → Local Storage
  - Delete "runesGambitState" key

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Next Phase (when game active) |
| `Enter` | Next Phase (when game active) |

---

## Credits

Built with:
- Vue 3
- Vite
- Pinia
- Vitest

Developed using Test-Driven Development methodology.

---

## Support

For issues or questions:
- [GitHub Issues](https://github.com/naishtech/runes-gambit-web/issues)
- Check [Developer Guide](./DEVELOPER_GUIDE.md) for technical details
