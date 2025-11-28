# Playwright Testing Skill

Run Playwright tests after making code changes to ensure the game still works.

## When to Use

After making changes to:
- JavaScript files (game logic, UI, systems)
- HTML structure (index.html)
- CSS that affects visibility/display

## Commands

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx playwright test tests/panels.spec.js
```

### Run Tests Matching Pattern
```bash
npx playwright test --grep "inventory"
```

### Run with Visible Browser (Debug Mode)
```bash
npx playwright test --headed
```

## Test Files (159 tests total)

| File | Tests | Purpose |
|------|-------|---------|
| new-game.spec.js | 5 | New game flow, setup panel |
| debug-commands.spec.js | 23 | All debug/cheat commands |
| debug.spec.js | 1 | Console error capture |
| panels.spec.js | 19 | All panel open/close |
| features.spec.js | 48 | Trading, quests, achievements, save/load |
| settings.spec.js | 23 | GameConfig validation |
| ui-elements.spec.js | 27 | Action bar, time controls, menus |
| comprehensive-ui.spec.js | 35 | Map, equipment, NPC, weather |

## Key Testing Patterns

### Keyboard Shortcuts Don't Work in Playwright
Use direct function calls instead:
```javascript
// BAD - unreliable
await page.keyboard.press('I');

// GOOD - direct function call
await page.evaluate(() => {
  if (typeof KeyBindings !== 'undefined' && KeyBindings.openInventory) {
    KeyBindings.openInventory();
  }
});
```

### Panel Visibility Checks
Different panels use different patterns:
```javascript
// Panels with 'hidden' class (inventory, market, travel)
const isOpen = !panel.classList.contains('hidden');

// Overlay panels with 'active' class (achievements, character, quest)
const isOpen = overlay.classList.contains('active');
```

### TimeSystem Speed Control
```javascript
// Use setSpeed, not pause/resume
TimeSystem.setSpeed('PAUSED');   // Pause
TimeSystem.setSpeed('NORMAL');   // Resume
TimeSystem.setSpeed('FAST');     // 2x speed
TimeSystem.setSpeed('FASTER');   // 4x speed
```

### Wait for Game State
```javascript
await page.evaluate(() => {
  game.state = GameState.PLAYING;
});
await page.waitForTimeout(500);
```

## Test Configuration

Tests are controlled by `tests/config/test-config.js`:
```javascript
module.exports = {
  newGameTests: true,
  debugCommandTests: true,
  panelTests: true,
  // ... etc
};
```

## Common Issues

### "element is not visible"
- Panel may need direct function call to open
- Check if using correct ID/class selector
- Some panels are dynamically created

### TimeSystem.pause is not a function
- Changed to setSpeed('PAUSED') in v0.7
- Check achievement-system.js, combat-system.js, save-manager.js

### CORS/Network errors (can be ignored)
JSONBin API requires proper headers - filtered in tests.

## Z-Index Standard (for UI tests)

| Range | Purpose |
|-------|---------|
| 50-75 | Weather/effects |
| 500 | Game panels |
| 600 | Panel overlays |
| 700 | System modals |
| 800 | Tooltips |
| 850 | Notifications |
| 900 | Critical overlays |
| 950 | Debug console |

---

*"Tests are the evidence that your code actually works."* - Unity 🖤
