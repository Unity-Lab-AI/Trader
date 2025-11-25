// ═══════════════════════════════════════════════════════════════
// 🖤 SAVE/LOAD SYSTEM - preserving your mistakes for eternity 🖤
// ═══════════════════════════════════════════════════════════════
// File Version: 0.1
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
    lastAutoSave: 0,
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

                // your digital identity's baggage
                player: {
                    name: game.player?.name,
                    class: game.player?.class,
                    gold: game.player?.gold,
                    inventory: game.player?.inventory,
                    reputation: game.player?.reputation,
                    skills: game.player?.skills,
                    stats: game.player?.stats,
                    attributes: game.player?.attributes,
                    transportation: game.player?.transportation,
                    ownedTransportation: game.player?.ownedTransportation,
                    currentLoad: game.player?.currentLoad,
                    ownedProperties: game.player?.ownedProperties,
                    ownedEmployees: game.player?.ownedEmployees,
                    perks: game.player?.perks,
                    lastRestTime: game.player?.lastRestTime,
                    ownsHouse: game.player?.ownsHouse,
                    toolDurability: game.player?.toolDurability,
                    temporaryEffects: game.player?.temporaryEffects,
                    equippedTool: game.player?.equippedTool,
                    equippedWeapon: game.player?.equippedWeapon
                },

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

                // the map of your personal hell
                worldState: typeof GameWorld !== 'undefined' ? {
                    unlockedRegions: GameWorld.unlockedRegions || ['starter'],
                    visitedLocations: GameWorld.visitedLocations || [],
                    locations: GameWorld.locations || {},
                    regions: GameWorld.regions || {}
                } : null,

                // real estate you probably can't afford
                propertyState: typeof PropertySystem !== 'undefined' ? {
                    properties: safeCall(() => PropertySystem.getPlayerProperties(), []),
                    propertyIncome: game.player?.propertyIncome,
                    propertyExpenses: game.player?.propertyExpenses
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

                // catalog of things you'll hoard
                itemDatabaseState: typeof ItemDatabase !== 'undefined' ? {
                    items: ItemDatabase.items,
                    categories: ItemDatabase.categories,
                    rarity: ItemDatabase.rarity
                } : null,

                // your backpack of broken dreams
                inventoryState: typeof InventorySystem !== 'undefined' ? {
                    maxSlots: InventorySystem.maxSlots,
                    maxWeight: InventorySystem.maxWeight,
                    sortCriteria: InventorySystem.sortCriteria,
                    filterCriteria: InventorySystem.filterCriteria
                } : null,

                // the hustle never stops
                tradingState: typeof TradingSystem !== 'undefined' ? {
                    tradeMode: TradingSystem.tradeMode,
                    selectedTradeItems: safeMapEntries(TradingSystem.selectedTradeItems),
                    tradeHistory: TradingSystem.tradeHistory || [],
                    priceAlerts: TradingSystem.priceAlerts || []
                } : null,

                // who loves you and who wants you dead
                cityReputationState: typeof CityReputationSystem !== 'undefined' && CityReputationSystem.getAllReputations ? {
                    reputations: safeCall(() => CityReputationSystem.getAllReputations(), {})
                } : null,

                // urban chaos log
                cityEventState: typeof CityEventSystem !== 'undefined' ? {
                    activeEvents: safeCall(() => CityEventSystem.getAllActiveEvents?.(), []),
                    eventHistory: safeCall(() => CityEventSystem.getEventHistory?.(), [])
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

                // hall of fame (or shame)
                highScores: typeof HighScoreSystem !== 'undefined' ? HighScoreSystem.highScores : []
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
    
    // squeeze the pain into smaller bytes
    compressSaveData(saveData) {
        if (!this.compressionEnabled) {
            return JSON.stringify(saveData);
        }

        try {
            // "compression" - it's just base64 but sounds better
            // real devs use gzip, we use denial
            const jsonString = JSON.stringify(saveData);
            return this.simpleCompress(jsonString);
        } catch (e) {
            console.error('Compression failed, using uncompressed data:', e);
            return JSON.stringify(saveData);
        }
    },

    // expand the compressed regrets
    decompressSaveData(compressedData) {
        if (!this.compressionEnabled) {
            return JSON.parse(compressedData);
        }
        // try decompressing, fail gracefully, cry internally
        try {
            const decompressed = this.simpleDecompress(compressedData);
            return JSON.parse(decompressed);
        } catch (e) {
            console.error('Decompression failed, trying direct parse:', e);
            try {
                return JSON.parse(compressedData);
            } catch (parseError) {
                console.error('Direct JSON parse failed:', parseError);
                return null;
            }
        }
    },

    // "compression" algorithm (it's just base64, don't judge)
    simpleCompress(data) {
        // this is embarrassingly simple
        // but hey, it works at 3am
        return btoa(data);
    },

    // reverse the totally-not-base64
    simpleDecompress(data) {
        // atob - the undo button we deserve
        return atob(data);
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

            // immortalize your stats on the leaderboard
            // (tracking mediocrity since day one)
            if (typeof HighScoreSystem !== 'undefined') {
                const daysSurvived = this.calculateDaysSurvived(gameState);
                HighScoreSystem.addHighScore(
                    gameState.gameData.player.name || 'Unknown Hero',
                    gameState.gameData.player.gold || 0,
                    daysSurvived,
                    null // no death cause - you're still breathing (barely)
                );

                // refresh the scoreboard of despair
                if (typeof SaveUISystem !== 'undefined') {
                    SaveUISystem.updateLeaderboard();
                }
            }

            addMessage(`Game saved to ${this.saveSlots[slotNumber].name}!`, 'success');
            return true;

        } catch (e) {
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
            addMessage('Load failed: ' + e.message, 'error');
            return false;
        }
    },
    
    // rehydrate the game state from json purgatory
    loadGameState(gameData) {
        // kill the current timeline
        if (game.isRunning) {
            game.stop();
        }

        // restore the fundamental variables
        game.state = gameData.state;
        game.gameTick = gameData.gameTick;
        game.currentLocation = gameData.currentLocation;
        game.marketPrices = gameData.marketData?.marketPrices || {};
        game.marketPriceModifier = gameData.marketData?.marketPriceModifier || 1;
        game.settings = { ...game.settings, ...gameData.settings };
        game.deathTimer = gameData.uiState?.deathTimer || game.deathTimer;

        // resurrect player identity
        if (gameData.player) {
            game.player = { ...game.player, ...gameData.player };
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

        // rebuild the world map
        if (gameData.worldState) {
            GameWorld.unlockedRegions = gameData.worldState.unlockedRegions || ['starter'];
            GameWorld.visitedLocations = gameData.worldState.visitedLocations || ['riverwood'];
            GameWorld.locations = gameData.worldState.locations || {};
            GameWorld.regions = gameData.worldState.regions || {};
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

        // reload travel plans
        if (gameData.travelState && typeof TravelSystem !== 'undefined') {
            TravelSystem.loadState(gameData.travelState);
        }

        // resurrect the hall of shame
        if (gameData.highScores && typeof HighScoreSystem !== 'undefined') {
            HighScoreSystem.highScores = gameData.highScores;
        }

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

        // refresh the UI
        updatePlayerInfo();
        updatePlayerStats();
        updateLocationInfo();
        updateLocationPanel();
        
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

        // reboot the game loop
        game.start();
    },

    // check if versions match (they probably don't)
    isVersionCompatible(saveVersion) {
        // naive version check - backwards compatibility is a fever dream
        return saveVersion === this.saveVersion;
    },
    
    // 🔄 periodic preservation of your suffering
    autoSave(silent = false) {
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

            // shove it into localStorage (pray it fits)
            const saveKey = `tradingGameAutoSave_${this.currentAutoSaveIndex}`;
            try {
                localStorage.setItem(saveKey, JSON.stringify(saveData));

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
            const parsedData = JSON.parse(saveData);
            this.restoreGameState(parsedData);
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