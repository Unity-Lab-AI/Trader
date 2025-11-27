// ═══════════════════════════════════════════════════════════════
// 💀 DEATH CAUSE SYSTEM - tracking how your journey ends
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// every merchant's tale must end... this system remembers how

console.log('💀 Death Cause System awakening from the grave...');

const DeathCauseSystem = {
    // ═══════════════════════════════════════════════════════════
    // 📊 DEATH TRACKING STATE
    // ═══════════════════════════════════════════════════════════

    // Current pending death cause (set before death is triggered)
    pendingDeathCause: null,

    // History of recent damage/events that could have caused death
    recentEvents: [],
    maxRecentEvents: 10,

    // ═══════════════════════════════════════════════════════════
    // 💀 DEATH CAUSE CATEGORIES
    // ═══════════════════════════════════════════════════════════

    categories: {
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

    // ═══════════════════════════════════════════════════════════
    // 🎭 DEATH MESSAGES - flavorful descriptions of demise
    // ═══════════════════════════════════════════════════════════

    deathMessages: {
        // Starvation deaths
        starvation: [
            'starved while surrounded by gold',
            'died hungry in a land of plenty',
            'the hunger finally won',
            'starved to death - forgot to eat',
            'wasted away from hunger',
            'died of starvation - trading didnt include food',
            'the belly was empty, the soul departed'
        ],

        // Dehydration deaths
        dehydration: [
            'died of thirst - ironic, really',
            'parched to death in the medieval wastes',
            'dehydration claimed another merchant',
            'forgot that water is essential',
            'dried up like old parchment',
            'the thirst was unquenchable',
            'died seeking water, found none'
        ],

        // Both hunger and thirst
        starvation_dehydration: [
            'withered away - hungry and parched',
            'died of neglect - no food, no water',
            'the body gave up on life',
            'wasted away completely',
            'forgot both food AND water existed'
        ],

        // Exhaustion deaths
        exhaustion: [
            'collapsed from exhaustion',
            'worked to death - literally',
            'the body finally gave out',
            'died of fatigue mid-journey',
            'exhaustion claimed its toll'
        ],

        // Combat deaths
        combat: {
            bandit: [
                'slain by roadside bandits',
                'murdered by highway robbers',
                'fell to bandit ambush',
                'killed by bandits for mere coins'
            ],
            thief: [
                'stabbed by a desperate thief',
                'killed during a robbery gone wrong',
                'murdered by cutpurses'
            ],
            guard: [
                'executed by the city guard',
                'killed resisting arrest',
                'slain by overzealous guards'
            ],
            mercenary: [
                'cut down by hired swords',
                'killed by mercenaries',
                'fell to a sellsword\'s blade'
            ],
            monster: [
                'devoured by dungeon creatures',
                'torn apart by monsters',
                'killed by something in the dark'
            ],
            generic: [
                'killed in combat',
                'died fighting',
                'slain in battle',
                'fell to an enemy\'s blade'
            ]
        },

        // Dungeon deaths
        dungeon: {
            trap: [
                'triggered a deadly trap',
                'fell into a spike pit',
                'crushed by a ceiling trap',
                'poisoned by trap darts'
            ],
            collapse: [
                'buried in a cave collapse',
                'crushed by falling rocks',
                'the dungeon claimed them'
            ],
            creature: [
                'devoured in the depths',
                'killed by dungeon denizens',
                'something in the dark got them'
            ],
            curse: [
                'succumbed to an ancient curse',
                'touched something cursed',
                'the tomb\'s magic consumed them'
            ],
            generic: [
                'lost in the dungeon depths',
                'never returned from the depths',
                'the dungeon claimed another soul'
            ]
        },

        // Travel deaths
        travel: {
            weather: [
                'frozen to death on the road',
                'died of exposure in a storm',
                'the weather proved fatal'
            ],
            accident: [
                'fell from a cliff while traveling',
                'drowned crossing a river',
                'died in a travel accident'
            ],
            wildlife: [
                'attacked by wild animals',
                'mauled by wolves on the road',
                'killed by wildlife'
            ],
            generic: [
                'died on the road',
                'never reached their destination',
                'perished while traveling'
            ]
        },

        // Encounter deaths
        encounter: {
            robbery: [
                'killed during a robbery',
                'murdered for their gold',
                'died defending their coin purse'
            ],
            betrayal: [
                'betrayed by a trusted contact',
                'stabbed in the back',
                'trusted the wrong person'
            ],
            generic: [
                'killed in a random encounter',
                'wrong place, wrong time',
                'an encounter turned deadly'
            ]
        },

        // Bankruptcy deaths
        bankruptcy: [
            'jailed for unpaid debts',
            'imprisoned for bankruptcy',
            'the debtors\' prison claimed them',
            'couldn\'t pay the bills',
            'financial ruin led to the dungeon'
        ],

        // Disease deaths
        disease: [
            'succumbed to plague',
            'died of mysterious illness',
            'fever took them',
            'the sickness won'
        ],

        // Environmental deaths
        environmental: [
            'died in a city fire',
            'killed in a natural disaster',
            'struck by lightning',
            'the elements proved fatal'
        ],

        // Unknown/Generic deaths
        unknown: [
            'the void simply called',
            'died of mysterious causes',
            'fate had other plans',
            'the end came unexpectedly',
            'their story ended abruptly'
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // 🔧 CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════

    // Record an event that could contribute to death
    recordEvent(category, subtype = null, details = null) {
        const event = {
            timestamp: Date.now(),
            category: category,
            subtype: subtype,
            details: details
        };

        this.recentEvents.unshift(event);

        // Keep only recent events
        if (this.recentEvents.length > this.maxRecentEvents) {
            this.recentEvents.pop();
        }

        console.log('💀 Death event recorded:', event);
    },

    // Set pending death cause (call before death triggers)
    setPendingCause(category, subtype = null, customMessage = null) {
        this.pendingDeathCause = {
            category: category,
            subtype: subtype,
            customMessage: customMessage,
            timestamp: Date.now()
        };
        console.log('💀 Pending death cause set:', this.pendingDeathCause);
    },

    // Clear pending cause
    clearPendingCause() {
        this.pendingDeathCause = null;
    },

    // Get the death cause message when player dies
    getDeathCause() {
        // First check if there's a pending cause
        if (this.pendingDeathCause) {
            const cause = this.pendingDeathCause;
            this.clearPendingCause();

            if (cause.customMessage) {
                return cause.customMessage;
            }

            return this.generateDeathMessage(cause.category, cause.subtype);
        }

        // Check recent events for context
        if (this.recentEvents.length > 0) {
            const recentEvent = this.recentEvents[0];
            // Only use if event is recent (within last 30 seconds)
            if (Date.now() - recentEvent.timestamp < 30000) {
                return this.generateDeathMessage(recentEvent.category, recentEvent.subtype);
            }
        }

        // Analyze player stats to determine cause
        return this.analyzeDeathCause();
    },

    // Analyze player stats to determine most likely death cause
    analyzeDeathCause() {
        if (typeof game === 'undefined' || !game.player || !game.player.stats) {
            return this.getRandomMessage('unknown');
        }

        const stats = game.player.stats;

        // Check for starvation/dehydration
        const isStarving = stats.hunger <= 0;
        const isDehydrated = stats.thirst <= 0;
        const isExhausted = stats.stamina <= 0;

        if (isStarving && isDehydrated) {
            return this.getRandomMessage('starvation_dehydration');
        } else if (isStarving) {
            return this.getRandomMessage('starvation');
        } else if (isDehydrated) {
            return this.getRandomMessage('dehydration');
        } else if (isExhausted) {
            return this.getRandomMessage('exhaustion');
        }

        // Check for bankruptcy
        if (stats.gold !== undefined && stats.gold < -100) {
            return this.getRandomMessage('bankruptcy');
        }

        // Default to unknown
        return this.getRandomMessage('unknown');
    },

    // Generate a death message based on category and subtype
    generateDeathMessage(category, subtype = null) {
        const messages = this.deathMessages[category];

        if (!messages) {
            return this.getRandomMessage('unknown');
        }

        // If messages is an object with subtypes
        if (typeof messages === 'object' && !Array.isArray(messages)) {
            if (subtype && messages[subtype]) {
                return this.getRandomFromArray(messages[subtype]);
            }
            // Try generic subtype
            if (messages.generic) {
                return this.getRandomFromArray(messages.generic);
            }
            // Get from first available subtype
            const keys = Object.keys(messages);
            if (keys.length > 0) {
                return this.getRandomFromArray(messages[keys[0]]);
            }
        }

        // Messages is an array
        if (Array.isArray(messages)) {
            return this.getRandomFromArray(messages);
        }

        return this.getRandomMessage('unknown');
    },

    // Get a random message from a category
    getRandomMessage(category) {
        const messages = this.deathMessages[category];
        if (Array.isArray(messages)) {
            return this.getRandomFromArray(messages);
        }
        return 'the void simply called';
    },

    // Helper: get random element from array
    getRandomFromArray(arr) {
        if (!arr || arr.length === 0) return 'unknown causes';
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // ═══════════════════════════════════════════════════════════
    // 🎮 GAME INTEGRATION HELPERS
    // ═══════════════════════════════════════════════════════════

    // Call when player takes damage from combat
    recordCombatDamage(enemyType = 'generic', damage = 0) {
        this.recordEvent(this.categories.COMBAT, enemyType, { damage });
        this.setPendingCause(this.categories.COMBAT, enemyType);
    },

    // Call when player is affected by dungeon events
    recordDungeonEvent(eventType = 'generic', details = null) {
        this.recordEvent(this.categories.DUNGEON, eventType, details);
        this.setPendingCause(this.categories.DUNGEON, eventType);
    },

    // Call when player is affected by travel hazards
    recordTravelHazard(hazardType = 'generic', details = null) {
        this.recordEvent(this.categories.TRAVEL, hazardType, details);
        this.setPendingCause(this.categories.TRAVEL, hazardType);
    },

    // Call when player encounters hostile NPC
    recordHostileEncounter(encounterType = 'generic', details = null) {
        this.recordEvent(this.categories.ENCOUNTER, encounterType, details);
        this.setPendingCause(this.categories.ENCOUNTER, encounterType);
    },

    // Call when player goes bankrupt
    recordBankruptcy(debt = 0) {
        this.recordEvent(this.categories.BANKRUPTCY, null, { debt });
        this.setPendingCause(this.categories.BANKRUPTCY, null,
            `jailed for bankruptcy (${Math.abs(debt).toLocaleString()} gold debt)`);
    },

    // Call when player starves
    recordStarvation() {
        this.recordEvent(this.categories.STARVATION);
        this.setPendingCause(this.categories.STARVATION);
    },

    // Call when player dehydrates
    recordDehydration() {
        this.recordEvent(this.categories.DEHYDRATION);
        this.setPendingCause(this.categories.DEHYDRATION);
    },

    // Call when player is exhausted
    recordExhaustion() {
        this.recordEvent(this.categories.EXHAUSTION);
        this.setPendingCause(this.categories.EXHAUSTION);
    },

    // ═══════════════════════════════════════════════════════════
    // 🔄 RESET
    // ═══════════════════════════════════════════════════════════

    reset() {
        this.pendingDeathCause = null;
        this.recentEvents = [];
        console.log('💀 Death Cause System reset');
    }
};

// 🌐 Expose globally
window.DeathCauseSystem = DeathCauseSystem;

console.log('✅ Death Cause System loaded! Your deaths will now be properly documented.');
