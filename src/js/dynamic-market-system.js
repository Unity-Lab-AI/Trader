// ═══════════════════════════════════════════════════════════════
// 📈 DYNAMIC MARKET SYSTEM - prices go brrr
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// supply and demand but make it chaotic
// buy low sell high cry often thats the motto

const DynamicMarketSystem = {
    // ⚙️ Market chaos configuration
    updateInterval: 5, // Update every 5 game minutes
    volatilityFactor: 0.1, // 10% price volatility
    saturationThreshold: 10, // Items bought/sold affect prices
    
    // Market saturation tracking
    marketSaturation: {},
    
    // Initialize dynamic market system
    init() {
        this.loadMarketSaturation();
        this.startUpdateTimer();
    },
    
    // Load market saturation from localStorage
    loadMarketSaturation() {
        const saved = localStorage.getItem('tradingGameMarketSaturation');
        if (saved) {
            try {
                this.marketSaturation = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load market saturation:', e);
                this.marketSaturation = {};
            }
        }
    },
    
    // Save market saturation to localStorage
    saveMarketSaturation() {
        try {
            localStorage.setItem('tradingGameMarketSaturation', JSON.stringify(this.marketSaturation));
        } catch (e) {
            console.error('Failed to save market saturation:', e);
        }
    },
    
    // Start update timer
    startUpdateTimer() {
        TimerManager.setInterval(() => {
            if (game.state === GameState.PLAYING && !TimeSystem.isPaused) {
                this.updateMarketPrices();
            }
        }, this.updateInterval * 60000); // Convert minutes to milliseconds
    },
    
    // Update market prices based on dynamic factors
    updateMarketPrices() {
        for (const [cityId, cityData] of Object.entries(GameWorld.locations)) {
            if (!cityData.marketPrices) continue;
            
            for (const [itemId, marketData] of Object.entries(cityData.marketPrices)) {
                const item = ItemDatabase.getItem(itemId);
                if (!item) continue;
                
                // Get base price
                const basePrice = ItemDatabase.calculatePrice(itemId);
                
                // Apply market saturation
                const saturation = this.getMarketSaturation(cityId, itemId);
                let saturationModifier = 1.0;
                
                if (saturation > this.saturationThreshold) {
                    // High saturation reduces prices
                    saturationModifier = 1.0 - ((saturation - this.saturationThreshold) / 100) * 0.3;
                }
                
                // Apply random volatility
                const volatility = (Math.random() - 0.5) * this.volatilityFactor;
                const priceModifier = saturationModifier * (1 + volatility);
                
                // Update price with bounds checking
                const newPrice = Math.round(basePrice * priceModifier);
                const minPrice = Math.round(basePrice * 0.5); // Minimum 50% of base price
                const maxPrice = Math.round(basePrice * 2.0); // Maximum 200% of base price
                
                marketData.price = Math.max(minPrice, Math.min(maxPrice, newPrice));
            }
        }
    },
    
    // Update supply and demand based on transactions
    updateSupplyDemand(cityId, itemId, quantity) {
        const saturationKey = `${cityId}_${itemId}`;
        if (!this.marketSaturation[saturationKey]) {
            this.marketSaturation[saturationKey] = {
                buyVolume: 0,
                sellVolume: 0,
                lastUpdate: Date.now()
            };
        }
        
        // Update volumes
        if (quantity > 0) {
            this.marketSaturation[saturationKey].buyVolume += quantity;
        } else {
            this.marketSaturation[saturationKey].sellVolume += Math.abs(quantity);
        }
        
        this.marketSaturation[saturationKey].lastUpdate = Date.now();
        this.saveMarketSaturation();
    },
    
    // Get market saturation for an item
    getMarketSaturation(cityId, itemId) {
        const saturationKey = `${cityId}_${itemId}`;
        const saturation = this.marketSaturation[saturationKey];
        
        if (!saturation) {
            return 0;
        }
        
        // Calculate total volume and decay over time
        const totalVolume = saturation.buyVolume + saturation.sellVolume;
        const timeSinceUpdate = Date.now() - saturation.lastUpdate;
        const daysSinceUpdate = timeSinceUpdate / (24 * 60 * 60 * 1000); // Convert to days
        
        // Decay saturation over time (5% per day)
        const decayFactor = Math.max(0.5, 1 - (daysSinceUpdate * 0.05));
        
        return totalVolume * decayFactor;
    },
    
    // Apply market saturation effects
    applyMarketSaturation(cityId, itemId) {
        const saturation = this.getMarketSaturation(cityId, itemId);
        const location = GameWorld.locations[cityId];
        
        if (!location || !location.marketPrices || !location.marketPrices[itemId]) {
            return;
        }
        
        const item = ItemDatabase.getItem(itemId);
        if (!item) return;
        
        // Apply saturation effects
        if (saturation > this.saturationThreshold) {
            // High saturation reduces stock
            location.marketPrices[itemId].stock = Math.max(1, Math.floor(location.marketPrices[itemId].stock * 0.7));
            
            // High saturation increases prices slightly
            location.marketPrices[itemId].price = Math.round(location.marketPrices[itemId].price * 1.1);
        }
    },
    
    // Generate market news based on current conditions
    generateMarketNews() {
        const news = [];
        const events = CityEventSystem.getAllActiveEvents();
        
        // Add event-based news
        events.forEach(event => {
            const location = GameWorld.locations[event.cityId];
            if (location) {
                news.push(`📢 ${event.name} in ${location.name}: ${event.description}`);
            }
        });
        
        // Add saturation-based news
        for (const [cityId, cityData] of Object.entries(GameWorld.locations)) {
            if (!cityData.marketPrices) continue;
            
            for (const [itemId, marketData] of Object.entries(cityData.marketPrices)) {
                const saturation = this.getMarketSaturation(cityId, itemId);
                const item = ItemDatabase.getItem(itemId);
                
                if (!item) continue;
                
                if (saturation > this.saturationThreshold * 1.5) {
                    news.push(`📉 ${item.name} prices soaring in ${cityData.name} due to shortages!`);
                } else if (saturation < this.saturationThreshold * 0.5) {
                    news.push(`📈 ${item.name} prices plummeting in ${cityData.name} due to oversupply!`);
                }
            }
        }
        
        // Limit news items
        return news.slice(0, 5);
    },
    
    // Get all market trends for save system
    getAllMarketTrends() {
        const trends = {};
        for (const [cityId, cityData] of Object.entries(GameWorld.locations)) {
            if (!cityData.marketPrices) continue;
            
            trends[cityId] = {};
            for (const [itemId, marketData] of Object.entries(cityData.marketPrices)) {
                trends[cityId][itemId] = {
                    currentPrice: marketData.price,
                    basePrice: ItemDatabase.calculatePrice(itemId),
                    saturation: this.getMarketSaturation(cityId, itemId),
                    lastUpdated: Date.now()
                };
            }
        }
        return trends;
    },
    
    // Load market trends from save system
    loadMarketTrends(trends) {
        // This would restore market trends if we stored them separately
        // For now, we'll just log it
        console.log('Loaded market trends:', trends);
    },
    
    // Get all supply/demand data for save system
    getAllSupplyDemandData() {
        return this.marketSaturation;
    },
    
    // Load supply/demand data from save system
    loadSupplyDemandData(data) {
        this.marketSaturation = data || {};
        this.saveMarketSaturation();
    },
    
    // Reset market saturation (for testing or admin)
    resetMarketSaturation() {
        this.marketSaturation = {};
        this.saveMarketSaturation();
        addMessage('Market saturation has been reset!');
    }
};

// Initialize dynamic market system when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            DynamicMarketSystem.init();
        }, 100);
    });
} else {
    setTimeout(() => {
        DynamicMarketSystem.init();
    }, 100);
}