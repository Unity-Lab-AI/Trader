/**
 * 🖤 TEST HELPERS - Common utilities for Playwright tests
 */

const config = require('../config/test-config');

/**
 * Wait for game to fully load
 */
async function waitForGameLoad(page) {
  // Wait for loading screen to have hidden class (use evaluate since hidden elements aren't visible)
  await page.waitForFunction(() => {
    const loading = document.getElementById('loading-screen');
    return loading && loading.classList.contains('hidden');
  }, { timeout: config.loadTimeout });

  // Wait for main menu to be visible
  await page.waitForSelector('#main-menu:not(.hidden)', { timeout: 5000 });

  // Verify LoadingManager completed
  const isComplete = await page.evaluate(() => {
    return window.LoadingManager && window.LoadingManager.isComplete === true;
  });

  if (!isComplete) {
    throw new Error('LoadingManager did not complete');
  }
}

/**
 * Start a new game and get to gameplay (basic setup only)
 * NOTE: This does NOT handle the tutorial/intro sequence!
 * Use startGameAndSkipIntro() for tests that need the full game ready.
 */
async function startNewGame(page) {
  await waitForGameLoad(page);

  // Click New Game
  await page.click('#new-game-btn');

  // Wait for setup panel to be visible
  await page.waitForFunction(() => {
    const panel = document.getElementById('game-setup-panel');
    return panel && !panel.classList.contains('hidden');
  }, { timeout: 10000 });

  // Fill name and spend attribute points
  await page.evaluate(() => {
    // Fill character name
    const nameInput = document.getElementById('character-name-input');
    if (nameInput) nameInput.value = 'TestCharacter';

    // Spend all attribute points by clicking increase buttons
    const attrs = ['strength', 'intelligence', 'charisma', 'endurance', 'luck'];
    for (let i = 0; i < 5; i++) {
      const attr = attrs[i % attrs.length];
      const btn = document.querySelector(`button[data-attr="${attr}"].attr-up`);
      if (btn) btn.click();
    }
  });

  await page.waitForTimeout(500);

  // Click start button (should be enabled now)
  await page.click('#start-game-btn');
  await page.waitForTimeout(config.actionDelay);

  await page.waitForTimeout(config.actionDelay);

  // Wait for game to be running (setup panel hidden OR game container visible)
  await page.waitForFunction(() => {
    const setupPanel = document.getElementById('game-setup-panel');
    const gameContainer = document.getElementById('game-container');
    const locationPanel = document.getElementById('location-panel');

    // Game started if setup is hidden OR location panel exists and visible
    const setupHidden = setupPanel && setupPanel.classList.contains('hidden');
    const gameVisible = gameContainer && !gameContainer.classList.contains('hidden');
    const locationVisible = locationPanel && !locationPanel.classList.contains('hidden');

    return setupHidden || gameVisible || locationVisible;
  }, { timeout: 20000 });
}

/**
 * 🖤 Start a new game and skip ALL intro modals to get to playable game state 💀
 * This handles the COMPLETE game initialization sequence:
 * 1. New Game button → Character Setup
 * 2. Randomize character → Start Game
 * 3. Tutorial Choice modal → Click "No, Just Start"
 * 4. Rank Celebration popup → Wait for it to dismiss
 * 5. Introduction modal → Click "Approach the Stranger"
 * 6. Stranger Encounter modal → Click "Accept Quest"
 * 7. Quest Info Panel → Close it
 * 8. Game is now ready for testing!
 */
async function startGameAndSkipIntro(page) {
  await waitForGameLoad(page);

  // 🖤 Step 1: Click New Game
  await page.click('#new-game-btn');
  await page.waitForFunction(() => {
    const panel = document.getElementById('game-setup-panel');
    return panel && !panel.classList.contains('hidden');
  }, { timeout: 10000 });

  // 🖤 Step 2: Use Randomize button (faster than manual attribute allocation)
  const randomizeBtn = page.locator('#randomize-character-btn');
  if (await randomizeBtn.count() > 0) {
    await randomizeBtn.click();
    await page.waitForTimeout(300);
  } else {
    // Fallback: manually allocate attributes
    await page.evaluate(() => {
      const nameInput = document.getElementById('character-name-input');
      if (nameInput) nameInput.value = 'TestCharacter';
      const attrs = ['strength', 'intelligence', 'charisma', 'endurance', 'luck'];
      for (let i = 0; i < 5; i++) {
        const btn = document.querySelector(`button[data-attr="${attrs[i % attrs.length]}"].attr-up`);
        if (btn) btn.click();
      }
    });
  }

  await page.waitForTimeout(300);

  // 🖤 Step 3: Click Start Game
  await page.click('#start-game-btn');
  await page.waitForTimeout(500);

  // 🖤 Step 4: Handle Tutorial Choice modal - click "No, Just Start"
  await handleModalButton(page, ['No, Just Start', 'No Thanks', '❌ No', 'Skip'], 3000);

  // 🖤 Step 5: Wait for Rank Celebration to appear and auto-dismiss (or click to dismiss)
  await page.waitForTimeout(1000);
  const rankCelebration = page.locator('.rank-up-celebration, .rank-celebration');
  if (await rankCelebration.count() > 0) {
    // Try clicking to dismiss if it has a dismiss button
    const dismissBtn = page.locator('.rank-up-celebration button, .rank-celebration button, .dismiss-celebration');
    if (await dismissBtn.count() > 0) {
      await dismissBtn.first().click();
    }
    // Wait for it to go away
    await page.waitForFunction(() => {
      return !document.querySelector('.rank-up-celebration, .rank-celebration');
    }, { timeout: 6000 }).catch(() => {});
  }

  // 🖤 Step 6: Handle Introduction modal - click "Approach the Stranger"
  await handleModalButton(page, ['Approach the Stranger', 'Approach', '🎭 Approach'], 5000);

  // 🖤 Step 7: Handle Stranger Encounter modal - click "Accept Quest"
  await handleModalButton(page, ['Accept Quest', 'Accept', '✅ Accept'], 5000);

  // 🖤 Step 8: Close Quest Info Panel if visible
  await page.waitForTimeout(500);

  // Try multiple methods to close any open quest panels
  await page.evaluate(() => {
    // Method 1: Try QuestSystem.hideQuestLog()
    if (typeof QuestSystem !== 'undefined' && QuestSystem.hideQuestLog) {
      QuestSystem.hideQuestLog();
    }

    // Method 2: Hide quest-info-panel directly
    const questInfoPanel = document.getElementById('quest-info-panel');
    if (questInfoPanel && !questInfoPanel.classList.contains('hidden')) {
      questInfoPanel.classList.add('hidden');
    }

    // Method 3: Hide quest-panel (quest log)
    const questPanel = document.getElementById('quest-panel');
    if (questPanel && !questPanel.classList.contains('hidden')) {
      questPanel.classList.add('hidden');
    }
  });

  await page.waitForTimeout(300);

  // 🖤 Step 9: Verify game is in playable state
  await page.waitForFunction(() => {
    // Game is ready when:
    // - Location panel is visible (main gameplay UI)
    // - No blocking modals are open
    const locationPanel = document.getElementById('location-panel');
    const modalContainer = document.querySelector('.modal-container:not(.hidden)');
    const gameContainer = document.getElementById('game-container');

    const locationVisible = locationPanel && !locationPanel.classList.contains('hidden');
    const noBlockingModal = !modalContainer;
    const gameVisible = gameContainer && !gameContainer.classList.contains('hidden');

    return (locationVisible || gameVisible) && noBlockingModal;
  }, { timeout: 10000 });

  // 🖤 Final: Ensure any remaining modals are closed
  await page.evaluate(() => {
    // Force close any lingering modals
    const modalContainers = document.querySelectorAll('.modal-container, .modal-overlay');
    modalContainers.forEach(modal => {
      if (!modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    });
    // Also try ModalSystem.hide()
    if (typeof ModalSystem !== 'undefined' && ModalSystem.hide) {
      ModalSystem.hide();
    }
  });

  await page.waitForTimeout(200);
}

/**
 * 🖤 Helper: Click a button in a modal by searching for text patterns 💀
 */
async function handleModalButton(page, buttonTexts, timeout = 3000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    // Check for modal buttons
    for (const text of buttonTexts) {
      const selector = `button:has-text("${text}"), .modal-btn:has-text("${text}"), .btn:has-text("${text}")`;
      const btn = page.locator(selector);

      if (await btn.count() > 0 && await btn.first().isVisible()) {
        await btn.first().click();
        await page.waitForTimeout(200);
        return true;
      }
    }

    // Also try clicking any visible primary button in a modal
    const primaryBtn = page.locator('.modal-container:not(.hidden) .primary, .modal-container:not(.hidden) button.btn-primary');
    if (await primaryBtn.count() > 0 && await primaryBtn.first().isVisible()) {
      await primaryBtn.first().click();
      await page.waitForTimeout(200);
      return true;
    }

    await page.waitForTimeout(100);
  }

  return false; // Timeout - no button found
}

/**
 * 🖤 Open the Debooger console (button-only, no keyboard shortcut) 💀
 * NOTE: For testing, this FORCE-ENABLES the debooger if it's disabled in config
 */
async function openDeboogerConsole(page) {
  // 🖤 FIRST: Force-enable debooger for testing purposes
  await page.evaluate(() => {
    // Enable debooger in GameConfig
    if (typeof GameConfig !== 'undefined' && GameConfig.debooger) {
      GameConfig.debooger.enabled = true;
    }

    // Make sure the debooger button is visible
    const btn = document.getElementById('toggle-debooger-console');
    if (btn) {
      btn.style.display = '';
      btn.style.visibility = 'visible';
    }

    // Make sure the debooger console element exists and is accessible
    const console = document.getElementById('debooger-console');
    if (console) {
      console.style.display = '';
      console.style.visibility = 'visible';
    }

    // Remove any CSS that hides the debooger
    const hidingStyles = document.querySelectorAll('style');
    hidingStyles.forEach(style => {
      if (style.innerHTML.includes('toggle-debooger-console') && style.innerHTML.includes('display: none')) {
        style.remove();
      }
    });
  });

  await page.waitForTimeout(100);

  // 🖤 Click the Debooger button to open it
  const deboogerBtn = page.locator('#toggle-debooger-console, #debooger-toggle-btn, .debooger-toggle, button:has-text("Debooger")');
  if (await deboogerBtn.count() > 0 && await deboogerBtn.first().isVisible()) {
    await deboogerBtn.first().click();
    await page.waitForTimeout(config.actionDelay);
  } else {
    // Fallback: Try to open via JS function
    await page.evaluate(() => {
      if (typeof toggleDebooger === 'function') {
        toggleDebooger();
      } else if (typeof DeboogerCommandSystem !== 'undefined' && DeboogerCommandSystem.toggle) {
        DeboogerCommandSystem.toggle();
      }
    });
    await page.waitForTimeout(config.actionDelay);
  }

  // Wait for Debooger console to be visible 🕯️
  await page.waitForFunction(() => {
    const deboogerConsole = document.getElementById('debooger-console') ||
                    document.querySelector('.debooger-console');
    return deboogerConsole && !deboogerConsole.classList.contains('hidden');
  }, { timeout: 5000 }).catch(() => {
    // If still not visible, force-show it directly
    console.log('Debooger console not visible, forcing display...');
  });

  // 🖤 Final fallback: Force the console visible
  await page.evaluate(() => {
    const deboogerConsole = document.getElementById('debooger-console');
    if (deboogerConsole) {
      deboogerConsole.classList.remove('hidden');
      deboogerConsole.style.display = '';
      deboogerConsole.style.visibility = 'visible';
    }
  });

  // Give a moment for the input to be ready
  await page.waitForTimeout(200);
}

/**
 * 🖤 Execute a debooger command 🔮
 * NOTE: For testing, this executes via DeboogerCommandSystem.execute() directly
 * and FORCE-ENABLES the debooger if it's disabled in config
 */
async function runDeboogerCommand(page, command) {
  // 🖤 Execute directly via DeboogerCommandSystem - bypasses UI entirely
  const result = await page.evaluate(async (cmd) => {
    // First, force-enable debooger for testing
    if (typeof GameConfig !== 'undefined' && GameConfig.debooger) {
      GameConfig.debooger.enabled = true;
    }

    // 🖤 If commands weren't registered (because debooger was disabled at load), register them now
    if (typeof DeboogerCommandSystem !== 'undefined') {
      if (!DeboogerCommandSystem.commands || Object.keys(DeboogerCommandSystem.commands).length === 0) {
        DeboogerCommandSystem.registerBuiltInCommands();
      }
    }

    // Execute the command directly (it's async!)
    if (typeof DeboogerCommandSystem !== 'undefined' && DeboogerCommandSystem.execute) {
      await DeboogerCommandSystem.execute(cmd);
      return { success: true, command: cmd };
    } else {
      console.warn('DeboogerCommandSystem not available');
      return { success: false, error: 'DeboogerCommandSystem not available' };
    }
  }, command);

  await page.waitForTimeout(config.actionDelay);
  return result;
}

/**
 * 🖤 Get the last debooger console output 🦇
 */
async function getDeboogerOutput(page) {
  return await page.evaluate(() => {
    const content = document.getElementById('debooger-console-content');
    if (!content) return '';
    const lastEntry = content.lastElementChild;
    return lastEntry ? lastEntry.textContent : '';
  });
}

/**
 * Check if a panel is visible
 */
async function isPanelVisible(page, panelId) {
  return await page.evaluate((id) => {
    const panel = document.getElementById(id);
    return panel && !panel.classList.contains('hidden');
  }, panelId);
}

/**
 * Toggle a panel using keyboard shortcut
 */
async function togglePanelWithKey(page, key) {
  // First ensure focus is on the document body
  await page.evaluate(() => document.body.focus());
  await page.waitForTimeout(50);

  // Press the key
  await page.keyboard.press(key);
  await page.waitForTimeout(config.actionDelay);
}

/**
 * Open a panel directly using game functions (more reliable than keys)
 */
async function openPanel(page, panelName) {
  await page.evaluate((name) => {
    // Map panel names to their open functions
    const panelFunctions = {
      'inventory': () => typeof openInventory === 'function' && openInventory(),
      'character': () => typeof openCharacter === 'function' && openCharacter(),
      'market': () => typeof openMarket === 'function' && openMarket(),
      'travel': () => typeof openTravel === 'function' && openTravel(),
      'map': () => typeof openMap === 'function' && openMap(),
      'quest': () => typeof openQuests === 'function' && openQuests(),
      'quests': () => typeof openQuests === 'function' && openQuests(),
      'achievements': () => typeof openAchievements === 'function' && openAchievements(),
      'properties': () => typeof openProperties === 'function' && openProperties(),
      'financial': () => typeof openFinancial === 'function' && openFinancial(),
      'people': () => typeof openPeople === 'function' && openPeople(),
      'settings': () => typeof SettingsPanel !== 'undefined' && SettingsPanel.show && SettingsPanel.show(),
    };

    // Try direct function first
    if (panelFunctions[name.toLowerCase()]) {
      panelFunctions[name.toLowerCase()]();
      return;
    }

    // Fallback to game.showOverlay
    if (typeof game !== 'undefined' && typeof game.showOverlay === 'function') {
      game.showOverlay(name + '-panel');
    }
  }, panelName);
  await page.waitForTimeout(config.actionDelay);
}

/**
 * Close a panel
 */
async function closePanel(page, panelId) {
  await page.evaluate((id) => {
    const panel = document.getElementById(id);
    if (panel) {
      panel.classList.add('hidden');
    }
    // Also try game.hideOverlay
    if (typeof game !== 'undefined' && typeof game.hideOverlay === 'function') {
      game.hideOverlay(id);
    }
  }, panelId);
  await page.waitForTimeout(config.actionDelay);
}

/**
 * Get player gold amount
 * 🖤 Reads directly from game.player.gold to ensure fresh value after load
 */
async function getPlayerGold(page) {
  return await page.evaluate(() => {
    // 🖤 Read directly from game.player.gold for most accurate value
    if (typeof game !== 'undefined' && game.player) {
      return game.player.gold || 0;
    }
    // Fallback to GoldManager
    if (typeof GoldManager !== 'undefined') {
      return GoldManager.getGold();
    }
    // Fallback to global player
    if (typeof player !== 'undefined') {
      return player.gold || 0;
    }
    return 0;
  });
}

/**
 * Get player stats
 * 🖤 Stats are in game.player.stats object, not directly on game.player
 */
async function getPlayerStats(page) {
  return await page.evaluate(() => {
    // Try game.player.stats first (correct path)
    if (typeof game !== 'undefined' && game.player?.stats) {
      return {
        health: game.player.stats.health,
        maxHealth: game.player.stats.maxHealth || 100,
        hunger: game.player.stats.hunger,
        thirst: game.player.stats.thirst,
        fatigue: game.player.stats.fatigue,
        happiness: game.player.stats.happiness,
      };
    }
    // Fall back to direct properties (legacy support)
    if (typeof game !== 'undefined' && game.player) {
      return {
        health: game.player.health,
        maxHealth: game.player.maxHealth || 100,
        hunger: game.player.hunger,
        thirst: game.player.thirst,
        fatigue: game.player.fatigue,
        happiness: game.player.happiness,
      };
    }
    // Fall back to global player
    if (typeof player !== 'undefined') {
      return {
        health: player.stats?.health ?? player.health,
        maxHealth: player.stats?.maxHealth ?? player.maxHealth ?? 100,
        hunger: player.stats?.hunger ?? player.hunger,
        thirst: player.stats?.thirst ?? player.thirst,
        fatigue: player.stats?.fatigue ?? player.fatigue,
        happiness: player.stats?.happiness ?? player.happiness,
      };
    }
    return null;
  });
}

/**
 * Capture console messages during a test
 */
function setupConsoleCapture(page) {
  const messages = { logs: [], errors: [], warnings: [] };

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') messages.errors.push(text);
    else if (type === 'warning') messages.warnings.push(text);
    else messages.logs.push(text);
  });

  page.on('pageerror', error => {
    messages.errors.push(`PAGE ERROR: ${error.message}`);
  });

  return messages;
}

/**
 * Filter out expected/ignorable errors
 */
function filterCriticalErrors(errors) {
  return errors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('404') &&
    !e.includes('CORS') &&
    !e.includes('JSONBin') &&
    !e.includes('Failed to fetch') &&
    !e.includes('net::ERR') &&
    !e.includes('getSavedGames') &&
    !e.includes('NPCScheduleSystem') &&
    !e.includes('NPC Voice API Error')  // 🖤 Cosmetic voice API errors are non-critical
  );
}

module.exports = {
  waitForGameLoad,
  startNewGame,
  startGameAndSkipIntro,  // 🖤 NEW: Complete game setup with all intro handling 💀
  handleModalButton,       // 🖤 NEW: Helper for clicking modal buttons 💀
  openDeboogerConsole,
  runDeboogerCommand,
  getDeboogerOutput,
  isPanelVisible,
  togglePanelWithKey,
  openPanel,
  closePanel,
  getPlayerGold,
  getPlayerStats,
  setupConsoleCapture,
  filterCriticalErrors,
  config,
};
