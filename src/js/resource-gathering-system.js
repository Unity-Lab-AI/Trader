// ═══════════════════════════════════════════════════════════════
// ⛏️ RESOURCE GATHERING SYSTEM
// ═══════════════════════════════════════════════════════════════
// Handles time-based resource gathering at mines, forests, etc.
// Requires appropriate tools for gathering

const ResourceGatheringSystem = {
    // Currently active gathering session
    activeGathering: null,

    // Tool requirements for different resource types
    TOOL_REQUIREMENTS: {
        // Mining resources
        iron_ore: { tool: 'pickaxe', skill: 'mining', minLevel: 0 },
        coal: { tool: 'pickaxe', skill: 'mining', minLevel: 0 },
        stone: { tool: 'pickaxe', skill: 'mining', minLevel: 0 },
        copper_ore: { tool: 'pickaxe', skill: 'mining', minLevel: 1 },
        silver_ore: { tool: 'pickaxe', skill: 'mining', minLevel: 2 },
        gold_ore: { tool: 'pickaxe', skill: 'mining', minLevel: 3 },
        gems: { tool: 'pickaxe', skill: 'mining', minLevel: 4 },
        rare_minerals: { tool: 'pickaxe', skill: 'mining', minLevel: 3 },
        crystals: { tool: 'pickaxe', skill: 'mining', minLevel: 4 },

        // Forestry resources
        wood: { tool: 'axe', skill: 'forestry', minLevel: 0 },
        planks: { tool: 'axe', skill: 'forestry', minLevel: 1 },
        rare_wood: { tool: 'axe', skill: 'forestry', minLevel: 2 },

        // Herbalism resources
        herbs: { tool: 'sickle', skill: 'herbalism', minLevel: 0 },
        medicinal_plants: { tool: 'sickle', skill: 'herbalism', minLevel: 1 },
        rare_herbs: { tool: 'sickle', skill: 'herbalism', minLevel: 2 },
        mushrooms: { tool: 'knife', skill: 'herbalism', minLevel: 1 },

        // Fishing resources
        fish: { tool: 'fishing_rod', skill: 'fishing', minLevel: 0 },
        exotic_fish: { tool: 'fishing_rod', skill: 'fishing', minLevel: 2 },
        river_pearls: { tool: 'fishing_rod', skill: 'fishing', minLevel: 3 },

        // No tool required (can be picked up)
        food: { tool: null, skill: null, minLevel: 0 },
        water: { tool: null, skill: null, minLevel: 0 }
    },

    // Tools and their properties
    TOOLS: {
        pickaxe: {
            id: 'pickaxe',
            name: 'Pickaxe',
            description: 'Used for mining ore and stone',
            durability: 100,
            efficiency: 1.0,
            price: 25
        },
        iron_pickaxe: {
            id: 'iron_pickaxe',
            name: 'Iron Pickaxe',
            description: 'Durable pickaxe for efficient mining',
            durability: 200,
            efficiency: 1.5,
            price: 75
        },
        steel_pickaxe: {
            id: 'steel_pickaxe',
            name: 'Steel Pickaxe',
            description: 'High-quality pickaxe for professional miners',
            durability: 400,
            efficiency: 2.0,
            price: 200
        },
        axe: {
            id: 'axe',
            name: 'Axe',
            description: 'Used for chopping wood',
            durability: 100,
            efficiency: 1.0,
            price: 20
        },
        iron_axe: {
            id: 'iron_axe',
            name: 'Iron Axe',
            description: 'Durable axe for efficient woodcutting',
            durability: 200,
            efficiency: 1.5,
            price: 60
        },
        steel_axe: {
            id: 'steel_axe',
            name: 'Steel Axe',
            description: 'High-quality axe for professional lumberjacks',
            durability: 400,
            efficiency: 2.0,
            price: 180
        },
        sickle: {
            id: 'sickle',
            name: 'Sickle',
            description: 'Used for harvesting herbs and plants',
            durability: 80,
            efficiency: 1.0,
            price: 15
        },
        silver_sickle: {
            id: 'silver_sickle',
            name: 'Silver Sickle',
            description: 'Enchanted sickle for harvesting rare herbs',
            durability: 150,
            efficiency: 1.8,
            price: 120
        },
        knife: {
            id: 'knife',
            name: 'Gathering Knife',
            description: 'Multipurpose knife for gathering',
            durability: 60,
            efficiency: 1.0,
            price: 10
        },
        fishing_rod: {
            id: 'fishing_rod',
            name: 'Fishing Rod',
            description: 'Basic fishing equipment',
            durability: 50,
            efficiency: 1.0,
            price: 15
        },
        quality_fishing_rod: {
            id: 'quality_fishing_rod',
            name: 'Quality Fishing Rod',
            description: 'Well-crafted rod for better catches',
            durability: 120,
            efficiency: 1.6,
            price: 80
        }
    },

    // Location types that support gathering vs trading
    LOCATION_MODES: {
        // NPC trading locations - buy/sell only
        city: 'trade',
        town: 'trade',
        village: 'trade',
        trading_post: 'trade',
        inn: 'trade',
        tavern: 'trade',

        // Gathering locations - player gathers with tools
        mine: 'gather',
        forest: 'gather',
        herb: 'gather',
        fishing: 'gather',
        cave: 'gather',
        ruins: 'gather',

        // Mixed locations
        farm: 'both',  // Can buy or work for resources
        quarry: 'both'
    },

    // Initialize the system
    init() {
        console.log('⛏️ ResourceGatheringSystem: Initializing...');

        // Ensure player has tools tracking
        this.initPlayerTools();

        // Setup gathering UI
        this.setupGatheringUI();

        console.log('⛏️ ResourceGatheringSystem: Ready');
    },

    // Initialize player tools tracking
    initPlayerTools() {
        if (typeof game !== 'undefined' && game.player) {
            game.player.tools = game.player.tools || {};
            game.player.equippedTool = game.player.equippedTool || null;
            game.player.skills = game.player.skills || {
                mining: 0,
                forestry: 0,
                herbalism: 0,
                fishing: 0
            };
        }
    },

    // Check if player has required tool for a resource
    hasRequiredTool(resourceId) {
        const requirement = this.TOOL_REQUIREMENTS[resourceId];
        if (!requirement || !requirement.tool) {
            return { hasTool: true, tool: null }; // No tool required
        }

        if (typeof game === 'undefined' || !game.player) {
            return { hasTool: false, reason: 'Player data not available' };
        }

        // Check if player owns any version of the required tool
        const toolType = requirement.tool;
        const playerTools = game.player.tools || {};

        // Check for exact tool or upgraded versions
        const matchingTools = Object.keys(this.TOOLS).filter(toolId => {
            const tool = this.TOOLS[toolId];
            return toolId === toolType ||
                   toolId.includes(toolType) ||
                   tool.id === toolType;
        });

        const ownedTool = matchingTools.find(t => playerTools[t] && playerTools[t].durability > 0);

        if (!ownedTool) {
            return {
                hasTool: false,
                reason: `You need a ${this.TOOLS[toolType]?.name || toolType} to gather this resource.`,
                requiredTool: toolType
            };
        }

        return { hasTool: true, tool: ownedTool, toolInfo: this.TOOLS[ownedTool] };
    },

    // Check skill level requirement
    hasRequiredSkill(resourceId) {
        const requirement = this.TOOL_REQUIREMENTS[resourceId];
        if (!requirement || requirement.minLevel === 0) {
            return { hasSkill: true };
        }

        if (typeof game === 'undefined' || !game.player || !game.player.skills) {
            return { hasSkill: true }; // Can't check, allow
        }

        const playerSkillLevel = game.player.skills[requirement.skill] || 0;

        if (playerSkillLevel < requirement.minLevel) {
            return {
                hasSkill: false,
                reason: `Your ${requirement.skill} skill (${playerSkillLevel}) is too low. Requires level ${requirement.minLevel}.`,
                requiredLevel: requirement.minLevel,
                currentLevel: playerSkillLevel
            };
        }

        return { hasSkill: true };
    },

    // Start gathering at a location
    startGathering(locationId, resourceId) {
        // Check if already gathering
        if (this.activeGathering) {
            addMessage('You are already gathering resources!', 'warning');
            return false;
        }

        // Find the location
        const location = this.findLocation(locationId);
        if (!location) {
            addMessage('Invalid gathering location!', 'error');
            return false;
        }

        // Check if location supports this resource
        const resources = location.resources || [];
        if (!resources.includes(resourceId)) {
            addMessage(`This location doesn't have ${resourceId}!`, 'error');
            return false;
        }

        // Check tool requirement
        const toolCheck = this.hasRequiredTool(resourceId);
        if (!toolCheck.hasTool) {
            addMessage(toolCheck.reason, 'error');
            return false;
        }

        // Check skill requirement
        const skillCheck = this.hasRequiredSkill(resourceId);
        if (!skillCheck.hasSkill) {
            addMessage(skillCheck.reason, 'error');
            return false;
        }

        // Calculate gathering time (base: 15-30 minutes game time)
        const baseTime = 15 + Math.random() * 15;
        const toolEfficiency = toolCheck.toolInfo?.efficiency || 1.0;
        const gatheringTime = Math.round(baseTime / toolEfficiency);

        // Start gathering session
        this.activeGathering = {
            locationId: locationId,
            resourceId: resourceId,
            tool: toolCheck.tool,
            startTime: TimeSystem.getTotalMinutes(),
            duration: gatheringTime,
            abundance: location.abundance?.[resourceId] || 0.5
        };

        // Auto-start time if paused
        if (TimeSystem.isPaused || TimeSystem.currentSpeed === 'PAUSED') {
            TimeSystem.setSpeed('NORMAL');
            if (typeof GameEngine !== 'undefined' && !GameEngine.isRunning) {
                GameEngine.start();
            }
        }

        addMessage(`⛏️ Started gathering ${resourceId}... Estimated time: ${gatheringTime} minutes.`, 'info');

        // Show gathering progress UI
        this.showGatheringProgress();

        return true;
    },

    // Update gathering progress (called from game loop)
    update() {
        if (!this.activeGathering) return;

        const currentTime = TimeSystem.getTotalMinutes();
        const elapsed = currentTime - this.activeGathering.startTime;
        const progress = elapsed / this.activeGathering.duration;

        // Update progress UI
        this.updateGatheringProgress(progress);

        // Check if complete
        if (progress >= 1.0) {
            this.completeGathering();
        }
    },

    // Complete gathering and give resources
    completeGathering() {
        if (!this.activeGathering) return;

        const { resourceId, abundance, tool } = this.activeGathering;

        // Calculate yield based on abundance and luck
        const baseYield = Math.floor(1 + abundance * 3);
        const bonusYield = Math.random() < abundance ? 1 : 0;
        const totalYield = baseYield + bonusYield;

        // Add resources to inventory
        if (typeof game !== 'undefined' && game.player && game.player.inventory) {
            const existingItem = game.player.inventory.find(i => i.id === resourceId);
            if (existingItem) {
                existingItem.quantity += totalYield;
            } else {
                game.player.inventory.push({
                    id: resourceId,
                    name: this.getResourceName(resourceId),
                    quantity: totalYield,
                    type: 'resource'
                });
            }
        }

        // Reduce tool durability
        if (tool && game.player.tools[tool]) {
            game.player.tools[tool].durability -= 5;
            if (game.player.tools[tool].durability <= 0) {
                addMessage(`⚠️ Your ${this.TOOLS[tool]?.name || tool} has broken!`, 'warning');
                delete game.player.tools[tool];
            }
        }

        // Grant skill experience
        const requirement = this.TOOL_REQUIREMENTS[resourceId];
        if (requirement?.skill && game.player.skills) {
            const xpGain = 5 + totalYield;
            game.player.skills[requirement.skill] = (game.player.skills[requirement.skill] || 0) + xpGain * 0.01;
        }

        addMessage(`✅ Gathered ${totalYield}x ${this.getResourceName(resourceId)}!`, 'success');

        // Clear active gathering
        this.activeGathering = null;

        // Hide progress UI
        this.hideGatheringProgress();

        // Update player stats
        if (typeof updatePlayerStats === 'function') {
            updatePlayerStats();
        }
    },

    // Cancel current gathering
    cancelGathering() {
        if (!this.activeGathering) return;

        addMessage('Gathering cancelled.', 'info');
        this.activeGathering = null;
        this.hideGatheringProgress();
    },

    // Find location by ID
    findLocation(locationId) {
        if (typeof TravelSystem !== 'undefined') {
            // Check resource nodes
            const resourceNode = TravelSystem.resourceNodes?.find(n => n.id === locationId);
            if (resourceNode) return resourceNode;

            // Check points of interest
            const poi = TravelSystem.pointsOfInterest?.find(p => p.id === locationId);
            if (poi) return poi;

            // Check locations
            const location = TravelSystem.locations?.[locationId];
            if (location) return location;
        }

        return null;
    },

    // Get human-readable resource name
    getResourceName(resourceId) {
        const names = {
            iron_ore: 'Iron Ore',
            coal: 'Coal',
            stone: 'Stone',
            copper_ore: 'Copper Ore',
            silver_ore: 'Silver Ore',
            gold_ore: 'Gold Ore',
            gems: 'Gems',
            rare_minerals: 'Rare Minerals',
            crystals: 'Crystals',
            wood: 'Wood',
            planks: 'Planks',
            rare_wood: 'Rare Wood',
            herbs: 'Herbs',
            medicinal_plants: 'Medicinal Plants',
            rare_herbs: 'Rare Herbs',
            mushrooms: 'Mushrooms',
            fish: 'Fish',
            exotic_fish: 'Exotic Fish',
            river_pearls: 'River Pearls',
            food: 'Food',
            water: 'Water'
        };
        return names[resourceId] || resourceId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    },

    // Setup gathering UI elements
    setupGatheringUI() {
        // Create gathering progress container
        if (!document.getElementById('gathering-progress')) {
            const progressDiv = document.createElement('div');
            progressDiv.id = 'gathering-progress';
            progressDiv.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(30, 30, 50, 0.95);
                border: 2px solid #4fc3f7;
                border-radius: 12px;
                padding: 16px 24px;
                z-index: 200;
                display: none;
                min-width: 300px;
                text-align: center;
            `;
            progressDiv.innerHTML = `
                <div class="gathering-title" style="color: #4fc3f7; font-size: 1.1em; margin-bottom: 8px;">
                    ⛏️ Gathering...
                </div>
                <div class="gathering-resource" style="color: #e0e0e0; margin-bottom: 12px;"></div>
                <div class="progress-bar-container" style="
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 8px;
                    height: 20px;
                    overflow: hidden;
                    margin-bottom: 12px;
                ">
                    <div class="progress-bar-fill" style="
                        height: 100%;
                        background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
                        width: 0%;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <button id="cancel-gathering-btn" style="
                    padding: 8px 16px;
                    background: linear-gradient(180deg, #f44336 0%, #d32f2f 100%);
                    border: none;
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                ">Cancel</button>
            `;
            document.body.appendChild(progressDiv);

            document.getElementById('cancel-gathering-btn').onclick = () => {
                this.cancelGathering();
            };
        }
    },

    // Show gathering progress UI
    showGatheringProgress() {
        const progressDiv = document.getElementById('gathering-progress');
        if (progressDiv && this.activeGathering) {
            const resourceName = this.getResourceName(this.activeGathering.resourceId);
            progressDiv.querySelector('.gathering-resource').textContent = `Gathering ${resourceName}`;
            progressDiv.querySelector('.progress-bar-fill').style.width = '0%';
            progressDiv.style.display = 'block';
        }
    },

    // Update gathering progress UI
    updateGatheringProgress(progress) {
        const progressDiv = document.getElementById('gathering-progress');
        if (progressDiv) {
            const percentage = Math.min(100, Math.round(progress * 100));
            progressDiv.querySelector('.progress-bar-fill').style.width = percentage + '%';
        }
    },

    // Hide gathering progress UI
    hideGatheringProgress() {
        const progressDiv = document.getElementById('gathering-progress');
        if (progressDiv) {
            progressDiv.style.display = 'none';
        }
    },

    // Get mode for a location type
    getLocationMode(locationType) {
        return this.LOCATION_MODES[locationType] || 'trade';
    },

    // Check if location supports gathering
    canGatherAt(locationId) {
        const location = this.findLocation(locationId);
        if (!location) return false;

        const mode = this.getLocationMode(location.type);
        return mode === 'gather' || mode === 'both';
    },

    // Check if location supports trading
    canTradeAt(locationId) {
        const location = this.findLocation(locationId);
        if (!location) return false;

        const mode = this.getLocationMode(location.type);
        return mode === 'trade' || mode === 'both';
    },

    // Buy a tool
    buyTool(toolId) {
        const tool = this.TOOLS[toolId];
        if (!tool) {
            addMessage('Invalid tool!', 'error');
            return false;
        }

        if (typeof game === 'undefined' || !game.player) {
            addMessage('Cannot access player data!', 'error');
            return false;
        }

        if (game.player.gold < tool.price) {
            addMessage(`Not enough gold! You need ${tool.price} gold.`, 'error');
            return false;
        }

        game.player.gold -= tool.price;
        game.player.tools = game.player.tools || {};
        game.player.tools[toolId] = {
            id: toolId,
            durability: tool.durability
        };

        addMessage(`🔧 Purchased ${tool.name} for ${tool.price} gold!`, 'success');

        if (typeof updatePlayerStats === 'function') {
            updatePlayerStats();
        }

        return true;
    },

    // Repair a tool
    repairTool(toolId) {
        const tool = this.TOOLS[toolId];
        if (!tool || !game.player.tools?.[toolId]) {
            addMessage('Invalid tool!', 'error');
            return false;
        }

        const currentDurability = game.player.tools[toolId].durability;
        const repairNeeded = tool.durability - currentDurability;

        if (repairNeeded <= 0) {
            addMessage('Tool is already at full durability!', 'info');
            return false;
        }

        const repairCost = Math.ceil(repairNeeded * tool.price / tool.durability * 0.5);

        if (game.player.gold < repairCost) {
            addMessage(`Not enough gold! Repair costs ${repairCost} gold.`, 'error');
            return false;
        }

        game.player.gold -= repairCost;
        game.player.tools[toolId].durability = tool.durability;

        addMessage(`🔧 Repaired ${tool.name} for ${repairCost} gold!`, 'success');

        return true;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => ResourceGatheringSystem.init(), 700);
    });
} else {
    setTimeout(() => ResourceGatheringSystem.init(), 700);
}

// Expose globally
window.ResourceGatheringSystem = ResourceGatheringSystem;
