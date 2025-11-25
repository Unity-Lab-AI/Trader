// ═══════════════════════════════════════════════════════════════
// 🏆 ACHIEVEMENT SYSTEM - validation through virtual trophies
// ═══════════════════════════════════════════════════════════════
// because real accomplishments are overrated, here's some pixel ones
// at least these ones give dopamine hits

const AchievementSystem = {
    // 🎖️ Achievement data - every flex you can earn
    achievements: {
        // --- WEALTH ACHIEVEMENTS ---
        first_gold: {
            id: 'first_gold',
            name: 'First Coin',
            description: 'Earn your first gold coin',
            icon: '💰',
            category: 'wealth',
            rarity: 'common',
            unlocked: false,
            unlockedAt: null,
            condition: () => game.player && game.player.gold >= 1
        },
        merchant_apprentice: {
            id: 'merchant_apprentice',
            name: 'Merchant Apprentice',
            description: 'Accumulate 1,000 gold',
            icon: '💰',
            category: 'wealth',
            rarity: 'common',
            unlocked: false,
            unlockedAt: null,
            condition: () => game.player && game.player.gold >= 1000
        },
        merchant_master: {
            id: 'merchant_master',
            name: 'Merchant Master',
            description: 'Accumulate 10,000 gold',
            icon: '💎',
            category: 'wealth',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => game.player && game.player.gold >= 10000
        },
        trade_tycoon: {
            id: 'trade_tycoon',
            name: 'Trade Tycoon',
            description: 'Accumulate 50,000 gold',
            icon: '👑',
            category: 'wealth',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => game.player && game.player.gold >= 50000
        },

        // --- TRADING ACHIEVEMENTS ---
        first_trade: {
            id: 'first_trade',
            name: 'First Deal',
            description: 'Complete your first trade',
            icon: '🤝',
            category: 'trading',
            rarity: 'common',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.tradesCompleted >= 1
        },
        savvy_trader: {
            id: 'savvy_trader',
            name: 'Savvy Trader',
            description: 'Complete 50 trades',
            icon: '📊',
            category: 'trading',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.tradesCompleted >= 50
        },
        trading_legend: {
            id: 'trading_legend',
            name: 'Trading Legend',
            description: 'Complete 200 trades',
            icon: '⭐',
            category: 'trading',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.tradesCompleted >= 200
        },
        profit_margin: {
            id: 'profit_margin',
            name: 'Profit Margin',
            description: 'Make 500 gold profit in a single trade',
            icon: '📈',
            category: 'trading',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.highestProfit >= 500
        },

        // --- TRAVEL ACHIEVEMENTS ---
        first_journey: {
            id: 'first_journey',
            name: 'First Journey',
            description: 'Travel to another location',
            icon: '🗺️',
            category: 'travel',
            rarity: 'common',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.locationsVisited >= 2
        },
        world_explorer: {
            id: 'world_explorer',
            name: 'World Explorer',
            description: 'Visit all locations in the realm',
            icon: '🌍',
            category: 'travel',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => {
                const totalLocations = typeof GameWorld !== 'undefined' && GameWorld.locations ? Object.keys(GameWorld.locations).length : 45;
                return AchievementSystem.stats.locationsVisited >= totalLocations;
            }
        },
        road_warrior: {
            id: 'road_warrior',
            name: 'Road Warrior',
            description: 'Travel 1,000 miles',
            icon: '🏃',
            category: 'travel',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.distanceTraveled >= 1000
        },
        frequent_traveler: {
            id: 'frequent_traveler',
            name: 'Frequent Traveler',
            description: 'Complete 100 journeys',
            icon: '🚶',
            category: 'travel',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.journeysCompleted >= 100
        },

        // --- SURVIVAL ACHIEVEMENTS ---
        survivor: {
            id: 'survivor',
            name: 'Survivor',
            description: 'Survive 10 hostile encounters',
            icon: '🛡️',
            category: 'survival',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.encountersSurvived >= 10
        },
        bandit_hunter: {
            id: 'bandit_hunter',
            name: 'Bandit Hunter',
            description: 'Defeat 20 bandit encounters',
            icon: '⚔️',
            category: 'survival',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.banditsDefeated >= 20
        },
        lucky_escape: {
            id: 'lucky_escape',
            name: 'Lucky Escape',
            description: 'Escape from danger with less than 10 gold remaining',
            icon: '🍀',
            category: 'survival',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.narrowEscapes >= 1
        },

        // --- COLLECTION ACHIEVEMENTS ---
        pack_rat: {
            id: 'pack_rat',
            name: 'Pack Rat',
            description: 'Carry 50 different items in your inventory',
            icon: '🎒',
            category: 'collection',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => {
                if (!game.player || !game.player.inventory) return false;
                return Object.keys(game.player.inventory).length >= 50;
            }
        },
        rare_collector: {
            id: 'rare_collector',
            name: 'Rare Collector',
            description: 'Own 10 rare or legendary items',
            icon: '💎',
            category: 'collection',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.rareItemsOwned >= 10
        },
        hoarder: {
            id: 'hoarder',
            name: 'Hoarder',
            description: 'Have 1,000 total items in inventory',
            icon: '📦',
            category: 'collection',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => {
                if (!game.player || !game.player.inventory) return false;
                return Object.values(game.player.inventory).reduce((sum, qty) => sum + qty, 0) >= 1000;
            }
        },

        // --- TIME ACHIEVEMENTS ---
        veteran_trader: {
            id: 'veteran_trader',
            name: 'Veteran Trader',
            description: 'Play for 10 in-game days',
            icon: '📅',
            category: 'time',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => typeof TimeSystem !== 'undefined' && TimeSystem.getTotalDays() >= 10
        },
        year_of_trading: {
            id: 'year_of_trading',
            name: 'Year of Trading',
            description: 'Play for 1 in-game year (365 days)',
            icon: '🎂',
            category: 'time',
            rarity: 'legendary',
            unlocked: false,
            unlockedAt: null,
            condition: () => typeof TimeSystem !== 'undefined' && TimeSystem.getTotalDays() >= 365
        },

        // --- SPECIAL ACHIEVEMENTS ---
        lucky_strike: {
            id: 'lucky_strike',
            name: 'Lucky Strike',
            description: 'Find hidden treasure during travel',
            icon: '✨',
            category: 'special',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.treasuresFound >= 1
        },
        rags_to_riches: {
            id: 'rags_to_riches',
            name: 'Rags to Riches',
            description: 'Go from less than 10 gold to over 5,000 gold',
            icon: '📊',
            category: 'special',
            rarity: 'rare',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.ragsToRiches
        },
        perfect_haggle: {
            id: 'perfect_haggle',
            name: 'Perfect Haggle',
            description: 'Buy an item at 50% below market price',
            icon: '🎯',
            category: 'special',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.perfectHaggles >= 1
        },
        generous_soul: {
            id: 'generous_soul',
            name: 'Generous Soul',
            description: 'Give away 1,000 gold worth of items or money',
            icon: '❤️',
            category: 'special',
            rarity: 'uncommon',
            unlocked: false,
            unlockedAt: null,
            condition: () => AchievementSystem.stats.goldGivenAway >= 1000
        }
    },

    // Statistics tracking
    stats: {
        tradesCompleted: 0,
        highestProfit: 0,
        locationsVisited: 0,
        uniqueLocationsVisited: new Set(),
        distanceTraveled: 0,
        journeysCompleted: 0,
        encountersSurvived: 0,
        banditsDefeated: 0,
        narrowEscapes: 0,
        rareItemsOwned: 0,
        treasuresFound: 0,
        ragsToRiches: false,
        perfectHaggles: 0,
        goldGivenAway: 0
    },

    // Initialize the achievement system
    init() {
        console.log('Achievement System initialized');
        this.checkAchievements();
    },

    // Check all achievements - wrapped in try-catch so errors dont freeze the UI
    checkAchievements() {
        if (!game.player) return;

        for (const [id, achievement] of Object.entries(this.achievements)) {
            try {
                if (!achievement.unlocked && achievement.condition()) {
                    this.unlockAchievement(id);
                }
            } catch (err) {
                // dont let one broken achievement check crash everything lol
                console.warn(`Achievement check failed for ${id}:`, err.message);
            }
        }
    },

    // Unlock an achievement
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();

        // Show notification
        this.showAchievementNotification(achievement);

        // Save progress
        this.saveProgress();

        console.log(`Achievement unlocked: ${achievement.name}`);
    },

    // Show achievement notification
    showAchievementNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-rarity rarity-${achievement.rarity}">${achievement.rarity.toUpperCase()}</div>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        TimerManager.setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after 5 seconds
        TimerManager.setTimeout(() => {
            notification.classList.remove('show');
            TimerManager.setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);

        // Also add message to game log
        if (typeof addMessage === 'function') {
            addMessage(`🏆 Achievement Unlocked: ${achievement.name}`);
        }
    },

    // Track trade completion
    trackTrade(profit) {
        AchievementSystem.stats.tradesCompleted++;
        if (profit > AchievementSystem.stats.highestProfit) {
            AchievementSystem.stats.highestProfit = profit;
        }
        if (profit >= 500) {
            this.checkAchievements();
        }
        this.checkAchievements();
    },

    // Track location visit
    trackLocationVisit(locationId) {
        AchievementSystem.stats.uniqueLocationsVisited.add(locationId);
        AchievementSystem.stats.locationsVisited = AchievementSystem.stats.uniqueLocationsVisited.size;
        this.checkAchievements();
    },

    // Track journey completion
    trackJourney(distance) {
        AchievementSystem.stats.journeysCompleted++;
        AchievementSystem.stats.distanceTraveled += distance;
        this.checkAchievements();
    },

    // Track encounter survival
    trackEncounter(encounterType, survived) {
        if (survived) {
            AchievementSystem.stats.encountersSurvived++;
            if (encounterType === 'bandits' || encounterType === 'highwaymen') {
                AchievementSystem.stats.banditsDefeated++;
            }
        }

        // Check for narrow escape
        if (survived && game.player && game.player.gold < 10) {
            AchievementSystem.stats.narrowEscapes++;
        }

        this.checkAchievements();
    },

    // Track treasure found
    trackTreasure() {
        AchievementSystem.stats.treasuresFound++;
        this.checkAchievements();
    },

    // Track rags to riches
    trackRagsToRiches() {
        if (!AchievementSystem.stats.ragsToRiches && game.player) {
            if (game.player.gold >= 5000) {
                // Check transaction history to see if they were ever below 10
                AchievementSystem.stats.ragsToRiches = true;
                this.checkAchievements();
            }
        }
    },

    // Get achievement progress
    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = Object.values(this.achievements).filter(a => a.unlocked).length;
        const percentage = Math.round((unlocked / total) * 100);

        return { total, unlocked, percentage };
    },

    // Get achievements by category
    getByCategory(category) {
        return Object.values(this.achievements).filter(a => a.category === category);
    },

    // Get unlocked achievements
    getUnlocked() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    },

    // Get locked achievements
    getLocked() {
        return Object.values(this.achievements).filter(a => !a.unlocked);
    },

    // Save achievement progress
    saveProgress() {
        const saveData = {
            achievements: {},
            stats: {
                ...this.stats,
                uniqueLocationsVisited: Array.from(AchievementSystem.stats.uniqueLocationsVisited)
            }
        };

        // Save only unlocked status and unlock time
        for (const [id, achievement] of Object.entries(this.achievements)) {
            saveData.achievements[id] = {
                unlocked: achievement.unlocked,
                unlockedAt: achievement.unlockedAt
            };
        }

        localStorage.setItem('achievementProgress', JSON.stringify(saveData));
    },

    // Load achievement progress
    loadProgress() {
        const saved = localStorage.getItem('achievementProgress');
        if (!saved) return;

        try {
            const saveData = JSON.parse(saved);

            // Restore achievement unlock status
            if (saveData.achievements) {
                for (const [id, data] of Object.entries(saveData.achievements)) {
                    if (this.achievements[id]) {
                        this.achievements[id].unlocked = data.unlocked;
                        this.achievements[id].unlockedAt = data.unlockedAt;
                    }
                }
            }

            // Restore stats
            if (saveData.stats) {
                this.stats = {
                    ...this.stats,
                    ...saveData.stats,
                    uniqueLocationsVisited: new Set(saveData.stats.uniqueLocationsVisited || [])
                };
                AchievementSystem.stats.locationsVisited = AchievementSystem.stats.uniqueLocationsVisited.size;
            }

            console.log('Achievement progress loaded');
        } catch (error) {
            console.error('Error loading achievement progress:', error);
        }
    },

    // Reset all achievements (for testing)
    reset() {
        for (const achievement of Object.values(this.achievements)) {
            achievement.unlocked = false;
            achievement.unlockedAt = null;
        }

        this.stats = {
            tradesCompleted: 0,
            highestProfit: 0,
            locationsVisited: 0,
            uniqueLocationsVisited: new Set(),
            distanceTraveled: 0,
            journeysCompleted: 0,
            encountersSurvived: 0,
            banditsDefeated: 0,
            narrowEscapes: 0,
            rareItemsOwned: 0,
            treasuresFound: 0,
            ragsToRiches: false,
            perfectHaggles: 0,
            goldGivenAway: 0
        };

        this.saveProgress();
        console.log('All achievements reset');
    }
};

// ===== UI FUNCTIONS =====

// Open achievement panel
function openAchievementPanel() {
    const overlay = document.getElementById('achievement-overlay');
    if (overlay) {
        overlay.classList.add('active');
        populateAchievements();
        updateAchievementProgress();
    }
}

// Close achievement panel
function closeAchievementPanel() {
    const overlay = document.getElementById('achievement-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Populate achievements in the panel
function populateAchievements(category = 'all') {
    const grid = document.getElementById('achievement-grid');
    if (!grid) return;

    grid.innerHTML = '';

    let achievements = Object.values(AchievementSystem.achievements);

    // Filter by category
    if (category !== 'all') {
        achievements = achievements.filter(a => a.category === category);
    }

    // Sort: unlocked first, then by category
    achievements.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;
        return a.category.localeCompare(b.category);
    });

    // Create achievement cards
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;

        const unlockedDate = achievement.unlockedAt
            ? new Date(achievement.unlockedAt).toLocaleDateString()
            : '';

        card.innerHTML = `
            <div class="achievement-card-icon">${achievement.icon}</div>
            <div class="achievement-card-name">${achievement.name}</div>
            <div class="achievement-card-description">${achievement.description}</div>
            <div class="achievement-card-footer">
                <div class="achievement-rarity rarity-${achievement.rarity}">${achievement.rarity.toUpperCase()}</div>
                ${achievement.unlocked
                    ? `<div class="achievement-unlocked-badge">UNLOCKED</div>`
                    : `<div class="achievement-locked-badge">LOCKED</div>`
                }
            </div>
            ${achievement.unlocked && unlockedDate
                ? `<div class="achievement-date">Unlocked on ${unlockedDate}</div>`
                : ''
            }
        `;

        grid.appendChild(card);
    });
}

// Filter achievements by category - called by onclick handlers cuz EventManager is being a lil brat
// like when ur code works in ur head but not in reality... story of my life tbh
function filterAchievements(button, category) {
    // yeet the active class from all buttons like they ghosted me
    const categoryButtons = document.querySelectorAll('.achievement-category-btn');
    categoryButtons.forEach(btn => btn.classList.remove('active'));

    // crown the clicked button as the chosen one
    button.classList.add('active');

    // summon the achievements for this dark ritual... i mean category
    populateAchievements(category);
}

// Update achievement progress display
function updateAchievementProgress() {
    const progress = AchievementSystem.getProgress();
    const progressText = document.getElementById('achievement-progress-text');
    const progressFill = document.getElementById('achievement-progress-fill');

    if (progressText) {
        progressText.textContent = `${progress.unlocked} / ${progress.total} (${progress.percentage}%)`;
    }

    if (progressFill) {
        progressFill.style.width = `${progress.percentage}%`;
    }
}

// Setup achievement category buttons
function setupAchievementCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.achievement-category-btn');

    categoryButtons.forEach(button => {
        EventManager.addEventListener(button, 'click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get category
            const category = button.getAttribute('data-category');

            // Populate achievements for this category
            populateAchievements(category);
        });
    });
}

// Initialize on game load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            AchievementSystem.loadProgress();
            AchievementSystem.init();
            setupAchievementCategoryButtons();
        }, 200);
    });
} else {
    setTimeout(() => {
        AchievementSystem.loadProgress();
        AchievementSystem.init();
        setupAchievementCategoryButtons();
    }, 200);
}
