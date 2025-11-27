# 🖤 NERD README - THE CODE GRIMOIRE 🖤
### *For those who dare to peek behind the curtain of this digital nightmare*

```
═══════════════════════════════════════════════════════════════════════
    "The code is held together by spite, caffeine, and dark magic."
                    - Every developer who touched this, 3am
═══════════════════════════════════════════════════════════════════════
```

> **Conjured by: Unity AI Lab - The Coven**
> *Hackall360 | Sponge | GFourteen*
> Written in the witching hours when the bugs come out to play

---

## 📖 TABLE OF CONTENTS

- [Architecture Overview](#-architecture-overview)
- [File Structure](#-file-structure)
- [Core Systems](#-core-systems)
- [Game Logic Files](#-game-logic-files)
- [UI & Rendering](#-ui--rendering)
- [Economy Systems](#-economy-systems)
- [Travel & World](#-travel--world)
- [Persistence](#-persistence)
- [Debug & Development](#-debug--development)
- [Adding New Features](#-adding-new-features)
- [Known Architectural Sins](#-known-architectural-sins)

---

## 🏗️ ARCHITECTURE OVERVIEW

*"It's not spaghetti code, it's... artisanal pasta."*

This game follows a loosely-coupled module architecture where each system is its own JavaScript object living in the global scope. They communicate through direct references and a shared `game` state object.

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│                    (Entry Point)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │   game.js   │◄───│ TimeSystem  │◄───│ GameWorld   │    │
│   │  (Core Hub) │    │  (Ticks)    │    │ (Locations) │    │
│   └──────┬──────┘    └─────────────┘    └─────────────┘    │
│          │                                                  │
│   ┌──────▼───────────────────────────────────────────┐     │
│   │                 SYSTEM MODULES                    │     │
│   │  trading | inventory | property | employee        │     │
│   │  crafting | achievement | travel | exploration    │     │
│   │  merchant | market | reputation | events          │     │
│   └──────────────────────────────────────────────────┘     │
│          │                                                  │
│   ┌──────▼───────────────────────────────────────────┐     │
│   │                  UI MODULES                       │     │
│   │  panels | modals | settings | debug | renderer    │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Holy Trinity of State

1. **`game`** - The global game state object (player, inventory, time, etc.)
2. **`GameWorld`** - All locations, paths, and world data
3. **`TimeSystem`** - The heartbeat that drives everything

---

## 📁 FILE STRUCTURE

```
Trader-Claude/
├── index.html                    # The summoning circle (entry point)
├── GameplayReadme.md             # For players who read documentation
├── NerdReadme.md                 # You are here, brave soul
├── todo.md                       # The neverending TODO list
│
├── src/
│   ├── css/
│   │   └── styles.css            # 6000+ lines of dark-themed CSS
│   │
│   └── js/
│       ├── game.js               # THE BIG ONE - main game logic (~8000 lines)
│       ├── game-engine.js        # Core game loop and initialization
│       ├── item-database.js      # All 150+ items defined here
│       │
│       ├── [ECONOMY SYSTEMS]
│       ├── trading-system.js     # Buy/sell mechanics and bulk trading
│       ├── inventory-system.js   # Item management and storage
│       ├── crafting-economy-system.js # Recipes and production
│       ├── dynamic-market-system.js   # Price fluctuations
│       ├── market-price-history.js    # Price tracking over time
│       ├── npc-merchant-system.js     # NPC traders with personalities
│       ├── trade-route-system.js      # Automated trade routes
│       │
│       ├── [PROPERTY SYSTEMS]
│       ├── property-system.js    # Property ownership and upgrades
│       ├── employee-system.js    # Worker management
│       ├── property-employee-bridge.js # Connects the two
│       ├── property-employee-ui.js     # UI for property/employees
│       │
│       ├── [WORLD & TRAVEL]
│       ├── travel-system.js      # Movement between locations
│       ├── travel-panel-map.js   # Mini-map in travel panel
│       ├── game-world-renderer.js # Main world map canvas rendering
│       ├── city-reputation-system.js  # Reputation per location
│       ├── city-event-system.js       # Random city events
│       ├── gatehouse-system.js        # Entry fees and restrictions
│       │
│       ├── [EXPLORATION & COMBAT]
│       ├── dungeon-exploration-system.js # Dungeon events & loot
│       ├── resource-gathering-system.js  # Mining, farming, etc.
│       │
│       ├── [UI SYSTEMS]
│       ├── panel-manager.js      # Panel state management
│       ├── draggable-panels.js   # Make panels draggable
│       ├── modal-system.js       # Popup modals
│       ├── settings-panel.js     # Game settings UI
│       ├── ui-enhancements.js    # UI polish and tweaks
│       ├── ui-polish-system.js   # More polish
│       ├── button-fix.js         # Yes, we needed this
│       │
│       ├── [PERSISTENCE]
│       ├── save-load-system.js   # Save/load core logic
│       ├── save-load-ui.js       # Save/load UI
│       ├── save-ui-system.js     # More save UI stuff
│       │
│       ├── [VISUAL & AUDIO]
│       ├── visual-effects-system.js   # Particles and effects
│       ├── animation-system.js        # Animation handling
│       ├── environmental-effects-system.js # Weather, day/night
│       ├── audio-system.js            # Sound effects and music
│       │
│       ├── [ACHIEVEMENTS & LEADERBOARD]
│       ├── achievement-system.js # 57 achievements tracking
│       ├── global-leaderboard-system.js # Hall of Fame, JSONBin API
│       ├── death-cause-system.js  # Tracks how/why players die
│       ├── game-over-system.js    # Death screen, score submission
│       │
│       ├── [UTILITIES]
│       ├── timer-manager.js      # setTimeout/setInterval wrapper
│       ├── event-manager.js      # Custom event system
│       ├── performance-optimizer.js # Performance tweaks
│       ├── browser-compatibility.js # Cross-browser fixes
│       ├── debug-command-system.js  # Cheat codes and debug
│       │
│       └── [INTEGRATION]
│           ├── unified-item-system.js # Item system unification
│           └── immersive-experience-integration.js # Misc integration
│
└── assets/
    ├── images/                   # Image assets
    ├── sounds/                   # Sound effects
    └── music/                    # Background music
```

---

## 🎮 CORE SYSTEMS

### game.js - The Heart of Darkness

*"8000 lines of pure, distilled chaos."*

This is the main game file. Everything important lives here or passes through here.

**Key Objects:**
```javascript
const game = {
    player: {
        name: 'Trader',
        gold: 100,
        inventory: {},
        equipment: {},
        attributes: { strength, intelligence, charisma, endurance, luck },
        stats: { health, maxHealth, hunger, thirst, stamina, happiness }
    },
    currentLocation: { id, name, type },
    settings: { ... },
    // ... much more
};

const GameWorld = {
    locations: { ... },  // All 30+ locations
    paths: { ... },      // Connections between locations
    getPath(from, to),
    getDistance(from, to)
};

const TimeSystem = {
    gameTime: { year, month, day, hour, minute },
    currentSpeed: 'NORMAL',
    isPaused: false,
    update(),
    setSpeed(speed),
    getTotalMinutes()
};
```

**Key Functions:**
- `initGame()` - Initializes all game systems
- `updateGame()` - Called every tick to update game state
- `buyItem(itemId, qty)` - Purchase from market
- `sellItem(itemId, qty)` - Sell to market
- `travel(locationId)` - Move to new location
- `consumeItem(itemId)` - Use consumable
- `updatePlayerInfo()` - Refresh all UI displays

---

### item-database.js - The Sacred Tome of Items

*"Every spoon, sword, and suspicious mushroom catalogued here."*

```javascript
const ItemDatabase = {
    items: {
        // 150+ items defined with:
        iron_ore: {
            id: 'iron_ore',
            name: 'Iron Ore',
            description: 'Raw iron ore for smelting.',
            icon: '⛏️',
            category: 'raw_ores',
            rarity: 'common',
            weight: 15,
            basePrice: 12,
            gatherable: true,
            gatherMethod: 'mining'
        },
        // ...
    },

    getItem(itemId),           // Get item by ID
    calculatePrice(itemId),    // Get price with modifiers
    calculateWeight(itemId, qty), // Get total weight
    getItemsByCategory(cat),   // Filter by category
    getItemsByRarity(rarity),  // Filter by rarity
    isConsumable(itemId),      // Check if edible/drinkable
    getItemEffects(itemId)     // Get consumption effects
};
```

---

### TimeSystem - The Eternal Tick

*"Time waits for no merchant. Unless you pause it."*

The game runs on a tick system. Every real second, game time advances based on speed:

```javascript
TimeSystem = {
    SPEEDS: {
        PAUSED: 0,        // frozen like my heart
        NORMAL: 2,        // 2 game minutes per real second (1 hour = 30 real seconds)
        FAST: 10,         // 10 game minutes per real second (1 hour = 6 real seconds)
        VERY_FAST: 30     // 30 game minutes per real second (1 hour = 2 real seconds)
    },

    update() {
        // Called every frame
        // Advances time, triggers events
        // Calls all system updates
    },

    getTotalMinutes() {
        // Returns total game minutes since start
        // Used for travel sync, events, etc.
    }
};
```

**Travel Animation Sync:**
Travel animations use `TimeSystem.getTotalMinutes()` to sync player marker movement with game time. This means:
- A 2-hour journey (120 game minutes) takes exactly 60 real seconds at NORMAL speed
- Pausing the game pauses the travel animation
- Speed changes affect travel progress in real-time

---

## 💰 ECONOMY SYSTEMS

### trading-system.js - The Art of the Deal

*"Buy low, sell high, try not to starve."*

```javascript
const TradingSystem = {
    tradeMode: 'single',  // 'single' or 'bulk'
    selectedTradeItems: new Map(),
    priceAlerts: [],

    executeBulkBuy(),
    executeBulkSell(),
    recordTrade(type, items),
    checkPriceAlerts(),
    calculateTradeValue(items)
};
```

### npc-merchant-system.js - The Greedy NPCs

*"Every merchant has a personality. Most are assholes."*

```javascript
const NPCMerchantSystem = {
    merchants: {},

    PERSONALITIES: {
        GREEDY: { buyModifier: 0.7, sellModifier: 1.3 },
        FRIENDLY: { buyModifier: 0.95, sellModifier: 1.05 },
        SHREWD: { buyModifier: 0.85, sellModifier: 1.15 },
        // ...
    },

    generateMerchants(),
    getCurrentMerchant(),
    calculatePrice(itemId, merchantId),
    getMerchantFinances(merchantId),  // NEW: Track merchant gold
    canMerchantAfford(merchantId, amount),
    deductMerchantGold(merchantId, amount),
    simulateNPCPurchases(),  // Items deplete over day
    updateEconomy()  // Called from game loop
};
```

### dynamic-market-system.js - Chaos Economics

*"Prices go up, prices go down. You can't explain that."*

```javascript
const DynamicMarketSystem = {
    marketConditions: {},
    supplyDemand: {},

    updatePrices(locationId),
    triggerMarketEvent(type),
    updateSupplyDemand(locationId, itemId, quantity),
    applyMarketSaturation(locationId, itemId)
};
```

---

## 🗺️ TRAVEL & WORLD

### travel-system.js - The Long Road

*"Getting there is half the battle. The other half is not dying."*

```javascript
const TravelSystem = {
    isCurrentlyTraveling: false,
    currentPath: [],
    travelProgress: 0,
    destination: null,

    startTravel(destinationId),
    updateTravel(),
    completeTravel(),
    calculateTravelTime(from, to),
    setDestination(locationId)  // NEW: Set without traveling
};
```

### game-world-renderer.js - The Pretty Map

*"HTML rendering for the existentially lost."*

```javascript
const GameWorldRenderer = {
    mapElement: null,
    tooltipElement: null,
    playerMarker: null,

    // Path types with speed/stamina/safety modifiers
    PATH_TYPES: {
        city_street: { speedMultiplier: 1.5, staminaDrain: 0.3, safety: 0.9 },
        main_road: { speedMultiplier: 1.3, staminaDrain: 0.5, safety: 0.7 },
        road: { speedMultiplier: 1.0, staminaDrain: 0.7, safety: 0.6 },
        path: { speedMultiplier: 0.8, staminaDrain: 0.9, safety: 0.5 },
        trail: { speedMultiplier: 0.6, staminaDrain: 1.2, safety: 0.4 },
        wilderness: { speedMultiplier: 0.4, staminaDrain: 1.5, safety: 0.3 }
    },

    init(),
    render(),
    renderPaths(),         // SVG paths with hover tooltips
    renderLocations(),     // Location markers with visibility states
    updatePlayerMarker(),  // Player position indicator

    // Path tooltips show: type, distance (miles), travel time,
    // real time at normal speed, stamina drain, safety %
    getPathInfo(from, to),
    showPathTooltip(e, pathInfo, fromLoc, toLoc),

    // Travel animation synced to TimeSystem
    animateTravel(fromId, toId, travelTimeMinutes),
    runTravelAnimation(),  // Uses TimeSystem.getTotalMinutes()
    onTravelStart(fromId, toId, duration),
    // ...
};
```

**Visibility States:**
- `'visible'` - Location visited, fully shown
- `'discovered'` - Connected to visited location, greyed out
- `'hidden'` - Not yet connected to explored area

### dungeon-exploration-system.js - Into the Darkness

*"Where the loot is good and the survival rate is... questionable."*

```javascript
const DungeonExplorationSystem = {
    DUNGEON_ITEMS: { /* 17 unique loot items */ },
    VENDOR_TRASH: { /* 10 sellable-only items */ },

    EXPLORATION_EVENTS: {
        ancient_shrine: {
            name: 'Ancient Shrine',
            options: [
                {
                    id: 'light_candles',
                    label: 'Light the candles',
                    outcomes: [
                        { weight: 40, type: 'blessing', loot: [...] },
                        { weight: 30, type: 'nothing', loot: [] },
                        // ...
                    ]
                }
            ]
        },
        // 20+ more events
    },

    SURVIVAL_REQUIREMENTS: {
        easy: { minHealth: 20, survivalChance: 0.95 },
        medium: { minHealth: 40, survivalChance: 0.70 },
        hard: { minHealth: 70, survivalChance: 0.40 },
        deadly: { minHealth: 90, survivalChance: 0.20 }
    },

    generateExplorationOptions(locationId),
    executeExplorationAction(actionId),
    calculateSurvivalAssessment(player, difficulty),
    renderExplorationUI()
};
```

### resource-gathering-system.js - Manual Labor

*"Chop wood, mine ore, question your career choices."*

```javascript
const ResourceGatheringSystem = {
    isGathering: false,
    currentResource: null,
    gatheringProgress: 0,
    isCommitted: false,  // Can't leave after first action

    startGathering(resourceType, locationId),
    completeGathering(),
    stopGatheringSession(reason),
    getCurrentCarryWeight(),
    getMaxCarryCapacity(),
    canCarryMore(additionalWeight),
    commitToLocation(locationId),
    canLeaveLocation()
};
```

---

## 💀 DEATH & LEADERBOARD SYSTEMS

### death-cause-system.js - How Did You Die?

*"Everyone dies. We just keep track of the embarrassing details."*

```javascript
const DeathCauseSystem = {
    // Death categories for that extra flavor of despair
    DEATH_CATEGORIES: {
        STARVATION: 'starvation',
        DEHYDRATION: 'dehydration',
        EXHAUSTION: 'exhaustion',
        COMBAT: 'combat',
        DUNGEON: 'dungeon',
        TRAVEL: 'travel',
        ENCOUNTER: 'encounter',
        BANKRUPTCY: 'bankruptcy',
        DISEASE: 'disease',
        ENVIRONMENTAL: 'environmental',
        UNKNOWN: 'unknown'
    },

    // Track events that lead to death
    recordEvent(category, description, damage),
    setPendingCause(category, description),
    getDeathCause(),  // Returns flavorful death message
    analyzeDeathCause(),  // Determines cause from event history

    // Integration helpers
    recordCombatDamage(enemy, damage),
    recordDungeonEvent(eventName, outcome),
    recordTravelHazard(hazardType, damage),
    reset()  // Called on new game
};
```

### global-leaderboard-system.js - Hall of Champions

*"Your score, immortalized in JSONBin's cold servers."*

The **Hall of Champions** is the single source of truth for the global leaderboard. It replaces the old "Hall of Fame" and consolidates all leaderboard functionality into one unified system.

```javascript
const GlobalLeaderboardSystem = {
    // Configuration loaded from GameConfig (config.js)
    config: {
        BIN_ID: 'xxx',      // JSONBin API
        API_KEY: 'xxx',     // X-Master-Key for read/write
        backend: 'jsonbin', // 'jsonbin', 'gist', or 'local'
        maxEntries: 100,    // Top 100 champions
        displayEntries: 10, // Show top 10 in compact view
        minScoreToSubmit: 100
    },

    leaderboard: [],

    // Core methods
    submitScore(scoreData),     // Called on death, save, AND retirement
    fetchLeaderboard(),
    renderLeaderboard(),
    renderFullHallOfChampions(containerId), // Full top 100 view with medals

    // Auto-refresh every 10 minutes
    startAutoRefresh(),
    stopAutoRefresh(),
    refresh(),  // Force refresh

    // Score data includes:
    // - playerName, score, gold, daysSurvived
    // - isAlive (💚 or 💀 indicator)
    // - causeOfDeath (from DeathCauseSystem)
    // - difficulty, tradesCompleted, netWorth
    // - timestamp
};

// Console utilities for debugging/admin
window.testJSONBin();      // Test API connectivity
window.resetLeaderboard(); // Clear all entries (admin only)
```

**Important:** Scores are only submitted during explicit gameplay events:
- **New Save** - Marks player as "still playing" (💚)
- **Death** - Records cause of death (💀)
- **Retirement** - Voluntary end to journey

Old saves are NEVER auto-submitted. Only active gameplay triggers leaderboard updates.

---

## 💾 PERSISTENCE

### save-load-system.js - Cheating Death

*"Your progress, preserved in localStorage's cold embrace."*

```javascript
const SaveLoadSystem = {
    SAVE_VERSION: '0.5',

    saveGame(slotId),
    loadGame(slotId),
    getSaveSlots(),
    deleteSave(slotId),
    exportSave(),
    importSave(data),

    // Serializes all game state:
    // - game object (player, inventory, equipment, stats)
    // - All system states (time, events, world, properties, employees)
    // - Trading state (history, price alerts, market data)
    // - Achievements
    // - Settings

    // Post-load restoration:
    // - Forces map re-render with saved visited locations
    // - Restores panel positions via DraggablePanels.loadPositions()
    // - Hides all setup screens, shows game UI
    // - Triggers full UI refresh (player info, inventory, time display)
};
```

### draggable-panels.js - Panel Position Persistence

*"Your panels, your way. We remember where you put them."*

```javascript
const DraggablePanels = {
    STORAGE_KEY: 'trader-claude-panel-positions',

    // Saves panel position to localStorage when dragged
    savePosition(element),

    // Restores all panel positions from localStorage
    loadPositions(),

    // Nuclear reset - clear positions and reload
    resetPositions(),

    // Positions persist across sessions and game loads
    // Panel positions are independent of save files
};
```

### config.js - Centralized Settings Defaults

*"One config to rule them all."*

All settings panel defaults are now centralized in `config.js`. The settings panel reads from `GameConfig.settings` as its source of truth:

```javascript
const GameConfig = {
    // ... other config sections ...

    settings: {
        // 🎵 audio settings
        audio: {
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.7,
            isMuted: false,
            isMusicMuted: false,
            isSfxMuted: false,
            audioEnabled: true
        },

        // 👁️ visual settings
        visual: {
            particlesEnabled: true,
            screenShakeEnabled: true,
            animationsEnabled: true,
            weatherEffectsEnabled: true,
            quality: 'medium',       // 'low', 'medium', 'high'
            reducedMotion: false,
            flashWarnings: true
        },

        // ✨ animation settings
        animation: {
            animationsEnabled: true,
            animationSpeed: 1.0,
            reducedMotion: false,
            quality: 'medium'
        },

        // 🎨 ui settings
        ui: {
            animationsEnabled: true,
            hoverEffectsEnabled: true,
            transitionsEnabled: true,
            reducedMotion: false,
            highContrast: false,
            fontSize: 'medium',      // 'small', 'medium', 'large'
            theme: 'default'
        },

        // 🌧️ environmental settings
        environmental: {
            weatherEffectsEnabled: true,
            lightingEnabled: true,
            seasonalEffectsEnabled: true,
            quality: 'medium',
            reducedEffects: false
        },

        // ♿ accessibility settings
        accessibility: {
            reducedMotion: false,
            highContrast: false,
            screenReaderEnabled: false,
            flashWarnings: true,
            colorBlindMode: 'none',  // 'none', 'deuteranopia', 'protanopia', 'tritanopia'
            fontSize: 'medium',
            keyboardNavigation: true
        }
    }
};
```

The `settings-panel.js` now uses a getter that pulls from `GameConfig.settings`:

```javascript
get defaultSettings() {
    if (typeof GameConfig !== 'undefined' && GameConfig.settings) {
        return GameConfig.settings;
    }
    // Fallback if config not loaded
    return { /* ... inline fallback ... */ };
}
```

**To change default settings:** Edit `config.js` - all settings panel defaults will update automatically.

---

### settings-panel.js - Clear All Data

*"When you want to burn it all down."*

```javascript
SettingsPanel.clearAllData() {
    // Two-step confirmation required

    // Clears EVERYTHING locally:
    // 1. localStorage (all keys)
    // 2. sessionStorage
    // 3. IndexedDB (all known + discovered databases)
    // 4. Cookies (all paths)
    // 5. Cache Storage (Service Worker caches)
    // 6. Service Workers (unregistered)
    // 7. In-memory caches (GlobalLeaderboardSystem)

    // Does NOT affect:
    // - Global Hall of Champions on JSONBin server
}
```

---

## 🐛 DEBUG & DEVELOPMENT

### 🔒 Debug Lockout System (config.js)

*"With great power comes great responsibility... so we made it toggleable."*

Debug commands can be locked out for production builds to prevent leaderboard manipulation:

```javascript
// In config.js
const GameConfig = {
    debug: {
        enabled: true,         // true = debug works, false = locked out
        showConsoleWarnings: true  // Show warnings when locked
    }
};
```

**Two ways to access debug:**

1. **Developer Mode:** Set `GameConfig.debug.enabled = true` in `config.js`
2. **Super Hacker Achievement:** Complete ALL achievements to unlock debug for that save!

The `DebugCommandSystem.isDebugEnabled()` checks:
1. First: Is Super Hacker unlocked? (`AchievementSystem.isDebugUnlockedForSave()`)
2. Second: Is `GameConfig.debug.enabled` true?
3. If neither, commands are blocked (except `help`)

### debug-command-system.js - The Cheat Codes

*"For testing purposes only. We swear."*

```javascript
const DebugCommandSystem = {
    isDebugEnabled(),    // Checks config + achievement unlock

    commands: {
        // Gold cheats
        'geecashnow': () => addGold(1000),
        'givegold': (amt) => addGold(parseInt(amt)),
        'setgold': (amt) => setGold(parseInt(amt)),
        'showgold': () => showAllGoldSources(),

        // Inventory cheats
        'giveitem': (id, qty) => addItem(id, qty),
        'listitems': () => listAllItemIds(),
        'clearinventory': () => clearInventory(),

        // Player cheats
        'heal': () => fullHeal(),
        'setstat': (stat, val) => setStat(stat, val),

        // World/Travel cheats
        'teleport': (locId) => teleportTo(locId),
        'listlocations': () => listAllLocations(),
        'advancetime': (hours) => advanceTime(hours),

        // Property cheats
        'giveproperty': (type) => giveProperty(type),

        // Achievement cheats
        'unlockall': () => unlockAllAchievements(),   // 🆕 Unlock everything + Super Hacker!
        'testachievement': () => unlockRandom(3),
        'unlockachievement': (id) => unlockAchievement(id),
        'listachievements': () => listAll(),
        'resetachievements': () => resetAll(),

        // 🏆 Leaderboard cheats
        'clearleaderboard': () => resetLeaderboard(),  // Clear Hall of Champions
        'refreshleaderboard': () => forceRefresh(),    // Force refresh display
        'showleaderboard': () => showAllEntries(),     // Show entries in console

        // Debug utilities
        'help': () => showHelp(),
        'clear': () => clearConsole(),
        'gamestate': () => showGameState(),
        'verifyeconomy': () => verifyChains(),
        'reload': () => location.reload()
    },

    executeCommand(input),
    parseCommand(input),
    showHelp()
};
```

**Debug Console Access:**
1. Click the 🐛 DEBUG button (bottom-right)
2. Press backtick (`) to focus input
3. Type command, press Enter

### 🏆 Super Hacker Achievement System

*"The ultimate reward for completionists."*

```javascript
// In achievement-system.js
super_hacker: {
    id: 'super_hacker',
    name: '💻 SUPER HACKER 💻',
    rarity: 'ultra',           // New rarity tier!
    isUltra: true,
    reward: {
        item: 'blade_of_the_hacker',  // Legendary weapon
        unlockDebug: true              // Permanent debug access
    },
    condition: () => {
        // All OTHER achievements must be unlocked
        const allOthers = Object.values(AchievementSystem.achievements)
            .filter(a => a.id !== 'super_hacker');
        return allOthers.every(a => a.unlocked);
    }
}

// Blade of the Hacker (item-database.js)
blade_of_the_hacker: {
    rarity: 'legendary',
    damage: 100,
    bonuses: {
        attack: 100,
        damage: 100,
        defense: 50,
        luck: 50,
        gathering: 50,
        crafting: 50
    }
}
```

When Super Hacker unlocks:
1. Player gets `blade_of_the_hacker` in inventory
2. `game.player.debugUnlocked = true` is set
3. Debug commands work regardless of `GameConfig.debug.enabled`

---

## ✨ ADDING NEW FEATURES

### Adding a New Item

1. Open `src/js/item-database.js`
2. Add to the `items` object:

```javascript
my_new_item: {
    id: 'my_new_item',
    name: 'My New Item',
    description: 'A thing that does stuff.',
    icon: '🆕',
    category: 'basic_resources',  // or consumables, weapons, etc.
    rarity: 'common',
    weight: 5,
    basePrice: 25,
    // Optional properties:
    consumable: true,
    effects: { hunger: 10, health: 5 },
    craftable: true,
    gatherable: true,
    gatherMethod: 'mining'
}
```

### Adding a New Location

1. Open `src/js/game.js`
2. Find `GameWorld.locations`
3. Add your location:

```javascript
my_village: {
    id: 'my_village',
    name: 'My Village',
    type: 'village',
    region: 'riverlands',
    description: 'A quaint village that definitely isn\'t haunted.',
    position: { x: 500, y: 400 },
    marketPrices: {
        bread: { price: 3, stock: 50 },
        // ...
    },
    services: ['inn', 'market'],
    unlocked: true
}
```

4. Add paths in `GameWorld.paths`:
```javascript
'my_village-other_location': { distance: 10, terrain: 'road' }
```

### Adding a New Exploration Event

1. Open `src/js/dungeon-exploration-system.js`
2. Find `EXPLORATION_EVENTS`
3. Add your event:

```javascript
my_event: {
    id: 'my_event',
    name: 'Mysterious Thing',
    description: 'You find something... unsettling.',
    icon: '❓',
    difficulty: 'medium',
    options: [
        {
            id: 'investigate',
            label: 'Investigate Closely',
            icon: '🔍',
            healthCost: { min: 5, max: 15 },
            staminaCost: { min: 10, max: 20 },
            outcomes: [
                {
                    weight: 50,
                    type: 'success',
                    message: 'You found treasure!',
                    loot: ['ancient_coin', 'ancient_coin']
                },
                {
                    weight: 30,
                    type: 'failure',
                    message: 'It was a trap!',
                    healthPenalty: 20,
                    loot: ['bone_fragment']
                }
            ]
        }
    ]
}
```

---

## 💀 KNOWN ARCHITECTURAL SINS

*"We acknowledge our crimes against clean code."*

### The Global State Problem
Everything lives in global scope. `game`, `GameWorld`, `TimeSystem`, all the system objects - they're all global. Yes, we know. No, we're not fixing it now.

### The 8000-Line game.js
It started small. It grew. Now it contains multitudes. Refactoring would require a blood sacrifice we're not prepared to make.

### Multiple UI Systems
There are like 4 different systems that update the UI. They mostly don't conflict. Mostly.

### The Bridge Files
`property-employee-bridge.js` exists because two systems grew apart and needed couples therapy. It works.

### CSS Specificity Wars
The stylesheet is 6000+ lines of !important battles. The dark theme won.

### Save System Versioning
We try to maintain backwards compatibility. We fail sometimes. Your old saves might work. Might.

---

## 🦇 THE COVEN'S CODING PHILOSOPHY

```
═══════════════════════════════════════════════════════════════════════
                    PRINCIPLES WE TRY TO FOLLOW
═══════════════════════════════════════════════════════════════════════

1. Make it work, then make it pretty, then make it work again
   because making it pretty broke something.

2. Comments are for the weak. Variable names should tell a story.
   A confusing, cryptic story written at 3am.

3. If it works, don't touch it. If you must touch it, make a backup.
   If the backup fails, blame the intern.

4. Every bug is a feature waiting to be documented.

5. Console.log is not a debugging strategy. It's a lifestyle.

6. The game loop is sacred. Touch it only during blood moons.

7. localStorage is eternal. Until the user clears their browser.

8. When in doubt, add another system file. Modular code is
   just spaghetti with better plating.

═══════════════════════════════════════════════════════════════════════
```

---

## 🔮 FUTURE ARCHITECTURAL DREAMS

*"Things we'd do if we had infinite time and zero responsibilities."*

- [ ] Proper module system (ES6 imports)
- [ ] State management (Redux-like)
- [ ] TypeScript conversion
- [ ] Unit tests (lol)
- [ ] Split game.js into manageable pieces
- [ ] Proper event bus architecture
- [ ] WebGL rendering for the map
- [ ] Offline-first with Service Workers
- [ ] Multiplayer??? (we can dream)

---

## 📜 CONTRIBUTION GUIDELINES

*"How to add your own chaos to the pile."*

1. **Fork it** - Your crimes, your repo
2. **Branch it** - `feature/my-cool-thing`
3. **Code it** - Match the existing style (dark, cynical)
4. **Test it** - Manually, like our ancestors
5. **Document it** - In the code comments, with sarcasm
6. **PR it** - Explain what you broke and how

### Code Style
- 4 spaces, not tabs (we're not animals)
- Single quotes for strings
- Semicolons always
- Comments should be funny AND useful
- No console.log in production (we're lying, there's hundreds)

---

```
═══════════════════════════════════════════════════════════════════════
                    🖤 END OF NERD README 🖤

    "If you've read this far, you're one of us now."

    May your builds compile and your bugs be reproducible.

                                            - The Coven, 2024
═══════════════════════════════════════════════════════════════════════
```
