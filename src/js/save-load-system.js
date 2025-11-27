// ═══════════════════════════════════════════════════════════════
// 🖤 SAVE/LOAD SYSTEM - preserving your mistakes for eternity 🖤
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// ctrl+s is the only thing standing between you and oblivion
// auto-saves are basically anxiety medication in code form

const SaveLoadSystem = {
    // ⚙️ save slots config - ten different flavors of regret
    maxSaveSlots: 10,
    maxAutoSaveSlots: 10, // rotating auto-saves because paranoia never sleeps
    autoSaveInterval: 300000, // 5 minutes - the average time between existential crises
    compressionEnabled: true,

    // tombstones of past decisions
    saveSlots: {},
    autoSaveSlots: [], // circular buffer of desperate attempts
    currentAutoSaveIndex: 0, // which timeline gets overwritten next

    // current state of denial
    currentSaveSlot: null,
    lastAutoSave: Date.now(), // 🖤 init to now so we don't spam on startup
    isAutoSaving: false,

    // version number - because backwards compatibility is suffering
    saveVersion: '1.0.0',

    // wake up the persistence layer
    init() {
        this.loadSaveSlotsMetadata();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
        this.setupEventListeners();
    },
    
    // 📂 dig up the graveyard of saved timelines
    loadSaveSlotsMetadata() {
        const metadata = localStorage.getItem('tradingGameSaveSlots');
        if (metadata) {
            try {
                this.saveSlots = JSON.parse(metadata);
            } catch (e) {
                console.error('💀 Failed to load save slots metadata:', e);
                this.saveSlots = {};
            }
        } else {
            // create empty vessels for future regrets
            for (let i = 1; i <= this.maxSaveSlots; i++) {
                this.saveSlots[i] = {
                    name: `Save Slot ${i}`,
                    timestamp: null,
                    exists: false,
                    screenshot: null,
                    version: null
                };
            }
            this.saveSaveSlotsMetadata();
        }

        // resurrect the auto-save records
        const autoSaveData = localStorage.getItem('tradingGameAutoSaveSlots');
        if (autoSaveData) {
            try {
                const parsed = JSON.parse(autoSaveData);
                this.autoSaveSlots = parsed.slots || [];
                this.currentAutoSaveIndex = parsed.currentIndex || 0;
            } catch (e) {
                console.error('💀 Failed to load auto-save metadata:', e);
                this.autoSaveSlots = [];
                this.currentAutoSaveIndex = 0;
            }
        }
        console.log(`💾 Loaded ${this.autoSaveSlots.length} auto-save slots`);
    },
    
    // 💾 etch the metadata into browser memory
    saveSaveSlotsMetadata() {
        try {
            localStorage.setItem('tradingGameSaveSlots', JSON.stringify(this.saveSlots));
            // also persist the auto-save ledger
            localStorage.setItem('tradingGameAutoSaveSlots', JSON.stringify({
                slots: this.autoSaveSlots,
                currentIndex: this.currentAutoSaveIndex
            }));
        } catch (e) {
            console.error('💀 Failed to save slots metadata:', e);
        }
    },
    
    // schedule the anxiety relief intervals
    setupAutoSave() {
        TimerManager.setInterval(() => {
            if (game.state === GameState.PLAYING && game.settings.autoSave) {
                this.autoSave();
            }
        }, this.autoSaveInterval);
    },
    
    // bind the panic buttons
    setupKeyboardShortcuts() {
        EventManager.addEventListener(document, 'keydown', (e) => {
            // f5 - freeze your current disaster
            if (e.key === 'F5') {
                e.preventDefault();
                this.quickSave();
            }
            // f9 - resurrect a previous disaster
            else if (e.key === 'F9') {
                e.preventDefault();
                this.quickLoad();
            }
        });
    },
    
    // wire up the existential dread handlers
    setupEventListeners() {
        // hijack state changes for our purposes
        const originalChangeState = window.changeState || function() {};
        window.changeState = function(newState) {
            originalChangeState(newState);

            // trigger auto-save when you start playing again
            if (newState === GameState.PLAYING && game.settings.autoSave) {
                this.autoSaveTimer = TimerManager.setTimeout(() => SaveLoadSystem.autoSave(), 1000);
            }
        };

        // catch the browser closing - last chance to preserve your soul
        EventManager.addEventListener(window, 'beforeunload', () => {
            if (game.state === GameState.PLAYING && game.settings.autoSave) {
                this.autoSave(true); // silent save - like it never happened
            }
        });
    },
    
    // capture the entire state of your questionable choices
    getCompleteGameState() {
        // wrap functions in try-catch because nothing works at 3am
        const safeCall = (fn, fallback = null) => {
            try { return fn(); } catch(e) { return fallback; }
        };

        // extract map entries without dying
        const safeMapEntries = (map) => {
            try {
                if (map && typeof map.entries === 'function') {
                    return Array.from(map.entries());
                }
                return [];
            } catch(e) { return []; }
        };

        const gameState = {
            version: this.saveVersion,
            timestamp: Date.now(),
            gameData: {
                // the fundamental void
                state: game.state,
                gameTick: game.gameTick,

                // your digital identity's baggage - capture EVERYTHING
                player: game.player ? {
                    // Core identity
                    name: game.player.name,
                    class: game.player.class,
                    difficulty: game.player.difficulty,

                    // Wealth
                    gold: game.player.gold,

                    // Inventory & Equipment
                    inventory: game.player.inventory,
                    equipment: game.player.equipment, // new equipment slots system
                    equippedTool: game.player.equippedTool, // legacy
                    equippedWeapon: game.player.equippedWeapon, // legacy
                    equippedArmor: game.player.equippedArmor, // legacy
                    toolDurability: game.player.toolDurability,

                    // Stats & Attributes
                    stats: game.player.stats,
                    attributes: game.player.attributes,
                    skills: game.player.skills,
                    perks: game.player.perks,

                    // Transportation
                    transportation: game.player.transportation,
                    ownedTransportation: game.player.ownedTransportation,
                    currentLoad: game.player.currentLoad,
                    maxLoad: game.player.maxLoad,

                    // Properties & Employees
                    ownedProperties: game.player.ownedProperties,
                    ownedEmployees: game.player.ownedEmployees,
                    ownsHouse: game.player.ownsHouse,
                    propertyIncome: game.player.propertyIncome,
                    propertyExpenses: game.player.propertyExpenses,
                    employeeExpenses: game.player.employeeExpenses,

                    // Reputation & Social
                    reputation: game.player.reputation,
                    visitedLocations: game.player.visitedLocations,

                    // Status Effects
                    temporaryEffects: game.player.temporaryEffects,
                    lastRestTime: game.player.lastRestTime,

                    // Tracking stats
                    itemsCrafted: game.player.itemsCrafted,
                    dungeonsExplored: game.player.dungeonsExplored,
                    totalEarned: game.player.totalEarned,
                    totalSpent: game.player.totalSpent,

                    // Level/XP if applicable
                    level: game.player.level,
                    experience: game.player.experience,

                    // Trade routes (stored on player)
                    tradeRoutes: game.player.tradeRoutes,
                    routeHistory: game.player.routeHistory
                } : null,

                // where you're currently stuck
                currentLocation: game.currentLocation,

                // the relentless march of time
                timeState: typeof TimeSystem !== 'undefined' ? {
                    currentTime: TimeSystem.currentTime,
                    currentSpeed: TimeSystem.currentSpeed,
                    isPaused: TimeSystem.isPaused
                } : null,

                // random chaos waiting to happen
                eventState: typeof EventSystem !== 'undefined' ? {
                    activeEvents: safeCall(() => EventSystem.getActiveEvents(), []),
                    scheduledEvents: EventSystem.scheduledEvents || []
                } : null,

                // the map of your personal hell (only save dynamic data, not static locations)
                worldState: typeof GameWorld !== 'undefined' ? {
                    unlockedRegions: GameWorld.unlockedRegions || ['starter'],
                    visitedLocations: GameWorld.visitedLocations || []
                    // NOT saving locations/regions - they're static data loaded at startup
                } : null,

                // real estate you probably can't afford
                propertyState: typeof PropertySystem !== 'undefined' ? {
                    properties: safeCall(() => PropertySystem.getPlayerProperties(), []),
                    propertyIncome: game.player?.propertyIncome,
                    propertyExpenses: game.player?.propertyExpenses
                } : null,

                // merchant rank tracking - your worth in capitalist terms
                merchantRankState: typeof MerchantRankSystem !== 'undefined' ? {
                    currentRankId: MerchantRankSystem.currentRank?.id || 'vagrant',
                    highestRankAchieved: game.player?.highestMerchantRank || 'vagrant'
                } : null,

                // the workers you exploit
                employeeState: typeof EmployeeSystem !== 'undefined' ? {
                    employees: safeCall(() => EmployeeSystem.getPlayerEmployees(), []),
                    employeeExpenses: game.player?.employeeExpenses
                } : null,

                // paths of capitalist ambition
                tradeRouteState: typeof TradeRouteSystem !== 'undefined' ? {
                    routes: safeCall(() => TradeRouteSystem.getTradeRoutes(), [])
                } : null,

                // wanderlust encoded
                travelState: typeof TravelSystem !== 'undefined' && TravelSystem.getState ?
                    safeCall(() => TravelSystem.getState(), null) : null,

                // catalog of things you'll hoard (NOT saving static item database - too large!)
                // ItemDatabase is static data loaded at startup, no need to save it
                itemDatabaseState: null,

                // your backpack of broken dreams
                inventoryState: typeof InventorySystem !== 'undefined' ? {
                    maxSlots: InventorySystem.maxSlots,
                    maxWeight: InventorySystem.maxWeight,
                    sortCriteria: InventorySystem.sortCriteria,
                    filterCriteria: InventorySystem.filterCriteria
                } : null,

                // the hustle never stops (limit history to last 50 entries to save space)
                tradingState: typeof TradingSystem !== 'undefined' ? {
                    tradeMode: TradingSystem.tradeMode,
                    selectedTradeItems: safeMapEntries(TradingSystem.selectedTradeItems),
                    tradeHistory: (TradingSystem.tradeHistory || []).slice(-50), // only last 50 trades
                    priceAlerts: TradingSystem.priceAlerts || []
                } : null,

                // who loves you and who wants you dead
                cityReputationState: typeof CityReputationSystem !== 'undefined' && CityReputationSystem.getAllReputations ? {
                    reputations: safeCall(() => CityReputationSystem.getAllReputations(), {})
                } : null,

                // urban chaos log (limit event history to save space)
                cityEventState: typeof CityEventSystem !== 'undefined' ? {
                    activeEvents: safeCall(() => CityEventSystem.getAllActiveEvents?.(), []),
                    eventHistory: safeCall(() => (CityEventSystem.getEventHistory?.() || []).slice(-30), []) // last 30 events
                } : null,

                // price fluctuations that haunt your sleep
                marketPriceHistoryState: typeof MarketPriceHistory !== 'undefined' && MarketPriceHistory.getAllPriceHistory ? {
                    priceHistory: safeCall(() => MarketPriceHistory.getAllPriceHistory(), {})
                } : null,

                // economic voodoo
                dynamicMarketState: typeof DynamicMarketSystem !== 'undefined' ? {
                    marketTrends: safeCall(() => DynamicMarketSystem.getAllMarketTrends?.(), {}),
                    supplyDemandData: safeCall(() => DynamicMarketSystem.getAllSupplyDemandData?.(), {})
                } : null,

                // capitalism in a nutshell
                marketData: {
                    marketPrices: game.marketPrices || {},
                    marketPriceModifier: game.marketPriceModifier || 1
                },

                // your preferences (probably bad)
                settings: game.settings || {},

                // interface ephemera
                uiState: {
                    deathTimer: game.deathTimer
                },

                // 📜 quest state - tracking the endless suffering
                questState: typeof QuestSystem !== 'undefined' ? {
                    activeQuests: QuestSystem.activeQuests || {},
                    completedQuests: QuestSystem.completedQuests || [],
                    failedQuests: QuestSystem.failedQuests || [],
                    discoveredQuests: QuestSystem.discoveredQuests || [],
                    questCompletionTimes: QuestSystem.questCompletionTimes || {},
                    questItems: game.player?.questItems || {}
                } : null,

                // 👹 dungeon boss state - tracking your victories over evil
                dungeonBossState: typeof DungeonExplorationSystem !== 'undefined' ? {
                    bossProgress: DungeonExplorationSystem.bossProgress || {},
                    defeatedBosses: DungeonExplorationSystem.defeatedBosses || {},
                    locationCooldowns: DungeonExplorationSystem.locationCooldowns || {}
                } : null

                // Note: Hall of Champions is stored via GlobalLeaderboardSystem (API/localStorage)
                // No need to save high scores in individual save files
            }
        };

        return gameState;
    },
    
    // check if the save file is broken (spoiler: probably)
    validateSaveData(saveData) {
        const errors = [];

        // does this even look like a save file?
        if (!saveData || typeof saveData !== 'object') {
            errors.push('Invalid save data structure');
            return { valid: false, errors };
        }

        // version check - forwards compatibility is a myth
        if (!saveData.version) {
            errors.push('Missing save version information');
        }

        // verify the bare minimum exists
        const requiredSections = ['gameData', 'timestamp', 'version'];
        for (const section of requiredSections) {
            if (!saveData[section]) {
                errors.push(`Missing required section: ${section}`);
            }
        }

        // no player = no game
        if (saveData.gameData && !saveData.gameData.player) {
            errors.push('Missing player data');
        }

        // can we even serialize this mess?
        try {
            JSON.stringify(saveData);
        } catch (e) {
            errors.push('Save data contains circular references or invalid data');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    // squeeze the pain into smaller bytes - using simple but effective RLE + trimming
    compressSaveData(saveData) {
        try {
            // First, aggressively trim the data
            const trimmedData = this.trimSaveData(saveData);
            const jsonString = JSON.stringify(trimmedData);
            const originalSize = JSON.stringify(saveData).length;
            const trimmedSize = jsonString.length;

            console.log(`🖤 Save trimmed: ${originalSize} -> ${trimmedSize} bytes (${Math.round((1 - trimmedSize/originalSize) * 100)}% reduction from trimming)`);

            // Use simple unicode compression for localStorage
            const compressed = this.unicodeCompress(jsonString);
            console.log(`🖤 Final size: ${compressed.length} chars`);

            return 'UC:' + compressed;
        } catch (e) {
            console.error('Compression failed, using uncompressed data:', e);
            // Fallback: just stringify trimmed data
            try {
                const trimmedData = this.trimSaveData(saveData);
                return JSON.stringify(trimmedData);
            } catch (e2) {
                return JSON.stringify(saveData);
            }
        }
    },

    // 🖤 Aggressively trim save data to reduce size
    trimSaveData(saveData) {
        const trimmed = JSON.parse(JSON.stringify(saveData)); // deep clone

        if (trimmed.gameData) {
            // Remove null/undefined values
            const removeNulls = (obj) => {
                if (!obj || typeof obj !== 'object') return obj;
                for (const key in obj) {
                    if (obj[key] === null || obj[key] === undefined) {
                        delete obj[key];
                    } else if (typeof obj[key] === 'object') {
                        removeNulls(obj[key]);
                        if (Object.keys(obj[key]).length === 0) {
                            delete obj[key];
                        }
                    }
                }
                return obj;
            };

            removeNulls(trimmed.gameData);

            // Limit arrays that grow over time
            if (trimmed.gameData.tradingState?.tradeHistory) {
                trimmed.gameData.tradingState.tradeHistory = trimmed.gameData.tradingState.tradeHistory.slice(-20);
            }
            if (trimmed.gameData.cityEventState?.eventHistory) {
                trimmed.gameData.cityEventState.eventHistory = trimmed.gameData.cityEventState.eventHistory.slice(-10);
            }
            if (trimmed.gameData.eventState?.scheduledEvents) {
                trimmed.gameData.eventState.scheduledEvents = trimmed.gameData.eventState.scheduledEvents.slice(-20);
            }

            // Remove price history entirely (takes tons of space, regenerates anyway)
            if (trimmed.gameData.marketPriceHistoryState) {
                trimmed.gameData.marketPriceHistoryState = null;
            }
            if (trimmed.gameData.dynamicMarketState) {
                trimmed.gameData.dynamicMarketState = null;
            }
        }

        return trimmed;
    },

    // expand the compressed regrets
    decompressSaveData(compressedData) {
        try {
            // Check for unicode compression marker
            if (compressedData.startsWith('UC:')) {
                const decompressed = this.unicodeDecompress(compressedData.slice(3));
                return JSON.parse(decompressed);
            }
            // Check for old LZ compression marker
            if (compressedData.startsWith('LZ:')) {
                // Try direct JSON parse of the rest (old format compatibility)
                try {
                    return JSON.parse(atob(compressedData.slice(3)));
                } catch (e) {
                    // Fall through
                }
            }
            // Legacy: try base64 (old saves)
            if (compressedData.match(/^[A-Za-z0-9+/=]+$/) && compressedData.length > 100) {
                try {
                    const decoded = atob(compressedData);
                    if (decoded.startsWith('{')) {
                        return JSON.parse(decoded);
                    }
                } catch (e) { /* not base64 */ }
            }
            // Direct JSON parse
            return JSON.parse(compressedData);
        } catch (e) {
            console.error('Decompression failed:', e);
            return null;
        }
    },

    // 🖤 Unicode compression - packs two chars into one unicode char
    // This gives ~50% size reduction and is very fast
    unicodeCompress(str) {
        if (!str) return '';
        let result = '';
        for (let i = 0; i < str.length; i += 2) {
            const c1 = str.charCodeAt(i);
            const c2 = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
            result += String.fromCharCode((c1 << 8) | c2);
        }
        // Store original length for decompression
        return str.length + ':' + result;
    },

    // 🖤 Unicode decompression
    unicodeDecompress(compressed) {
        if (!compressed) return '';
        const colonIdx = compressed.indexOf(':');
        if (colonIdx === -1) throw new Error('Invalid compressed format');

        const originalLen = parseInt(compressed.substring(0, colonIdx), 10);
        const data = compressed.substring(colonIdx + 1);

        let result = '';
        for (let i = 0; i < data.length; i++) {
            const code = data.charCodeAt(i);
            result += String.fromCharCode(code >> 8);
            result += String.fromCharCode(code & 0xFF);
        }

        // Trim to original length (removes padding zero)
        return result.substring(0, originalLen);
    },
    
    // freeze this moment of questionable decisions
    saveToSlot(slotNumber, customName = null) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return false;
        }

        try {
            // snapshot the chaos
            const gameState = this.getCompleteGameState();

            // sanity check (ha, as if we have any)
            const validation = this.validateSaveData(gameState);
            if (!validation.valid) {
                addMessage('Save data validation failed: ' + validation.errors.join(', '), 'error');
                return false;
            }

            // crush it down
            const compressedData = this.compressSaveData(gameState);

            // shove it into localStorage and pray
            const saveKey = `tradingGameSave_${slotNumber}`;
            localStorage.setItem(saveKey, compressedData);
            
            // update the tombstone inscription
            this.saveSlots[slotNumber] = {
                name: customName || this.saveSlots[slotNumber].name,
                timestamp: Date.now(),
                exists: true,
                screenshot: this.generateScreenshot(),
                version: gameState.version,
                playerInfo: {
                    name: gameState.gameData.player.name,
                    level: gameState.gameData.player.level || 1,
                    gold: gameState.gameData.player.gold,
                    location: gameState.gameData.currentLocation?.name || 'Unknown',
                    daysSurvived: this.calculateDaysSurvived(gameState)
                }
            };
            
            this.saveSaveSlotsMetadata();
            this.currentSaveSlot = slotNumber;

            // 🏆 Submit to Hall of Champions - the single source of truth
            // Every save updates your standing in the Hall of Champions (top 100)
            if (typeof GlobalLeaderboardSystem !== 'undefined') {
                console.log('🏆 Submitting save to Hall of Champions...');
                this.submitToGlobalLeaderboard(gameState).then(result => {
                    console.log('🏆 Hall of Champions submission result:', result);
                }).catch(err => {
                    console.error('🏆 Hall of Champions submission failed:', err);
                });
            } else {
                console.warn('🏆 GlobalLeaderboardSystem not available');
            }

            addMessage(`Game saved to ${this.saveSlots[slotNumber].name}!`, 'success');

            // 🖤 scream into the void that we saved successfully - force UI refresh
            this.notifyUIRefresh(slotNumber);

            return true;

        } catch (e) {
            // 🖤 Handle QuotaExceededError specifically
            if (e?.name === 'QuotaExceededError' || e?.message?.includes('quota')) {
                console.error('🖤 localStorage quota exceeded! Attempting to free space...');

                // Try to clear some old data to make room
                const freedSpace = this.freeUpStorageSpace();

                if (freedSpace) {
                    // Retry the save once
                    try {
                        const gameState = this.getCompleteGameState();
                        const compressedData = this.compressSaveData(gameState);
                        const saveKey = `tradingGameSave_${slotNumber}`;
                        localStorage.setItem(saveKey, compressedData);

                        addMessage('Save successful after clearing old data!', 'success');
                        return true;
                    } catch (retryError) {
                        console.error('Save still failed after freeing space:', retryError);
                    }
                }

                addMessage('💾 Storage full! Try deleting old saves or exporting your game.', 'error');
                return false;
            }

            // error logging - because debugging is eternal
            const errorMsg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e) || 'Unknown error');
            console.error('Save failed:', e);
            console.error('Save error details:', {
                name: e?.name,
                message: e?.message,
                stack: e?.stack,
                raw: e
            });
            addMessage('Save failed: ' + errorMsg, 'error');
            return false;
        }
    },

    // 🖤 Free up storage space by removing old/unused data
    freeUpStorageSpace() {
        console.log('🖤 Attempting to free up localStorage space...');
        let freedSomething = false;
        let freedBytes = 0;

        try {
            // 1. Clear ALL auto-saves (they take up the most space!)
            for (let i = 0; i < 10; i++) {
                const autoSaveKey = `tradingGameAutoSave_${i}`;
                const data = localStorage.getItem(autoSaveKey);
                if (data) {
                    freedBytes += data.length;
                    localStorage.removeItem(autoSaveKey);
                    freedSomething = true;
                    console.log(`🖤 Cleared ${autoSaveKey} (${(data.length/1024).toFixed(1)} KB)`);
                }
            }

            // 2. Clear auto-save slots metadata
            if (localStorage.getItem('tradingGameAutoSaveSlots')) {
                localStorage.removeItem('tradingGameAutoSaveSlots');
                freedSomething = true;
            }

            // 3. Clear any debug logs stored in localStorage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('debug') || key.includes('log') || key.includes('temp') || key.includes('PriceHistory'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) freedBytes += data.length;
                localStorage.removeItem(key);
                freedSomething = true;
            });

            // 4. Clear price history (can be regenerated)
            if (localStorage.getItem('tradingGamePriceHistory')) {
                const data = localStorage.getItem('tradingGamePriceHistory');
                if (data) freedBytes += data.length;
                localStorage.removeItem('tradingGamePriceHistory');
                freedSomething = true;
                console.log('🖤 Cleared price history cache');
            }

            // 5. Clear market saturation data
            if (localStorage.getItem('tradingGameMarketSaturation')) {
                localStorage.removeItem('tradingGameMarketSaturation');
                freedSomething = true;
            }

            // 6. Clear city events cache
            if (localStorage.getItem('tradingGameCityEvents')) {
                localStorage.removeItem('tradingGameCityEvents');
                freedSomething = true;
            }

            console.log(`🖤 Freed approximately ${(freedBytes/1024).toFixed(1)} KB`);

            // 7. Report storage status
            this.reportStorageStatus();

            return freedSomething;
        } catch (e) {
            console.error('Error freeing storage space:', e);
            return false;
        }
    },

    // 🖤 Report current localStorage usage
    reportStorageStatus() {
        let totalSize = 0;
        const breakdown = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const size = (localStorage.getItem(key) || '').length;
                totalSize += size;

                // Categorize
                if (key.includes('tradingGame')) {
                    breakdown[key] = `${(size / 1024).toFixed(1)} KB`;
                }
            }
        }

        console.log(`🖤 localStorage usage: ${(totalSize / 1024).toFixed(1)} KB`);
        console.log('🖤 Game data breakdown:', breakdown);

        // localStorage limit is typically 5MB
        const limitKB = 5120;
        const usedPercent = ((totalSize / 1024) / limitKB * 100).toFixed(1);
        console.log(`🖤 Using ${usedPercent}% of estimated 5MB limit`);
    },

    // resurrect a timeline from the void
    loadFromSlot(slotNumber) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return false;
        }

        const saveSlot = this.saveSlots[slotNumber];
        if (!saveSlot.exists) {
            addMessage('No save data in this slot!', 'error');
            return false;
        }

        try {
            // extract the compressed memories
            const saveKey = `tradingGameSave_${slotNumber}`;
            const compressedData = localStorage.getItem(saveKey);

            if (!compressedData) {
                addMessage('Save data not found!', 'error');
                return false;
            }

            // decompress and parse the fossilized data
            const saveData = this.decompressSaveData(compressedData);

            // check if it's completely borked
            const validation = this.validateSaveData(saveData);
            if (!validation.valid) {
                addMessage('Save data is corrupted: ' + validation.errors.join(', '), 'error');
                return false;
            }

            // version check (good luck)
            if (!this.isVersionCompatible(saveData.version)) {
                addMessage('Save data is from an incompatible version!', 'error');
                return false;
            }

            // inject the old state into the game
            this.loadGameState(saveData.gameData);
            this.currentSaveSlot = slotNumber;
            
            addMessage(`Game loaded from ${saveSlot.name}!`, 'success');
            return true;
            
        } catch (e) {
            console.error('Load failed:', e);
            console.error('Error stack:', e?.stack);
            const errorMsg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e) || 'Unknown error');
            addMessage('Load failed: ' + errorMsg, 'error');
            return false;
        }
    },
    
    // rehydrate the game state from json purgatory
    loadGameState(gameData) {
        console.log('🖤 loadGameState called with:', gameData ? 'valid gameData' : 'null/undefined gameData');

        if (!gameData) {
            throw new Error('No game data provided to loadGameState');
        }

        try {
        // kill the current timeline
        if (game.isRunning) {
            game.stop();
        }

        // 🖤 CRITICAL: Hide any setup/creation panels BEFORE restoring state
        // This prevents the game setup from showing when loading a saved game
        const setupPanel = document.getElementById('game-setup-panel');
        if (setupPanel) {
            setupPanel.classList.add('hidden');
            setupPanel.classList.remove('active');
            setupPanel.style.display = 'none';
        }
        const characterPanel = document.getElementById('character-panel');
        if (characterPanel) {
            characterPanel.classList.add('hidden');
            characterPanel.classList.remove('active');
        }
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.add('hidden');
            mainMenu.classList.remove('active');
        }

        // restore the fundamental variables
        // 🖤 Force state to PLAYING when loading - ignore saved state if it was MENU or CHARACTER_CREATION
        const savedState = gameData.state;
        if (savedState === GameState.MENU || savedState === GameState.CHARACTER_CREATION) {
            game.state = GameState.PLAYING;
        } else {
            game.state = savedState || GameState.PLAYING;
        }
        game.gameTick = gameData.gameTick;
        game.currentLocation = gameData.currentLocation;
        game.marketPrices = gameData.marketData?.marketPrices || {};
        game.marketPriceModifier = gameData.marketData?.marketPriceModifier || 1;
        game.settings = { ...game.settings, ...gameData.settings };
        game.deathTimer = gameData.uiState?.deathTimer || game.deathTimer;

        // resurrect player identity
        if (gameData.player) {
            game.player = { ...game.player, ...gameData.player };

            // 🔧 Initialize equipment system with loaded data
            if (typeof EquipmentSystem !== 'undefined') {
                // ensure equipment object exists with all slots
                if (!game.player.equipment) {
                    game.player.equipment = {};
                }
                // migrate legacy equipment if present
                if (game.player.equippedTool && !game.player.equipment.tool) {
                    game.player.equipment.tool = game.player.equippedTool;
                }
                if (game.player.equippedWeapon && !game.player.equipment.weapon) {
                    game.player.equipment.weapon = game.player.equippedWeapon;
                }
                if (game.player.equippedArmor && !game.player.equipment.body) {
                    game.player.equipment.body = game.player.equippedArmor;
                }
                console.log('⚔️ Equipment restored from save');
            }
        }

        // rewind the clock
        if (gameData.timeState) {
            TimeSystem.currentTime = gameData.timeState.currentTime;
            TimeSystem.setSpeed(gameData.timeState.currentSpeed);
            TimeSystem.isPaused = gameData.timeState.isPaused;
        }

        // reload pending doom
        if (gameData.eventState) {
            EventSystem.events = gameData.eventState.activeEvents || [];
            EventSystem.scheduledEvents = gameData.eventState.scheduledEvents || [];
        }

        // rebuild the world map - 🖤 DON'T overwrite static location data!
        if (gameData.worldState) {
            GameWorld.unlockedRegions = gameData.worldState.unlockedRegions || ['starter'];
            GameWorld.visitedLocations = gameData.worldState.visitedLocations || ['riverwood'];
            // locations and regions are STATIC data - only restore if save has meaningful data
            // empty objects from old saves would nuke everything, so we skip those
            if (gameData.worldState.locations && Object.keys(gameData.worldState.locations).length > 5) {
                GameWorld.locations = gameData.worldState.locations;
            }
            if (gameData.worldState.regions && Object.keys(gameData.worldState.regions).length > 0) {
                GameWorld.regions = gameData.worldState.regions;
            }
        }

        // restore your property empire
        if (gameData.propertyState && typeof PropertySystem !== 'undefined') {
            game.player.ownedProperties = gameData.propertyState.properties || [];
            game.player.propertyIncome = gameData.propertyState.propertyIncome || 0;
            PropertySystem.loadProperties(gameData.propertyState.properties);
        }

        // rehire your wage slaves
        if (gameData.employeeState && typeof EmployeeSystem !== 'undefined') {
            game.player.ownedEmployees = gameData.employeeState.employees || [];
            game.player.employeeExpenses = gameData.employeeState.employeeExpenses || 0;
            EmployeeSystem.loadEmployees(gameData.employeeState.employees);
        }

        // restore trade routes
        if (gameData.tradeRouteState && typeof TradeRouteSystem !== 'undefined') {
            TradeRouteSystem.loadTradeRoutes(gameData.tradeRouteState.routes);
        }

        // Also restore trade routes from player data if present (newer save format)
        if (gameData.player?.tradeRoutes && typeof TradeRouteSystem !== 'undefined') {
            game.player.tradeRoutes = gameData.player.tradeRoutes;
            game.player.routeHistory = gameData.player.routeHistory || [];
        }

        // reload travel plans
        if (gameData.travelState && typeof TravelSystem !== 'undefined') {
            TravelSystem.loadState(gameData.travelState);
        }

        // Note: Hall of Champions is managed by GlobalLeaderboardSystem (API/localStorage)
        // No need to restore from individual save files

        // reload item catalog
        if (gameData.itemDatabaseState && typeof ItemDatabase !== 'undefined') {
            ItemDatabase.items = gameData.itemDatabaseState.items || ItemDatabase.items;
            ItemDatabase.categories = gameData.itemDatabaseState.categories || ItemDatabase.categories;
            ItemDatabase.rarity = gameData.itemDatabaseState.rarity || ItemDatabase.rarity;
        }

        // restore inventory limits
        if (gameData.inventoryState && typeof InventorySystem !== 'undefined') {
            InventorySystem.maxSlots = gameData.inventoryState.maxSlots || 20;
            InventorySystem.maxWeight = gameData.inventoryState.maxWeight || 100;
            InventorySystem.sortCriteria = gameData.inventoryState.sortCriteria;
            InventorySystem.filterCriteria = gameData.inventoryState.filterCriteria;
        }

        // restore trading system
        if (gameData.tradingState && typeof TradingSystem !== 'undefined') {
            TradingSystem.tradeMode = gameData.tradingState.tradeMode || 'single';
            TradingSystem.selectedTradeItems = new Map(gameData.tradingState.selectedTradeItems || []);
            TradingSystem.tradeHistory = gameData.tradingState.tradeHistory || [];
            TradingSystem.priceAlerts = gameData.tradingState.priceAlerts || [];
        }

        // reload your reputation (or lack thereof)
        if (gameData.cityReputationState && typeof CityReputationSystem !== 'undefined') {
            if (typeof CityReputationSystem.loadReputations === 'function') {
                CityReputationSystem.loadReputations(gameData.cityReputationState.reputations || {});
            }
        }

        // restore city chaos
        if (gameData.cityEventState && typeof CityEventSystem !== 'undefined') {
            if (typeof CityEventSystem.loadActiveEvents === 'function') {
                CityEventSystem.loadActiveEvents(gameData.cityEventState.activeEvents || []);
            }
            if (typeof CityEventSystem.loadEventHistory === 'function') {
                CityEventSystem.loadEventHistory(gameData.cityEventState.eventHistory || []);
            }
        }

        // restore price history charts
        if (gameData.marketPriceHistoryState && typeof MarketPriceHistory !== 'undefined') {
            if (typeof MarketPriceHistory.loadPriceHistoryFromSave === 'function') {
                MarketPriceHistory.loadPriceHistoryFromSave(gameData.marketPriceHistoryState.priceHistory || {});
            }
        }

        // reload market voodoo
        if (gameData.dynamicMarketState && typeof DynamicMarketSystem !== 'undefined') {
            if (typeof DynamicMarketSystem.loadMarketTrends === 'function') {
                DynamicMarketSystem.loadMarketTrends(gameData.dynamicMarketState.marketTrends || {});
            }
            if (typeof DynamicMarketSystem.loadSupplyDemandData === 'function') {
                DynamicMarketSystem.loadSupplyDemandData(gameData.dynamicMarketState.supplyDemandData || {});
            }
        }

        // 📜 restore quest state - all that unfinished business
        if (gameData.questState && typeof QuestSystem !== 'undefined') {
            QuestSystem.activeQuests = gameData.questState.activeQuests || {};
            QuestSystem.completedQuests = gameData.questState.completedQuests || [];
            QuestSystem.failedQuests = gameData.questState.failedQuests || [];
            QuestSystem.discoveredQuests = gameData.questState.discoveredQuests || [];
            QuestSystem.questCompletionTimes = gameData.questState.questCompletionTimes || {};

            // restore quest items to player
            if (game.player) {
                game.player.questItems = gameData.questState.questItems || {};
            }

            // update the quest log UI if it exists
            if (typeof QuestSystem.updateQuestLogUI === 'function') {
                QuestSystem.updateQuestLogUI();
            }

            console.log(`📜 Restored ${Object.keys(QuestSystem.activeQuests).length} active quests, ${QuestSystem.completedQuests.length} completed`);
        }

        // 👑 restore merchant rank state
        if (gameData.merchantRankState && typeof MerchantRankSystem !== 'undefined') {
            // Store highest rank achieved on player
            if (game.player) {
                game.player.highestMerchantRank = gameData.merchantRankState.highestRankAchieved || 'vagrant';
            }

            // Force a rank check to ensure current rank is calculated
            if (typeof MerchantRankSystem.checkForRankUp === 'function') {
                MerchantRankSystem.checkForRankUp();
            }

            console.log(`👑 Restored merchant rank state (highest: ${gameData.merchantRankState.highestRankAchieved || 'vagrant'})`);
        }

        // 👹 restore dungeon boss state - your victories over evil
        if (gameData.dungeonBossState && typeof DungeonExplorationSystem !== 'undefined') {
            DungeonExplorationSystem.bossProgress = gameData.dungeonBossState.bossProgress || {};
            DungeonExplorationSystem.defeatedBosses = gameData.dungeonBossState.defeatedBosses || {};
            if (gameData.dungeonBossState.locationCooldowns) {
                DungeonExplorationSystem.locationCooldowns = gameData.dungeonBossState.locationCooldowns;
            }
            console.log(`👹 Restored dungeon boss state (${Object.keys(DungeonExplorationSystem.defeatedBosses).length} bosses defeated)`);
        }

        // refresh the UI - 🖤 guard against the void (undefined functions)
        if (typeof updatePlayerInfo === 'function') updatePlayerInfo();
        if (typeof updatePlayerStats === 'function') updatePlayerStats();
        if (typeof updateLocationInfo === 'function') updateLocationInfo();
        if (typeof updateLocationPanel === 'function') updateLocationPanel();
        
        // refresh all the system displays
        if (typeof InventorySystem !== 'undefined') {
            InventorySystem.updateInventoryDisplay();
        }
        if (typeof TradingSystem !== 'undefined') {
            if (typeof TradingSystem.updateTradeHistoryDisplay === 'function') {
                TradingSystem.updateTradeHistoryDisplay();
            }
            if (typeof TradingSystem.updatePriceAlertsDisplay === 'function') {
                TradingSystem.updatePriceAlertsDisplay();
            }
        }

        // 🖤 CRITICAL: Show the game UI and ensure we're in PLAYING state
        // This ensures the game is playable after loading, not stuck in setup
        console.log('🖤 Transitioning to game UI...');

        // First, hide ALL setup/menu screens
        const screensToHide = [
            'main-menu',
            'game-setup-panel',
            'character-panel',
            'character-creation-panel'
        ];
        screensToHide.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('active');
                el.style.display = 'none';
            }
        });

        // Make sure game container and layout are visible
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.classList.remove('hidden');
            gameContainer.style.display = '';
        }

        const gameLayout = document.getElementById('game-layout');
        if (gameLayout) {
            gameLayout.classList.remove('hidden');
            gameLayout.style.display = '';
        }

        // Now show the game UI
        if (typeof showGameUI === 'function') {
            showGameUI();
        }

        // Ensure state is PLAYING and panels are shown properly
        if (typeof changeState === 'function') {
            changeState(GameState.PLAYING);
        }

        // Force hide setup panel again after all UI updates (belt and suspenders)
        const setupPanelFinal = document.getElementById('game-setup-panel');
        if (setupPanelFinal) {
            setupPanelFinal.classList.add('hidden');
            setupPanelFinal.classList.remove('active');
            setupPanelFinal.style.display = 'none';
        }

        // reboot the game loop
        game.start();

        // 🖤 CRITICAL: Force map to render after load
        // The map renderer has async initialization, so we need to force a render
        console.log('🖤 Forcing map and UI render after load...');

        // Ensure GameWorld has the loaded data
        if (typeof GameWorld !== 'undefined' && gameData.worldState) {
            GameWorld.visitedLocations = gameData.worldState.visitedLocations || [];
            GameWorld.unlockedRegions = gameData.worldState.unlockedRegions || ['starter'];
        }

        // Force map render after a short delay to let initialization complete
        setTimeout(() => {
            if (typeof GameWorldRenderer !== 'undefined') {
                console.log('🖤 Executing deferred map render...');
                if (GameWorldRenderer.render) {
                    GameWorldRenderer.render();
                }
                if (GameWorldRenderer.resetView) {
                    GameWorldRenderer.resetView();
                }
                if (GameWorldRenderer.updateHistoryPanel) {
                    GameWorldRenderer.updateHistoryPanel();
                }
            }

            // Ensure map container is visible
            const mapContainer = document.getElementById('map-container');
            if (mapContainer) {
                mapContainer.classList.remove('hidden');
            }

            // Force update all displays
            if (typeof updatePlayerInfo === 'function') updatePlayerInfo();
            if (typeof updateInventoryDisplay === 'function') updateInventoryDisplay();
            if (typeof updateTimeDisplay === 'function') updateTimeDisplay();

            // Show panel toolbar
            if (typeof PanelManager !== 'undefined' && PanelManager.showToolbar) {
                PanelManager.showToolbar();
            }

            // Restore panel positions from saved preferences
            if (typeof DraggablePanels !== 'undefined' && DraggablePanels.loadPositions) {
                console.log('🖤 Restoring panel positions...');
                DraggablePanels.loadPositions();
            }

            console.log('🖤 Post-load UI refresh complete!');
        }, 150);

        console.log('🖤 Game loaded successfully! State:', game.state);

        } catch (loadError) {
            console.error('🖤 Error in loadGameState:', loadError);
            console.error('🖤 Error stack:', loadError?.stack);
            throw loadError; // Re-throw to be caught by caller
        }
    },

    // check if versions match (they probably don't)
    isVersionCompatible(saveVersion) {
        // 🖤 relaxed version check - we're not monsters, allow older saves
        if (!saveVersion) return true; // ancient saves without version? let em try

        // parse semantic versions like "1.0.0"
        const parseSemver = (v) => {
            const parts = String(v).split('.');
            return {
                major: parseInt(parts[0]) || 0,
                minor: parseInt(parts[1]) || 0,
                patch: parseInt(parts[2]) || 0
            };
        };

        const current = parseSemver(this.saveVersion);
        const saved = parseSemver(saveVersion);

        // same major version = compatible (1.x.x works with 1.y.y)
        // we're generous souls in this dark world
        return saved.major <= current.major;
    },
    
    // 🔄 periodic preservation of your suffering
    autoSave(silent = false) {
        // 🖤 cooldown check - no spam allowed, 30 second minimum between saves
        const now = Date.now();
        if (now - this.lastAutoSave < 30000) {
            return; // chill out, we just saved
        }

        if (this.isAutoSaving) return;

        this.isAutoSaving = true;

        try {
            // use rotating slots (your mistakes on repeat)
            const autoSaveSlotName = `auto_${this.currentAutoSaveIndex}`;
            const timestamp = new Date();
            const formattedTime = timestamp.toLocaleString();

            // capture the current disaster
            const saveData = this.getCompleteGameState();
            if (!saveData) {
                console.error('💀 Auto-save failed: no game state to save');
                return;
            }

            // 🖤 compress auto-saves too - consistency is queen
            const compressedData = this.compressSaveData(saveData);

            // shove it into localStorage (pray it fits)
            const saveKey = `tradingGameAutoSave_${this.currentAutoSaveIndex}`;
            try {
                localStorage.setItem(saveKey, compressedData);

                // track this auto-save in the rotation
                const slotInfo = {
                    index: this.currentAutoSaveIndex,
                    timestamp: timestamp.getTime(),
                    formattedTime: formattedTime,
                    playerName: game.player?.name || 'Unknown',
                    gold: game.player?.gold || 0,
                    location: game.currentLocation?.name || 'Unknown',
                    day: TimeSystem.currentTime?.day || 1
                };

                // update or insert into the rotation
                const existingIndex = this.autoSaveSlots.findIndex(s => s.index === this.currentAutoSaveIndex);
                if (existingIndex >= 0) {
                    this.autoSaveSlots[existingIndex] = slotInfo;
                } else {
                    this.autoSaveSlots.push(slotInfo);
                }

                // sort by timestamp (most recent failures first)
                this.autoSaveSlots.sort((a, b) => b.timestamp - a.timestamp);

                // purge the oldest if we're over limit
                if (this.autoSaveSlots.length > this.maxAutoSaveSlots) {
                    const removed = this.autoSaveSlots.pop();
                    localStorage.removeItem(`tradingGameAutoSave_${removed.index}`);
                }

                // advance to next slot in the circle
                this.currentAutoSaveIndex = (this.currentAutoSaveIndex + 1) % this.maxAutoSaveSlots;

                // persist the metadata
                this.saveSaveSlotsMetadata();

                if (!silent) {
                    addMessage(`💾 Auto-saved! (Slot ${this.currentAutoSaveIndex === 0 ? this.maxAutoSaveSlots : this.currentAutoSaveIndex}/${this.maxAutoSaveSlots})`, 'info');
                }
                console.log(`💾 Auto-saved to slot ${autoSaveSlotName}`);

            } catch (e) {
                console.error('💀 Auto-save failed:', e);
                if (!silent) {
                    addMessage('Auto-save failed!', 'error');
                }
            }

            this.lastAutoSave = Date.now();

        } finally {
            this.isAutoSaving = false;
        }
    },

    // 📋 enumerate your automated regrets
    getAutoSaveList() {
        return this.autoSaveSlots.map(slot => ({
            ...slot,
            name: `Auto-Save ${slot.index + 1}`,
            key: `tradingGameAutoSave_${slot.index}`
        }));
    },

    // 📂 resurrect from auto-save graveyard
    loadAutoSave(slotIndex) {
        const saveKey = `tradingGameAutoSave_${slotIndex}`;
        const saveData = localStorage.getItem(saveKey);

        if (!saveData) {
            addMessage('Auto-save not found!', 'error');
            return false;
        }

        try {
            // 🖤 decompress auto-saves just like manual saves
            const parsedData = this.decompressSaveData(saveData);
            if (!parsedData || !parsedData.gameData) {
                throw new Error('decompression yielded nothing but void');
            }
            this.loadGameState(parsedData.gameData);
            addMessage(`📂 Loaded auto-save slot ${slotIndex + 1}!`, 'info');
            console.log(`📂 Loaded auto-save from slot ${slotIndex}`);
            return true;
        } catch (e) {
            console.error('💀 Failed to load auto-save:', e);
            addMessage('Failed to load auto-save!', 'error');
            return false;
        }
    },

    // 💾 user-initiated preservation
    manualSave() {
        if (game.state !== GameState.PLAYING) {
            addMessage('Cannot save outside of gameplay!', 'error');
            return false;
        }

        // find first empty slot or just use slot 1
        let targetSlot = 1;
        for (let i = 1; i <= this.maxSaveSlots; i++) {
            if (!this.saveSlots[i]?.exists) {
                targetSlot = i;
                break;
            }
        }

        const success = this.saveToSlot(targetSlot);
        if (success) {
            addMessage(`💾 Game saved to slot ${targetSlot}!`, 'info');
        }
        return success;
    },

    // f5 - the muscle memory of paranoia
    quickSave() {
        if (game.state !== GameState.PLAYING) {
            addMessage('Cannot save outside of gameplay!', 'error');
            return;
        }

        // use current slot or default to 1
        const slot = this.currentSaveSlot || 1;
        this.saveToSlot(slot);
    },

    // f9 - the undo button for bad decisions
    quickLoad() {
        if (this.currentSaveSlot) {
            this.loadFromSlot(this.currentSaveSlot);
        } else {
            // load the most recent timeline
            const mostRecentSlot = this.findMostRecentSave();
            if (mostRecentSlot) {
                this.loadFromSlot(mostRecentSlot);
            } else {
                addMessage('No save available to load!', 'error');
            }
        }
    },

    // find the newest save file
    findMostRecentSave() {
        let mostRecentSlot = null;
        let mostRecentTime = 0;
        
        for (let i = 1; i <= this.maxSaveSlots; i++) {
            const slot = this.saveSlots[i];
            if (slot.exists && slot.timestamp > mostRecentTime) {
                mostRecentTime = slot.timestamp;
                mostRecentSlot = i;
            }
        }
        
        return mostRecentSlot;
    },
    
    // generate screenshot (lol jk we don't)
    generateScreenshot() {
        // in a real implementation, you'd capture the canvas
        // for now, just return null and pretend it's intentional
        return null;
    },

    // calculate how long you've survived
    calculateDaysSurvived(saveData) {
        if (!saveData.gameData.timeState?.currentTime) return 0;
        
        const timeData = saveData.gameData.timeState.currentTime;
        return timeData.day + (timeData.month - 1) * 30 + (timeData.year - 1) * 360;
    },
    
    // erase a timeline permanently
    deleteSave(slotNumber) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return false;
        }

        try {
            // purge from localStorage
            const saveKey = `tradingGameSave_${slotNumber}`;
            localStorage.removeItem(saveKey);

            // reset the metadata
            this.saveSlots[slotNumber] = {
                name: `Save Slot ${slotNumber}`,
                timestamp: null,
                exists: false,
                screenshot: null,
                version: null
            };

            this.saveSaveSlotsMetadata();

            // clear current if we just deleted it
            if (this.currentSaveSlot === slotNumber) {
                this.currentSaveSlot = null;
            }
            
            addMessage(`Save ${slotNumber} deleted!`, 'success');
            return true;
            
        } catch (e) {
            console.error('Delete failed:', e);
            addMessage('Delete failed: ' + e.message, 'error');
            return false;
        }
    },
    
    // export save to physical file (take it with you)
    exportSave(slotNumber) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return;
        }

        const saveSlot = this.saveSlots[slotNumber];
        if (!saveSlot.exists) {
            addMessage('No save data in this slot!', 'error');
            return;
        }

        try {
            const saveKey = `tradingGameSave_${slotNumber}`;
            const compressedData = localStorage.getItem(saveKey);

            if (!compressedData) {
                addMessage('Save data not found!', 'error');
                return;
            }

            // generate download (browser magic)
            const blob = new Blob([compressedData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `trading_game_save_${slotNumber}_${saveSlot.name.replace(/\s+/g, '_')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addMessage(`Save ${slotNumber} exported!`, 'success');
            
        } catch (e) {
            console.error('Export failed:', e);
            addMessage('Export failed: ' + e.message, 'error');
        }
    },
    
    // import save from external file (trust no one)
    importSave(slotNumber, fileData) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return false;
        }

        try {
            // validate and decompress foreign data
            const saveData = this.decompressSaveData(fileData);
            const validation = this.validateSaveData(saveData);

            if (!validation.valid) {
                addMessage('Invalid save file: ' + validation.errors.join(', '), 'error');
                return false;
            }

            // stuff it into the specified slot
            const compressedData = this.compressSaveData(saveData);
            const saveKey = `tradingGameSave_${slotNumber}`;
            localStorage.setItem(saveKey, compressedData);

            // update the records
            this.saveSlots[slotNumber] = {
                name: `Imported Save`,
                timestamp: Date.now(),
                exists: true,
                screenshot: null,
                version: saveData.version,
                playerInfo: {
                    name: saveData.gameData.player.name,
                    level: saveData.gameData.player.level || 1,
                    gold: saveData.gameData.player.gold,
                    location: saveData.gameData.currentLocation?.name || 'Unknown',
                    daysSurvived: this.calculateDaysSurvived(saveData)
                }
            };
            
            this.saveSaveSlotsMetadata();
            
            addMessage(`Save imported to slot ${slotNumber}!`, 'success');
            return true;
            
        } catch (e) {
            console.error('Import failed:', e);
            addMessage('Import failed: ' + e.message, 'error');
            return false;
        }
    },
    
    // get save slot metadata for display
    getSaveSlotInfo(slotNumber) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            return null;
        }

        const slot = this.saveSlots[slotNumber];
        if (!slot.exists) {
            return {
                slotNumber: slotNumber,
                name: slot.name,
                exists: false,
                isEmpty: true
            };
        }

        return {
            slotNumber: slotNumber,
            name: slot.name,
            exists: true,
            isEmpty: false,
            timestamp: slot.timestamp,
            version: slot.version,
            playerInfo: slot.playerInfo,
            formattedDate: new Date(slot.timestamp).toLocaleString(),
            timeSinceSave: this.getTimeSinceSave(slot.timestamp)
        };
    },

    // calculate how long ago you saved (time is a flat circle)
    getTimeSinceSave(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    },

    // 🖤 notify all UI systems that a save happened - force immediate refresh
    notifyUIRefresh(slotNumber) {
        console.log('💾 notifying UI systems of save to slot', slotNumber);

        // poke the SaveLoadUI if it exists (the fancy one)
        if (typeof SaveLoadUI !== 'undefined') {
            if (typeof SaveLoadUI.updateSaveSlotsDisplay === 'function') {
                SaveLoadUI.updateSaveSlotsDisplay();
            }
            if (typeof SaveLoadUI.updateLoadSlotsDisplay === 'function') {
                SaveLoadUI.updateLoadSlotsDisplay();
            }
            if (typeof SaveLoadUI.updateManageOptions === 'function') {
                SaveLoadUI.updateManageOptions();
            }
        }

        // poke the SaveUISystem if it exists (the other save UI because why have one when you can have two?)
        if (typeof SaveUISystem !== 'undefined') {
            // this is the main one that renders save slots
            if (typeof SaveUISystem.populateSaveSlots === 'function') {
                SaveUISystem.populateSaveSlots();
            }
            // also refresh load slots if they exist
            if (typeof SaveUISystem.populateLoadSlots === 'function') {
                SaveUISystem.populateLoadSlots();
            }
            if (typeof SaveUISystem.updateLeaderboard === 'function') {
                SaveUISystem.updateLeaderboard();
            }
        }

        // flash the saved slot to show it updated (visual feedback is self-care)
        this.flashSavedSlot(slotNumber);

        // dispatch a custom event for any other listeners lurking in the shadows
        try {
            window.dispatchEvent(new CustomEvent('gameSaved', {
                detail: { slotNumber, timestamp: Date.now() }
            }));
        } catch (e) {
            // some browsers dont like custom events, thats fine
            console.warn('🖤 custom event dispatch failed, the void swallowed it');
        }
    },

    // 🖤 flash the saved slot to give visual feedback that something actually happened
    flashSavedSlot(slotNumber) {
        // find all possible slot elements across the various UI systems
        const selectors = [
            `.save-slot[data-slot="${slotNumber}"]`,
            `.save-slot[data-slot-number="${slotNumber}"]`,
            `[data-slot="${slotNumber}"]`
        ];

        selectors.forEach(selector => {
            const slots = document.querySelectorAll(selector);
            slots.forEach(slot => {
                // add a flashy animation class
                slot.classList.add('just-saved');
                slot.style.animation = 'none';
                slot.offsetHeight; // force reflow (the dark arts of CSS)
                slot.style.animation = 'saveFlash 0.6s ease-out';

                // remove the class after animation completes
                setTimeout(() => {
                    slot.classList.remove('just-saved');
                    slot.style.animation = '';
                }, 700);
            });
        });

        // inject the animation if it doesnt exist
        if (!document.getElementById('save-flash-animation')) {
            const style = document.createElement('style');
            style.id = 'save-flash-animation';
            style.textContent = `
                @keyframes saveFlash {
                    0% { background-color: rgba(76, 175, 80, 0.5); transform: scale(1.02); }
                    50% { background-color: rgba(76, 175, 80, 0.3); }
                    100% { background-color: transparent; transform: scale(1); }
                }
                .just-saved {
                    box-shadow: 0 0 15px rgba(76, 175, 80, 0.6) !important;
                    border-color: #4CAF50 !important;
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Create backup of all saves
    createBackup() {
        try {
            const backup = {
                version: this.saveVersion,
                timestamp: Date.now(),
                saveSlots: this.saveSlots,
                saves: {}
            };
            
            // Backup all save data
            for (let i = 1; i <= this.maxSaveSlots; i++) {
                const saveKey = `tradingGameSave_${i}`;
                const saveData = localStorage.getItem(saveKey);
                if (saveData) {
                    backup.saves[i] = saveData;
                }
            }
            
            // Compress and save backup
            const backupData = this.compressSaveData(backup);
            localStorage.setItem('tradingGameBackup', backupData);
            
            addMessage('Backup created successfully!', 'success');
            return true;
            
        } catch (e) {
            console.error('Backup failed:', e);
            addMessage('Backup failed: ' + e.message, 'error');
            return false;
        }
    },
    
    // Restore from backup
    restoreFromBackup() {
        try {
            const backupData = localStorage.getItem('tradingGameBackup');
            if (!backupData) {
                addMessage('No backup found!', 'error');
                return false;
            }
            
            const backup = this.decompressSaveData(backupData);
            
            // Restore save slots metadata
            this.saveSlots = backup.saveSlots || {};
            this.saveSaveSlotsMetadata();
            
            // Restore all save data
            for (const [slotNumber, saveData] of Object.entries(backup.saves)) {
                const saveKey = `tradingGameSave_${slotNumber}`;
                localStorage.setItem(saveKey, saveData);
            }
            
            addMessage('Backup restored successfully!', 'success');
            return true;
            
        } catch (e) {
            console.error('Restore failed:', e);
            addMessage('Restore failed: ' + e.message, 'error');
            return false;
        }
    },
    
    // Check for corrupted saves and attempt recovery
    checkAndRepairSaves() {
        let repairedSaves = 0;
        
        for (let i = 1; i <= this.maxSaveSlots; i++) {
            const slot = this.saveSlots[i];
            if (!slot.exists) continue;
            
            try {
                const saveKey = `tradingGameSave_${i}`;
                const saveData = localStorage.getItem(saveKey);
                
                if (!saveData) {
                    // Metadata says save exists but data is missing
                    console.warn(`Save ${i} metadata exists but data is missing, repairing...`);
                    this.saveSlots[i] = {
                        name: `Save Slot ${i}`,
                        timestamp: null,
                        exists: false,
                        screenshot: null,
                        version: null
                    };
                    repairedSaves++;
                    continue;
                }
                
                // Try to validate and decompress
                const gameState = this.decompressSaveData(saveData);
                const validation = this.validateSaveData(gameState);
                
                if (!validation.valid) {
                    console.warn(`Save ${i} is corrupted, attempting repair...`);
                    
                    // Try to recover what we can
                    if (gameState && gameState.gameData) {
                        // Save the partial data
                        const partialData = this.compressSaveData(gameState);
                        localStorage.setItem(saveKey, partialData);
                        
                        // Update metadata to indicate corruption
                        this.saveSlots[i].version = gameState.version + '_CORRUPTED';
                        repairedSaves++;
                    } else {
                        // Completely corrupted, remove it
                        localStorage.removeItem(saveKey);
                        this.saveSlots[i] = {
                            name: `Save Slot ${i}`,
                            timestamp: null,
                            exists: false,
                            screenshot: null,
                            version: null
                        };
                        repairedSaves++;
                    }
                }
                
            } catch (e) {
                console.error(`Error checking save ${i}:`, e);
                
                // Remove corrupted save
                const saveKey = `tradingGameSave_${i}`;
                localStorage.removeItem(saveKey);
                this.saveSlots[i] = {
                    name: `Save Slot ${i}`,
                    timestamp: null,
                    exists: false,
                    screenshot: null,
                    version: null
                };
                repairedSaves++;
            }
        }
        
        if (repairedSaves > 0) {
            this.saveSaveSlotsMetadata();
            addMessage(`Repaired ${repairedSaves} corrupted save(s)!`, 'warning');
        }
        
        return repairedSaves;
    },

    // 🏆 Submit current game state to Hall of Champions (the single source of truth)
    async submitToGlobalLeaderboard(gameState) {
        try {
            console.log('🏆 submitToGlobalLeaderboard called with gameState:', !!gameState);

            const player = gameState?.gameData?.player;
            if (!player) {
                console.log('🏆 No player data to submit to Hall of Champions');
                return false;
            }

            console.log('🏆 Player data found:', player.name, 'Gold:', player.gold);

            const daysSurvived = this.calculateDaysSurvived(gameState);

            // Calculate score using same logic as GlobalLeaderboardSystem
            let score = Math.max(0, player.gold || 0);
            score += daysSurvived * 10;

            // Property bonus
            const properties = typeof PropertySystem !== 'undefined' ?
                PropertySystem.getOwnedProperties?.() || [] : [];
            score += properties.length * 500;

            // Inventory value
            let inventoryValue = 0;
            if (player.inventory && typeof ItemDatabase !== 'undefined') {
                for (const [itemId, quantity] of Object.entries(player.inventory)) {
                    if (quantity > 0) {
                        const price = ItemDatabase.calculatePrice?.(itemId) || 0;
                        inventoryValue += price * quantity;
                    }
                }
            }
            score += Math.floor(inventoryValue * 0.5);

            // Achievement bonus
            const achievements = typeof AchievementSystem !== 'undefined' ?
                AchievementSystem.unlockedAchievements?.size || 0 : 0;
            score += achievements * 100;

            // Trade bonus
            const tradesCompleted = typeof TradingSystem !== 'undefined' ?
                TradingSystem.tradeHistory?.length || 0 : 0;
            score += tradesCompleted * 5;

            // Difficulty multiplier
            const difficultyMultipliers = { easy: 0.5, normal: 1.0, hard: 1.5, nightmare: 2.0 };
            const difficulty = player.difficulty || 'normal';
            score = Math.floor(score * (difficultyMultipliers[difficulty] || 1));

            // Calculate property value for net worth
            let propertyValue = 0;
            properties.forEach(p => {
                const type = typeof PropertySystem !== 'undefined' ?
                    PropertySystem.propertyTypes?.[p.type] : null;
                if (type) {
                    propertyValue += type.basePrice || 0;
                }
            });

            const scoreData = {
                playerName: player.name || 'Unknown Merchant',
                score: score,
                gold: player.gold || 0,
                daysSurvived: daysSurvived,
                causeOfDeath: 'still playing', // 💚 They're still kicking!
                difficulty: difficulty,
                tradesCompleted: tradesCompleted,
                propertyCount: properties.length,
                inventoryValue: inventoryValue,
                netWorth: (player.gold || 0) + inventoryValue + propertyValue,
                achievements: achievements,
                locationsVisited: Object.keys(player.visitedLocations || {}).length,
                itemsCrafted: player.itemsCrafted || 0,
                dungeonsExplored: player.dungeonsExplored || 0,
                isAlive: true // 💚 Flag to show they're still playing
            };

            console.log('🏆 Calling GlobalLeaderboardSystem.submitScore with:', scoreData);
            const result = await GlobalLeaderboardSystem.submitScore(scoreData);
            console.log('🏆 Score submitted to Hall of Champions:', score, 'Result:', result);
            return result;

        } catch (error) {
            console.error('🏆 Failed to submit to Hall of Champions:', error);
            return false;
        }
    }
};

// Initialize save system when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            SaveLoadSystem.init();
        }, 1000);
    });
} else {
    setTimeout(() => {
        SaveLoadSystem.init();
    }, 1000);
}