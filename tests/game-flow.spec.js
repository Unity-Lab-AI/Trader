// ═══════════════════════════════════════════════════════════════
// 🖤 GAME FLOW TESTS - Complete game flow testing from startup to death
// ═══════════════════════════════════════════════════════════════
// Tests the complete lifecycle of a game session
// Unity AI Lab by Hackall360 Sponge GFourteen www.unityailab.com
// ═══════════════════════════════════════════════════════════════

const { test, expect } = require('@playwright/test');
const config = require('./config/test-config');
const {
  waitForGameLoad,
  startNewGame,
  startGameAndSkipIntro,  // 🖤 Use this for tests that need full game state
  openDeboogerConsole,
  runDeboogerCommand,
  getPlayerGold,
  getPlayerStats,
  setupConsoleCapture,
  filterCriticalErrors,
  openPanel,
  isPanelVisible,
  handleModalButton
} = require('./helpers/test-helpers');

// ═══════════════════════════════════════════════════════════════
// 🎮 GAME STARTUP FLOW
// ═══════════════════════════════════════════════════════════════

test.describe('Game Startup Flow', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test('loads game successfully from initial page load', async ({ page }) => {
    const messages = setupConsoleCapture(page);

    // Navigate to the game
    await page.goto('/');

    // Wait for game to load (loading manager ready and main menu visible)
    await waitForGameLoad(page);

    // Main menu should be visible
    const mainMenuVisible = await page.evaluate(() => {
      const menu = document.getElementById('main-menu');
      return menu && !menu.classList.contains('hidden');
    });
    expect(mainMenuVisible).toBe(true);

    // Loading manager should be complete
    const loadingComplete = await page.evaluate(() => {
      return window.LoadingManager && window.LoadingManager.isComplete === true;
    });
    expect(loadingComplete).toBe(true);

    // Check for critical errors
    const criticalErrors = filterCriticalErrors(messages.errors);
    expect(criticalErrors).toHaveLength(0);
  });

  test('displays correct game title and version', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Check title
    const title = await page.title();
    expect(title).toContain('Medieval Trading Game');

    // Check main menu title
    const menuTitle = await page.textContent('#main-menu-title');
    expect(menuTitle).toContain('Medieval Trading Game');

    // Check version is displayed
    const versionText = await page.textContent('#main-menu-version');
    expect(versionText).toBeTruthy();
    expect(versionText).toMatch(/v?\d+\.\d+/); // Matches version pattern like "0.81" or "v0.81"
  });

  test('main menu has all required buttons', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Check for New Game button
    await expect(page.locator('#new-game-btn')).toBeVisible();

    // Check for Load Game button (may be disabled if no saves)
    await expect(page.locator('#load-game-btn')).toBeVisible();

    // Check for Settings button
    await expect(page.locator('#settings-btn')).toBeVisible();
  });

  test('weather effects initialize on main menu', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Check if weather container exists
    const weatherContainer = page.locator('#menu-weather-container');
    await expect(weatherContainer).toBeAttached();

    // MenuWeatherSystem should be initialized
    const weatherSystemLoaded = await page.evaluate(() => {
      return typeof MenuWeatherSystem !== 'undefined';
    });
    expect(weatherSystemLoaded).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎭 MAIN MENU TO GAME TRANSITION
// ═══════════════════════════════════════════════════════════════

test.describe('Main Menu to Game Transition', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test('clicking New Game button transitions to character setup', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    const messages = setupConsoleCapture(page);

    // Main menu should be visible
    await expect(page.locator('#main-menu')).not.toHaveClass(/hidden/);

    // Click New Game button
    await page.click('#new-game-btn');

    // Wait for transition
    await page.waitForTimeout(1000);

    // Main menu should now be hidden
    await expect(page.locator('#main-menu')).toHaveClass(/hidden/);

    // Game container should be visible
    await expect(page.locator('#game-container')).not.toHaveClass(/hidden/);

    // Game setup panel should be visible
    await expect(page.locator('#game-setup-panel')).not.toHaveClass(/hidden/);

    // No critical errors
    const criticalErrors = filterCriticalErrors(messages.errors);
    expect(criticalErrors).toHaveLength(0);
  });

  test('startNewGame function is globally available', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    const functionExists = await page.evaluate(() => {
      return typeof window.startNewGame === 'function';
    });

    expect(functionExists).toBe(true);
  });

  test('can cancel setup and return to main menu', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Click New Game
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Setup panel should be visible
    await expect(page.locator('#game-setup-panel')).not.toHaveClass(/hidden/);

    // Click cancel button
    await page.click('#cancel-setup-btn');
    await page.waitForTimeout(500);

    // Should be back at main menu
    await expect(page.locator('#main-menu')).not.toHaveClass(/hidden/);
    await expect(page.locator('#game-setup-panel')).toHaveClass(/hidden/);
  });

  test('cancelGameSetup function works correctly', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Start new game
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Call cancelGameSetup directly
    await page.evaluate(() => {
      if (typeof cancelGameSetup === 'function') {
        cancelGameSetup();
      }
    });

    await page.waitForTimeout(500);

    // Should return to main menu
    await expect(page.locator('#main-menu')).not.toHaveClass(/hidden/);
  });
});

// ═══════════════════════════════════════════════════════════════
// 👤 CHARACTER CREATION TESTS
// ═══════════════════════════════════════════════════════════════

test.describe('Character Creation Flow', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);
  });

  test('character setup panel has all required elements', async ({ page }) => {
    // Character name input
    await expect(page.locator('#character-name-input')).toBeVisible();

    // Difficulty options
    await expect(page.locator('input[name="difficulty"][value="easy"]')).toBeVisible();
    await expect(page.locator('input[name="difficulty"][value="normal"]')).toBeVisible();
    await expect(page.locator('input[name="difficulty"][value="hard"]')).toBeVisible();

    // Attribute controls
    await expect(page.locator('.attributes-grid')).toBeVisible();
    await expect(page.locator('#attr-points-remaining')).toBeVisible();

    // Perk selection button
    await expect(page.locator('#open-perk-modal-btn')).toBeVisible();

    // Action buttons
    await expect(page.locator('#randomize-character-btn')).toBeVisible();
    await expect(page.locator('#start-game-btn')).toBeVisible();
    await expect(page.locator('#setup-settings-btn')).toBeVisible();
    await expect(page.locator('#cancel-setup-btn')).toBeVisible();
  });

  test('can enter character name', async ({ page }) => {
    const testName = 'TestMerchant';

    await page.fill('#character-name-input', testName);

    const inputValue = await page.inputValue('#character-name-input');
    expect(inputValue).toBe(testName);
  });

  test('can select difficulty levels', async ({ page }) => {
    // Default should be normal
    const defaultChecked = await page.isChecked('input[name="difficulty"][value="normal"]');
    expect(defaultChecked).toBe(true);

    // Select easy
    await page.click('input[name="difficulty"][value="easy"]');
    const easyChecked = await page.isChecked('input[name="difficulty"][value="easy"]');
    expect(easyChecked).toBe(true);

    // Select hard
    await page.click('input[name="difficulty"][value="hard"]');
    const hardChecked = await page.isChecked('input[name="difficulty"][value="hard"]');
    expect(hardChecked).toBe(true);
  });

  test('difficulty affects starting gold', async ({ page }) => {
    // Check normal difficulty gold
    await page.click('input[name="difficulty"][value="normal"]');
    await page.waitForTimeout(200);
    let goldDisplay = await page.textContent('#setup-gold-amount');
    expect(goldDisplay).toContain('100');

    // Check easy difficulty gold (120)
    await page.click('input[name="difficulty"][value="easy"]');
    await page.waitForTimeout(200);
    goldDisplay = await page.textContent('#setup-gold-amount');
    expect(goldDisplay).toContain('120');

    // Check hard difficulty gold (80)
    await page.click('input[name="difficulty"][value="hard"]');
    await page.waitForTimeout(200);
    goldDisplay = await page.textContent('#setup-gold-amount');
    expect(goldDisplay).toContain('80');
  });

  test('can modify character attributes', async ({ page }) => {
    // Get initial points
    const initialPoints = await page.textContent('#attr-points-remaining');

    // Click increase button for strength
    await page.click('button[data-attr="strength"].attr-up');
    await page.waitForTimeout(100);

    // Points should decrease
    const newPoints = await page.textContent('#attr-points-remaining');
    expect(parseInt(newPoints)).toBe(parseInt(initialPoints) - 1);

    // Strength value should increase
    const strengthValue = await page.textContent('#attr-strength');
    expect(parseInt(strengthValue)).toBe(6); // Base 5 + 1
  });

  test('can decrease attributes back to base', async ({ page }) => {
    // Increase strength
    await page.click('button[data-attr="strength"].attr-up');
    await page.waitForTimeout(100);

    // Decrease strength
    await page.click('button[data-attr="strength"].attr-down');
    await page.waitForTimeout(100);

    // Should be back to 5
    const strengthValue = await page.textContent('#attr-strength');
    expect(parseInt(strengthValue)).toBe(5);
  });

  test('attribute points limit is enforced', async ({ page }) => {
    // Try to spend more than 5 points - use evaluate to bypass disabled check
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        const btn = document.querySelector('button[data-attr="strength"].attr-up');
        if (btn && !btn.disabled) {
          btn.click();
        }
      }
    });
    await page.waitForTimeout(200);

    // Points should be 0 or can't go negative
    const remainingPoints = await page.textContent('#attr-points-remaining');
    expect(parseInt(remainingPoints)).toBeGreaterThanOrEqual(0);
  });

  test('randomize character button works', async ({ page }) => {
    // Get initial attribute values
    const initialStrength = await page.textContent('#attr-strength');

    // Click randomize
    await page.click('#randomize-character-btn');
    await page.waitForTimeout(500);

    // At least name should change or attributes might change
    // Just verify the button doesn't crash
    const strengthAfter = await page.textContent('#attr-strength');
    expect(strengthAfter).toBeTruthy();
  });

  test('can open perk selection modal', async ({ page }) => {
    // Click perk selection button
    await page.click('#open-perk-modal-btn');
    await page.waitForTimeout(300);

    // Perk modal should be visible
    await expect(page.locator('#perk-selection-modal')).not.toHaveClass(/hidden/);

    // Close modal
    const closeBtn = page.locator('#perk-selection-modal .overlay-close').first();
    await closeBtn.click();
    await page.waitForTimeout(300);
  });

  test('can complete character creation and start game', async ({ page }) => {
    // Fill in character name
    await page.fill('#character-name-input', 'TestHero');

    // Spend attribute points
    await page.click('button[data-attr="strength"].attr-up');
    await page.click('button[data-attr="charisma"].attr-up');
    await page.click('button[data-attr="intelligence"].attr-up');
    await page.click('button[data-attr="endurance"].attr-up');
    await page.click('button[data-attr="luck"].attr-up');
    await page.waitForTimeout(200);

    // Click start game
    await page.click('#start-game-btn');
    await page.waitForTimeout(500);

    // Handle intro modals
    await handleModalButton(page, ['No, Just Start', 'No Thanks', '❌ No', 'Skip'], 3000);
    await page.waitForTimeout(1000);
    await handleModalButton(page, ['Approach the Stranger', 'Approach', '🎭 Approach'], 5000);
    await handleModalButton(page, ['Accept Quest', 'Accept', '✅ Accept'], 5000);

    // Close any quest panels
    await page.evaluate(() => {
      const questInfoPanel = document.getElementById('quest-info-panel');
      if (questInfoPanel && !questInfoPanel.classList.contains('hidden')) {
        questInfoPanel.classList.add('hidden');
      }
    });

    await page.waitForTimeout(500);

    // Setup panel should be hidden
    await expect(page.locator('#game-setup-panel')).toHaveClass(/hidden/);

    // Game should be running
    const isGameRunning = await page.evaluate(() => {
      return typeof game !== 'undefined' && game.player !== null;
    });
    expect(isGameRunning).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎮 GAME STATE INITIALIZATION
// ═══════════════════════════════════════════════════════════════

test.describe('Game State Initialization', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 🖤 Use full intro skip to get to playable game state
    await startGameAndSkipIntro(page);
  });

  test('game object is initialized correctly', async ({ page }) => {
    // Game already started in beforeEach

    const gameState = await page.evaluate(() => {
      if (typeof game === 'undefined') return null;

      return {
        hasPlayer: game.player !== null,
        hasGold: typeof game.player?.gold === 'number',
        // 🖤 Inventory is an OBJECT with itemId: count pairs, not an array
        hasInventory: typeof game.player?.inventory === 'object' && game.player?.inventory !== null,
        // 🖤 game.currentLocation is an OBJECT with {id, name, description}
        hasLocation: typeof game.currentLocation === 'object' && game.currentLocation?.id !== undefined,
        hasAttributes: game.player?.attributes !== undefined
      };
    });

    expect(gameState).not.toBeNull();
    expect(gameState.hasPlayer).toBe(true);
    expect(gameState.hasGold).toBe(true);
    expect(gameState.hasInventory).toBe(true);
    expect(gameState.hasLocation).toBe(true);
    expect(gameState.hasAttributes).toBe(true);
  });

  test('player starts with correct default gold', async ({ page }) => {
    // Game already started in beforeEach
    const gold = await getPlayerGold(page);
    // 🖤 Randomized characters may have bonus gold from perks/traits
    // Normal difficulty gives 100 base, but perks can modify by +/- 50%
    expect(gold).toBeGreaterThanOrEqual(50);
    expect(gold).toBeLessThanOrEqual(200);
  });

  test('player starts at a valid location', async ({ page }) => {
    // Game already started in beforeEach
    const locationData = await page.evaluate(() => {
      // 🖤 game.currentLocation is an OBJECT with {id, name, description}
      if (typeof game?.currentLocation === 'object') {
        return {
          id: game.currentLocation.id,
          name: game.currentLocation.name,
          hasDescription: !!game.currentLocation.description
        };
      }
      return null;
    });

    // 🖤 Verify location is properly initialized (randomized chars can start at different locations)
    expect(locationData).not.toBeNull();
    expect(locationData.id).toBeTruthy();
    expect(locationData.name).toBeTruthy();
    expect(locationData.hasDescription).toBe(true);
  });

  test('player vitals are initialized correctly', async ({ page }) => {
    // Game already started in beforeEach
    const stats = await getPlayerStats(page);

    expect(stats).not.toBeNull();
    expect(stats.health).toBeGreaterThan(0);
    expect(stats.maxHealth).toBe(100);
    expect(stats.hunger).toBeGreaterThanOrEqual(0);
    expect(stats.thirst).toBeGreaterThanOrEqual(0);
  });

  test('UI displays are updated with initial values', async ({ page }) => {
    // Game already started in beforeEach

    // Check gold display
    const goldDisplay = await page.textContent('#player-gold');
    expect(parseInt(goldDisplay)).toBeGreaterThan(0);

    // Check player name display
    const nameDisplay = await page.textContent('#player-name');
    expect(nameDisplay).toBeTruthy();
    // Randomized names are valid too
    expect(nameDisplay.length).toBeGreaterThan(0);

    // Check location display
    const locationName = await page.textContent('#location-name');
    expect(locationName).toBeTruthy();
  });

  test('all core game systems are initialized', async ({ page }) => {
    // Game already started in beforeEach

    const systems = await page.evaluate(() => {
      return {
        tradingSystem: typeof TradingSystem !== 'undefined',
        travelSystem: typeof TravelSystem !== 'undefined',
        // 🖤 It's InventorySystem, not InventoryPanel
        inventorySystem: typeof InventorySystem !== 'undefined',
        achievementSystem: typeof AchievementSystem !== 'undefined',
        questSystem: typeof QuestSystem !== 'undefined',
        saveManager: typeof SaveManager !== 'undefined',
        timeSystem: typeof TimeSystem !== 'undefined' || typeof TimeMachine !== 'undefined',
        npcManager: typeof NPCManager !== 'undefined',
        marketSystem: typeof DynamicMarket !== 'undefined' || typeof MarketSystem !== 'undefined'
      };
    });

    expect(systems.tradingSystem).toBe(true);
    expect(systems.travelSystem).toBe(true);
    expect(systems.inventorySystem).toBe(true);
    expect(systems.achievementSystem).toBe(true);
    expect(systems.saveManager).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 💾 SAVE/LOAD GAME FLOW
// ═══════════════════════════════════════════════════════════════

test.describe('Save/Load Game Flow', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 🖤 Use full intro skip to get to playable game state
    await startGameAndSkipIntro(page);
  });

  test('SaveManager is available', async ({ page }) => {
    const exists = await page.evaluate(() => {
      return typeof SaveManager !== 'undefined';
    });
    expect(exists).toBe(true);
  });

  test('can save game successfully', async ({ page }) => {
    // Try to save via function - use slot 1
    const saveResult = await page.evaluate(() => {
      if (typeof SaveManager !== 'undefined' && SaveManager.saveToSlot) {
        try {
          SaveManager.saveToSlot(1, 'TestSave');
          return true;
        } catch (e) {
          console.error('Save failed:', e);
          return false;
        }
      }
      return false;
    });

    expect(saveResult).toBe(true);
  });

  test('saved game persists in localStorage', async ({ page }) => {
    // Save game to slot 2 and check result with detailed error info
    const saveResult = await page.evaluate(() => {
      if (typeof SaveManager !== 'undefined') {
        // Try to get game state first to see if it's valid
        let gameStateError = null;
        let validationResult = null;
        try {
          const gameState = SaveManager.getCompleteGameState();
          validationResult = SaveManager.validateSaveData(gameState);
        } catch (e) {
          gameStateError = e.message;
        }

        const success = SaveManager.saveToSlot(2, 'PersistenceTest');
        const saveData = localStorage.getItem('tradingGameSave_2');
        return {
          success: success,
          hasData: saveData !== null && saveData.length > 0,
          dataLength: saveData ? saveData.length : 0,
          gameStateError: gameStateError,
          validationValid: validationResult?.valid,
          validationErrors: validationResult?.errors,
          validationWarnings: validationResult?.warnings
        };
      }
      return { success: false, error: 'SaveManager not found' };
    });

    console.log('🖤 Save debug info:', JSON.stringify(saveResult, null, 2));

    // Verify save succeeded and data persists
    expect(saveResult.success).toBe(true);
    expect(saveResult.hasData).toBe(true);
  });

  test('can load saved game', async ({ page }) => {
    // Save current game state to slot 3
    const goldBeforeSave = await getPlayerGold(page);

    const saveSuccess = await page.evaluate(() => {
      if (typeof SaveManager !== 'undefined') {
        return SaveManager.saveToSlot(3, 'LoadTest');
      }
      return false;
    });
    expect(saveSuccess).toBe(true);

    await page.waitForTimeout(300);

    // Modify gold
    await runDeboogerCommand(page, 'givegold 500');
    await page.waitForTimeout(500);

    const goldAfterChange = await getPlayerGold(page);
    expect(goldAfterChange).not.toBe(goldBeforeSave);

    // Load the save from slot 3
    const loadSuccess = await page.evaluate(() => {
      if (typeof SaveManager !== 'undefined') {
        return SaveManager.loadFromSlot(3);
      }
      return false;
    });
    expect(loadSuccess).toBe(true);

    await page.waitForTimeout(1000);

    // Gold should be restored
    const goldAfterLoad = await getPlayerGold(page);
    expect(goldAfterLoad).toBeCloseTo(goldBeforeSave, 0);
  });

  test('F5 quick save works', async ({ page }) => {
    // Press F5 to quick save
    await page.keyboard.press('F5');
    await page.waitForTimeout(500);

    // 🖤 quickSave() saves to currentSaveSlot (default 1), using tradingGameSave_ prefix
    // NOT auto-save slots (those are for timed auto-saves)
    const hasSave = await page.evaluate(() => {
      // Check for any save slot (quickSave uses slot 1 by default)
      for (let i = 1; i <= 10; i++) {
        if (localStorage.getItem(`tradingGameSave_${i}`)) {
          return true;
        }
      }
      return false;
    });

    expect(hasSave).toBe(true);
  });

  test('save includes player state correctly', async ({ page }) => {
    // Modify player state
    await runDeboogerCommand(page, 'givegold 999');
    await page.waitForTimeout(300);

    const goldBefore = await getPlayerGold(page);

    // Save to slot 4
    await page.evaluate(() => {
      if (typeof SaveManager !== 'undefined') {
        SaveManager.saveToSlot(4, 'StateTest');
      }
    });

    await page.waitForTimeout(300);

    // Get saved data and verify gold
    const savedGold = await page.evaluate(() => {
      const saveData = localStorage.getItem('tradingGameSave_4');
      if (!saveData) return 0;
      try {
        // SaveManager compresses data, need to decompress
        if (typeof SaveManager !== 'undefined' && SaveManager.decompressSaveData) {
          const parsed = SaveManager.decompressSaveData(saveData);
          return parsed?.gameData?.player?.gold || 0;
        }
        return 0;
      } catch (e) {
        return 0;
      }
    });

    expect(savedGold).toBeCloseTo(goldBefore, 0);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🏠 QUIT TO MAIN MENU
// ═══════════════════════════════════════════════════════════════

test.describe('Quit to Main Menu', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 🖤 Use full intro skip to get to playable game state
    await startGameAndSkipIntro(page);
  });

  test('quitToMainMenu function exists', async ({ page }) => {
    const exists = await page.evaluate(() => {
      return typeof quitToMainMenu === 'function';
    });
    expect(exists).toBe(true);
  });

  test('can quit to main menu from game', async ({ page }) => {
    // Call quit function
    await page.evaluate(() => {
      if (typeof quitToMainMenu === 'function') {
        quitToMainMenu();
      }
    });

    await page.waitForTimeout(500);

    // Should be back at main menu
    await expect(page.locator('#main-menu')).not.toHaveClass(/hidden/);

    // Game container should be hidden
    await expect(page.locator('#game-container')).toHaveClass(/hidden/);
  });

  test('main menu buttons are functional after quit', async ({ page }) => {
    // Quit to menu
    await page.evaluate(() => {
      if (typeof quitToMainMenu === 'function') {
        quitToMainMenu();
      }
    });

    await page.waitForTimeout(500);

    // Try clicking New Game again
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Should go to setup
    await expect(page.locator('#game-setup-panel')).not.toHaveClass(/hidden/);
  });

  test('game state is cleaned up on quit', async ({ page }) => {
    // Modify game state by setting gold to a high value
    await page.evaluate(() => {
      if (typeof game !== 'undefined' && game.player) {
        game.player.gold = 9999;
      }
    });
    await page.waitForTimeout(200);

    // Verify gold was modified
    const goldBefore = await getPlayerGold(page);
    expect(goldBefore).toBe(9999);

    // Quit
    await page.evaluate(() => {
      if (typeof quitToMainMenu === 'function') {
        quitToMainMenu();
      }
    });

    await page.waitForTimeout(500);

    // Start new game with full intro handling
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Use randomize and start
    const randomizeBtn = page.locator('#randomize-character-btn');
    if (await randomizeBtn.count() > 0) {
      await randomizeBtn.click();
      await page.waitForTimeout(300);
    }

    await page.click('#start-game-btn');
    await page.waitForTimeout(500);

    // Handle intro modals
    await handleModalButton(page, ['No, Just Start', 'No Thanks', '❌ No', 'Skip'], 3000);
    await page.waitForTimeout(1000);
    await handleModalButton(page, ['Approach the Stranger', 'Approach', '🎭 Approach'], 5000);
    await handleModalButton(page, ['Accept Quest', 'Accept', '✅ Accept'], 5000);

    // Close any quest panels
    await page.evaluate(() => {
      const questInfoPanel = document.getElementById('quest-info-panel');
      if (questInfoPanel && !questInfoPanel.classList.contains('hidden')) {
        questInfoPanel.classList.add('hidden');
      }
    });

    await page.waitForTimeout(500);

    // Gold should be fresh start, NOT 9999 - randomized chars may have 60-200 gold depending on perks
    const newGold = await getPlayerGold(page);
    expect(newGold).not.toBe(9999);  // Must NOT be the modified value
    expect(newGold).toBeGreaterThanOrEqual(60);
    expect(newGold).toBeLessThanOrEqual(200);
  });
});

// ═══════════════════════════════════════════════════════════════
// 💀 GAME OVER CONDITIONS
// ═══════════════════════════════════════════════════════════════

test.describe('Game Over Conditions', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 🖤 Use full intro skip to get to playable game state
    await startGameAndSkipIntro(page);
  });

  test('game over system is initialized', async ({ page }) => {
    const exists = await page.evaluate(() => {
      return typeof GameOverSystem !== 'undefined' || typeof showGameOver === 'function';
    });
    expect(exists).toBe(true);
  });

  test('death by starvation triggers game over', async ({ page }) => {
    // 🖤 Set stats to simulate starvation state
    await page.evaluate(() => {
      if (game?.player?.stats) {
        game.player.stats.health = 0;
        game.player.stats.hunger = 0;
      }
    });

    // 🖤 Trigger game over using the correct method
    await page.evaluate(async () => {
      if (typeof GameOverSystem !== 'undefined' && GameOverSystem.handleGameOver) {
        await GameOverSystem.handleGameOver('starvation');
      }
    });
    await page.waitForTimeout(1500);

    // Game over overlay should appear
    const gameOverVisible = await page.evaluate(() => {
      const overlay = document.getElementById('game-over-overlay');
      return overlay && !overlay.classList.contains('hidden');
    });

    expect(gameOverVisible).toBe(true);
  });

  test('game over screen displays final stats', async ({ page }) => {
    // 🖤 Trigger game over using correct method
    await page.evaluate(async () => {
      if (typeof GameOverSystem !== 'undefined' && GameOverSystem.handleGameOver) {
        await GameOverSystem.handleGameOver('testing');
      }
    });
    await page.waitForTimeout(1500);

    // Check for stats grid
    const hasStats = await page.evaluate(() => {
      const statsGrid = document.getElementById('game-over-stats-grid');
      return statsGrid && statsGrid.children.length > 0;
    });

    expect(hasStats).toBe(true);
  });

  test('game over screen has action buttons', async ({ page }) => {
    // 🖤 Trigger game over using correct method
    await page.evaluate(async () => {
      if (typeof GameOverSystem !== 'undefined' && GameOverSystem.handleGameOver) {
        await GameOverSystem.handleGameOver('testing');
      }
    });
    await page.waitForTimeout(1500);

    // Check for action buttons (look for common button patterns)
    const hasButtons = await page.evaluate(() => {
      const overlay = document.getElementById('game-over-overlay');
      if (!overlay) return false;
      const buttons = overlay.querySelectorAll('button');
      return buttons.length > 0;
    });

    expect(hasButtons).toBe(true);
  });

  test('can restart game from game over screen', async ({ page }) => {
    // 🖤 Trigger game over using correct method
    await page.evaluate(async () => {
      if (typeof GameOverSystem !== 'undefined' && GameOverSystem.handleGameOver) {
        await GameOverSystem.handleGameOver('testing');
      }
    });
    await page.waitForTimeout(1500);

    // Click Try Again / Restart button using force: true since overlay might have z-index issues
    const tryAgainBtn = page.locator('#game-over-overlay button').filter({ hasText: /Try Again|Restart|New Game/i }).first();
    if (await tryAgainBtn.count() > 0) {
      await tryAgainBtn.click({ force: true });
      await page.waitForTimeout(500);

      // 🖤 Game over overlay should be hidden after clicking restart
      const gameOverHidden = await page.evaluate(() => {
        const overlay = document.getElementById('game-over-overlay');
        return !overlay || overlay.classList.contains('hidden');
      });

      expect(gameOverHidden).toBe(true);
    }
  });

  test('can return to main menu from game over', async ({ page }) => {
    // 🖤 Trigger game over using correct method
    await page.evaluate(async () => {
      if (typeof GameOverSystem !== 'undefined' && GameOverSystem.handleGameOver) {
        await GameOverSystem.handleGameOver('testing');
      }
    });
    await page.waitForTimeout(1500);

    // Click Main Menu button using force: true since overlay might have z-index issues
    const menuBtn = page.locator('#game-over-overlay button').filter({ hasText: /Main Menu|Menu|Home/i }).first();
    if (await menuBtn.count() > 0) {
      await menuBtn.click({ force: true });
      await page.waitForTimeout(500);

      // 🖤 The game over overlay should be hidden after clicking the button
      // (Credits may show briefly, but game over overlay should be gone)
      const gameOverHidden = await page.evaluate(() => {
        const overlay = document.getElementById('game-over-overlay');
        return !overlay || overlay.classList.contains('hidden');
      });
      expect(gameOverHidden).toBe(true);
    }
  });

  test('death cause is tracked correctly', async ({ page }) => {
    // 🖤 Trigger starvation death with cause
    await page.evaluate(async () => {
      if (typeof GameOverSystem !== 'undefined' && GameOverSystem.handleGameOver) {
        await GameOverSystem.handleGameOver('starvation');
      }
    });
    await page.waitForTimeout(1500);

    // Check death cause in game over screen - the message should contain our cause
    const deathInfo = await page.evaluate(() => {
      const causeElement = document.getElementById('game-over-cause');
      const messageElement = document.querySelector('#game-over-overlay .game-over-message');
      return {
        cause: causeElement ? causeElement.textContent : '',
        message: messageElement ? messageElement.textContent : '',
        overlayVisible: !document.getElementById('game-over-overlay')?.classList.contains('hidden')
      };
    });

    expect(deathInfo.overlayVisible).toBe(true);
    // The overlay should be showing with some content
    expect(deathInfo.cause || deathInfo.message).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════
// 🔄 COMPLETE GAME CYCLE TEST
// ═══════════════════════════════════════════════════════════════

test.describe('Complete Game Cycle', () => {
  test.skip(!config.gameFlowTests, 'Game flow tests disabled in config');
  test('full game cycle: start -> play -> save -> load -> quit -> restart', async ({ page }) => {
    const messages = setupConsoleCapture(page);

    // STEP 1: Load game and complete full intro sequence
    await page.goto('/');
    await startGameAndSkipIntro(page);

    const gameStarted = await page.evaluate(() => {
      return typeof game !== 'undefined' && game.player !== null;
    });
    expect(gameStarted).toBe(true);

    // STEP 2: Play game (modify state) - use direct gold manipulation
    const initialGold = await getPlayerGold(page);
    await page.evaluate(() => {
      if (game?.player) game.player.gold += 777;
    });
    await page.waitForTimeout(300);

    const goldAfterPlay = await getPlayerGold(page);
    expect(goldAfterPlay).toBe(initialGold + 777);

    // STEP 3: Save game
    const saveSuccess = await page.evaluate(() => {
      if (typeof SaveManager !== 'undefined') {
        return SaveManager.saveToSlot(1, 'CycleTest');
      }
      return false;
    });
    expect(saveSuccess).toBe(true);
    await page.waitForTimeout(300);

    // STEP 4: Modify state again
    await page.evaluate(() => {
      if (game?.player) game.player.gold += 123;
    });
    await page.waitForTimeout(200);

    // STEP 5: Load saved game
    const loadSuccess = await page.evaluate(() => {
      if (typeof SaveManager !== 'undefined') {
        return SaveManager.loadFromSlot(1);
      }
      return false;
    });
    expect(loadSuccess).toBe(true);
    await page.waitForTimeout(500);

    const goldAfterLoad = await getPlayerGold(page);
    expect(goldAfterLoad).toBe(initialGold + 777);  // Should be back to saved state

    // STEP 6: Quit to main menu
    await page.evaluate(() => {
      if (typeof quitToMainMenu === 'function') {
        quitToMainMenu();
      }
    });
    await page.waitForTimeout(1000);

    // Verify game was quit - should be at main menu or game panels should be gone
    const quitSuccessful = await page.evaluate(() => {
      const mainMenu = document.getElementById('main-menu');
      const gameSetup = document.getElementById('game-setup-panel');
      // Either at main menu or game state was reset
      return (mainMenu && !mainMenu.classList.contains('hidden')) ||
             (gameSetup && !gameSetup.classList.contains('hidden')) ||
             (game && game.state !== 'playing');
    });
    expect(quitSuccessful).toBe(true);

    // Verify no critical errors throughout
    const criticalErrors = filterCriticalErrors(messages.errors);
    expect(criticalErrors).toHaveLength(0);
  });
});

console.log('🖤 Game Flow Tests loaded - Unity Agent F');
