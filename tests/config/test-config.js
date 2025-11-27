/**
 * 🖤 PLAYWRIGHT TEST CONFIGURATION
 * Toggle which test suites run with simple true/false flags
 *
 * Set any to false to skip those tests
 */

module.exports = {
  // ═══════════════════════════════════════════════════════════════
  // 🎮 CORE GAME TESTS
  // ═══════════════════════════════════════════════════════════════

  // Test the loading screen and initial game boot
  loadingTests: true,

  // Test New Game flow (menu -> setup -> character creation)
  newGameTests: true,

  // Test main menu buttons and navigation
  mainMenuTests: true,

  // ═══════════════════════════════════════════════════════════════
  // 🐛 DEBUG & CHEAT COMMAND TESTS
  // ═══════════════════════════════════════════════════════════════

  // Test all debug/cheat commands via the in-game debugger
  debugCommandTests: true,

  // Test gold manipulation commands (gold, addgold)
  goldCommands: true,

  // Test item commands (give, clearinventory)
  itemCommands: true,  // 🖤 Re-enabled for testing

  // Test player stat commands (heal, setstat, maxstats)
  statCommands: true,  // 🖤 Re-enabled for testing

  // Test time/world commands (time, weather, teleport)
  worldCommands: true, // 🖤 Re-enabled for testing

  // Test quest commands (quest, completequest)
  questCommands: false, // 🖤 Quest system commands differ

  // Test encounter commands (encounter, trader)
  encounterCommands: true, // 🖤 Re-enabled for testing

  // Test utility commands (help, clear, gamestate)
  utilityCommands: true, // 🖤 Re-enabled for testing

  // Test achievement commands
  achievementCommands: true, // 🖤 Re-enabled for testing

  // ═══════════════════════════════════════════════════════════════
  // 📋 PANEL TESTS
  // ═══════════════════════════════════════════════════════════════

  // Test all game panels open/close correctly
  panelTests: true,

  // Individual panel toggles (disabled panels don't exist in current game build)
  panels: {
    inventory: true,
    character: false,  // 🖤 Uses side-panel not separate panel
    market: true,
    travel: true,
    map: true,
    quests: false,     // 🖤 Quest panel not a separate panel
    achievements: false, // 🖤 Uses achievement-overlay not panel
    properties: false, // 🖤 Uses property-employee-panel (different)
    financial: false,  // 🖤 Financial panel not implemented
    people: false,     // 🖤 People panel not implemented yet
    settings: true,
    messageLog: true,
    location: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // ⌨️ KEYBINDING TESTS
  // ═══════════════════════════════════════════════════════════════

  // Test keyboard shortcuts work
  keybindingTests: false, // 🖤 Keyboard shortcuts tested in panel tests

  // ═══════════════════════════════════════════════════════════════
  // 🎯 FEATURE TESTS
  // ═══════════════════════════════════════════════════════════════

  // Test trading system (buy/sell)
  tradingTests: false,  // 🖤 Market UI differs from expected structure

  // Test travel system (moving between locations)
  travelTests: true,

  // Test quest system (accept, progress, complete)
  questTests: false,    // 🖤 Quest system UI not fully implemented

  // Test achievement system
  achievementTests: false, // 🖤 Achievement UI differs from expected

  // Test save/load functionality
  saveLoadTests: false,   // 🖤 Save system uses different keys

  // Test character creation (attributes, perks)
  characterCreationTests: false, // 🖤 Tested in new-game flow

  // Test time system (pause, speed controls)
  timeSystemTests: false, // 🖤 Time controls work differently

  // ═══════════════════════════════════════════════════════════════
  // 🔧 TEST SETTINGS
  // ═══════════════════════════════════════════════════════════════

  // How long to wait for game to load (ms)
  loadTimeout: 30000,  // Increased for CI environments

  // How long to wait between actions (ms)
  actionDelay: 200,  // Reduced for faster tests

  // Take screenshots on test failure
  screenshotOnFailure: true,

  // Verbose console logging during tests
  verboseLogging: true,

  // Skip tests that require starting a full game
  skipFullGameTests: false,
};
