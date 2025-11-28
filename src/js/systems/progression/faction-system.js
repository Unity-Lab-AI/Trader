// ═══════════════════════════════════════════════════════════════
// 🏛️ FACTION SYSTEM - Choose your allies wisely
// ═══════════════════════════════════════════════════════════════
// File Version: GameConfig.version.file
// Made by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// Faction reputation affects prices, access to special items,
// quest availability, and NPC reactions throughout the game.
// ═══════════════════════════════════════════════════════════════

const FactionSystem = {
    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════
    playerFactionRep: {},

    // Reputation thresholds
    repLevels: {
        hated: { min: -1000, max: -500, name: 'Hated', icon: '💀', color: '#8b0000' },
        hostile: { min: -500, max: -200, name: 'Hostile', icon: '⚔️', color: '#ff0000' },
        unfriendly: { min: -200, max: -50, name: 'Unfriendly', icon: '😠', color: '#ff6600' },
        neutral: { min: -50, max: 50, name: 'Neutral', icon: '😐', color: '#888888' },
        friendly: { min: 50, max: 200, name: 'Friendly', icon: '😊', color: '#66bb66' },
        honored: { min: 200, max: 500, name: 'Honored', icon: '🤝', color: '#44aa44' },
        revered: { min: 500, max: 1000, name: 'Revered', icon: '⭐', color: '#22cc22' },
        exalted: { min: 1000, max: Infinity, name: 'Exalted', icon: '👑', color: '#ffd700' }
    },

    // ═══════════════════════════════════════════════════════════════
    // FACTION DEFINITIONS
    // ═══════════════════════════════════════════════════════════════
    factions: {
        merchants_guild: {
            id: 'merchants_guild',
            name: "Merchant's Guild",
            icon: '⚖️',
            description: 'The powerful trade organization that controls commerce in major cities.',
            headquarters: 'royal_capital',
            rivals: ['thieves_guild', 'smugglers'],
            allies: ['noble_houses', 'city_guard'],
            benefits: {
                friendly: { priceDiscount: 0.05, description: '5% better prices at guild shops' },
                honored: { priceDiscount: 0.10, specialItems: true, description: '10% discount, access to rare goods' },
                revered: { priceDiscount: 0.15, bulkDeals: true, description: '15% discount, bulk trade deals' },
                exalted: { priceDiscount: 0.20, exclusiveAccess: true, guildHall: true, description: '20% discount, guild hall access, exclusive contracts' }
            },
            penalties: {
                unfriendly: { priceIncrease: 0.10, description: '10% price increase' },
                hostile: { priceIncrease: 0.25, limitedStock: true, description: '25% increase, limited stock' },
                hated: { banned: true, description: 'Banned from guild shops' }
            }
        },

        thieves_guild: {
            id: 'thieves_guild',
            name: "Thieves' Guild",
            icon: '🗡️',
            description: 'A shadowy network of rogues, pickpockets, and information brokers.',
            headquarters: 'jade_harbor',
            rivals: ['merchants_guild', 'city_guard'],
            allies: ['smugglers'],
            benefits: {
                friendly: { fenceDiscount: 0.10, description: 'Better fence prices for stolen goods' },
                honored: { lockpicks: true, safePassage: true, description: 'Free lockpicks, safe passage in slums' },
                revered: { heistTips: true, ambushWarnings: true, description: 'Heist opportunities, bandit warnings' },
                exalted: { masterThief: true, shadowNetwork: true, description: 'Master thief training, shadow network access' }
            },
            penalties: {
                unfriendly: { pickpocketRisk: 0.10, description: '10% chance to be pickpocketed in cities' },
                hostile: { pickpocketRisk: 0.25, ambushRisk: true, description: '25% pickpocket risk, may be ambushed' },
                hated: { bounty: 100, assassinRisk: true, description: 'Bounty placed, assassins may target you' }
            }
        },

        noble_houses: {
            id: 'noble_houses',
            name: 'Noble Houses',
            icon: '🏰',
            description: 'The aristocratic families that rule the kingdom.',
            headquarters: 'royal_capital',
            rivals: ['peasant_union', 'thieves_guild'],
            allies: ['merchants_guild', 'city_guard', 'royal_court'],
            benefits: {
                friendly: { nobleAccess: true, description: 'Access to noble districts' },
                honored: { courtInvitations: true, titlePrefix: 'Esquire', description: 'Court invitations, minor title' },
                revered: { landGrants: true, titlePrefix: 'Sir/Dame', description: 'Land grants available, knighthood' },
                exalted: { royalAudience: true, titlePrefix: 'Lord/Lady', description: 'Royal audience, lordship title' }
            },
            penalties: {
                unfriendly: { nobleDistrictBan: true, description: 'Barred from noble districts' },
                hostile: { taxIncrease: 0.20, description: '20% additional taxes' },
                hated: { arrest: true, description: 'Arrest on sight in noble areas' }
            }
        },

        city_guard: {
            id: 'city_guard',
            name: 'City Guard',
            icon: '🛡️',
            description: 'The law enforcement of the realm.',
            headquarters: 'ironforge_city',
            rivals: ['thieves_guild', 'smugglers', 'bandits'],
            allies: ['merchants_guild', 'noble_houses'],
            benefits: {
                friendly: { fasterTravel: true, description: 'Guards help you travel faster' },
                honored: { escortService: true, bountyBoard: true, description: 'Guard escorts, bounty hunting jobs' },
                revered: { deputyStatus: true, jailFreeCard: true, description: 'Deputy status, one-time jail release' },
                exalted: { captainRank: true, guardCommand: true, description: 'Honorary captain, command guards' }
            },
            penalties: {
                unfriendly: { searchChance: 0.20, description: '20% chance to be searched at gates' },
                hostile: { fines: true, harassedByGuards: true, description: 'Random fines, guard harassment' },
                hated: { arrestOnSight: true, description: 'Wanted criminal - arrest on sight' }
            }
        },

        smugglers: {
            id: 'smugglers',
            name: 'Smugglers Ring',
            icon: '📦',
            description: 'Underground traders dealing in contraband and tax-free goods.',
            headquarters: 'jade_harbor',
            rivals: ['city_guard', 'merchants_guild'],
            allies: ['thieves_guild'],
            benefits: {
                friendly: { contrabandAccess: true, description: 'Access to contraband goods' },
                honored: { taxFree: true, secretRoutes: true, description: 'Tax-free trading, secret routes' },
                revered: { smugglerCaches: true, borderCrossing: true, description: 'Hidden caches, easy border crossing' },
                exalted: { smugglerKing: true, network: true, description: 'Run your own smuggling operation' }
            },
            penalties: {
                unfriendly: { overpriced: true, description: 'Contraband costs 50% more' },
                hostile: { noContraband: true, description: 'No access to contraband' },
                hated: { ratted: true, description: 'Guards informed of your activities' }
            }
        },

        mages_circle: {
            id: 'mages_circle',
            name: "Mages' Circle",
            icon: '🔮',
            description: 'The arcane practitioners who control magical knowledge.',
            headquarters: 'royal_capital',
            rivals: ['church_of_light'],
            allies: ['noble_houses'],
            benefits: {
                friendly: { enchantDiscount: 0.10, description: '10% off enchantments' },
                honored: { spellScrolls: true, magicIdentify: true, description: 'Spell scroll access, free item identification' },
                revered: { apprenticeStatus: true, enchantAccess: true, description: 'Mage apprenticeship, enchanting services' },
                exalted: { archmageAudience: true, artifacts: true, description: 'Archmage counsel, artifact access' }
            },
            penalties: {
                unfriendly: { noEnchants: true, description: 'No enchanting services' },
                hostile: { cursed: true, description: 'May be cursed when visiting mage towers' },
                hated: { magicBan: true, description: 'Banned from all magical services' }
            }
        },

        farmers_collective: {
            id: 'farmers_collective',
            name: 'Farmers Collective',
            icon: '🌾',
            description: 'The hardworking folk who feed the kingdom.',
            headquarters: 'greendale',
            rivals: ['noble_houses'],
            allies: ['merchants_guild'],
            benefits: {
                friendly: { foodDiscount: 0.10, description: '10% off food items' },
                honored: { harvestInfo: true, bulkFood: true, description: 'Harvest predictions, bulk food deals' },
                revered: { farmAccess: true, cropSharing: true, description: 'Farm worker access, crop sharing' },
                exalted: { landowner: true, farmNetwork: true, description: 'Farm ownership opportunities' }
            },
            penalties: {
                unfriendly: { foodMarkup: 0.15, description: '15% food price increase' },
                hostile: { foodShortage: true, description: 'May refuse to sell food' },
                hated: { farmBan: true, description: 'Banned from farming communities' }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════
    init() {
        console.log('🏛️ FactionSystem: Establishing allegiances...');

        // Initialize faction reputations
        for (const factionId of Object.keys(this.factions)) {
            if (this.playerFactionRep[factionId] === undefined) {
                this.playerFactionRep[factionId] = 0; // Start neutral
            }
        }

        this.setupEventListeners();
        this.injectStyles();

        console.log('🏛️ FactionSystem: Ready!');
    },

    setupEventListeners() {
        if (typeof EventBus !== 'undefined') {
            // Listen for trade events
            EventBus.on('trade-completed', (data) => this.onTradeCompleted(data));

            // Listen for quest completion
            EventBus.on('quest-completed', (data) => this.onQuestCompleted(data));

            // Listen for crime events
            EventBus.on('crime-committed', (data) => this.onCrimeCommitted(data));
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // REPUTATION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    getReputation(factionId) {
        return this.playerFactionRep[factionId] || 0;
    },

    getReputationLevel(factionId) {
        const rep = this.getReputation(factionId);

        for (const [levelId, level] of Object.entries(this.repLevels)) {
            if (rep >= level.min && rep < level.max) {
                return { id: levelId, ...level, currentRep: rep };
            }
        }

        return { id: 'neutral', ...this.repLevels.neutral, currentRep: rep };
    },

    modifyReputation(factionId, amount, reason = '') {
        const faction = this.factions[factionId];
        if (!faction) return;

        const oldRep = this.playerFactionRep[factionId] || 0;
        const oldLevel = this.getReputationLevel(factionId);

        this.playerFactionRep[factionId] = Math.max(-1000, Math.min(1500, oldRep + amount));

        const newLevel = this.getReputationLevel(factionId);

        // Announce change
        if (typeof addMessage === 'function') {
            const sign = amount >= 0 ? '+' : '';
            addMessage(`${faction.icon} ${faction.name}: ${sign}${amount} reputation${reason ? ' (' + reason + ')' : ''}`, amount >= 0 ? 'success' : 'warning');
        }

        // Check for level change
        if (oldLevel.id !== newLevel.id) {
            this.onReputationLevelChanged(factionId, oldLevel, newLevel);
        }

        // Apply rival/ally effects
        this.applyFactionRelationships(factionId, amount);

        // Fire event
        if (typeof EventBus !== 'undefined') {
            EventBus.emit('faction-rep-changed', {
                factionId,
                oldRep,
                newRep: this.playerFactionRep[factionId],
                amount,
                reason
            });
        }
    },

    applyFactionRelationships(factionId, amount) {
        const faction = this.factions[factionId];
        if (!faction) return;

        // Allies gain smaller amount
        if (faction.allies) {
            faction.allies.forEach(allyId => {
                if (this.factions[allyId]) {
                    const allyAmount = Math.floor(amount * 0.3);
                    if (allyAmount !== 0) {
                        this.playerFactionRep[allyId] = (this.playerFactionRep[allyId] || 0) + allyAmount;
                    }
                }
            });
        }

        // Rivals lose reputation
        if (faction.rivals) {
            faction.rivals.forEach(rivalId => {
                if (this.factions[rivalId]) {
                    const rivalAmount = Math.floor(-amount * 0.5);
                    if (rivalAmount !== 0) {
                        this.playerFactionRep[rivalId] = (this.playerFactionRep[rivalId] || 0) + rivalAmount;
                    }
                }
            });
        }
    },

    onReputationLevelChanged(factionId, oldLevel, newLevel) {
        const faction = this.factions[factionId];
        if (!faction) return;

        if (typeof addMessage === 'function') {
            if (newLevel.min > oldLevel.min) {
                addMessage(`🎉 Your standing with ${faction.name} has improved to ${newLevel.name}!`, 'success');
            } else {
                addMessage(`⚠️ Your standing with ${faction.name} has dropped to ${newLevel.name}.`, 'warning');
            }
        }

        // Unlock/remove benefits
        this.updateFactionBenefits(factionId);
    },

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════
    onTradeCompleted(data) {
        // Trading with faction merchants increases rep
        const location = data.location || game?.currentLocation?.id;
        if (!location) return;

        // Large trades = more rep
        const value = data.totalValue || 0;
        if (value > 100) {
            this.modifyReputation('merchants_guild', Math.floor(value / 100), 'successful trade');
        }
    },

    onQuestCompleted(data) {
        // Check if quest has faction rewards
        if (data.factionRewards) {
            for (const [factionId, amount] of Object.entries(data.factionRewards)) {
                this.modifyReputation(factionId, amount, 'quest completed');
            }
        }
    },

    onCrimeCommitted(data) {
        const crimeType = data.type;

        // Crimes affect factions
        switch (crimeType) {
            case 'theft':
                this.modifyReputation('city_guard', -20, 'theft');
                this.modifyReputation('thieves_guild', 5, 'theft');
                break;
            case 'assault':
                this.modifyReputation('city_guard', -50, 'assault');
                break;
            case 'smuggling':
                this.modifyReputation('city_guard', -30, 'smuggling');
                this.modifyReputation('smugglers', 10, 'smuggling');
                this.modifyReputation('merchants_guild', -15, 'smuggling');
                break;
            case 'murder':
                this.modifyReputation('city_guard', -100, 'murder');
                this.modifyReputation('noble_houses', -50, 'murder');
                break;
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // BENEFITS/PENALTIES API
    // ═══════════════════════════════════════════════════════════════
    getFactionBenefits(factionId) {
        const faction = this.factions[factionId];
        const level = this.getReputationLevel(factionId);
        if (!faction) return null;

        // Check if we have benefits at this level
        if (level.currentRep >= 50 && faction.benefits) {
            // Find highest benefit tier we qualify for
            const tiers = ['exalted', 'revered', 'honored', 'friendly'];
            for (const tier of tiers) {
                if (faction.benefits[tier] && level.currentRep >= this.repLevels[tier].min) {
                    return { tier, ...faction.benefits[tier] };
                }
            }
        }

        return null;
    },

    getFactionPenalties(factionId) {
        const faction = this.factions[factionId];
        const level = this.getReputationLevel(factionId);
        if (!faction) return null;

        // Check if we have penalties at this level
        if (level.currentRep < -50 && faction.penalties) {
            const tiers = ['hated', 'hostile', 'unfriendly'];
            for (const tier of tiers) {
                if (faction.penalties[tier] && level.currentRep < this.repLevels[tier].max) {
                    return { tier, ...faction.penalties[tier] };
                }
            }
        }

        return null;
    },

    getPriceModifier(factionId) {
        const benefits = this.getFactionBenefits(factionId);
        const penalties = this.getFactionPenalties(factionId);

        if (benefits?.priceDiscount) {
            return 1 - benefits.priceDiscount;
        }
        if (penalties?.priceIncrease) {
            return 1 + penalties.priceIncrease;
        }

        return 1.0;
    },

    isBannedFromFaction(factionId) {
        const penalties = this.getFactionPenalties(factionId);
        return penalties?.banned || penalties?.arrestOnSight || false;
    },

    updateFactionBenefits(factionId) {
        // This would update UI or game state based on new benefits
        // For now, just log
        const benefits = this.getFactionBenefits(factionId);
        const penalties = this.getFactionPenalties(factionId);

        if (benefits) {
            console.log(`🏛️ Active benefits from ${factionId}:`, benefits);
        }
        if (penalties) {
            console.log(`🏛️ Active penalties from ${factionId}:`, penalties);
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // UI
    // ═══════════════════════════════════════════════════════════════
    showFactionPanel() {
        const existing = document.getElementById('faction-panel-overlay');
        if (existing) {
            existing.remove();
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'faction-panel-overlay';
        overlay.className = 'faction-overlay';
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        let factionsHTML = '';
        for (const [factionId, faction] of Object.entries(this.factions)) {
            const level = this.getReputationLevel(factionId);
            const rep = this.getReputation(factionId);
            const benefits = this.getFactionBenefits(factionId);
            const penalties = this.getFactionPenalties(factionId);

            // Calculate progress to next level
            const nextLevel = this.getNextLevel(level.id);
            const progress = nextLevel ?
                ((rep - level.min) / (nextLevel.min - level.min)) * 100 : 100;

            factionsHTML += `
                <div class="faction-card">
                    <div class="faction-header">
                        <span class="faction-icon">${faction.icon}</span>
                        <span class="faction-name">${faction.name}</span>
                    </div>
                    <div class="faction-description">${faction.description}</div>
                    <div class="faction-standing">
                        <span class="standing-icon">${level.icon}</span>
                        <span class="standing-name" style="color: ${level.color}">${level.name}</span>
                        <span class="standing-rep">(${rep})</span>
                    </div>
                    <div class="faction-progress-bar">
                        <div class="faction-progress-fill" style="width: ${Math.max(0, Math.min(100, progress))}%; background: ${level.color}"></div>
                    </div>
                    ${benefits ? `<div class="faction-benefit">✅ ${benefits.description}</div>` : ''}
                    ${penalties ? `<div class="faction-penalty">⚠️ ${penalties.description}</div>` : ''}
                </div>
            `;
        }

        overlay.innerHTML = `
            <div class="faction-panel">
                <div class="faction-panel-header">
                    <h2>🏛️ Faction Standings</h2>
                    <button class="faction-close" onclick="this.closest('.faction-overlay').remove()">✕</button>
                </div>
                <div class="faction-list">
                    ${factionsHTML}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    },

    getNextLevel(currentLevelId) {
        const levels = Object.entries(this.repLevels);
        const currentIndex = levels.findIndex(([id]) => id === currentLevelId);
        if (currentIndex < levels.length - 1) {
            return { id: levels[currentIndex + 1][0], ...levels[currentIndex + 1][1] };
        }
        return null;
    },

    injectStyles() {
        if (document.getElementById('faction-styles')) return;

        const style = document.createElement('style');
        style.id = 'faction-styles';
        style.textContent = `
            .faction-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 700; /* Z-INDEX STANDARD: System modals */
            }
            .faction-panel {
                background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid rgba(79, 195, 247, 0.5);
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .faction-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid rgba(79, 195, 247, 0.3);
            }
            .faction-panel-header h2 {
                margin: 0;
                color: #4fc3f7;
            }
            .faction-close {
                background: rgba(244, 67, 54, 0.3);
                border: 1px solid #f44336;
                color: #f44336;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
            }
            .faction-list {
                padding: 15px;
                display: grid;
                gap: 15px;
            }
            .faction-card {
                background: rgba(40, 40, 70, 0.4);
                border: 1px solid rgba(79, 195, 247, 0.2);
                border-radius: 8px;
                padding: 15px;
            }
            .faction-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
            }
            .faction-icon {
                font-size: 24px;
            }
            .faction-name {
                color: #fff;
                font-weight: bold;
                font-size: 16px;
            }
            .faction-description {
                color: #888;
                font-size: 12px;
                margin-bottom: 10px;
            }
            .faction-standing {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            .standing-icon {
                font-size: 18px;
            }
            .standing-name {
                font-weight: bold;
            }
            .standing-rep {
                color: #666;
                font-size: 12px;
            }
            .faction-progress-bar {
                height: 6px;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            .faction-progress-fill {
                height: 100%;
                transition: width 0.3s ease;
            }
            .faction-benefit {
                color: #4caf50;
                font-size: 12px;
                margin-top: 5px;
            }
            .faction-penalty {
                color: #f44336;
                font-size: 12px;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);
    },

    // ═══════════════════════════════════════════════════════════════
    // SAVE/LOAD
    // ═══════════════════════════════════════════════════════════════
    getState() {
        return {
            playerFactionRep: { ...this.playerFactionRep }
        };
    },

    loadState(state) {
        if (state?.playerFactionRep) {
            this.playerFactionRep = { ...state.playerFactionRep };
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // DEBUG
    // ═══════════════════════════════════════════════════════════════
    setReputation(factionId, amount) {
        if (this.factions[factionId]) {
            this.playerFactionRep[factionId] = amount;
            return true;
        }
        return false;
    },

    listFactions() {
        return Object.keys(this.factions);
    }
};

// ═══════════════════════════════════════════════════════════════
// GLOBAL EXPOSURE
// ═══════════════════════════════════════════════════════════════
window.FactionSystem = FactionSystem;

// Initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FactionSystem.init());
} else {
    FactionSystem.init();
}

console.log('🏛️ FactionSystem loaded');
