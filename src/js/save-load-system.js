// ═══════════════════════════════════════════════════════════════
// 💾 SAVE/LOAD SYSTEM - preserving your progress (and mistakes)
// ═══════════════════════════════════════════════════════════════
// because even in games we fear losing everything
// auto-saves are basically anxiety medication

const SaveLoadSystem = {
    // ⚙️ Save slots configuration - multiple timelines of regret
    maxSaveSlots: 10,
    maxAutoSaveSlots: 10, // rotating auto-saves because we're paranoid
    autoSaveInterval: 300000, // 5 minutes in milliseconds
    compressionEnabled: true,

    // Save slot metadata
    saveSlots: {},
    autoSaveSlots: [], // array of auto-save slot numbers (rotating)
    currentAutoSaveIndex: 0, // which auto-save slot to use next

    // Current save state
    currentSaveSlot: null,
    lastAutoSave: 0,
    isAutoSaving: false,

    // Save data version for compatibility
    saveVersion: '1.0.0',
    
    // Initialize save system
    init() {
        this.loadSaveSlotsMetadata();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
        this.setupEventListeners();
    },
    
    // 📂 Load save slots metadata from localStorage - digging up past timelines
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
            // Initialize empty save slots
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

        // Load auto-save metadata
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
    
    // 💾 Save slots metadata to localStorage - preserving the timeline records
    saveSaveSlotsMetadata() {
        try {
            localStorage.setItem('tradingGameSaveSlots', JSON.stringify(this.saveSlots));
            // Also save auto-save metadata
            localStorage.setItem('tradingGameAutoSaveSlots', JSON.stringify({
                slots: this.autoSaveSlots,
                currentIndex: this.currentAutoSaveIndex
            }));
        } catch (e) {
            console.error('💀 Failed to save slots metadata:', e);
        }
    },
    
    // Setup auto-save functionality
    setupAutoSave() {
        TimerManager.setInterval(() => {
            if (game.state === GameState.PLAYING && game.settings.autoSave) {
                this.autoSave();
            }
        }, this.autoSaveInterval);
    },
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        EventManager.addEventListener(document, 'keydown', (e) => {
            // F5 for quick save
            if (e.key === 'F5') {
                e.preventDefault();
                this.quickSave();
            }
            // F9 for quick load
            else if (e.key === 'F9') {
                e.preventDefault();
                this.quickLoad();
            }
        });
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Listen for game state changes
        const originalChangeState = window.changeState || function() {};
        window.changeState = function(newState) {
            originalChangeState(newState);
            
            // Trigger auto-save when entering playing state
            if (newState === GameState.PLAYING && game.settings.autoSave) {
                this.autoSaveTimer = TimerManager.setTimeout(() => SaveLoadSystem.autoSave(), 1000);
            }
        };
        
        // Listen for beforeunload to save current state
        EventManager.addEventListener(window, 'beforeunload', () => {
            if (game.state === GameState.PLAYING && game.settings.autoSave) {
                this.autoSave(true); // Silent save
            }
        });
    },
    
    // Get complete game state for saving
    getCompleteGameState() {
        const gameState = {
            version: this.saveVersion,
            timestamp: Date.now(),
            gameData: {
                // Core game state
                state: game.state,
                gameTick: game.gameTick,
                
                // Player data
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
                
                // Current location
                currentLocation: game.currentLocation,
                
                // Time system state
                timeState: {
                    currentTime: TimeSystem.currentTime,
                    currentSpeed: TimeSystem.currentSpeed,
                    isPaused: TimeSystem.isPaused
                },
                
                // Event system state
                eventState: {
                    activeEvents: EventSystem.getActiveEvents(),
                    scheduledEvents: EventSystem.scheduledEvents
                },
                
                // Game world state
                worldState: {
                    unlockedRegions: GameWorld.unlockedRegions,
                    visitedLocations: GameWorld.visitedLocations,
                    locations: GameWorld.locations,
                    regions: GameWorld.regions
                },
                
                // Property system state
                propertyState: {
                    properties: PropertySystem.getPlayerProperties(),
                    propertyIncome: game.player?.propertyIncome,
                    propertyExpenses: game.player?.propertyExpenses
                },
                
                // Employee system state
                employeeState: {
                    employees: EmployeeSystem.getPlayerEmployees(),
                    employeeExpenses: game.player?.employeeExpenses
                },
                
                // Trade route system state
                tradeRouteState: {
                    routes: TradeRouteSystem.getTradeRoutes()
                },
                
                // Travel system state
                travelState: typeof TravelSystem !== 'undefined' ? TravelSystem.getState() : null,
                
                // Item Database state
                itemDatabaseState: typeof ItemDatabase !== 'undefined' ? {
                    items: ItemDatabase.items,
                    categories: ItemDatabase.categories,
                    rarity: ItemDatabase.rarity
                } : null,
                
                // Inventory System state
                inventoryState: typeof InventorySystem !== 'undefined' ? {
                    maxSlots: InventorySystem.maxSlots,
                    maxWeight: InventorySystem.maxWeight,
                    sortCriteria: InventorySystem.sortCriteria,
                    filterCriteria: InventorySystem.filterCriteria
                } : null,
                
                // Trading System state
                tradingState: typeof TradingSystem !== 'undefined' ? {
                    tradeMode: TradingSystem.tradeMode,
                    selectedTradeItems: Array.from(TradingSystem.selectedTradeItems.entries()),
                    tradeHistory: TradingSystem.tradeHistory,
                    priceAlerts: TradingSystem.priceAlerts
                } : null,
                
                // City Reputation System state
                cityReputationState: typeof CityReputationSystem !== 'undefined' ? {
                    reputations: CityReputationSystem.getAllReputations()
                } : null,
                
                // City Event System state
                cityEventState: typeof CityEventSystem !== 'undefined' ? {
                    activeEvents: CityEventSystem.getAllActiveEvents(),
                    eventHistory: CityEventSystem.getEventHistory()
                } : null,
                
                // Market Price History state
                marketPriceHistoryState: typeof MarketPriceHistory !== 'undefined' ? {
                    priceHistory: MarketPriceHistory.getAllPriceHistory()
                } : null,
                
                // Dynamic Market System state
                dynamicMarketState: typeof DynamicMarketSystem !== 'undefined' ? {
                    marketTrends: DynamicMarketSystem.getAllMarketTrends(),
                    supplyDemandData: DynamicMarketSystem.getAllSupplyDemandData()
                } : null,
                
                // Market data
                marketData: {
                    marketPrices: game.marketPrices,
                    marketPriceModifier: game.marketPriceModifier
                },
                
                // Settings
                settings: game.settings,
                
                // UI state
                uiState: {
                    deathTimer: game.deathTimer
                },
                
                // High scores
                highScores: HighScoreSystem.highScores
            }
        };
        
        return gameState;
    },
    
    // Validate save data integrity
    validateSaveData(saveData) {
        const errors = [];
        
        // Check basic structure
        if (!saveData || typeof saveData !== 'object') {
            errors.push('Invalid save data structure');
            return { valid: false, errors };
        }
        
        // Check version compatibility
        if (!saveData.version) {
            errors.push('Missing save version information');
        }
        
        // Check required game data sections
        const requiredSections = ['gameData', 'timestamp', 'version'];
        for (const section of requiredSections) {
            if (!saveData[section]) {
                errors.push(`Missing required section: ${section}`);
            }
        }
        
        // Check player data
        if (saveData.gameData && !saveData.gameData.player) {
            errors.push('Missing player data');
        }
        
        // Check for corrupted data (circular references, etc.)
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
    
    // Compress save data
    compressSaveData(saveData) {
        if (!this.compressionEnabled) {
            return JSON.stringify(saveData);
        }
        
        try {
            // Simple compression using JSON string manipulation
            // In a real implementation, you might use a proper compression library
            const jsonString = JSON.stringify(saveData);
            return this.simpleCompress(jsonString);
        } catch (e) {
            console.error('Compression failed, using uncompressed data:', e);
            return JSON.stringify(saveData);
        }
    },
    
    // Decompress save data
    decompressSaveData(compressedData) {
        if (!this.compressionEnabled) {
            return JSON.parse(compressedData);
        }
        // Try to decompress using the simple decompression first,
        // fall back to direct JSON.parse if that fails.
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
    
    // Simple compression algorithm
    simpleCompress(data) {
        // This is a very simple compression for demonstration
        // In production, use a proper compression library
        return btoa(data);
    },
    
    // Simple decompression algorithm
    simpleDecompress(data) {
        // This matches the simple compression above
        return atob(data);
    },
    
    // Save game to specific slot
    saveToSlot(slotNumber, customName = null) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return false;
        }
        
        try {
            // Get complete game state
            const gameState = this.getCompleteGameState();
            
            // Validate save data
            const validation = this.validateSaveData(gameState);
            if (!validation.valid) {
                addMessage('Save data validation failed: ' + validation.errors.join(', '), 'error');
                return false;
            }
            
            // Compress save data
            const compressedData = this.compressSaveData(gameState);
            
            // Save to localStorage
            const saveKey = `tradingGameSave_${slotNumber}`;
            localStorage.setItem(saveKey, compressedData);
            
            // Update save slot metadata
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
            
            addMessage(`Game saved to ${this.saveSlots[slotNumber].name}!`, 'success');
            return true;
            
        } catch (e) {
            console.error('Save failed:', e);
            addMessage('Save failed: ' + e.message, 'error');
            return false;
        }
    },
    
    // Load game from specific slot
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
            // Load compressed data from localStorage
            const saveKey = `tradingGameSave_${slotNumber}`;
            const compressedData = localStorage.getItem(saveKey);
            
            if (!compressedData) {
                addMessage('Save data not found!', 'error');
                return false;
            }
            
            // Decompress and parse save data
            const saveData = this.decompressSaveData(compressedData);
            
            // Validate loaded data
            const validation = this.validateSaveData(saveData);
            if (!validation.valid) {
                addMessage('Save data is corrupted: ' + validation.errors.join(', '), 'error');
                return false;
            }
            
            // Check version compatibility
            if (!this.isVersionCompatible(saveData.version)) {
                addMessage('Save data is from an incompatible version!', 'error');
                return false;
            }
            
            // Load the game state
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
    
    // Load game state into the game
    loadGameState(gameData) {
        // Stop current game if running
        if (game.isRunning) {
            game.stop();
        }
        
        // Restore core game state
        game.state = gameData.state;
        game.gameTick = gameData.gameTick;
        game.currentLocation = gameData.currentLocation;
        game.marketPrices = gameData.marketData?.marketPrices || {};
        game.marketPriceModifier = gameData.marketData?.marketPriceModifier || 1;
        game.settings = { ...game.settings, ...gameData.settings };
        game.deathTimer = gameData.uiState?.deathTimer || game.deathTimer;
        
        // Restore player data
        if (gameData.player) {
            game.player = { ...game.player, ...gameData.player };
        }
        
        // Restore time system
        if (gameData.timeState) {
            TimeSystem.currentTime = gameData.timeState.currentTime;
            TimeSystem.setSpeed(gameData.timeState.currentSpeed);
            TimeSystem.isPaused = gameData.timeState.isPaused;
        }
        
        // Restore event system
        if (gameData.eventState) {
            EventSystem.events = gameData.eventState.activeEvents || [];
            EventSystem.scheduledEvents = gameData.eventState.scheduledEvents || [];
        }
        
        // Restore game world
        if (gameData.worldState) {
            GameWorld.unlockedRegions = gameData.worldState.unlockedRegions || ['starter'];
            GameWorld.visitedLocations = gameData.worldState.visitedLocations || ['riverwood'];
            GameWorld.locations = gameData.worldState.locations || {};
            GameWorld.regions = gameData.worldState.regions || {};
        }
        
        // Restore property system
        if (gameData.propertyState && typeof PropertySystem !== 'undefined') {
            game.player.ownedProperties = gameData.propertyState.properties || [];
            game.player.propertyIncome = gameData.propertyState.propertyIncome || 0;
            PropertySystem.loadProperties(gameData.propertyState.properties);
        }
        
        // Restore employee system
        if (gameData.employeeState && typeof EmployeeSystem !== 'undefined') {
            game.player.ownedEmployees = gameData.employeeState.employees || [];
            game.player.employeeExpenses = gameData.employeeState.employeeExpenses || 0;
            EmployeeSystem.loadEmployees(gameData.employeeState.employees);
        }
        
        // Restore trade routes
        if (gameData.tradeRouteState && typeof TradeRouteSystem !== 'undefined') {
            TradeRouteSystem.loadTradeRoutes(gameData.tradeRouteState.routes);
        }
        
        // Restore travel system
        if (gameData.travelState && typeof TravelSystem !== 'undefined') {
            TravelSystem.loadState(gameData.travelState);
        }
        
        // Restore high scores
        if (gameData.highScores && typeof HighScoreSystem !== 'undefined') {
            HighScoreSystem.highScores = gameData.highScores;
        }
        
        // Restore Item Database
        if (gameData.itemDatabaseState && typeof ItemDatabase !== 'undefined') {
            ItemDatabase.items = gameData.itemDatabaseState.items || ItemDatabase.items;
            ItemDatabase.categories = gameData.itemDatabaseState.categories || ItemDatabase.categories;
            ItemDatabase.rarity = gameData.itemDatabaseState.rarity || ItemDatabase.rarity;
        }
        
        // Restore Inventory System
        if (gameData.inventoryState && typeof InventorySystem !== 'undefined') {
            InventorySystem.maxSlots = gameData.inventoryState.maxSlots || 20;
            InventorySystem.maxWeight = gameData.inventoryState.maxWeight || 100;
            InventorySystem.sortCriteria = gameData.inventoryState.sortCriteria;
            InventorySystem.filterCriteria = gameData.inventoryState.filterCriteria;
        }
        
        // Restore Trading System
        if (gameData.tradingState && typeof TradingSystem !== 'undefined') {
            TradingSystem.tradeMode = gameData.tradingState.tradeMode || 'single';
            TradingSystem.selectedTradeItems = new Map(gameData.tradingState.selectedTradeItems || []);
            TradingSystem.tradeHistory = gameData.tradingState.tradeHistory || [];
            TradingSystem.priceAlerts = gameData.tradingState.priceAlerts || [];
        }
        
        // Restore City Reputation System
        if (gameData.cityReputationState && typeof CityReputationSystem !== 'undefined') {
            if (typeof CityReputationSystem.loadReputations === 'function') {
                CityReputationSystem.loadReputations(gameData.cityReputationState.reputations || {});
            }
        }
        
        // Restore City Event System
        if (gameData.cityEventState && typeof CityEventSystem !== 'undefined') {
            if (typeof CityEventSystem.loadActiveEvents === 'function') {
                CityEventSystem.loadActiveEvents(gameData.cityEventState.activeEvents || []);
            }
            if (typeof CityEventSystem.loadEventHistory === 'function') {
                CityEventSystem.loadEventHistory(gameData.cityEventState.eventHistory || []);
            }
        }
        
        // Restore Market Price History
        if (gameData.marketPriceHistoryState && typeof MarketPriceHistory !== 'undefined') {
            if (typeof MarketPriceHistory.loadPriceHistoryFromSave === 'function') {
                MarketPriceHistory.loadPriceHistoryFromSave(gameData.marketPriceHistoryState.priceHistory || {});
            }
        }
        
        // Restore Dynamic Market System
        if (gameData.dynamicMarketState && typeof DynamicMarketSystem !== 'undefined') {
            if (typeof DynamicMarketSystem.loadMarketTrends === 'function') {
                DynamicMarketSystem.loadMarketTrends(gameData.dynamicMarketState.marketTrends || {});
            }
            if (typeof DynamicMarketSystem.loadSupplyDemandData === 'function') {
                DynamicMarketSystem.loadSupplyDemandData(gameData.dynamicMarketState.supplyDemandData || {});
            }
        }
        
        // Update UI
        updatePlayerInfo();
        updatePlayerStats();
        updateLocationInfo();
        updateLocationPanel();
        
        // Update system displays
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
        
        // Restart game engine
        game.start();
    },
    
    // Check version compatibility
    isVersionCompatible(saveVersion) {
        // Simple version check - in production, you'd implement proper version compatibility
        return saveVersion === this.saveVersion;
    },
    
    // 🔄 Auto-save functionality - rotating saves because paranoia is valid
    autoSave(silent = false) {
        if (this.isAutoSaving) return;

        this.isAutoSaving = true;

        try {
            // Use rotating auto-save slots (auto_0 through auto_9)
            const autoSaveSlotName = `auto_${this.currentAutoSaveIndex}`;
            const timestamp = new Date();
            const formattedTime = timestamp.toLocaleString();

            // Create the save data
            const saveData = this.getCompleteGameState();
            if (!saveData) {
                console.error('💀 Auto-save failed: no game state to save');
                return;
            }

            // Save to localStorage with unique auto-save key
            const saveKey = `tradingGameAutoSave_${this.currentAutoSaveIndex}`;
            try {
                localStorage.setItem(saveKey, JSON.stringify(saveData));

                // Update auto-save slots tracking
                const slotInfo = {
                    index: this.currentAutoSaveIndex,
                    timestamp: timestamp.getTime(),
                    formattedTime: formattedTime,
                    playerName: game.player?.name || 'Unknown',
                    gold: game.player?.gold || 0,
                    location: game.currentLocation?.name || 'Unknown',
                    day: TimeSystem.currentTime?.day || 1
                };

                // Add or update slot in array
                const existingIndex = this.autoSaveSlots.findIndex(s => s.index === this.currentAutoSaveIndex);
                if (existingIndex >= 0) {
                    this.autoSaveSlots[existingIndex] = slotInfo;
                } else {
                    this.autoSaveSlots.push(slotInfo);
                }

                // Sort by timestamp (newest first)
                this.autoSaveSlots.sort((a, b) => b.timestamp - a.timestamp);

                // Keep only maxAutoSaveSlots
                if (this.autoSaveSlots.length > this.maxAutoSaveSlots) {
                    const removed = this.autoSaveSlots.pop();
                    localStorage.removeItem(`tradingGameAutoSave_${removed.index}`);
                }

                // Move to next slot (rotating)
                this.currentAutoSaveIndex = (this.currentAutoSaveIndex + 1) % this.maxAutoSaveSlots;

                // Save metadata
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

    // 📋 Get list of auto-saves for display
    getAutoSaveList() {
        return this.autoSaveSlots.map(slot => ({
            ...slot,
            name: `Auto-Save ${slot.index + 1}`,
            key: `tradingGameAutoSave_${slot.index}`
        }));
    },

    // 📂 Load from auto-save slot
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

    // 💾 Manual save (called from settings)
    manualSave() {
        if (game.state !== GameState.PLAYING) {
            addMessage('Cannot save outside of gameplay!', 'error');
            return false;
        }

        // Find first empty slot or use slot 1
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
    
    // Quick save (F5)
    quickSave() {
        if (game.state !== GameState.PLAYING) {
            addMessage('Cannot save outside of gameplay!', 'error');
            return;
        }
        
        // Use current save slot or slot 1
        const slot = this.currentSaveSlot || 1;
        this.saveToSlot(slot);
    },
    
    // Quick load (F9)
    quickLoad() {
        if (this.currentSaveSlot) {
            this.loadFromSlot(this.currentSaveSlot);
        } else {
            // Load most recent save
            const mostRecentSlot = this.findMostRecentSave();
            if (mostRecentSlot) {
                this.loadFromSlot(mostRecentSlot);
            } else {
                addMessage('No save available to load!', 'error');
            }
        }
    },
    
    // Find most recent save
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
    
    // Generate screenshot (simplified)
    generateScreenshot() {
        // In a real implementation, you'd capture the game canvas
        // For now, return null
        return null;
    },
    
    // Calculate days survived
    calculateDaysSurvived(saveData) {
        if (!saveData.gameData.timeState?.currentTime) return 0;
        
        const timeData = saveData.gameData.timeState.currentTime;
        return timeData.day + (timeData.month - 1) * 30 + (timeData.year - 1) * 360;
    },
    
    // Delete save from slot
    deleteSave(slotNumber) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return false;
        }
        
        try {
            // Remove from localStorage
            const saveKey = `tradingGameSave_${slotNumber}`;
            localStorage.removeItem(saveKey);
            
            // Update metadata
            this.saveSlots[slotNumber] = {
                name: `Save Slot ${slotNumber}`,
                timestamp: null,
                exists: false,
                screenshot: null,
                version: null
            };
            
            this.saveSaveSlotsMetadata();
            
            // Clear current save slot if it was the deleted one
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
    
    // Export save to file
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
            
            // Create download link
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
    
    // Import save from file
    importSave(slotNumber, fileData) {
        if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
            addMessage('Invalid save slot number!', 'error');
            return false;
        }
        
        try {
            // Validate and decompress the imported data
            const saveData = this.decompressSaveData(fileData);
            const validation = this.validateSaveData(saveData);
            
            if (!validation.valid) {
                addMessage('Invalid save file: ' + validation.errors.join(', '), 'error');
                return false;
            }
            
            // Save to specified slot
            const compressedData = this.compressSaveData(saveData);
            const saveKey = `tradingGameSave_${slotNumber}`;
            localStorage.setItem(saveKey, compressedData);
            
            // Update metadata
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
    
    // Get save slot info for UI display
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
    
    // Get time since save in human readable format
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