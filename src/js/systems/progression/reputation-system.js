/**
 * ========================================
 * REPUTATION CONSEQUENCES SYSTEM - Medieval Trading Game
 * ========================================
 * Reputation now has real gameplay effects
 * ========================================
 */

const ReputationSystem = {
    // Reputation tiers with thresholds and effects
    tiers: {
        villain: {
            name: 'Villain',
            min: -1000,
            max: -500,
            color: '#8b0000',
            icon: '💀',
            effects: {
                priceModifier: 1.50,      // 50% markup
                questAccess: 'criminal',   // Only criminal quests
                guardHostility: true,      // Guards attack on sight
                npcTrust: 0.0,            // NPCs won't trust you
                bountyMultiplier: 2.0,    // Double bounties
                factionPenalty: -0.5,     // Harder to gain rep with factions
                specialAccess: ['thieves_guild', 'black_market']
            },
            triggers: [
                { event: 'enter_city', chance: 0.3, result: 'guard_attack' },
                { event: 'talk_npc', chance: 0.5, result: 'npc_flee' }
            ]
        },
        criminal: {
            name: 'Criminal',
            min: -499,
            max: -200,
            color: '#dc3545',
            icon: '⚠️',
            effects: {
                priceModifier: 1.30,
                questAccess: 'shady',
                guardHostility: false,
                npcTrust: 0.3,
                bountyMultiplier: 1.5,
                factionPenalty: -0.25,
                specialAccess: ['thieves_guild']
            },
            triggers: [
                { event: 'enter_city', chance: 0.1, result: 'guard_warning' },
                { event: 'talk_npc', chance: 0.3, result: 'npc_suspicious' }
            ]
        },
        suspicious: {
            name: 'Suspicious',
            min: -199,
            max: -50,
            color: '#fd7e14',
            icon: '👁️',
            effects: {
                priceModifier: 1.15,
                questAccess: 'limited',
                guardHostility: false,
                npcTrust: 0.5,
                bountyMultiplier: 1.2,
                factionPenalty: -0.1,
                specialAccess: []
            },
            triggers: [
                { event: 'talk_npc', chance: 0.2, result: 'npc_wary' }
            ]
        },
        unknown: {
            name: 'Unknown',
            min: -49,
            max: 49,
            color: '#6c757d',
            icon: '❓',
            effects: {
                priceModifier: 1.0,
                questAccess: 'basic',
                guardHostility: false,
                npcTrust: 0.7,
                bountyMultiplier: 1.0,
                factionPenalty: 0,
                specialAccess: []
            },
            triggers: []
        },
        known: {
            name: 'Known',
            min: 50,
            max: 199,
            color: '#17a2b8',
            icon: '👋',
            effects: {
                priceModifier: 0.95,
                questAccess: 'standard',
                guardHostility: false,
                npcTrust: 0.85,
                bountyMultiplier: 0.9,
                factionPenalty: 0,
                specialAccess: []
            },
            triggers: [
                { event: 'enter_city', chance: 0.2, result: 'friendly_greeting' }
            ]
        },
        respected: {
            name: 'Respected',
            min: 200,
            max: 499,
            color: '#28a745',
            icon: '🌟',
            effects: {
                priceModifier: 0.90,
                questAccess: 'advanced',
                guardHostility: false,
                npcTrust: 0.95,
                bountyMultiplier: 0.7,
                factionPenalty: 0,
                factionBonus: 0.1,
                specialAccess: ['merchants_guild']
            },
            triggers: [
                { event: 'enter_city', chance: 0.3, result: 'warm_welcome' },
                { event: 'talk_npc', chance: 0.2, result: 'npc_helpful' }
            ]
        },
        famous: {
            name: 'Famous',
            min: 500,
            max: 999,
            color: '#ffd700',
            icon: '⭐',
            effects: {
                priceModifier: 0.85,
                questAccess: 'elite',
                guardHostility: false,
                npcTrust: 1.0,
                bountyMultiplier: 0.5,
                factionPenalty: 0,
                factionBonus: 0.2,
                specialAccess: ['merchants_guild', 'noble_court']
            },
            triggers: [
                { event: 'enter_city', chance: 0.5, result: 'crowd_gathers' },
                { event: 'talk_npc', chance: 0.3, result: 'npc_excited' }
            ]
        },
        legendary: {
            name: 'Legendary',
            min: 1000,
            max: Infinity,
            color: '#9b59b6',
            icon: '👑',
            effects: {
                priceModifier: 0.75,
                questAccess: 'legendary',
                guardHostility: false,
                npcTrust: 1.0,
                bountyMultiplier: 0.25,
                factionPenalty: 0,
                factionBonus: 0.5,
                specialAccess: ['merchants_guild', 'noble_court', 'royal_audience']
            },
            triggers: [
                { event: 'enter_city', chance: 0.7, result: 'fanfare' },
                { event: 'talk_npc', chance: 0.5, result: 'npc_honored' }
            ]
        }
    },

    // Reputation actions and their effects
    actions: {
        // Positive actions
        complete_quest: { base: 15, description: 'Completed a quest' },
        help_npc: { base: 5, description: 'Helped an NPC' },
        donate_gold: { base: 1, description: 'Donated gold to charity', perGold: 0.1 },
        defeat_bandit: { base: 10, description: 'Defeated bandits' },
        save_merchant: { base: 25, description: 'Saved a merchant from danger' },
        fair_trade: { base: 2, description: 'Made a fair trade' },
        discover_location: { base: 5, description: 'Discovered a new location' },
        win_tournament: { base: 50, description: 'Won a tournament' },

        // Negative actions
        steal: { base: -20, description: 'Caught stealing' },
        murder: { base: -100, description: 'Committed murder' },
        assault: { base: -30, description: 'Assaulted someone' },
        cheat_trade: { base: -15, description: 'Cheated in a trade' },
        break_contract: { base: -25, description: 'Broke a contract' },
        trespass: { base: -10, description: 'Trespassed on private property' },
        vandalism: { base: -15, description: 'Vandalized property' },
        smuggling: { base: -20, description: 'Caught smuggling' },
        bribery: { base: -10, description: 'Attempted bribery' },
        fail_quest: { base: -10, description: 'Failed a quest' }
    },

    // Current reputation value
    reputation: 0,

    // Reputation history
    history: [],

    // Per-location reputation modifiers
    locationReputation: {},

    // Bounty system
    bounty: 0,
    activeBounties: [],

    // Initialize the system
    init() {
        this.loadReputation();
        this.createStyles();
        this.setupEventListeners();

        console.log('🏆 ReputationSystem initialized');
    },

    // Load reputation from game state
    loadReputation() {
        if (typeof game !== 'undefined' && game.player) {
            this.reputation = game.player.reputation || 0;
            this.bounty = game.player.bounty || 0;
            this.history = game.player.reputationHistory || [];
            this.locationReputation = game.player.locationReputation || {};
        }
    },

    // Save reputation to game state
    saveReputation() {
        if (typeof game !== 'undefined' && game.player) {
            game.player.reputation = this.reputation;
            game.player.bounty = this.bounty;
            game.player.reputationHistory = this.history;
            game.player.locationReputation = this.locationReputation;
        }
    },

    // Setup event listeners
    setupEventListeners() {
        if (typeof EventBus !== 'undefined') {
            // Listen for various game events
            EventBus.on('quest:completed', (data) => {
                this.modifyReputation('complete_quest', data.questDifficulty || 1);
            });

            EventBus.on('quest:failed', () => {
                this.modifyReputation('fail_quest');
            });

            EventBus.on('combat:victory', (data) => {
                if (data.enemyType === 'bandit') {
                    this.modifyReputation('defeat_bandit');
                }
            });

            EventBus.on('location:discovered', () => {
                this.modifyReputation('discover_location');
            });

            EventBus.on('location:entered', (data) => {
                this.checkLocationTriggers(data.locationId);
            });

            EventBus.on('npc:interacted', (data) => {
                this.checkNPCTriggers(data.npcId);
            });
        }
    },

    // Get current reputation tier
    getCurrentTier() {
        for (const [tierId, tier] of Object.entries(this.tiers)) {
            if (this.reputation >= tier.min && this.reputation <= tier.max) {
                return { id: tierId, ...tier };
            }
        }
        return { id: 'unknown', ...this.tiers.unknown };
    },

    // Modify reputation
    modifyReputation(actionId, multiplier = 1, locationId = null) {
        const action = this.actions[actionId];
        if (!action) {
            console.warn(`Unknown reputation action: ${actionId}`);
            return;
        }

        const previousTier = this.getCurrentTier();
        const baseChange = action.base * multiplier;

        // Apply faction bonuses/penalties
        const effects = this.getCurrentTier().effects;
        let finalChange = baseChange;
        if (baseChange > 0 && effects.factionBonus) {
            finalChange *= (1 + effects.factionBonus);
        }
        if (baseChange < 0 && effects.factionPenalty) {
            finalChange *= (1 + Math.abs(effects.factionPenalty));
        }

        finalChange = Math.round(finalChange);
        this.reputation += finalChange;

        // Update location-specific reputation
        if (locationId) {
            this.locationReputation[locationId] = (this.locationReputation[locationId] || 0) + finalChange;
        }

        // Add to history
        this.history.push({
            action: actionId,
            description: action.description,
            change: finalChange,
            newTotal: this.reputation,
            timestamp: Date.now(),
            location: locationId
        });

        // Keep history limited
        if (this.history.length > 100) {
            this.history = this.history.slice(-100);
        }

        this.saveReputation();

        // Check for tier change
        const newTier = this.getCurrentTier();
        if (previousTier.id !== newTier.id) {
            this.onTierChanged(previousTier, newTier);
        }

        // Emit event
        if (typeof EventBus !== 'undefined') {
            EventBus.emit('reputation:changed', {
                action: actionId,
                change: finalChange,
                newTotal: this.reputation,
                tier: newTier.id
            });
        }

        // Show notification
        this.showReputationChange(finalChange, action.description);

        return finalChange;
    },

    // Handle tier change
    onTierChanged(previousTier, newTier) {
        const isPromotion = newTier.min > previousTier.min;

        // Show tier change notification
        this.showTierChangeNotification(previousTier, newTier, isPromotion);

        // Emit tier change event
        if (typeof EventBus !== 'undefined') {
            EventBus.emit('reputation:tierChanged', {
                previousTier: previousTier.id,
                newTier: newTier.id,
                isPromotion
            });
        }

        // Apply tier-specific unlocks
        if (newTier.effects.specialAccess) {
            newTier.effects.specialAccess.forEach(access => {
                if (typeof EventBus !== 'undefined') {
                    EventBus.emit('reputation:accessUnlocked', { access });
                }
            });
        }
    },

    // Get price modifier based on reputation
    getPriceModifier(locationId = null) {
        let modifier = this.getCurrentTier().effects.priceModifier;

        // Apply location-specific modifier
        if (locationId && this.locationReputation[locationId]) {
            const localRep = this.locationReputation[locationId];
            if (localRep > 100) modifier *= 0.95;
            else if (localRep > 250) modifier *= 0.90;
            else if (localRep < -100) modifier *= 1.10;
            else if (localRep < -250) modifier *= 1.20;
        }

        return modifier;
    },

    // Check if player can access certain content
    canAccess(accessType) {
        const tier = this.getCurrentTier();
        return tier.effects.specialAccess?.includes(accessType) || false;
    },

    // Get NPC trust level
    getNPCTrust() {
        return this.getCurrentTier().effects.npcTrust;
    },

    // Check if guards are hostile
    areGuardsHostile() {
        return this.getCurrentTier().effects.guardHostility;
    },

    // Add bounty
    addBounty(amount, reason) {
        const multiplier = this.getCurrentTier().effects.bountyMultiplier;
        const finalBounty = Math.round(amount * multiplier);

        this.bounty += finalBounty;
        this.activeBounties.push({
            amount: finalBounty,
            reason,
            timestamp: Date.now()
        });

        this.saveReputation();

        // Emit event
        if (typeof EventBus !== 'undefined') {
            EventBus.emit('bounty:added', {
                amount: finalBounty,
                total: this.bounty,
                reason
            });
        }

        this.showNotification(`Bounty added: ${finalBounty} gold - ${reason}`, 'warning');
    },

    // Pay off bounty
    payBounty(amount) {
        if (typeof game !== 'undefined' && game.player) {
            if (game.player.gold < amount) {
                this.showNotification("Not enough gold to pay bounty!", 'error');
                return false;
            }

            game.player.gold -= amount;
            this.bounty = Math.max(0, this.bounty - amount);
            this.saveReputation();

            this.showNotification(`Paid ${amount} gold toward bounty`, 'success');
            return true;
        }
        return false;
    },

    // Check location triggers
    checkLocationTriggers(locationId) {
        const tier = this.getCurrentTier();

        for (const trigger of tier.triggers || []) {
            if (trigger.event === 'enter_city' && Math.random() < trigger.chance) {
                this.executeTrigger(trigger.result, locationId);
            }
        }
    },

    // Check NPC interaction triggers
    checkNPCTriggers(npcId) {
        const tier = this.getCurrentTier();

        for (const trigger of tier.triggers || []) {
            if (trigger.event === 'talk_npc' && Math.random() < trigger.chance) {
                this.executeTrigger(trigger.result, null, npcId);
            }
        }
    },

    // Execute a trigger effect
    executeTrigger(result, locationId = null, npcId = null) {
        const triggerEffects = {
            guard_attack: () => {
                this.showNotification("Guards! That's the criminal!", 'danger');
                if (typeof CombatSystem !== 'undefined') {
                    CombatSystem.startCombat({ enemyId: 'city_guard', reason: 'bounty' });
                }
            },
            guard_warning: () => {
                this.showNotification("Guard: 'We're watching you, criminal...'", 'warning');
            },
            npc_flee: () => {
                this.showNotification("The NPC runs away in fear!", 'warning');
            },
            npc_suspicious: () => {
                this.showNotification("The NPC eyes you suspiciously...", 'info');
            },
            npc_wary: () => {
                this.showNotification("The NPC seems hesitant to talk to you.", 'info');
            },
            friendly_greeting: () => {
                this.showNotification("'Welcome back, friend!'", 'success');
            },
            warm_welcome: () => {
                this.showNotification("'It's an honor to have you here!'", 'success');
            },
            npc_helpful: () => {
                this.showNotification("The NPC offers to help you.", 'success');
            },
            crowd_gathers: () => {
                this.showNotification("A crowd gathers to see the famous traveler!", 'success');
            },
            npc_excited: () => {
                this.showNotification("'I can't believe it's really you!'", 'success');
            },
            fanfare: () => {
                this.showNotification("Trumpets sound! The legendary hero arrives!", 'success');
            },
            npc_honored: () => {
                this.showNotification("'It would be my greatest honor to assist you!'", 'success');
            }
        };

        const effect = triggerEffects[result];
        if (effect) effect();
    },

    // Show reputation change notification
    showReputationChange(change, description) {
        const isPositive = change > 0;
        const message = `${isPositive ? '+' : ''}${change} Reputation: ${description}`;
        this.showNotification(message, isPositive ? 'success' : 'danger');
    },

    // Show tier change notification
    showTierChangeNotification(previousTier, newTier, isPromotion) {
        const message = isPromotion
            ? `Reputation Increased! You are now ${newTier.icon} ${newTier.name}`
            : `Reputation Decreased! You are now ${newTier.icon} ${newTier.name}`;

        this.showNotification(message, isPromotion ? 'success' : 'danger', 5000);
    },

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show(message, type);
        } else {
            // Fallback notification
            const colors = {
                success: '#28a745',
                danger: '#dc3545',
                warning: '#ffc107',
                info: '#17a2b8'
            };

            const notification = document.createElement('div');
            notification.className = 'reputation-notification';
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 12px 20px;
                background: ${colors[type] || colors.info};
                color: ${type === 'warning' ? '#000' : '#fff'};
                border-radius: 8px;
                z-index: 850; /* Z-INDEX STANDARD: Notifications (reputation) */
                animation: repSlideIn 0.3s ease;
                font-family: 'Crimson Text', serif;
                max-width: 300px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'repSlideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    },

    // Show reputation panel UI
    show() {
        const existingPanel = document.getElementById('reputation-panel');
        if (existingPanel) existingPanel.remove();

        const tier = this.getCurrentTier();

        const panel = document.createElement('div');
        panel.id = 'reputation-panel';
        panel.className = 'reputation-panel';

        panel.innerHTML = `
            <div class="rep-panel-header">
                <h2>🏆 Reputation</h2>
                <button class="rep-panel-close" onclick="ReputationSystem.hide()">×</button>
            </div>
            <div class="rep-panel-content">
                <div class="rep-current-tier" style="border-color: ${tier.color}">
                    <span class="tier-icon">${tier.icon}</span>
                    <div class="tier-info">
                        <span class="tier-name" style="color: ${tier.color}">${tier.name}</span>
                        <span class="tier-value">${this.reputation} reputation</span>
                    </div>
                </div>

                ${this.bounty > 0 ? `
                    <div class="rep-bounty">
                        <span class="bounty-icon">💰</span>
                        <span class="bounty-amount">${this.bounty} gold bounty</span>
                        <button class="pay-bounty-btn" onclick="ReputationSystem.showPayBountyDialog()">Pay</button>
                    </div>
                ` : ''}

                <div class="rep-effects">
                    <h3>Current Effects</h3>
                    <div class="effect-list">
                        <div class="effect-item">
                            <span class="effect-label">Prices:</span>
                            <span class="effect-value ${tier.effects.priceModifier > 1 ? 'negative' : 'positive'}">
                                ${tier.effects.priceModifier > 1 ? '+' : ''}${Math.round((tier.effects.priceModifier - 1) * 100)}%
                            </span>
                        </div>
                        <div class="effect-item">
                            <span class="effect-label">NPC Trust:</span>
                            <span class="effect-value">${Math.round(tier.effects.npcTrust * 100)}%</span>
                        </div>
                        <div class="effect-item">
                            <span class="effect-label">Quest Access:</span>
                            <span class="effect-value">${tier.effects.questAccess}</span>
                        </div>
                        ${tier.effects.guardHostility ? `
                            <div class="effect-item negative">
                                <span class="effect-label">⚠️ Guards Hostile!</span>
                            </div>
                        ` : ''}
                        ${tier.effects.specialAccess?.length > 0 ? `
                            <div class="effect-item positive">
                                <span class="effect-label">Special Access:</span>
                                <span class="effect-value">${tier.effects.specialAccess.join(', ')}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="rep-tiers">
                    <h3>Reputation Tiers</h3>
                    <div class="tier-progress">
                        ${Object.entries(this.tiers).map(([id, t]) => `
                            <div class="tier-marker ${id === tier.id ? 'current' : ''}"
                                 style="--tier-color: ${t.color}">
                                <span class="tier-icon-small">${t.icon}</span>
                                <span class="tier-name-small">${t.name}</span>
                                <span class="tier-range">${t.min === -1000 ? '<-500' : t.max === Infinity ? '1000+' : `${t.min} to ${t.max}`}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="rep-history">
                    <h3>Recent History</h3>
                    <div class="history-list">
                        ${this.history.slice(-10).reverse().map(entry => `
                            <div class="history-item ${entry.change > 0 ? 'positive' : 'negative'}">
                                <span class="history-change">${entry.change > 0 ? '+' : ''}${entry.change}</span>
                                <span class="history-desc">${entry.description}</span>
                            </div>
                        `).join('') || '<p class="no-history">No reputation changes yet.</p>'}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        requestAnimationFrame(() => {
            panel.classList.add('visible');
        });
    },

    // Hide reputation panel
    hide() {
        const panel = document.getElementById('reputation-panel');
        if (panel) {
            panel.classList.remove('visible');
            setTimeout(() => panel.remove(), 300);
        }
    },

    // Show pay bounty dialog
    showPayBountyDialog() {
        const currentGold = typeof game !== 'undefined' ? game.player?.gold || 0 : 0;

        const dialog = document.createElement('div');
        dialog.className = 'bounty-dialog';
        dialog.innerHTML = `
            <div class="bounty-dialog-content">
                <h3>💰 Pay Bounty</h3>
                <p>Current bounty: ${this.bounty} gold</p>
                <p>Your gold: ${currentGold}</p>
                <input type="number" id="bounty-amount" value="${Math.min(this.bounty, currentGold)}"
                       min="0" max="${Math.min(this.bounty, currentGold)}">
                <div class="bounty-buttons">
                    <button onclick="ReputationSystem.payBounty(parseInt(document.getElementById('bounty-amount').value)); this.parentElement.parentElement.parentElement.remove();">Pay</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove();">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    },

    // Create CSS styles
    createStyles() {
        if (document.getElementById('reputation-styles')) return;

        const style = document.createElement('style');
        style.id = 'reputation-styles';
        style.textContent = `
            @keyframes repSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes repSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }

            .reputation-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                background: linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%);
                border: 2px solid #ffd700;
                border-radius: 12px;
                z-index: 600; /* Z-INDEX STANDARD: Panel overlays (reputation) */
                opacity: 0;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
            }

            .reputation-panel.visible {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            .rep-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: rgba(255, 215, 0, 0.1);
                border-bottom: 1px solid #ffd700;
            }

            .rep-panel-header h2 {
                margin: 0;
                color: #ffd700;
                font-family: 'Cinzel', serif;
            }

            .rep-panel-close {
                background: none;
                border: none;
                color: #888;
                font-size: 24px;
                cursor: pointer;
            }

            .rep-panel-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .rep-current-tier {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                border-left: 4px solid;
                margin-bottom: 15px;
            }

            .tier-icon {
                font-size: 2.5em;
            }

            .tier-info {
                display: flex;
                flex-direction: column;
            }

            .tier-name {
                font-family: 'Cinzel', serif;
                font-size: 1.3em;
            }

            .tier-value {
                color: #888;
            }

            .rep-bounty {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 15px;
                background: rgba(220, 53, 69, 0.2);
                border: 1px solid #dc3545;
                border-radius: 8px;
                margin-bottom: 15px;
            }

            .bounty-icon {
                font-size: 1.5em;
            }

            .bounty-amount {
                color: #dc3545;
                flex: 1;
            }

            .pay-bounty-btn {
                background: #28a745;
                border: none;
                color: white;
                padding: 5px 15px;
                border-radius: 4px;
                cursor: pointer;
            }

            .rep-effects, .rep-tiers, .rep-history {
                margin-bottom: 20px;
            }

            .rep-effects h3, .rep-tiers h3, .rep-history h3 {
                color: #ffd700;
                font-family: 'Cinzel', serif;
                margin-bottom: 10px;
                font-size: 1em;
            }

            .effect-list {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 10px;
            }

            .effect-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid #2a2a3e;
            }

            .effect-item:last-child {
                border-bottom: none;
            }

            .effect-label {
                color: #888;
            }

            .effect-value {
                color: #ccc;
            }

            .effect-value.positive {
                color: #28a745;
            }

            .effect-value.negative {
                color: #dc3545;
            }

            .tier-progress {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .tier-marker {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 8px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                border: 2px solid transparent;
                min-width: 80px;
            }

            .tier-marker.current {
                border-color: var(--tier-color);
                background: rgba(255, 255, 255, 0.05);
            }

            .tier-icon-small {
                font-size: 1.2em;
            }

            .tier-name-small {
                color: var(--tier-color);
                font-size: 0.8em;
            }

            .tier-range {
                color: #666;
                font-size: 0.7em;
            }

            .history-list {
                max-height: 150px;
                overflow-y: auto;
            }

            .history-item {
                display: flex;
                gap: 10px;
                padding: 8px;
                border-bottom: 1px solid #2a2a3e;
            }

            .history-change {
                min-width: 50px;
                font-weight: bold;
            }

            .history-item.positive .history-change {
                color: #28a745;
            }

            .history-item.negative .history-change {
                color: #dc3545;
            }

            .history-desc {
                color: #888;
            }

            .no-history {
                color: #666;
                text-align: center;
                padding: 20px;
            }

            .bounty-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 700; /* Z-INDEX STANDARD: System modals (bounty) */
            }

            .bounty-dialog-content {
                background: #1a1a2e;
                padding: 20px;
                border-radius: 12px;
                border: 2px solid #ffd700;
                text-align: center;
            }

            .bounty-dialog-content input {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                background: #0d0d1a;
                border: 1px solid #4a4a6a;
                border-radius: 4px;
                color: #fff;
            }

            .bounty-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }

            .bounty-buttons button {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .bounty-buttons button:first-child {
                background: #28a745;
                color: white;
            }

            .bounty-buttons button:last-child {
                background: #6c757d;
                color: white;
            }
        `;
        document.head.appendChild(style);
    },

    // Save state
    getSaveData() {
        return {
            reputation: this.reputation,
            bounty: this.bounty,
            history: this.history,
            locationReputation: this.locationReputation,
            activeBounties: this.activeBounties
        };
    },

    // Load state
    loadSaveData(data) {
        if (data) {
            this.reputation = data.reputation || 0;
            this.bounty = data.bounty || 0;
            this.history = data.history || [];
            this.locationReputation = data.locationReputation || {};
            this.activeBounties = data.activeBounties || [];
            this.saveReputation();
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ReputationSystem.init());
} else {
    ReputationSystem.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReputationSystem;
}
