// ═══════════════════════════════════════════════════════════════
// DOOM WORLD CONFIG - The rules of the apocalypse 💀🔥
// ═══════════════════════════════════════════════════════════════
// Version: 0.89.9 | Unity AI Lab
// This file configures everything about the doom world:
// - Economy (barter system, worthless gold)
// - World state (corruption, danger levels)
// - NPC integration with main systems
// - UI elements and atmosphere
// ═══════════════════════════════════════════════════════════════

const DoomWorldConfig = {
    // ═══════════════════════════════════════════════════════════════
    // 🔥 WORLD STATE
    // ═══════════════════════════════════════════════════════════════
    worldState: {
        name: 'The Doom',
        isActive: false, // Set true when player enters doom world
        unlockCondition: 'defeat_first_boss', // Must defeat a boss first
        entryPoint: 'smugglers_cove', // Where the Ferryman takes you
        corruption: {
            level: 100, // 0-100, starts at max
            spreadRate: 0, // Doesn't spread further - already consumed
            canBeReduced: true // Player actions can reduce it
        },
        timeOfDay: 'eternal_dusk', // Always dim, never full day or night
        weatherPatterns: ['ash_fall', 'blood_rain', 'shadow_fog', 'deathly_still']
    },

    // ═══════════════════════════════════════════════════════════════
    // 💰 DOOM ECONOMY - Barter system, gold is worthless
    // ═══════════════════════════════════════════════════════════════
    economy: {
        goldMultiplier: 0.01, // Gold is worth 1% of normal
        barterEnabled: true,  // Trade item for item

        // Item value tiers in doom (for barter calculations)
        valueTiers: {
            // CRITICAL SURVIVAL - Most valuable
            water: 100,
            clean_water: 150,
            food: 80,
            bread: 60,
            meat: 75,
            vegetables: 50,
            medical_plants: 90,
            bandages: 85,
            plague_cure: 200,

            // WEAPONS AND DEFENSE - Very valuable
            iron_sword: 70,
            steel_sword: 90,
            bow: 60,
            arrows: 40,
            shield: 55,
            armor: 80,
            chainmail: 75,
            plate_armor: 100,

            // SURVIVAL TOOLS - Valuable
            torch: 45,
            lamp: 50,
            rope: 35,
            tools: 40,
            pickaxe: 45,
            axe: 45,

            // MATERIALS - Moderate value
            leather: 30,
            cloth: 25,
            wood: 20,
            iron_bar: 35,
            iron_ore: 25,
            coal: 30,
            furs: 40,

            // CLOTHING - Moderate value (protection matters)
            winter_clothing: 50,
            hide: 35,

            // CONSUMABLES - Some value
            ale: 20, // Morale matters
            wine: 15,
            herbs: 25,

            // FORMER LUXURIES - Nearly worthless
            gold: 1,
            gold_bar: 2,
            gold_ore: 1,
            silver_ore: 1,
            gems: 3,
            rare_gems: 5,
            jewelry: 2,
            silk: 5,
            perfume: 1,
            royal_goods: 1,
            luxury_items: 1,
            spices: 8, // Some preservation value
            tea: 10, // Morale value
            artifacts: 10 // Historical/mystical value
        },

        // What NPCs desperately need (affects their barter rates)
        desperateNeeds: {
            food: ['water', 'bread', 'meat', 'vegetables'],
            medicine: ['medical_plants', 'bandages', 'plague_cure'],
            weapons: ['iron_sword', 'steel_sword', 'bow', 'arrows'],
            warmth: ['furs', 'winter_clothing', 'coal', 'wood'],
            light: ['torch', 'lamp', 'oil']
        },

        // Calculate doom barter value
        getBarterValue(itemId, quantity = 1) {
            const baseValue = this.valueTiers[itemId] || 10;
            return baseValue * quantity;
        },

        // Check if trade is fair in doom
        isTradeValid(offeredItems, requestedItems) {
            let offeredValue = 0;
            let requestedValue = 0;

            offeredItems.forEach(item => {
                offeredValue += this.getBarterValue(item.id, item.quantity);
            });

            requestedItems.forEach(item => {
                requestedValue += this.getBarterValue(item.id, item.quantity);
            });

            // Allow 20% variance in doom (desperate times)
            return offeredValue >= requestedValue * 0.8;
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ⚠️ DANGER SYSTEM
    // ═══════════════════════════════════════════════════════════════
    danger: {
        // Base danger levels by location type
        baseLevels: {
            capital: 80,
            city: 70,
            village: 50,
            inn: 30, // Refuges are safer
            mine: 60,
            forest: 75,
            farm: 55,
            dungeon: 95,
            cave: 65,
            ruins: 85,
            outpost: 40, // Fortified
            port: 60
        },

        // Random encounter chances (per travel segment)
        encounterChance: {
            day: 0.3,    // 30% chance during "day"
            night: 0.6,  // 60% at "night"
            dusk: 0.4    // 40% at dusk (eternal dusk = always this)
        },

        // Types of encounters
        encounterTypes: [
            { type: 'blight_creature', weight: 30, difficulty: 'medium' },
            { type: 'shadow_beast', weight: 20, difficulty: 'hard' },
            { type: 'desperate_survivors', weight: 25, difficulty: 'easy' }, // May attack or beg
            { type: 'corrupted_wildlife', weight: 15, difficulty: 'medium' },
            { type: 'wandering_dead', weight: 10, difficulty: 'hard' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // 🎨 UI CONFIGURATION - Doom aesthetic
    // ═══════════════════════════════════════════════════════════════
    ui: {
        // Color scheme
        colors: {
            background: '#1a0a0a', // Dark blood red/black
            text: '#8b0000', // Dark red
            textSecondary: '#4a0000',
            accent: '#ff4444', // Bright red for alerts
            highlight: '#660000',
            border: '#330000',
            warning: '#ff0000',
            hope: '#44aa44' // Rare moments of hope - green
        },

        // Message prefixes
        messagePrefix: {
            info: '💀',
            warning: '⚠️',
            danger: '🔥',
            death: '☠️',
            quest: '📜',
            trade: '🔄',
            hope: '🌱'
        },

        // Atmosphere text for locations
        atmosphereText: {
            arrival: [
                'The air tastes of ash and despair.',
                'Shadows move at the edge of your vision.',
                'The silence is broken only by distant screams.',
                'Death has walked these streets.',
                'The corruption pulses in the ground beneath you.'
            ],
            combat: [
                'It comes for you from the darkness!',
                'The creature\'s eyes burn with hunger!',
                'There is no escape. Only survival.',
                'Steel yourself. This is the doom.'
            ],
            rest: [
                'Sleep brings no peace, only nightmares.',
                'You rest, but the darkness never sleeps.',
                'Tomorrow may be your last. Rest while you can.',
                'The fire flickers. Something watches from beyond its light.'
            ]
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔧 INTEGRATION FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    // Check if doom world is active
    isActive() {
        return this.worldState.isActive || (typeof game !== 'undefined' && game.inDoomWorld === true);
    },

    // Activate doom world
    activate() {
        this.worldState.isActive = true;
        if (typeof game !== 'undefined') {
            game.inDoomWorld = true;
        }
        console.log('💀 DOOM WORLD ACTIVATED - The apocalypse begins...');
        this._applyDoomEffects();
    },

    // Deactivate (return to normal world via Ferryman)
    deactivate() {
        this.worldState.isActive = false;
        if (typeof game !== 'undefined') {
            game.inDoomWorld = false;
        }
        console.log('🌅 Returned to the normal world...');
        this._removeDoomEffects();
    },

    // Apply doom visual/audio effects
    _applyDoomEffects() {
        // Apply CSS class for doom styling
        document.body.classList.add('doom-world');

        // Update UI colors if UIManager exists
        if (typeof UIManager !== 'undefined' && UIManager.applyTheme) {
            UIManager.applyTheme('doom');
        }

        // Play doom ambient if AudioSystem exists
        if (typeof AudioSystem !== 'undefined' && AudioSystem.playAmbient) {
            AudioSystem.playAmbient('doom_ambient');
        }
    },

    // Remove doom effects
    _removeDoomEffects() {
        document.body.classList.remove('doom-world');

        if (typeof UIManager !== 'undefined' && UIManager.applyTheme) {
            UIManager.applyTheme('default');
        }

        if (typeof AudioSystem !== 'undefined' && AudioSystem.playAmbient) {
            AudioSystem.playAmbient('normal_ambient');
        }
    },

    // Get location data for doom world
    getLocationData(locationId) {
        // Get base location from GameWorld
        const baseLocation = GameWorld?.locations?.[locationId];
        if (!baseLocation) return null;

        // Get doom-specific data
        const doomNPCs = DoomWorldNPCs?.getNPCsForLocation(locationId) || [];
        const doomName = DoomWorldNPCs?.getLocationName(locationId) || baseLocation.name;
        const doomDesc = DoomWorldNPCs?.getLocationDescription(locationId) || baseLocation.description;
        const doomAtmosphere = DoomWorldNPCs?.getLocationAtmosphere(locationId) || '';

        return {
            ...baseLocation,
            name: doomName,
            description: doomDesc,
            atmosphere: doomAtmosphere,
            npcs: doomNPCs,
            dangerLevel: this.danger.baseLevels[baseLocation.type] || 50,
            isDoom: true
        };
    },

    // Get NPC instruction for doom world
    getNPCInstruction(npcType, action, context = {}) {
        if (typeof DoomNPCInstructionTemplates !== 'undefined') {
            return DoomNPCInstructionTemplates.buildDoomInstruction(npcType, action, context);
        }
        // Fallback
        return `You are a survivor in the apocalypse. Be desperate and traumatized. ${action}`;
    },

    // Get available quests at location
    getAvailableQuests(locationId) {
        if (typeof DoomQuestSystem !== 'undefined') {
            return DoomQuestSystem.getAvailableQuests(locationId);
        }
        return [];
    },

    // Calculate price in doom economy
    getDoomPrice(itemId, normalPrice) {
        if (typeof DoomWorldNPCs !== 'undefined') {
            return DoomWorldNPCs.getDoomPrice(itemId, normalPrice);
        }
        // Fallback
        const modifier = this.economy.valueTiers[itemId] ? this.economy.valueTiers[itemId] / 50 : 1;
        return Math.round(normalPrice * modifier);
    },

    // Get random atmosphere text
    getAtmosphereText(situation = 'arrival') {
        const texts = this.ui.atmosphereText[situation] || this.ui.atmosphereText.arrival;
        return texts[Math.floor(Math.random() * texts.length)];
    },

    // Check for random encounter during travel
    checkRandomEncounter() {
        const chance = this.danger.encounterChance.dusk; // Eternal dusk
        if (Math.random() < chance) {
            // Weight-based encounter selection
            const totalWeight = this.danger.encounterTypes.reduce((sum, e) => sum + e.weight, 0);
            let roll = Math.random() * totalWeight;

            for (const encounter of this.danger.encounterTypes) {
                roll -= encounter.weight;
                if (roll <= 0) {
                    return encounter;
                }
            }
        }
        return null;
    }
};

// ═══════════════════════════════════════════════════════════════
// 🌐 EXPOSE GLOBALLY
// ═══════════════════════════════════════════════════════════════
window.DoomWorldConfig = DoomWorldConfig;

console.log('💀 DoomWorldConfig loaded - The apocalypse is configured...');
