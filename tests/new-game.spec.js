// @ts-check
const { test, expect } = require('@playwright/test');
const config = require('./config/test-config');

/**
 * Medieval Trading Game - New Game Flow Tests
 * Version: 0.88 | Unity AI Lab | Creators: Hackall360, Sponge, GFourteen
 */

test.describe('New Game Flow', () => {
  test.skip(!config.newGameTests, 'New game tests disabled in config');

  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');

    // Wait for loading to complete (loading screen should be hidden)
    await expect(page.locator('#loading-screen')).toHaveClass(/hidden/, { timeout: 20000 });

    // Main menu should be visible
    await expect(page.locator('#main-menu')).not.toHaveClass(/hidden/);
  });

  test('clicking New Game button starts the game', async ({ page }) => {
    // Capture console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Click the New Game button
    await page.click('#new-game-btn');

    // Wait a moment for transitions
    await page.waitForTimeout(1000);

    // Main menu should now be hidden
    await expect(page.locator('#main-menu')).toHaveClass(/hidden/);

    // Game container should be visible (not hidden)
    await expect(page.locator('#game-container')).not.toHaveClass(/hidden/);

    // Game setup panel should be visible
    await expect(page.locator('#game-setup-panel')).not.toHaveClass(/hidden/);

    // No critical errors should have occurred
    // Filter out network/CORS errors (JSONBin API, etc.) - these don't affect gameplay
    const criticalErrors = consoleErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('404') &&
      !e.includes('CORS') &&
      !e.includes('JSONBin') &&
      !e.includes('Failed to fetch') &&
      !e.includes('net::ERR')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('game setup panel has difficulty options and settings button', async ({ page }) => {
    // Click New Game
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Check difficulty radio buttons exist
    await expect(page.locator('input[name="difficulty"][value="easy"]')).toBeVisible();
    await expect(page.locator('input[name="difficulty"][value="normal"]')).toBeVisible();
    await expect(page.locator('input[name="difficulty"][value="hard"]')).toBeVisible();

    // Check settings button (cog wheel) exists in setup panel
    await expect(page.locator('#setup-settings-btn')).toBeVisible();
  });

  test('can navigate back to main menu from setup', async ({ page }) => {
    // Click New Game
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Click Exit/Cancel button
    await page.click('#cancel-setup-btn');
    await page.waitForTimeout(500);

    // Should be back at main menu
    await expect(page.locator('#main-menu')).not.toHaveClass(/hidden/);
    await expect(page.locator('#game-setup-panel')).toHaveClass(/hidden/);
  });

  test('startNewGame function is available globally', async ({ page }) => {
    // Check that startNewGame is exposed on window
    const hasStartNewGame = await page.evaluate(() => {
      return typeof window.startNewGame === 'function';
    });

    expect(hasStartNewGame).toBe(true);
  });

  test('loading manager completes successfully', async ({ page }) => {
    // Check loading manager state
    const loadingComplete = await page.evaluate(() => {
      return window.LoadingManager && window.LoadingManager.isComplete === true;
    });

    expect(loadingComplete).toBe(true);
  });
});
